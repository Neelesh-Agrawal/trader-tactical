import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { apiFetch, AuthTokens, getAuthTokens, setAuthTokens } from '@/lib/api';

interface Profile {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
  phone_verified?: boolean;
  email_verified?: boolean;
  date_of_birth?: string | null;
  current_level?: string;
}

interface SignUpData {
  name: string;
  email: string;
  phone_number: string;
  password: string;
  occupation?: string;
  sex?: string;
  birth_date?: string;
}

interface Streak {
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
}

interface AuthContextType {
  user: { id: number; email: string } | null;
  profile: Profile | null;
  streak: Streak | null;
  loading: boolean;
  signUp: (data: SignUpData) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithPhone: (phoneNumber: string, pin: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateStreak: () => Promise<number>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: number; email: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const data = await apiFetch<{
        id: number;
        email: string;
        username: string;
        first_name: string;
        last_name: string;
        phone?: string;
        phone_verified?: boolean;
        email_verified?: boolean;
        occupation?: string;
        sex?: string;
        birth_date?: string;
      }>('/api/auth/me/');

      const name =
        [data.first_name, data.last_name].filter(Boolean).join(' ') ||
        data.email;

      setUser({ id: data.id, email: data.email });
      setProfile({
        id: data.id,
        name,
        email: data.email,
        phone_number: data.phone,
        phone_verified: data.phone_verified,
        email_verified: data.email_verified,
        date_of_birth: data.birth_date ? new Date(data.birth_date) : null,
        current_level: 'beginner',
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setUser(null);
      setProfile(null);
    }
  };

  const fetchStreak = async () => {
    try {
      const data = await apiFetch<{
        current_streak: number;
        longest_streak: number;
        last_activity_date: string | null;
      }>('/api/progress/streak/');
      
      setStreak({
        current_streak: data.current_streak,
        longest_streak: data.longest_streak,
        last_activity_date: data.last_activity_date,
      });
    } catch (error) {
      console.error('Failed to fetch streak:', error);
      setStreak(null);
    }
  };

  const refreshProfile = async () => {
    if (!getAuthTokens()) return;
    await fetchProfile();
    await fetchStreak();
  };

  useEffect(() => {
    const bootstrap = async () => {
      const tokens = getAuthTokens();
      if (!tokens) {
        setLoading(false);
        return;
      }

      await refreshProfile();
      setLoading(false);
    };

    void bootstrap();
  }, []);

  const signUp = async (
    data: SignUpData
  ): Promise<{ error: Error | null }> => {
    try {
      if (!data.name || typeof data.name !== 'string') {
        throw new Error('Name is required');
      }
      
      const nameParts = data.name.split(' ').filter(Boolean);
      const first_name = nameParts[0] || data.name;
      const last_name = nameParts.slice(1).join(' ');

      await apiFetch('/api/auth/register/', {
        method: 'POST',
        auth: false,
        body: JSON.stringify({
          email: data.email,
          username: data.email,
          password: data.password,
          first_name,
          last_name,
          phone: data.phone_number,
          occupation: data.occupation,
          sex: data.sex,
          birth_date: data.birth_date,
        }),
      });

      const tokens = await apiFetch<AuthTokens>('/api/auth/login/', {
        method: 'POST',
        auth: false,
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      setAuthTokens(tokens);
      await refreshProfile();

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (
    email: string,
    password: string
  ): Promise<{ error: Error | null }> => {
    try {
      const tokens = await apiFetch<AuthTokens>('/api/auth/login/', {
        method: 'POST',
        auth: false,
        body: JSON.stringify({ email, password }),
      });

      setAuthTokens(tokens);
      await refreshProfile();

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signInWithPhone = async (
    phoneNumber: string,
    pin: string
  ): Promise<{ error: Error | null }> => {
    try {
      // Normalize phone number (remove spaces, dashes, etc.)
      const normalizedPhone = phoneNumber.replace(/[\s\-\(\)]/g, '');

      const tokens = await apiFetch<AuthTokens>('/api/auth/phone-login/', {
        method: 'POST',
        auth: false,
        body: JSON.stringify({ phone: normalizedPhone, pin }),
      });

      setAuthTokens(tokens);
      await refreshProfile();

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    setAuthTokens(null);
    setUser(null);
    setProfile(null);
    setStreak(null);
  };

  const updateStreak = async (): Promise<number> => {
    try {
      const data = await apiFetch<{
        current_streak: number;
        longest_streak: number;
        last_activity_date: string | null;
      }>('/api/progress/streak/update/', {
        method: 'POST',
      });
      
      const currentStreak = data.current_streak;
      
      setStreak({
        current_streak: data.current_streak,
        longest_streak: data.longest_streak,
        last_activity_date: data.last_activity_date,
      });
      
      return currentStreak;
    } catch (error) {
      console.error('Failed to update streak:', error);
      return streak?.current_streak ?? 0;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        streak,
        loading,
        signUp,
        signIn,
        signInWithPhone,
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
