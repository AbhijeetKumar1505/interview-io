import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { getSession, onAuthStateChange } from '../utils/supabase';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  session: Session | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  session: null,
});

export const useAuth = () => useContext(AuthContext);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there's a valid session when the component mounts
    const checkSession = async () => {
      try {
        const session = await getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Set up the auth state change listener
    const { data: { subscription } } = onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Clean up the subscription when the component unmounts
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, session }}>
      {children}
    </AuthContext.Provider>
  );
};
