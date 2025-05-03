// src/lib/constants/media.ts

export const DEPLOYMENT_IDS = {
    image: '3910eafb-7921-4de3-bbcd-8756f0dd1cb6',
    video: 'f9b35f20-228b-446b-820c-8f497aa5d8f3',
    firstLastFrameVideo: '8c463102-0525-4cf1-8535-731fee0f93b4',
  } as const;
  
  export const CREDIT_COSTS = {
    image: 10,
    video: 100,
    firstLastFrameVideo: 100,
  } as const;
  
  export const MEDIA_TYPES = ['image', 'video'] as const;
  
  export type MediaType = typeof MEDIA_TYPES[number];

  export const GENERATION_MODES = ['image', 'video', 'firstLastFrameVideo'] as const;
  export type GenerationMode = typeof GENERATION_MODES[number];
  
  export type MediaStatus = 'pending' | 'processing' | 'completed' | 'failed';
  
  export type GenerationResult = {
    success: boolean;
    mediaId?: string;
    runId?: string;
    status?: string;
    mediaUrl?: string;
    error?: string;
  };
  