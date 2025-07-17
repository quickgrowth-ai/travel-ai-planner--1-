// Authentication API
export { AuthAPI } from './auth';
export type { SignUpData, LoginData, AuthResponse } from './auth';

// User API
export { UserAPI } from './userAPI';
export type { UserProfile, UpdateProfileData } from './userAPI';

// Trip API
export { TripAPI } from './tripAPI';
export type { Trip, TripItem, CreateTripData } from './tripAPI';

// Core Supabase client
export { supabase } from './supabase';

// Utilities
export { cn } from './utils';

// API Library Collection
export const API = {
  auth: AuthAPI,
  user: UserAPI,
  trip: TripAPI
};

// API Endpoints Configuration
export const API_ENDPOINTS = {
  auth: {
    signup: '/auth/v1/signup',
    login: '/auth/v1/token?grant_type=password',
    refresh: '/auth/v1/token?grant_type=refresh_token',
    logout: '/auth/v1/logout'
  },
  user: {
    profile: '/rest/v1/user_profiles',
    update: '/rest/v1/user_profiles'
  },
  trip: {
    trips: '/rest/v1/saved_trips',
    items: '/rest/v1/trip_items'
  }
};

// Base API Configuration
export const API_CONFIG = {
  baseUrl: 'https://txzecrhhoefpsbqrzjwm.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4emVjcmhob2VmcHNicXJ6andtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3NTQ1NTQsImV4cCI6MjA1MjMzMDU1NH0.gBGnQKJmQKJmQKJmQKJmQKJmQKJmQKJmQKJmQKJmQKJm',
  headers: {
    'Content-Type': 'application/json',
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4emVjcmhob2VmcHNicXJ6andtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3NTQ1NTQsImV4cCI6MjA1MjMzMDU1NH0.gBGnQKJmQKJmQKJmQKJmQKJmQKJmQKJmQKJmQKJmQKJm'
  }
};