import { FILL_DISCLOSURE, fetchQuotes } from '../_shared/alpaca.ts';
import { cors, json, requireUser } from '../_shared/http.ts';

const SHARE_PRECISION = 1_000_000;

function floorShares(value: number) {
  return Math.floor(value * SHARE_PRECISION + 1e-8) / SHARE_PRECISION;
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const auth = await requireUser(request);
  if ('error' in auth && auth.error) return auth.error;
  try {
    const body = await request.json();
    const symbol = String(body.symbol ?? '').toUpperCase();
    const side = body.side === 'sell' ? 'sell' : body.side === 'buy' ? 'buy' : '';
    const mode = body.mode === 'shares' ? 'shares' : body.mode === 'dollars' ? 'dollars' : '';
    const amount = Number(body.amount);
    const idempotencyKey = String(body.idempotencyKey ?? '');
    if (!/^[A-Z.]{1,10}$/.test(symbol)) return json({ error: 'invalid', message: 'Invalid symbol.' }, 400);
    if (!side || !mode) return json({ error: 'invalid', message: 'Invalid order.' }, 400);
    if (!Number.isFinite(amount) || amount <= 0 || amount > 1_000_000_000) {
      return json({ error: 'invalid', message: 'Enter an amount greater than zero.' }, 400);
    }
    if (!/^[0-9a-f-]{36}$/i.test(idempotencyKey)) {
      return json({ error: 'invalid', message: 'Missing idempotency key.' }, 400);
    }

    const [quote] = await fetchQuotes([symbol]);
    if (!quote || quote.pricing !== 'exchange_trade') {
      return json({
        error: 'no_price',
        message: 'No exchange trade price is available for this symbol, so the simulated order was not recorded.',
      }, 409);
    }
    if (quote.stale) {
      return json({
        error: 'stale_price',
        message: 'The latest provider price is more than 15 minutes old, so the simulated order was not recorded.',
      }, 409);
    }

    const { data: account } = await auth.admin.from('virtual_accounts').select('cash').eq('user_id', auth.user.id).single();
    const cash = Number(account?.cash ?? 0);
    let quantity = mode === 'dollars' ? floorShares(amount / quote.price) : floorShares(amount);
    if (side === 'sell') {
      const { data: holding } = await auth.admin
        .from('holdings')
        .select('quantity')
        .eq('user_id', auth.user.id)
        .eq('symbol', symbol)
        .maybeSingle();
      const owned = Number(holding?.quantity ?? 0);
      if (quantity > owned) {
        return json({ error: 'insufficient_shares', message: 'You cannot sell more shares than you hold.' }, 400);
      }
    } else if (mode === 'dollars' && amount > cash) {
      return json({ error: 'insufficient_cash', message: 'That order costs more virtual cash than you have.' }, 400);
    }
    if (quantity <= 0) {
      return json({ error: 'too_small', message: 'That amount is too small for a simulated share at this price.' }, 400);
    }

    const { data, error } = await auth.admin.rpc('execute_trade', {
      p_user_id: auth.user.id,
      p_symbol: symbol,
      p_side: side,
      p_quantity: quantity,
      p_price: quote.price,
      p_as_of: quote.asOf,
      p_feed: quote.feed,
      p_exchange: quote.exchange,
      p_source_label: quote.sourceLabel,
      p_disclosure: FILL_DISCLOSURE,
      p_idempotency_key: idempotencyKey,
    });
    if (error) return json({ error: 'rejected', message: error.message }, 400);
    return json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'The simulated trade could not be recorded.';
    const status = message.includes('not set') ? 503 : 502;
    return json({ error: 'trade', message }, status);
  }
});
