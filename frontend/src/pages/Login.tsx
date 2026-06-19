import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { PinInput } from '@/components/ui/pin-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const REMEMBER_ME_KEY = 'trademaster_remember_phone';

const Login = () => {
  const [countryCode, setCountryCode] = useState<string>('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const { signInWithPhone } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const t = setTimeout(() => setCardVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const savedPhone = localStorage.getItem(REMEMBER_ME_KEY);
    if (savedPhone) {
      if (savedPhone.startsWith('+')) {
        const codeMatch = savedPhone.match(/^(\+\d{1,3})/);
        if (codeMatch) {
          setCountryCode(codeMatch[1]);
          setPhoneNumber(savedPhone.replace(codeMatch[1], ''));
        } else {
          setPhoneNumber(savedPhone);
        }
      } else {
        setPhoneNumber(savedPhone);
      }
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) {
      toast({ title: 'Invalid PIN', description: 'PIN must be 4 digits', variant: 'destructive' });
      return;
    }
    const fullPhoneNumber = countryCode + phoneNumber.replace(/\D/g, '');
    if (rememberMe) {
      localStorage.setItem(REMEMBER_ME_KEY, fullPhoneNumber);
    } else {
      localStorage.removeItem(REMEMBER_ME_KEY);
    }
    setLoading(true);
    const { error } = await signInWithPhone(fullPhoneNumber, pin);
    setLoading(false);
    if (error) {
      toast({ title: 'Login Failed', description: error.message, variant: 'destructive' });
      setPin('');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Link
        to="/"
        className="fixed left-6 top-6 z-30 flex items-center gap-3 transition hover:opacity-80 fixed-logo-mobile"
      >
        <img
          src={`${import.meta.env.BASE_URL}logo.png`}
          alt="Easy Option Learning"
          className="h-8 w-8 rounded-md object-contain"
        />
        <span className="font-semibold text-sm text-foreground">Easy Option Learning</span>
      </Link>

      <style>{`
        /* Card animation & button */
        @keyframes cardFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .login-btn {
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px hsl(var(--success) / 0.35);
        }
        .login-btn:active:not(:disabled) { transform: translateY(0); }

        /* Background motion */
        @keyframes floatA { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes floatB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes orbDrift1 { 0%,100%{transform:translate(0,0)} 33%{transform:translate(20px,-14px)} 66%{transform:translate(-12px,18px)} }
        @keyframes orbDrift2 { 0%,100%{transform:translate(0,0)} 33%{transform:translate(-16px,12px)} 66%{transform:translate(22px,-10px)} }
        @keyframes softPulse { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:0.9;transform:scale(1.04)} }
        @keyframes rotateSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .rv-float-a { animation: floatA 5s ease-in-out infinite; }
        .rv-float-b { animation: floatB 6.5s ease-in-out infinite; }
        .rv-orb1 { animation: orbDrift1 10s ease-in-out infinite; }
        .rv-orb2 { animation: orbDrift2 13s ease-in-out infinite; }
        .rv-pulse { animation: softPulse 3s ease-in-out infinite; }
        .rv-rotate { animation: rotateSlow 18s linear infinite; }
        .rv-fade-1 { animation: fadeUp 0.6s ease-out 0.2s both; }
        .rv-fade-2 { animation: fadeUp 0.6s ease-out 0.5s both; }
        .rv-fade-3 { animation: fadeUp 0.6s ease-out 0.8s both; }

        @media (max-width: 768px) {
          .center-wrap { padding: 18px; }
          .fixed-logo-mobile { left: 1rem; top: 1rem; }
        }
        @media (max-width: 480px) {
          .fixed-logo-mobile { position: absolute; left: 0.75rem; top: 0.75rem; }
        }
      `}</style>

      {/* Background — same as Register */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/30" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="login-bg-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#login-bg-grid)" />
        </svg>
        <div className="rv-orb1 absolute top-10 left-10 w-52 h-52 rounded-full bg-emerald-300/20 dark:bg-emerald-500/10 blur-3xl" />
        <div className="rv-orb2 absolute bottom-16 right-8 w-60 h-60 rounded-full bg-teal-200/25 dark:bg-teal-600/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-emerald-100/20 dark:bg-emerald-900/10 blur-3xl" />
        <div className="rv-rotate absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border border-emerald-200/30 dark:border-emerald-700/20" />
        <div className="rv-rotate absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full border border-dashed border-emerald-300/20 dark:border-emerald-600/15" style={{ animationDirection: 'reverse', animationDuration: '24s' }} />
      </div>

      {/* Center wrapper: exact center alignment for the card */}
      <div className="flex items-center justify-center min-h-screen p-6 center-wrap">
        <main
          id="main-content"
          className="w-full max-w-md"
          style={{ opacity: 0, ...(cardVisible ? { animation: 'cardFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) forwards' } : {}) }}
        >
          <Card
            className="border border-border/60 bg-card/80 backdrop-blur-md shadow-2xl shadow-black/10 dark:shadow-black/40"
            style={{ borderRadius: '22px', padding: '8px' }}
          >
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome Back 👋</CardTitle>
              <CardDescription>Pick up right where you left off</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="flex gap-2">
                  <Select value={countryCode} onValueChange={setCountryCode}>
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="+91" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+91">🇮🇳 +91</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    maxLength={10}
                    required
                    autoComplete="tel"
                    className="flex-1 transition-shadow duration-200 focus:shadow-md focus:shadow-success/10"
                  />
                </div>

                <div>
                  <label className="mono text-xs text-muted-foreground mb-3 block text-center">
                    ENTER PIN
                  </label>
                  <PinInput value={pin} onChange={setPin} autoFocus={false} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked === true)}
                    />
                    <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                      Remember me
                    </label>
                  </div>
                  <Link to="/forgot-pin" className="text-sm text-primary hover:underline font-medium">
                    Forgot PIN?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full login-btn"
                  disabled={loading || pin.length !== 4 || !phoneNumber.trim()}
                >
                  {loading ? 'Authenticating...' : 'Login'}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:underline font-medium">
                  Sign Up
                </Link>
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Login;
