import { supabase } from './supabase';

export interface SignUpData {
  email: string;
  password: string;
  name?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: any;
  session: any;
  error?: any;
}

export class AuthAPI {
  static async signup(data: SignUpData): Promise<AuthResponse> {
    try {
      console.log('=== SIGNUP DEBUG ===');
      console.log('Email:', data.email);
      console.log('Domain:', window.location.hostname);
      console.log('Origin:', window.location.origin);
      console.log('Supabase URL:', supabase.supabaseUrl);
      
      const redirectUrl = window.location.hostname === 'app.unitraveltech.ca' 
        ? 'https://app.unitraveltech.ca/auth/callback'
        : `${window.location.origin}/auth/callback`;
      
      console.log('Redirect URL:', redirectUrl);
      
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: data.name ? { name: data.name } : undefined,
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        console.error('❌ Signup error:', {
          message: error.message,
          status: error.status,
          code: error.code,
          details: error
        });
        return { user: null, session: null, error };
      }

      console.log('✅ Signup successful:', authData);
      
      // Create user profile after successful signup
      if (authData.user && data.name) {
        try {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              user_id: authData.user.id,
              name: data.name,
              email: data.email
            });
          
          if (profileError) {
            console.error('Profile creation error:', profileError);
          } else {
            console.log('✅ User profile created');
          }
        } catch (profileErr) {
          console.error('Profile creation exception:', profileErr);
        }
      }
      
      return { user: authData.user, session: authData.session, error: null };
    } catch (error) {
      console.error('❌ Signup exception:', error);
      return { user: null, session: null, error };
    }
  }

  static async login(data: LoginData): Promise<AuthResponse> {
    try {
      console.log('=== LOGIN DEBUG ===');
      console.log('Email:', data.email);
      console.log('Domain:', window.location.hostname);
      console.log('Origin:', window.location.origin);
      
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      if (error) {
        console.error('❌ Login error:', {
          message: error.message,
          status: error.status,
          code: error.code,
          details: error
        });
        return { user: null, session: null, error };
      }

      console.log('✅ Login successful:', authData);
      return { user: authData.user, session: authData.session, error: null };
    } catch (error) {
      console.error('❌ Login exception:', error);
      return { user: null, session: null, error };
    }
  }

  static async logout(): Promise<{ error?: any }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error };
    }
  }

  static async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      return { user: session?.user || null, session, error };
    } catch (error) {
      return { user: null, session: null, error };
    }
  }

  static async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const { data: authData, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken
      });

      if (error) {
        return { user: null, session: null, error };
      }

      return { user: authData.user, session: authData.session, error: null };
    } catch (error) {
      return { user: null, session: null, error };
    }
  }
}