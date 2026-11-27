import { cors, json, requireUser } from '../_shared/http.ts';

const DISCLAIMER =
  'Educational only. Stak is not a broker and this is not a recommendation to buy, sell, or hold any security.';

const SYSTEM = `You are Stak's financial education tutor. Explain concepts in plain language with short examples.
You teach budgeting, saving, compound interest, stocks, ETFs, diversification, and how to read a chart.
You must not give personalized investment recommendations, name a security someone should buy or sell, promise returns, or encourage speculation.
You cannot place trades. If asked what to buy, explain the concepts involved and point the learner back to a lesson.
If you do not have a verified price or timestamp in the conversation, say you do not have verified market data. Never invent a price, volume, or P/E ratio.
Keep answers under 180 words.`;

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const auth = await requireUser(request);
  if ('error' in auth && auth.error) return auth.error;
  const apiKey = Deno.env.get('AI_API_KEY');
  if (!apiKey) {
    return json({
      error: 'not_configured',
      message: 'The tutor needs an AI_API_KEY secret on the Supabase function. No answer was generated.',
    }, 503);
  }
  try {
    const { message } = await request.json();
    const text = String(message ?? '').trim();
    if (text.length < 2 || text.length > 2000) {
      return json({ error: 'invalid', message: 'Ask a question in a sentence or two.' }, 400);
    }
    const { data: profile } = await auth.admin.from('profiles').select('plan').eq('id', auth.user.id).single();
    if (profile?.plan !== 'premium') {
      const since = new Date();
      since.setUTCHours(0, 0, 0, 0);
      const { count } = await auth.admin
        .from('ai_messages')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', auth.user.id)
        .eq('role', 'user')
        .gte('created_at', since.toISOString());
      if ((count ?? 0) >= 5) {
        return json({
          error: 'limit',
          message: 'The free tutor answers five questions a day. Stak Plus raises that limit, and the billing connection is not turned on yet.',
        }, 402);
      }
    }
    const { data: history } = await auth.admin
      .from('ai_messages')
      .select('role, content')
      .eq('user_id', auth.user.id)
      .order('created_at', { ascending: false })
      .limit(8);
    const messages = [
      { role: 'system', content: SYSTEM },
      ...(history ?? []).reverse().map((row) => ({ role: row.role, content: row.content })),
      { role: 'user', content: text },
    ];
    const base = Deno.env.get('AI_API_BASE') || 'https://api.openai.com/v1';
    const model = Deno.env.get('AI_MODEL') || 'gpt-4o-mini';
    const response = await fetch(`${base.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, temperature: 0.2, messages }),
    });
    if (!response.ok) {
      return json({ error: 'provider', message: `The tutor model returned ${response.status}.` }, 502);
    }
    const payload = await response.json();
    const reply = payload.choices?.[0]?.message?.content;
    if (typeof reply !== 'string' || !reply.trim()) {
      return json({ error: 'provider', message: 'The tutor returned an empty answer.' }, 502);
    }
    await auth.admin.from('ai_messages').insert([
      { user_id: auth.user.id, role: 'user', content: text },
      { user_id: auth.user.id, role: 'assistant', content: reply.trim() },
    ]);
    return json({ reply: reply.trim(), disclaimer: DISCLAIMER });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'The tutor is unavailable.';
    return json({ error: 'tutor', message }, 500);
  }
});
