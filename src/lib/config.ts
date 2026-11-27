export const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
export const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const isSupabaseConfigured = supabaseUrl.startsWith('https://') && supabaseAnonKey.length > 20;

export const requiredCredentials = {
  app: ['EXPO_PUBLIC_SUPABASE_URL', 'EXPO_PUBLIC_SUPABASE_ANON_KEY'],
  edgeSecrets: [
    'ALPACA_API_KEY_ID',
    'ALPACA_API_SECRET_KEY',
    'ALPACA_DATA_FEED (optional, default iex)',
    'AI_API_KEY',
    'AI_API_BASE (optional)',
    'AI_MODEL (optional)',
    'REVENUECAT_WEBHOOK_SECRET (optional, Stak Plus)',
  ],
} as const;
