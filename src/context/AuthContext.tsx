import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import type { Session, User } from '@supabase/supabase-js';

// Define the shape of our auth context
interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up an auth state listener from Supabase.
    // This function will be called whenever the user's session changes (login, logout, token refresh).
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Clean up the subscription when the component unmounts.
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      // Try server logout first
      await supabase.auth.signOut({ scope: 'global' });
    } catch (error) {
      console.warn('Server logout failed, proceeding with local logout:', error);
    }

    // Always clear local session
    try {
      await supabase.auth.signOut({ scope: 'local' });
    } catch (localError) {
      console.warn('Local logout failed:', localError);
    }

    // Clear any additional local storage
    localStorage.clear();
    sessionStorage.clear();
  };

  // The context value provides the session, user, and loading state to children.
  const value = { session, user, loading, signOut };

  return (
    <AuthContext.Provider value={value}>
      {/* We only render children once the initial session check is complete. */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to make accessing auth context easier.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
