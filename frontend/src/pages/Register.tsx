import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PinInput } from '@/components/ui/pin-input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, Check, Shield, MessageSquare, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { typography } from '@/design-system';
import authSignupImage from '@/assets/auth-signup.png';

type Step = 'details' | 'phone-otp' | 'email-otp' | 'pin';

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

const OCCUPATION_OPTIONS = [
  { value: 'student', label: 'Student' },
  { value: 'trader', label: 'Full-time Trader' },
  { value: 'professional', label: 'Finance Professional' },
  { value: 'entrepreneur', label: 'Entrepreneur' },
  { value: 'employee', label: 'Salaried Employee' },
  { value: 'business', label: 'Business Owner' },
  { value: 'investor', label: 'Investor' },
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
  
  // Phone OTP state
  const [phoneOtp, setPhoneOtp] = useState('');
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtpError, setPhoneOtpError] = useState('');
  const [phoneOtpLoading, setPhoneOtpLoading] = useState(false);
  const [phoneResendTimer, setPhoneResendTimer] = useState(0);
  
  // Email OTP state
  const [emailOtp, setEmailOtp] = useState('');
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpError, setEmailOtpError] = useState('');
  const [emailOtpLoading, setEmailOtpLoading] = useState(false);
  const [emailResendTimer, setEmailResendTimer] = useState(0);

  // Terms modal
  const [showTermsModal, setShowTermsModal] = useState(false);
  
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
    if (formData.phoneNumber.length < 10) {
      toast({ title: 'Invalid', description: 'Please enter a valid phone number', variant: 'destructive' });
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

  const sendPhoneOtp = async () => {
    const normalizedPhone = countryCode + formData.phoneNumber.replace(/\D/g, '');
    
    setPhoneOtpLoading(true);
    setPhoneOtpError('');
    
    try {
      const response = await apiFetch<{ message: string; otp?: string }>('/api/auth/send-otp/', {
        method: 'POST',
        auth: false,
        body: JSON.stringify({ phone: normalizedPhone }),
      });
      
      setPhoneOtpSent(true);
      setPhoneResendTimer(60);
      
      const timer = setInterval(() => {
        setPhoneResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      toast({ title: 'OTP Sent', description: 'Verification code sent to your phone' });
      
      if (response.otp) {
        console.log('Dev mode phone OTP:', response.otp);
      }
    } catch (error: any) {
      setPhoneOtpError(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setPhoneOtpLoading(false);
    }
  };

  const verifyPhoneOtp = async () => {
    if (phoneOtp.length !== 6) {
      setPhoneOtpError('Please enter the 6-digit code');
      return;
    }
    
    const normalizedPhone = countryCode + formData.phoneNumber.replace(/\D/g, '');
    
    setPhoneOtpLoading(true);
    setPhoneOtpError('');
    
    try {
      await apiFetch('/api/auth/verify-otp/', {
        method: 'POST',
        auth: false,
        body: JSON.stringify({ phone: normalizedPhone, otp: phoneOtp }),
      });
      
      // Phone verified, move to email step
      setStep('email-otp');
      sendEmailOtp();
    } catch (error: any) {
      setPhoneOtpError(error.message || 'Invalid OTP. Please try again.');
    } finally {
      setPhoneOtpLoading(false);
    }
  };

  const sendEmailOtp = async () => {
    setEmailOtpLoading(true);
    setEmailOtpError('');
    
    try {
      const response = await apiFetch<{ message: string; otp?: string }>('/api/auth/send-email-otp/', {
        method: 'POST',
        auth: false,
        body: JSON.stringify({ email: formData.email.toLowerCase() }),
      });
      
      setEmailOtpSent(true);
      setEmailResendTimer(60);
      
      const timer = setInterval(() => {
        setEmailResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      toast({ title: 'OTP Sent', description: 'Verification code sent to your email' });
      
      if (response.otp) {
        console.log('Dev mode email OTP:', response.otp);
      }
    } catch (error: any) {
      setEmailOtpError(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setEmailOtpLoading(false);
    }
  };

  const verifyEmailOtp = async () => {
    if (emailOtp.length !== 6) {
      setEmailOtpError('Please enter the 6-digit code');
      return;
    }
    
    setEmailOtpLoading(true);
    setEmailOtpError('');
    
    try {
      await apiFetch('/api/auth/verify-email-otp/', {
        method: 'POST',
        auth: false,
        body: JSON.stringify({ email: formData.email.toLowerCase(), otp: emailOtp }),
      });
      
      // Email verified, move to PIN step
      setStep('pin');
    } catch (error: any) {
      setEmailOtpError(error.message || 'Invalid OTP. Please try again.');
    } finally {
      setEmailOtpLoading(false);
    }
  };

  const handleNextStep = () => {
    if (!validateDetailsStep()) {
      return;
    }
    
    // Set loading and step immediately
    setLoading(true);
    setStep('phone-otp');
    
    // Then send OTP
    sendPhoneOtp().finally(() => {
      setLoading(false);
    });
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
    
    const normalizedPhone = countryCode + formData.phoneNumber.replace(/\D/g, '');
    
    const sexMap: Record<string, string> = {
      'male': 'M',
      'female': 'F',
      'other': 'N',
      'prefer-not-to-say': 'N',
    };
    
    const { error } = await signUp({
      name: formData.name,
      email: formData.email,
      phone_number: normalizedPhone,
      password: pin,
      occupation: formData.occupation,
      sex: sexMap[formData.gender] || 'N',
      birth_date: formData.dateOfBirth,
    });
    
    setLoading(false);

    if (error) {
      toast({ title: 'Registration Failed', description: error.message, variant: 'destructive' });
    } else {
      // Clear last lesson from localStorage for new users
      localStorage.removeItem('last_lesson');
      toast({ title: 'Welcome, Trader!', description: 'Your account has been created' });
      navigate('/dashboard');
    }
  };

  const getStepNumber = () => {
    switch (step) {
      case 'details': return 1;
      case 'phone-otp': return 2;
      case 'email-otp': return 3;
      case 'pin': return 4;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 'details': return 'Begin Your Journey';
      case 'phone-otp': return 'Verify Your Phone';
      case 'email-otp': return 'Verify Your Email';
      case 'pin': return 'Secure Your Account';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 'details': return 'Create your trading profile';
      case 'phone-otp': return 'Enter the code sent to your phone';
      case 'email-otp': return 'Enter the code sent to your email';
      case 'pin': return 'Create a 4-digit PIN for quick login';
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={authSignupImage}
            alt="Trading chart visualization"
            className="w-[85%] h-[85%] object-contain"
          />
        </div>
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
                {getStepTitle()}
              </CardTitle>
              <CardDescription>
                {getStepDescription()}
              </CardDescription>
            
            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                step !== 'details' ? "bg-primary text-primary-foreground" : "bg-primary/20 text-primary"
              )}>
                {step !== 'details' ? <Check className="h-4 w-4" /> : '1'}
              </div>
              <div className="w-8 h-0.5 bg-border" />
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                step === 'phone-otp' ? "bg-primary text-primary-foreground" : 
                (step === 'email-otp' || step === 'pin') ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
              )}>
                {(step === 'email-otp' || step === 'pin') ? <Check className="h-4 w-4" /> : '2'}
              </div>
              <div className="w-8 h-0.5 bg-border" />
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                step === 'email-otp' ? "bg-primary text-primary-foreground" : 
                step === 'pin' ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
              )}>
                {step === 'pin' ? <Check className="h-4 w-4" /> : '3'}
              </div>
              <div className="w-8 h-0.5 bg-border" />
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                step === 'pin' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                4
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {step === 'details' ? (
              <>
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

                <p className="text-xs text-muted-foreground text-center">
                  By continuing, you accept the{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowTermsModal(true);
                    }}
                    className="text-primary hover:underline font-medium underline-offset-2"
                  >
                    Terms and Conditions
                  </button>
                </p>

                <Button type="submit" className="w-full gap-2" disabled={loading}>
                  {loading ? 'Please wait...' : 'Continue'}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </Button>
              </form>

              <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
                <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0">
                  <DialogHeader className="p-6 pb-0 shrink-0">
                    <DialogTitle className="font-display">Terms and Conditions</DialogTitle>
                  </DialogHeader>
                  <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6 font-body">
                    <section>
                      <h3 className={`${typography.heading.h4} font-display mb-2`}>1. Introduction</h3>
                      <p className={`${typography.body.sm} text-muted-foreground leading-relaxed`}>
                        These Terms and Conditions ("Terms") govern the use of the website www.easyoptionlearning.com ("Website"), 
                        owned and operated by Anata Securities Private Limited ("Company", "We", "Us", "Our"). 
                        By accessing or enrolling in any course offered on this Website, you agree to be legally bound by these Terms.
                      </p>
                    </section>
                    <section>
                      <h3 className={`${typography.heading.h4} font-display mb-2`}>2. Nature of Services</h3>
                      <ul className={`${typography.body.sm} text-muted-foreground leading-relaxed list-disc pl-6 space-y-1`}>
                        <li>The Website provides educational content related to options trading and financial markets.</li>
                        <li>The content includes video lectures, written materials, webinars, and downloadable resources.</li>
                        <li>The services are strictly educational. The Company does not provide investment advisory services or stock tips.</li>
                      </ul>
                    </section>
                    <section>
                      <h3 className={`${typography.heading.h4} font-display mb-2`}>3. Eligibility</h3>
                      <ul className={`${typography.body.sm} text-muted-foreground leading-relaxed list-disc pl-6 space-y-1`}>
                        <li>Users must be at least 18 years of age.</li>
                        <li>By enrolling, you confirm you are legally competent to enter into a binding contract.</li>
                      </ul>
                    </section>
                    <section>
                      <h3 className={`${typography.heading.h4} font-display mb-2`}>4. User Account & Responsibilities</h3>
                      <ul className={`${typography.body.sm} text-muted-foreground leading-relaxed list-disc pl-6 space-y-1`}>
                        <li>You must provide accurate information during registration.</li>
                        <li>Login credentials are confidential. Sharing course access is strictly prohibited.</li>
                        <li>The Company reserves the right to suspend or terminate accounts for misuse.</li>
                      </ul>
                    </section>
                    <section>
                      <h3 className={`${typography.heading.h4} font-display mb-2`}>5. Intellectual Property Rights</h3>
                      <ul className={`${typography.body.sm} text-muted-foreground leading-relaxed list-disc pl-6 space-y-1`}>
                        <li>All content is the exclusive property of Anata Securities Private Limited.</li>
                        <li>No content may be copied, reproduced, or redistributed without written permission.</li>
                      </ul>
                    </section>
                    <section>
                      <h3 className={`${typography.heading.h4} font-display mb-2`}>6. Payment Terms</h3>
                      <ul className={`${typography.body.sm} text-muted-foreground leading-relaxed list-disc pl-6 space-y-1`}>
                        <li>All course fees must be paid in full before access is granted.</li>
                        <li>Prices are subject to change. Payments are governed by our Refund Policy.</li>
                      </ul>
                    </section>
                    <section>
                      <h3 className={`${typography.heading.h4} font-display mb-2`}>7. Limitation of Liability</h3>
                      <p className={`${typography.body.sm} text-muted-foreground leading-relaxed`}>
                        The Company shall not be liable for trading losses, indirect damages, or loss of profits. 
                        Users are solely responsible for their trading decisions.
                      </p>
                    </section>
                    <section>
                      <h3 className={`${typography.heading.h4} font-display mb-2`}>8. Termination</h3>
                      <p className={`${typography.body.sm} text-muted-foreground leading-relaxed`}>
                        The Company may terminate access for violation of Terms, modify content, or discontinue services.
                      </p>
                    </section>
                    <section>
                      <h3 className={`${typography.heading.h4} font-display mb-2`}>9. Governing Law</h3>
                      <p className={`${typography.body.sm} text-muted-foreground leading-relaxed`}>
                        These Terms are governed by the laws of India. Disputes shall be subject to courts in Ernakulam, Kerala.
                      </p>
                    </section>
                    <p className={`${typography.body.xs} text-muted-foreground italic`}>
                      Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
              </>
            ) : step === 'phone-otp' ? (
              <div className="space-y-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="h-8 w-8 text-primary" />
                  </div>
                </div>
                
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    We've sent a verification code to
                  </p>
                  <p className="font-medium">
                    {countryCode} {formData.phoneNumber}
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="mono text-xs text-muted-foreground text-center block">
                    ENTER VERIFICATION CODE
                  </label>
                  <Input
                    type="tel"
                    placeholder="123456"
                    value={phoneOtp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setPhoneOtp(value);
                      setPhoneOtpError('');
                    }}
                    className="text-center text-2xl tracking-widest"
                    autoFocus
                  />
                  {phoneOtpError && (
                    <p className="text-destructive text-sm text-center">{phoneOtpError}</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setPhoneOtpSent(false);
                      setStep('details');
                    }}
                    className="flex-1 gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button 
                    type="button"
                    onClick={verifyPhoneOtp}
                    disabled={phoneOtpLoading || phoneOtp.length !== 6}
                    className="flex-1"
                  >
                    {phoneOtpLoading ? 'Verifying...' : 'Verify'}
                  </Button>
                </div>

                <div className="text-center">
                  {phoneResendTimer > 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Resend code in {phoneResendTimer}s
                    </p>
                  ) : (
                    <Button
                      type="button"
                      variant="link"
                      onClick={sendPhoneOtp}
                      disabled={phoneOtpLoading}
                      className="text-sm"
                    >
                      Didn't receive the code? Resend
                    </Button>
                  )}
                </div>
              </div>
            ) : step === 'email-otp' ? (
              <div className="space-y-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="h-8 w-8 text-primary" />
                  </div>
                </div>
                
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    We've sent a verification code to
                  </p>
                  <p className="font-medium">
                    {formData.email}
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="mono text-xs text-muted-foreground text-center block">
                    ENTER VERIFICATION CODE
                  </label>
                  <Input
                    type="tel"
                    placeholder="123456"
                    value={emailOtp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setEmailOtp(value);
                      setEmailOtpError('');
                    }}
                    className="text-center text-2xl tracking-widest"
                    autoFocus
                  />
                  {emailOtpError && (
                    <p className="text-destructive text-sm text-center">{emailOtpError}</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setEmailOtpSent(false);
                      setStep('phone-otp');
                    }}
                    className="flex-1 gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button 
                    type="button"
                    onClick={verifyEmailOtp}
                    disabled={emailOtpLoading || emailOtp.length !== 6}
                    className="flex-1"
                  >
                    {emailOtpLoading ? 'Verifying...' : 'Verify'}
                  </Button>
                </div>

                <div className="text-center">
                  {emailResendTimer > 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Resend code in {emailResendTimer}s
                    </p>
                  ) : (
                    <Button
                      type="button"
                      variant="link"
                      onClick={sendEmailOtp}
                      disabled={emailOtpLoading}
                      className="text-sm"
                    >
                      Didn't receive the code? Resend
                    </Button>
                  )}
                </div>
              </div>
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
                  You'll use this PIN along with your email to log in
                </p>

                <div className="flex gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep('email-otp')}
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
