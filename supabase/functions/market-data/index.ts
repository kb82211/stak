import { fetchBars, fetchQuotes, lookupAsset } from '../_shared/alpaca.ts';
import { cors, json, requireUser } from '../_shared/http.ts';

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const auth = await requireUser(request);
  if ('error' in auth && auth.error) return auth.error;
  try {
    const body = await request.json();
    if (body.action === 'quotes') {
      const symbols = Array.isArray(body.symbols) ? body.symbols.map(String).slice(0, 50) : [];
      const quotes = await fetchQuotes(symbols);
      return json({ quotes });
    }
    if (body.action === 'bars') {
      const symbol = String(body.symbol ?? '').toUpperCase();
      const range = body.range === '1D' || body.range === '3M' || body.range === '1Y' ? body.range : '1M';
      return json(await fetchBars(symbol, range));
    }
    if (body.action === 'lookup') {
      const symbol = String(body.symbol ?? '').toUpperCase();
      if (!/^[A-Z.]{1,10}$/.test(symbol)) {
        return json({ error: 'invalid_symbol', message: 'Enter a ticker such as AAPL or BRK.B.' }, 400);
      }
      const asset = await lookupAsset(symbol);
      if (!asset) return json({ asset: null });
      await auth.admin.from('assets').upsert({
        symbol: asset.symbol,
        name: asset.name,
        asset_type: asset.assetType,
        exchange: asset.exchange,
      });
      return json({
        asset: {
          symbol: asset.symbol,
          name: asset.name,
          assetType: asset.assetType,
          sector: null,
          description: null,
          exchange: asset.exchange,
        },
      });
    }
    if (body.action === 'portfolio') {
      const { data: holdings, error } = await auth.admin
        .from('holdings')
        .select('symbol, quantity')
        .eq('user_id', auth.user.id);
      if (error) throw error;
      const symbols = (holdings ?? []).map((row) => row.symbol as string);
      const { data: account } = await auth.admin
        .from('virtual_accounts')
        .select('cash')
        .eq('user_id', auth.user.id)
        .single();
      const cash = Number(account?.cash ?? 0);
      const { data: latest } = await auth.admin
        .from('portfolio_snapshots')
        .select('total_value, recorded_at')
        .eq('user_id', auth.user.id)
        .order('recorded_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      async function saveSnapshot(total: number) {
        const recent = latest && Date.now() - new Date(latest.recorded_at).getTime() < 30 * 60 * 1000;
        const same = latest && Math.abs(Number(latest.total_value) - total) < 0.01;
        if (recent && same) return;
        await auth.admin.from('portfolio_snapshots').insert({
          user_id: auth.user.id,
          total_value: total,
          cash,
        });
      }
      if (symbols.length === 0) {
        await auth.admin.from('holding_marks').delete().eq('user_id', auth.user.id);
        await saveSnapshot(Math.round(cash * 100) / 100);
        return json({ quotes: [], missing: [] });
      }
      const quotes = await fetchQuotes(symbols);
      const bySymbol = new Map(quotes.map((quote) => [quote.symbol, quote]));
      const missing = symbols.filter((symbol) => !bySymbol.has(symbol));
      await auth.admin.from('holding_marks').delete().eq('user_id', auth.user.id);
      if (missing.length === 0) {
        await auth.admin.from('holding_marks').upsert(
          symbols.map((symbol) => ({
            user_id: auth.user.id,
            symbol,
            price: bySymbol.get(symbol)!.price,
            marked_at: bySymbol.get(symbol)!.asOf,
          })),
        );
        const invested = (holdings ?? []).reduce((sum, row) => {
          return sum + Number(row.quantity) * bySymbol.get(row.symbol as string)!.price;
        }, 0);
        await saveSnapshot(Math.round((cash + invested) * 100) / 100);
      }
      return json({ quotes, missing });
    }
    return json({ error: 'unknown_action', message: 'Unknown market-data action.' }, 400);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Market data is unavailable.';
    const status = message.includes('not set') ? 503 : 502;
    return json({ error: 'market_data', message }, status);
  }
});
