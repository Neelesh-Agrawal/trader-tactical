import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  user_id: string;
  name: string;
  phone_number: string;
  email: string;
  date_of_birth: string;
  current_level: string;
}

interface SignUpData {
  name: string;
  phone_number: string;
  email: string;
  date_of_birth: string;
  pin: string;
}

interface Streak {
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  streak: Streak | null;
  loading: boolean;
  signUp: (email: string, password: string, profileData: SignUpData) => Promise<{ error: Error | null }>;
  signIn: (phoneNumber: string, pin: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateStreak: () => Promise<number>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (!error && data) {
      setProfile(data as Profile);
    }
  };

  const fetchStreak = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_streaks')
      .select('current_streak, longest_streak, last_activity_date')
      .eq('user_id', userId)
      .single();
    
    if (!error && data) {
      setStreak(data as Streak);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
      await fetchStreak(user.id);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Defer fetching to avoid race conditions
          setTimeout(() => {
            fetchProfile(currentSession.user.id);
            fetchStreak(currentSession.user.id);
          }, 0);
        } else {
          setProfile(null);
          setStreak(null);
        }
        
        setLoading(false);
      }
    );

    // Then get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      if (initialSession?.user) {
        fetchProfile(initialSession.user.id);
        fetchStreak(initialSession.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const hashPin = async (pin: string): Promise<string> => {
    // Simple hash for demo - in production use proper bcrypt on server
    const encoder = new TextEncoder();
    const data = encoder.encode(pin + 'trademaster_salt');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const signUp = async (
    email: string,
    password: string,
    profileData: { name: string; phone_number: string; email: string; date_of_birth: string; pin: string }
  ): Promise<{ error: Error | null }> => {
    try {
      const pinHash = await hashPin(profileData.pin);

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin
        }
      });

      if (signUpError) throw signUpError;
      if (!data.user) throw new Error('No user returned');

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: data.user.id,
          name: profileData.name,
          phone_number: profileData.phone_number,
          email: profileData.email,
          date_of_birth: profileData.date_of_birth,
          pin_hash: pinHash,
          current_level: 'beginner'
        });

      if (profileError) throw profileError;

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (phoneNumber: string, pin: string): Promise<{ error: Error | null }> => {
    try {
      // Normalize phone number (remove spaces, dashes)
      const normalizedPhone = phoneNumber.replace(/[\s\-\(\)]/g, '');
      
      // Find user by phone number
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('email, pin_hash, user_id')
        .eq('phone_number', normalizedPhone)
        .maybeSingle();

      if (profileError) {
        console.error('Profile lookup error:', profileError);
        throw new Error('Unable to verify credentials');
      }
      
      if (!profileData) {
        throw new Error('Phone number not found. Please check and try again.');
      }

      // Verify PIN
      const hashedPin = await hashPin(pin);
      if (hashedPin !== profileData.pin_hash) {
        throw new Error('Invalid PIN. Please try again.');
      }

      // Sign in with email (we use phone+pin as password, matching registration)
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: profileData.email,
        password: pin + normalizedPhone
      });

      if (signInError) {
        console.error('Auth sign in error:', signInError);
        throw new Error('Authentication failed. Please try again.');
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setStreak(null);
  };

  const updateStreak = async (): Promise<number> => {
    if (!user) return 0;
    
    const { data, error } = await supabase.rpc('update_daily_streak', {
      p_user_id: user.id
    });

    if (!error && data !== null) {
      await fetchStreak(user.id);
      return data as number;
    }
    
    return streak?.current_streak ?? 0;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        streak,
        loading,
        signUp,
        signIn,
        signOut,
        updateStreak,
        refreshProfile
      }}
    >
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
