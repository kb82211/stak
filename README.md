# Stak

Stak is a native financial-education app. It teaches budgeting, saving, markets, and portfolio ideas, then lets a learner practice with a $10,000 virtual balance. It is not a broker. It does not take deposits, hold securities, or send orders.

## Run it on an iPhone

```bash
npm install
cp .env.example .env
npx expo prebuild --platform ios
npx expo run:ios --device
```

Expo Go is not the target. Apple sign-in, Face ID, and notifications need a development build. Node 22 or 24 matches the Expo SDK engine. This machine’s Node 25 prints an engine warning.

A development build for a physical phone can also be made with EAS:

```bash
npx eas build --profile development --platform ios
```

## Credentials

Put these in `.env` for the app. They are the public Supabase project URL and anon key:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

Set these as Supabase Edge Function secrets. Do not put them in the app:

- `ALPACA_API_KEY_ID` and `ALPACA_API_SECRET_KEY` — market data. The default feed is `ALPACA_DATA_FEED=iex`. IEX prices are labeled as exchange-specific, not consolidated US market data.
- `AI_API_KEY` — tutor. Optional `AI_API_BASE` and `AI_MODEL`.
- `REVENUECAT_WEBHOOK_SECRET` — only if you connect Stak Plus. The app has no purchase button until billing is connected, and only the webhook can set `profiles.plan`.

Apply the database from `supabase/migrations`, then deploy `market-data`, `execute-trade`, `ai-tutor`, and `billing-webhook`. Enable Email, Google, and Apple providers in Supabase Auth. Apple sign-in also needs the `com.stak.learn` bundle id and the Sign in with Apple capability.

Prices are never invented. If Alpaca is not configured, quotes, charts, and simulated orders fail with that reason. Lesson text, quizzes, and XP grading still work once Supabase is connected, because the curriculum is stored in the database and graded there.

## What is simulated

Every new account receives $10,000 of virtual cash. Buys and sells are calculated on the server from a fresh Alpaca trade print. Orders are rejected when the print is missing or older than 15 minutes. The stored transaction keeps that price, timestamp, feed, and a disclosure that it was not an exchange execution.
