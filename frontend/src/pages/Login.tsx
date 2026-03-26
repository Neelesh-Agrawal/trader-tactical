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
import authChartLightImage from '@/assets/auth-chart-light.png';
import authChartDarkImage from '@/assets/auth-chart-dark.png';
const REMEMBER_ME_KEY = 'trademaster_remember_phone';

const Login = () => {
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signInWithPhone } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load remembered phone number on mount
  useEffect(() => {
    const savedPhone = localStorage.getItem(REMEMBER_ME_KEY);
    if (savedPhone) {
      // Extract country code if present
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

    // Handle remember me
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
      setPin(''); // Clear PIN on error
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Chart image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-white dark:bg-background">
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <img
            src={authChartLightImage}
            alt="NIFTY 50 chart - trading education"
            className="w-full h-full max-w-[94%] max-h-[94%] object-contain block dark:hidden"
          />
          <img
            src={authChartDarkImage}
            alt="NIFTY 50 chart - trading education dark mode"
            className="w-full h-full max-w-[94%] max-h-[94%] object-contain hidden dark:block"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white dark:bg-background" />
        <div className="absolute top-0 left-0 right-0 z-10 p-12 flex flex-col">
          <h2 className="text-3xl font-bold mb-2 text-foreground">Master the Markets</h2>
          <p className="text-muted-foreground">Access your personalized trading education dashboard</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-4">
        <main id="main-content" className="w-full max-w-md">
          <Card className="tactical-card">
            <CardHeader className="text-center">
              <div className="caption text-primary mb-2"></div>
              <CardTitle className="text-2xl">Welcome Back, Trader</CardTitle>
              <CardDescription>Enter your credentials to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div>
                  <label htmlFor="phone" className="mono text-xs text-muted-foreground mb-2 block">
                    PHONE NUMBER
                  </label>
                  <div className="flex gap-2">
                    <Select value={countryCode} onValueChange={setCountryCode}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+91">🇮🇳 +91</SelectItem>
                        <SelectItem value="+1">🇺🇸 +1</SelectItem>
                        <SelectItem value="+44">🇬🇧 +44</SelectItem>
                        <SelectItem value="+61">🇦🇺 +61</SelectItem>
                        <SelectItem value="+971">🇦🇪 +971</SelectItem>
                        <SelectItem value="+65">🇸🇬 +65</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter phone number"
                      value={phoneNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setPhoneNumber(value);
                      }}
                      required
                      autoComplete="tel"
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="mono text-xs text-muted-foreground mb-3 block text-center">
                    ENTER YOUR 4-DIGIT PIN
                  </label>
                  <PinInput
                    value={pin}
                    onChange={setPin}
                    autoFocus={false}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember" 
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked === true)}
                    />
                    <label 
                      htmlFor="remember" 
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      Remember me
                    </label>
                  </div>
                  
                  <Link 
                    to="/forgot-pin" 
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    Forgot PIN?
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || pin.length !== 4 || !phoneNumber.trim()}
                >
                  {loading ? 'Authenticating...' : 'Login'}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Don't Have an Account?{' '}
                <Link to="/register" className="text-primary hover:underline font-medium">
                  Create Account
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
