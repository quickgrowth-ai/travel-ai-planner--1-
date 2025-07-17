import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallback to hardcoded values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://txzecrhhoefpsbqrzjwm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4emVjcmhob2VmcHNicXJ6andtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNzk3MTAsImV4cCI6MjA2Nzk1NTcxMH0.5AbzSNu1k2xbC9oDZ3mSlYf4SN5cf0nUS_pSvsWyLWM';

// Create Supabase client with production-ready configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'supabase.auth.token',
    debug: false
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web',
      'X-Requested-With': 'XMLHttpRequest'
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

export default supabase;

// Debug logging for deployment troubleshooting
if (typeof window !== 'undefined') {
  console.log('=== Supabase Debug Info ===');
  console.log('Environment:', import.meta.env?.MODE || 'unknown');
  console.log('Domain:', window.location.hostname);
  console.log('Origin:', window.location.origin);
  console.log('Supabase URL:', supabaseUrl);
  console.log('Supabase Key (first 20 chars):', supabaseAnonKey.substring(0, 20) + '...');
  console.log('Env VITE_SUPABASE_URL:', import.meta.env?.VITE_SUPABASE_URL || 'Not set');
  console.log('Env VITE_SUPABASE_ANON_KEY:', import.meta.env?.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not set');
  
  // Test connection with detailed logging
  supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.error('❌ Supabase connection error:', error.message);
      console.error('Error details:', error);
    } else {
      console.log('✅ Supabase connection successful');
      console.log('Session data:', data.session ? 'Session exists' : 'No session');
    }
  }).catch(err => {
    console.error('❌ Supabase connection exception:', err);
  });
  
  // Test database connection
  supabase.from('users').select('count').limit(1).then(({ data, error }) => {
    if (error) {
      console.error('❌ Database connection error:', error.message);
    } else {
      console.log('✅ Database connection successful');
    }
  }).catch(err => {
    console.error('❌ Database connection exception:', err);
  });
}