import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { PinInput } from '@/components/ui/pin-input';
import { useToast } from '@/hooks/use-toast';
import authImage from '@/assets/auth-trading.jpg';
const REMEMBER_ME_KEY = 'trademaster_remember_phone';

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load remembered phone number on mount
  useEffect(() => {
    const savedPhone = localStorage.getItem(REMEMBER_ME_KEY);
    if (savedPhone) {
      setPhoneNumber(savedPhone);
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
    if (rememberMe) {
      localStorage.setItem(REMEMBER_ME_KEY, phoneNumber);
    } else {
      localStorage.removeItem(REMEMBER_ME_KEY);
    }

    setLoading(true);
    const { error } = await signIn(phoneNumber, pin);
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
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img 
          src={authImage} 
          alt="Trading chart visualization"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
        <div className="relative z-10 p-12 flex flex-col justify-end">
          <h2 className="text-3xl font-bold mb-2">Master the Markets</h2>
          <p className="text-muted-foreground">Access your personalized trading education dashboard</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-4">
        <main id="main-content" className="w-full max-w-md">
          <Card className="tactical-card">
            <CardHeader className="text-center">
              <div className="caption text-primary mb-2">AUTHENTICATION</div>
              <CardTitle className="text-2xl">Welcome Back, Trader</CardTitle>
              <CardDescription>Enter your credentials to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div>
                  <label htmlFor="phone" className="mono text-xs text-muted-foreground mb-2 block">
                    PHONE NUMBER
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    autoComplete="tel"
                  />
                </div>
                
                <div>
                  <label className="mono text-xs text-muted-foreground mb-3 block text-center">
                    ENTER YOUR 4-DIGIT PIN
                  </label>
                  <PinInput
                    value={pin}
                    onChange={setPin}
                    autoFocus={!!phoneNumber}
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
                  disabled={loading || pin.length !== 4}
                >
                  {loading ? 'Authenticating...' : 'Enter Command Center'}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                New recruit?{' '}
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
