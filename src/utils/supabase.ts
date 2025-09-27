import { createClient, type AuthChangeEvent, type Session } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

type AuthResponse = {
  data: any;
  error: any;
};


export const signUpWithEmail = async (email: string, password: string): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signInWithEmail = async (email: string, password: string): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signInWithGoogle = async (): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });
  return { data, error };
};

export const signOut = async (): Promise<{ error: any }> => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getSession = async (): Promise<Session | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

export type AuthChangeCallback = (event: AuthChangeEvent, session: Session | null) => void;

export const onAuthStateChange = (callback: AuthChangeCallback) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
  return { data: { subscription } };
};
