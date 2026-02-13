import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PinInput } from '@/components/ui/pin-input';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, Check, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import authImage from '@/assets/auth-trading.jpg';

type Step = 'details' | 'pin';

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

const OCCUPATION_OPTIONS = [
  { value: 'student', label: 'Student' },
  { value: 'employed', label: 'Employed' },
  { value: 'self-employed', label: 'Self-Employed' },
  { value: 'business-owner', label: 'Business Owner' },
  { value: 'freelancer', label: 'Freelancer' },
  { value: 'retired', label: 'Retired' },
  { value: 'other', label: 'Other' },
];

const Register = () => {
  const [step, setStep] = useState<Step>('details');
  const [countryCode, setCountryCode] = useState('+91');
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    occupation: '',
  });
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateDetailsStep = () => {
    if (!formData.name.trim()) {
      toast({ title: 'Required', description: 'Please enter your name', variant: 'destructive' });
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      toast({ title: 'Required', description: 'Please enter your phone number', variant: 'destructive' });
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast({ title: 'Required', description: 'Please enter a valid email', variant: 'destructive' });
      return false;
    }
    if (!formData.dateOfBirth) {
      toast({ title: 'Required', description: 'Please enter your date of birth', variant: 'destructive' });
      return false;
    }
    if (!formData.gender) {
      toast({ title: 'Required', description: 'Please select your gender', variant: 'destructive' });
      return false;
    }
    if (!formData.occupation) {
      toast({ title: 'Required', description: 'Please select your occupation', variant: 'destructive' });
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateDetailsStep()) {
      setStep('pin');
    }
  };

  const handlePinChange = (value: string) => {
    setPin(value);
    setPinError('');
  };

  const handleConfirmPinChange = (value: string) => {
    setConfirmPin(value);
    if (value.length === 4 && pin.length === 4 && value !== pin) {
      setPinError('PINs do not match');
    } else {
      setPinError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (pin.length !== 4) {
      setPinError('PIN must be 4 digits');
      return;
    }

    if (pin !== confirmPin) {
      setPinError('PINs do not match');
      return;
    }

    setLoading(true);
    
    // Normalize phone number with country code
    const normalizedPhone = countryCode + formData.phoneNumber.replace(/\D/g, '');
    
    // Use pin+phone as password
    const password = pin + normalizedPhone;
    
    const { error } = await signUp(formData.email, password, {
      name: formData.name,
      phone_number: normalizedPhone,
      email: formData.email,
      date_of_birth: formData.dateOfBirth,
      pin: pin,
      gender: formData.gender,
      occupation: formData.occupation,
    });
    
    setLoading(false);

    if (error) {
      toast({ title: 'Registration Failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Welcome, Trader!', description: 'Your account has been created' });
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
          <h2 className="text-3xl font-bold mb-2">Start Your Trading Journey</h2>
          <p className="text-muted-foreground">Join thousands of traders mastering the markets</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-4">
        <main id="main-content" className="w-full max-w-md">
          <Card className="tactical-card">
            <CardHeader className="text-center">
              <div className="caption text-primary mb-2">RECRUITMENT</div>
              <CardTitle className="text-2xl">
                {step === 'details' ? 'Begin Your Journey' : 'Secure Your Account'}
              </CardTitle>
              <CardDescription>
                {step === 'details' ? 'Create your trading profile' : 'Create a 4-digit PIN for quick login'}
              </CardDescription>
            
            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                step === 'details' ? "bg-primary text-primary-foreground" : "bg-primary/20 text-primary"
              )}>
                {step === 'pin' ? <Check className="h-4 w-4" /> : '1'}
              </div>
              <div className="w-8 h-0.5 bg-border" />
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                step === 'pin' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                2
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {step === 'details' ? (
              <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="name" className="mono text-xs text-muted-foreground mb-2 block">
                    FULL NAME
                  </label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    autoComplete="name"
                  />
                </div>

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
                      value={formData.phoneNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setFormData({ ...formData, phoneNumber: value });
                      }}
                      required
                      autoComplete="tel"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="mono text-xs text-muted-foreground mb-2 block">
                    EMAIL
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label htmlFor="dob" className="mono text-xs text-muted-foreground mb-2 block">
                    DATE OF BIRTH
                  </label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    required
                    autoComplete="bday"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="gender" className="mono text-xs text-muted-foreground mb-2 block">
                      GENDER
                    </label>
                    <Select 
                      value={formData.gender} 
                      onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {GENDER_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label htmlFor="occupation" className="mono text-xs text-muted-foreground mb-2 block">
                      OCCUPATION
                    </label>
                    <Select 
                      value={formData.occupation} 
                      onValueChange={(value) => setFormData({ ...formData, occupation: value })}
                    >
                      <SelectTrigger id="occupation">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {OCCUPATION_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button type="submit" className="w-full gap-2">
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="mono text-xs text-muted-foreground text-center block">
                    CREATE YOUR PIN
                  </label>
                  <PinInput
                    value={pin}
                    onChange={handlePinChange}
                    autoFocus
                  />
                </div>

                <div className="space-y-3">
                  <label className="mono text-xs text-muted-foreground text-center block">
                    CONFIRM YOUR PIN
                  </label>
                  <PinInput
                    value={confirmPin}
                    onChange={handleConfirmPinChange}
                    error={!!pinError}
                  />
                  {pinError && (
                    <p className="text-destructive text-sm text-center">{pinError}</p>
                  )}
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  You'll use this PIN along with your phone number to log in
                </p>

                <div className="flex gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep('details')}
                    className="flex-1 gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1" 
                    disabled={loading || pin.length !== 4 || confirmPin.length !== 4}
                  >
                    {loading ? 'Creating...' : 'Create Account'}
                  </Button>
                </div>
              </form>
            )}

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already registered?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign In
              </Link>
            </p>
          </CardContent>
        </Card>
        </main>
      </div>
    </div>
  );
};

export default Register;
