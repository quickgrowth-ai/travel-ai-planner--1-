import { supabase } from './supabase';
import { AuthAPI } from './auth';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  profile_picture?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateProfileData {
  name?: string;
  profile_picture?: string;
}

export class UserAPI {
  private static baseUrl = 'https://txzecrhhoefpsbqrzjwm.supabase.co';
  private static anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4emVjcmhob2VmcHNicXJ6andtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3NTQ1NTQsImV4cCI6MjA1MjMzMDU1NH0.gBGnQKJmQKJmQKJmQKJmQKJmQKJmQKJmQKJmQKJmQKJm';

  static async getProfile(userId: string): Promise<{ data: UserProfile | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async updateProfile(userId: string, updates: UpdateProfileData): Promise<{ data: UserProfile | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          ...updates,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async createProfile(userId: string, email: string, name: string): Promise<{ data: UserProfile | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          name,
          email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async deleteProfile(userId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);

      return { error };
    } catch (error) {
      return { error };
    }
  }

  static async getCurrentUser(): Promise<{ user: any; error: any }> {
    try {
      const { session, error } = await AuthAPI.getSession();
      
      if (error || !session?.user) {
        return { user: null, error: error || 'No session found' };
      }

      return { user: session.user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  }
}