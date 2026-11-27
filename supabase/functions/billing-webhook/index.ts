import { createClient } from 'npm:@supabase/supabase-js@2';
import { cors, json } from '../_shared/http.ts';

// RevenueCat (or a compatible store) posts entitlement changes here.
// The app does not unlock Stak Plus from the device by itself.
Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const secret = Deno.env.get('REVENUECAT_WEBHOOK_SECRET');
  if (!secret) {
    return json({ error: 'not_configured', message: 'REVENUECAT_WEBHOOK_SECRET is not set.' }, 503);
  }
  if (request.headers.get('Authorization') !== `Bearer ${secret}`) {
    return json({ error: 'unauthorized', message: 'Webhook authorization failed.' }, 401);
  }
  const body = await request.json();
  const userId = body?.event?.app_user_id as string | undefined;
  const entitlement = body?.event?.entitlement_ids as string[] | undefined;
  const type = String(body?.event?.type ?? '');
  if (!userId) return json({ error: 'invalid', message: 'Missing app user id.' }, 400);
  const active = Array.isArray(entitlement) && entitlement.includes('stak_plus') && !type.includes('EXPIRATION');
  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const { error } = await admin.from('profiles').update({ plan: active ? 'premium' : 'free' }).eq('id', userId);
  if (error) return json({ error: 'update_failed', message: error.message }, 500);
  return json({ ok: true, plan: active ? 'premium' : 'free' });
});
