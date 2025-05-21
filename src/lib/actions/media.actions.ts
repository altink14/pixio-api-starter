// src/lib/actions/media.actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
// Import getUserCredits without parameters
import { getUserCredits } from '@/lib/credits';
import { revalidatePath } from 'next/cache';
import { checkGenerationStatus as checkGenerationStatusService } from '@/lib/services/media.service';
import { MediaType, CREDIT_COSTS, GenerationResult, GenerationMode } from '@/lib/constants/media';
import { Database, GeneratedMedia } from '@/types/db_types';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { listUserFiles as listUserFilesService, deleteFile as deleteFileService } from '@/lib/storage/supabase-storage';

type GeneratedMediaInsert = Database['public']['Tables']['generated_media']['Insert'];

export async function generateMedia(formData: FormData): Promise<{
  success: boolean;
  mediaId?: string;
  error?: string;
}> {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (!user || userError) {
    return { success: false, error: 'Authentication error' };
  }

  // --- Read data from FormData ---
  const prompt = formData.get('prompt') as string;
  const generationMode = formData.get('generationMode') as GenerationMode;
  const mediaType = formData.get('mediaType') as MediaType;

  const startImageUrl = formData.get('startImageUrl') as string | null;
  const endImageUrl = formData.get('endImageUrl') as string | null;

  // --- Validation ---
  if (!prompt || !generationMode || !mediaType) {
    return { success: false, error: 'Missing required fields' };
  }
  if (generationMode === 'firstLastFrameVideo') {
    if (!startImageUrl) return { success: false, error: 'Missing start image URL' };
    if (!endImageUrl) return { success: false, error: 'Missing end image URL' };
  }

  const creditCost = CREDIT_COSTS[generationMode];
  if (creditCost === undefined) {
    return { success: false, error: 'Invalid generation mode' };
  }

  try {
    // 1. Get credits - getUserCredits takes no parameters
    const creditsInfo = await getUserCredits();
    
    // Check if total credits are sufficient
    if (creditsInfo.total < creditCost) {
      return { success: false, error: 'Not enough credits' };
    }
    
    // 2. Deduct credits - we'll use credit_usage table
    // Record credit usage
    const description = `Generate ${generationMode}: "${prompt.slice(0, 30)}${prompt.length > 30 ? '...' : ''}"`;
    
    const { error: creditError } = await supabaseAdmin
      .from('credit_usage')
      .insert({
        user_id: user.id,
        amount: creditCost, 
        description: description,
        created_at: new Date().toISOString()
      });
    
    if (creditError) {
      console.error("[Action] Failed to record credit usage:", creditError);
      return { success: false, error: 'Failed to deduct credits' };
    }
    
    console.log(`[Action] Credits deducted successfully for user ${user.id}`);

    // 3. Create initial 'pending' record in DB
    const insertPayload: GeneratedMediaInsert = {
        user_id: user.id,
        prompt: prompt,
        media_type: mediaType,
        credits_used: creditCost,
        status: 'pending',
        media_url: '', // Required by Insert type
        storage_path: '', // Required by Insert type
        metadata: { generationMode } // Store UI mode
    };
    if (generationMode === 'firstLastFrameVideo') {
        insertPayload.start_image_url = startImageUrl;
        insertPayload.end_image_url = endImageUrl;
    }
    const { data: newMediaRecord, error: insertError } = await supabaseAdmin
      .from('generated_media').insert(insertPayload).select('id').single();
    if (insertError || !newMediaRecord) {
      console.error("[Action] Failed to insert initial media record:", insertError);
      // TODO: Consider refunding credits here if insert fails after deduction
      return { success: false, error: `Failed to create generation record: ${insertError?.message}` };
    }
    const mediaId = newMediaRecord.id;
    console.log(`[Action] Initial media record created with ID: ${mediaId}`);

    // 4. Prepare payload for the Edge Function (includes URLs now)
    interface FunctionPayload {
      prompt: string;
      mediaType: MediaType;
      generationMode: GenerationMode;
      mediaId: string;
      startImageUrl?: string | null;
      endImageUrl?: string | null;
    }
    const functionPayload: FunctionPayload = { prompt, mediaType, generationMode, mediaId };
    if (generationMode === 'firstLastFrameVideo') {
        functionPayload.startImageUrl = startImageUrl;
        functionPayload.endImageUrl = endImageUrl;
    }

    // 5. Start the Supabase Function (Fire and Forget from Action's perspective)
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    supabase.functions.invoke('generate-media-handler', { body: functionPayload })
    .then(response => {
      if (response.error) {
         console.error(`[Action] Edge Function invocation for ${mediaId} reported an error (status might still be processing):`, response.error);
      } else {
         console.log(`[Action] Edge Function invocation for ${mediaId} acknowledged successfully (processing should start).`);
      }
    })
    .catch(error => {
       console.error(`[Action] Error invoking Edge Function for ${mediaId} (status might still be processing):`, error);
    });

    // 6. Revalidate path immediately to show pending state
    revalidatePath('/dashboard');

    // 7. Return success (indicates the process was initiated)
    return { success: true, mediaId: mediaId };

  } catch (error: unknown) {
    console.error('[Action] Error in generateMedia action:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

/**
 * Checks the status of a media generation task by calling the service function.
 */
export async function checkMediaStatus(mediaId: string): Promise<GenerationResult> {
  if (!mediaId) { return { success: false, error: "Media ID is required", status: 'failed' }; }
  console.log(`[Action] Polling status check for mediaId: ${mediaId}`);
  try {
    // Fetch record to check status and get run_id
    const { data: mediaRecord, error: fetchError } = await supabaseAdmin
        .from('generated_media')
        .select('status, metadata, media_url')
        .eq('id', mediaId)
        .single();

    if (fetchError) { console.error(`[Action] Error fetching media record ${mediaId}:`, fetchError); return { success: false, error: `Record fetch error: ${fetchError.message}`, status: 'processing' }; }
    if (!mediaRecord) { console.warn(`[Action] Media record ${mediaId} not found during poll.`); return { success: false, error: `Media record not found: ${mediaId}`, status: 'processing' }; }

    // If already completed or failed in DB, return that status
    if (mediaRecord.status === 'completed' || mediaRecord.status === 'failed') {
      console.log(`[Action] Status for ${mediaId} from DB is final: ${mediaRecord.status}`);
      type MediaMetadata = { error?: string; run_id?: string; [key: string]: unknown };
      const metadata = mediaRecord.metadata as MediaMetadata;
      return { success: mediaRecord.status === 'completed', status: mediaRecord.status, mediaUrl: mediaRecord.media_url || undefined, error: mediaRecord.status === 'failed' ? (metadata?.error || 'Failed') : undefined };
    }

    // Get run_id from metadata
    type MediaMetadata = { run_id?: string; [key: string]: unknown };
    const runId = (mediaRecord.metadata as MediaMetadata)?.run_id;
    if (!runId) {
      // run_id might not be set yet if function invocation was slightly delayed
      console.warn(`[Action] run_id not yet found for mediaId ${mediaId}. DB status: ${mediaRecord.status}. Continuing poll...`);
      return { success: true, status: mediaRecord.status || 'pending' }; // Return current DB status
    }

    // Call the *service function* which interacts with ComfyUI API and updates DB/Storage
    console.log(`[Action] Found run_id ${runId} for mediaId ${mediaId}. Calling service function...`);
    const serviceResult = await checkGenerationStatusService(mediaId, runId);

    // Revalidate the dashboard path if the service function marked it as completed/failed
    // Note: Revalidation might happen frequently if the service returns 'failed' transiently
    if (serviceResult.status === 'completed' || serviceResult.status === 'failed') {
      revalidatePath('/dashboard');
      console.log(`[Action] Revalidated /dashboard. Service status: ${serviceResult.status}`);
    }
    return serviceResult; // Return result from service

  } catch (error: unknown) {
    console.error(`[Action] Error in checkMediaStatus for ${mediaId}:`, error);
    // Return failed status if the action itself encounters an error
    return { success: false, error: error instanceof Error ? error.message : String(error), status: 'failed' };
  }
}

/**
 * Deletes a media item record and its associated file from storage.
 */
export async function deleteMedia(mediaId: string, storagePath: string | null): Promise<{
    success: boolean;
    error?: string;
  }> {
    if (!mediaId) { return { success: false, error: "Media ID is required." }; }
    const supabase = await createClient(); // Use server client to get user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!user || userError) { return { success: false, error: 'Authentication error' }; }

    console.log(`[Action] Deleting media ${mediaId} (path: ${storagePath || 'N/A'}) for user ${user.id}`);
    try {
      // Verify ownership using admin client
      const { data: mediaRecord, error: fetchError } = await supabaseAdmin
        .from('generated_media').select('id, user_id, storage_path').eq('id', mediaId).single();
      if (fetchError || !mediaRecord) { console.error(`[Action] Error fetching media ${mediaId} for deletion or not found:`, fetchError); return { success: false, error: 'Media record not found.' }; }
      if (mediaRecord.user_id !== user.id) { console.warn(`[Action] User ${user.id} attempted to delete media ${mediaId} owned by ${mediaRecord.user_id}. Denying.`); return { success: false, error: 'Permission denied.' }; }

      const actualStoragePath = mediaRecord.storage_path;

      // Delete from Storage *only if path exists* using the service function
      if (actualStoragePath) {
        console.log(`[Action] Calling service to delete file from storage: ${actualStoragePath}`);
        const { success: deleteSuccess, error: deleteError } = await deleteFileService(actualStoragePath); // Use storage service
        if (!deleteSuccess) { console.error(`[Action] Error deleting file ${actualStoragePath} from storage (continuing):`, deleteError); }
        else { console.log(`[Action] Successfully deleted file ${actualStoragePath} via service.`); }
      } else { console.log(`[Action] No storage path for media ${mediaId}, skipping storage deletion.`); }

      // Delete from Database using admin client
      console.log(`[Action] Deleting record from database: ${mediaId}`);
      const { error: dbError } = await supabaseAdmin.from('generated_media').delete().eq('id', mediaId);
      if (dbError) { console.error(`[Action] Error deleting record ${mediaId} from database:`, dbError); throw new Error(`Database deletion failed: ${dbError.message}`); }
      console.log(`[Action] Successfully deleted record ${mediaId} from database.`);

      revalidatePath('/dashboard');
      return { success: true };
    } catch (error: unknown) {
      console.error(`[Action] Unexpected error during media deletion for ${mediaId}:`, error);
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}

/**
 * Fetches completed and processing media items for the current user.
 */
export async function fetchUserMedia(): Promise<{
  success: boolean;
  media: GeneratedMedia[];
  error?: string;
}> {
  const supabase = await createClient(); // Uses server client
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (!user || userError) { return { success: false, error: 'Authentication error', media: [] }; }

  try {
    // Use user-context client for RLS
    const { data, error } = await supabase
      .from('generated_media')
      .select('*')
      .eq('user_id', user.id)
      .in('status', ['pending', 'processing', 'completed', 'failed'])
      .order('created_at', { ascending: false })
      .limit(50); // Adjust limit as needed

    if (error) { throw new Error(`Failed to fetch media: ${error.message}`); }
    return { success: true, media: data || [], error: undefined };
  } catch (error: unknown) {
    console.error('[Action] Error fetching user media:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error), media: [] };
  }
}

/**
 * Server Action to list user's generated images and input images for selection.
 */
export async function listUserImagesForSelection(): Promise<{
    success: boolean;
    images: { value: string; label: string; type: 'generated' | 'input' }[];
    error?: string;
}> {
    const supabase = await createClient(); // Use server client to get user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!user || userError) { return { success: false, images: [], error: 'Authentication error' }; }

    try {
        const [generatedResult, inputResult] = await Promise.all([
            // Fetch completed generated images using RLS-enabled client
            supabase
                .from('generated_media')
                .select('id, prompt, media_url')
                .eq('user_id', user.id)
                .eq('media_type', 'image')
                .eq('status', 'completed')
                .not('media_url', 'is', null)
                .order('created_at', { ascending: false })
                .limit(50), // Limit generated images shown
            // Fetch input images using the service function (uses admin client)
            listUserFilesService(user.id, 'inputs')
        ]);

        const fetchedImages: { value: string; label: string; type: 'generated' | 'input' }[] = [];

        // Process generated images
        if (generatedResult.error) { console.error("[Action] Error fetching generated images:", generatedResult.error); }
        else if (generatedResult.data) { generatedResult.data.forEach(item => { fetchedImages.push({ value: item.media_url!, label: item.prompt ? `Gen: ${item.prompt.substring(0, 30)}...` : `Generated Image ${item.id.substring(0, 6)}`, type: 'generated', }); }); }

        // Process input images
        if (!inputResult.success) { console.error("[Action] Error fetching input images:", inputResult.error); }
        else if (inputResult.files) { inputResult.files.forEach(file => { if (file.publicUrl && /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name)) { fetchedImages.push({ value: file.publicUrl, label: `Input: ${file.name}`, type: 'input', }); } }); }

        fetchedImages.sort((a, b) => a.label.localeCompare(b.label));
        return { success: true, images: fetchedImages };

    } catch (error: unknown) {
        console.error('[Action] Error listing user images:', error);
        return { success: false, images: [], error: error instanceof Error ? error.message : String(error) };
    }
}