// src/lib/actions/stripe.actions.ts
'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe/client';
import { createOrRetrieveCustomer } from '@/lib/supabase/admin';
import { getURL } from '@/lib/utils';

/**
 * Creates a Stripe customer portal session.
 * Redirects the user to the Stripe customer portal on success.
 */
export async function createCustomerPortalSession() {
  // Call cookies to prevent caching
  cookies();

  // Get current user
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    return redirect('/login');
  }
  
  try {
    // Get customer
    const customerId = await createOrRetrieveCustomer({
      uuid: user.id,
      email: user.email!,
    });
    
    if (!customerId) {
      throw new Error('Could not get customer');
    }
    
    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${getURL()}/account`,
    });
    
    if (session.url) {
      return redirect(session.url);
    } else {
      throw new Error('Failed to create portal session');
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error creating portal session:', error.message);
    } else {
      console.error('Error creating portal session:', error);
    }
    return redirect('/account?error=portal_failed');
  }
}
