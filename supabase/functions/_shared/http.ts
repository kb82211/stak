import { createClient } from 'npm:@supabase/supabase-js@2';

export const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}

export async function requireUser(request: Request) {
  const header = request.headers.get('Authorization');
  if (!header) return { error: json({ error: 'unauthorized', message: 'Sign in is required.' }, 401) };
  const userClient = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: header } },
  });
  const { data, error } = await userClient.auth.getUser();
  if (error || !data.user) {
    return { error: json({ error: 'unauthorized', message: 'The session is not valid.' }, 401) };
  }
  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  return { user: data.user, admin };
}
