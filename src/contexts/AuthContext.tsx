import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  username: string;
  full_name: string;
  phone?: string;
  role: 'admin' | 'customer';
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: {
    full_name: string;
    role?: 'admin' | 'customer';
  }) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  hasRole: (role: 'admin' | 'customer') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch profile when user logs in
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        // If profile doesn't exist or there's an RLS error, still allow login
        // User can still access the app, just without profile data
        return;
      }

      if (data) {
        setProfile(data);
      } else {
        console.log('No profile found for user, they may need to complete setup');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Don't block login if profile fetch fails
    }
  };

  const signUp = async (email: string, password: string, userData: {
    full_name: string;
    role?: 'admin' | 'customer';
  }) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          username: userData.full_name.toLowerCase().replace(/\s+/g, ''), // Generate username from full name
          full_name: userData.full_name,
          phone: '',
          role: userData.role || 'customer'
        }
      }
    });

    // If signup is successful and user is created, call edge function to create profile
    if (data.user && !error) {
      try {
        const { error: profileError } = await supabase.functions.invoke('create-profile', {
          body: {
            userId: data.user.id,
            email: email,
            fullName: userData.full_name,
            role: userData.role || 'customer'
          }
        });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        } else {
          console.log('Profile created successfully via edge function');
        }
      } catch (profileError) {
        console.error('Error calling create-profile function:', profileError);
      }
    }
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setSession(null);
      setProfile(null);
    }
    return { error };
  };

  const hasRole = (role: 'admin' | 'customer') => {
    return profile?.role === role;
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export type { Profile };