import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

import { RegisterDetailsStep, RegisterFormData } from '@/components/auth/RegisterDetailsStep';
import { RegisterPhoneOtpStep } from '@/components/auth/RegisterPhoneOtpStep';
import { RegisterEmailOtpStep } from '@/components/auth/RegisterEmailOtpStep';
import { RegisterPinStep } from '@/components/auth/RegisterPinStep';

type Step = 'details' | 'phone-otp' | 'email-otp' | 'pin';

const RegisterVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
    <style>{`
      @keyframes floatA { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
      @keyframes floatB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      @keyframes floatC { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
      @keyframes orbDrift1 { 0%,100%{transform:translate(0,0)} 33%{transform:translate(20px,-14px)} 66%{transform:translate(-12px,18px)} }
      @keyframes orbDrift2 { 0%,100%{transform:translate(0,0)} 33%{transform:translate(-16px,12px)} 66%{transform:translate(22px,-10px)} }
      @keyframes softPulse { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:0.9;transform:scale(1.04)} }
      @keyframes rotateSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      @keyframes progressFill { from{width:0%} to{width:72%} }
      @keyframes checkPop { 0%{transform:scale(0)} 60%{transform:scale(1.2)} 100%{transform:scale(1)} }
      .rv-float-a { animation: floatA 5s ease-in-out infinite; }
      .rv-float-b { animation: floatB 6.5s ease-in-out infinite; }
      .rv-float-c { animation: floatC 4.5s ease-in-out 0.5s infinite; }
      .rv-orb1 { animation: orbDrift1 10s ease-in-out infinite; }
      .rv-orb2 { animation: orbDrift2 13s ease-in-out infinite; }
      .rv-pulse { animation: softPulse 3s ease-in-out infinite; }
      .rv-rotate { animation: rotateSlow 18s linear infinite; }
      .rv-fade-1 { animation: fadeUp 0.6s ease-out 0.2s both; }
      .rv-fade-2 { animation: fadeUp 0.6s ease-out 0.5s both; }
      .rv-fade-3 { animation: fadeUp 0.6s ease-out 0.8s both; }
      .rv-fade-4 { animation: fadeUp 0.6s ease-out 1.1s both; }
      .rv-progress { animation: progressFill 1.8s ease-out 1s both; }
      .rv-check { animation: checkPop 0.4s ease-out 2s both; }
    `}</style>

    {/* Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/30" />

    <svg className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="register-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#register-grid)" />
    </svg>

    {/* Ambient orbs */}
    <div className="rv-orb1 absolute top-10 left-10 w-52 h-52 rounded-full bg-emerald-300/20 dark:bg-emerald-500/10 blur-3xl" />
    <div className="rv-orb2 absolute bottom-16 right-8 w-60 h-60 rounded-full bg-teal-200/25 dark:bg-teal-600/10 blur-3xl" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-emerald-100/20 dark:bg-emerald-900/10 blur-3xl" />

    {/* Rotating ring */}
    <div className="rv-rotate absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border border-emerald-200/30 dark:border-emerald-700/20" />
    <div className="rv-rotate absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full border border-dashed border-emerald-300/20 dark:border-emerald-600/15" style={{ animationDirection: 'reverse', animationDuration: '24s' }} />

    {/* Main content */}
    <div className="relative z-10 w-full max-w-sm px-6 flex flex-col gap-4">
      {/* Header */}
      <div className="rv-fade-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-700/50 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Beginner Friendly</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground leading-tight">
          Your learning journey<br />
          <span className="text-emerald-500">starts with one step.</span>
        </h2>
      </div>

      {/* Journey path card */}
      <div className="rv-float-a rv-fade-2">
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-2xl border border-white/80 dark:border-slate-700/50 shadow-xl shadow-emerald-100/40 dark:shadow-black/30 p-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Your Learning Path</p>
          <div className="space-y-2.5">
            {[
              { label: 'Options Fundamentals', done: true },
              { label: 'Reading Option Chains', done: true },
              { label: 'Greeks & Pricing', done: false, active: true },
              { label: 'Strategy Building', done: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                  item.done ? 'bg-emerald-500' : item.active ? 'bg-emerald-100 dark:bg-emerald-900/40 border-2 border-emerald-400' : 'bg-slate-100 dark:bg-slate-700'
                }`}>
                  {item.done && <svg className="rv-check w-3 h-3 text-white" fill="none" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  {item.active && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                </div>
                <span className={`text-sm ${
                  item.done ? 'text-slate-400 dark:text-slate-500 line-through' :
                  item.active ? 'text-slate-800 dark:text-white font-semibold' :
                  'text-slate-400 dark:text-slate-500'
                }`}>{item.label}</span>
                {item.active && <span className="ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">In Progress</span>}
              </div>
            ))}
          </div>
          {/* Progress bar */}
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              <span>Overall Progress</span><span className="font-mono font-semibold text-emerald-600">72%</span>
            </div>
            <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="rv-progress h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" style={{ width: 0 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Two mini cards row */}
      <div className="rv-fade-3 grid grid-cols-2 gap-3">
        {/* Achievement card */}
        <div className="rv-float-b bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-xl border border-white/80 dark:border-slate-700/50 shadow-lg p-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mb-2">
            <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Badges Earned</p>
          <p className="text-lg font-bold font-mono text-slate-800 dark:text-white">4 / 12</p>
        </div>

        {/* Streak card */}
        <div className="rv-float-c bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-xl border border-white/80 dark:border-slate-700/50 shadow-lg p-3">
          <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-2">
            <span className="text-base">🔥</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Day Streak</p>
          <p className="text-lg font-bold font-mono text-slate-800 dark:text-white">7 Days</p>
        </div>
      </div>

      {/* Bottom trust line */}
      <div className="rv-fade-4 rv-pulse flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50/80 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/40">
        <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">Your data is safe. 100% secure & private.</p>
      </div>
    </div>
  </div>
);

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
  const [formData, setFormData] = useState<RegisterFormData>({
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
  const [phoneOtpError, setPhoneOtpError] = useState('');
  const [phoneOtpLoading, setPhoneOtpLoading] = useState(false);
  const [phoneResendTimer, setPhoneResendTimer] = useState(0);
  
  // Email OTP state
  const [emailOtp, setEmailOtp] = useState('');
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
      
      if (response.otp && import.meta.env.DEV) {
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
      
      if (response.otp && import.meta.env.DEV) {
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
    setLoading(true);
    setStep('phone-otp');
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
      localStorage.removeItem('last_lesson');
      toast({ title: 'Welcome, Trader!', description: 'Your account has been created' });
      navigate('/pricing');
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 'details': return 'Create Your Account';
      case 'phone-otp': return 'Verify Your Phone';
      case 'email-otp': return 'Verify Your Email';
      case 'pin': return 'Secure Your Account';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 'details': return 'Tell us a bit about yourself to get started';
      case 'phone-otp': return 'Enter the code sent to your phone';
      case 'email-otp': return 'Enter the code sent to your email';
      case 'pin': return 'Create a 4-digit PIN for quick login';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <RegisterVisual />
      </div>
      <Link to="/" className="fixed left-6 top-6 z-30 flex items-center gap-3 transition hover:opacity-80 fixed-logo-mobile">
        <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Easy Option Learning" className="h-8 w-8 rounded-md object-contain" />
        <span className="font-semibold text-foreground text-sm">Easy Option Learning</span>
      </Link>
      <style>{`
        @media (max-width: 768px) {
          .fixed-logo-mobile { left: 1rem; top: 1rem; }
        }
        @media (max-width: 480px) {
          .fixed-logo-mobile { left: 0.75rem; top: 0.75rem; }
        }
      `}</style>

      <div className="flex items-center justify-center min-h-screen p-4">
        <main id="main-content" className="w-full max-w-lg mx-auto">
          <Card
            className="border border-border/60 bg-card/80 backdrop-blur-md shadow-2xl shadow-black/10 dark:shadow-black/40"
            style={{ borderRadius: '22px', padding: '8px' }}
          >
            <CardHeader className="text-center">
              <div className="caption text-primary mb-2"></div>
              <CardTitle className="text-2xl">
                {getStepTitle()}
              </CardTitle>
              <CardDescription>
                {getStepDescription()}
              </CardDescription>
            
              {/* Step Indicator */}
              <div className="mt-4">
                <style>{`
                  @keyframes stepGlow {
                    0%,100% { box-shadow: 0 0 0 0 hsl(var(--success) / 0.4); }
                    50% { box-shadow: 0 0 0 6px hsl(var(--success) / 0); }
                  }
                  @keyframes lineFill {
                    from { width: 0%; }
                    to { width: 100%; }
                  }
                  .step-glow { animation: stepGlow 2s ease-in-out infinite; }
                  .step-circle {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                  }
                  .step-circle:hover { transform: scale(1.12); }
                  .line-fill { animation: lineFill 0.4s ease-out forwards; }
                `}</style>

                <div className="flex items-center justify-center">
                  {[
                    { key: 'details',   label: 'Profile' },
                    { key: 'phone-otp', label: 'Mobile OTP' },
                    { key: 'email-otp', label: 'Email OTP' },
                    { key: 'pin',       label: 'Set PIN' },
                  ].map(({ key, label }, i, arr) => {
                    const stepOrder = { details: 0, 'phone-otp': 1, 'email-otp': 2, pin: 3 };
                    const currentIdx = stepOrder[step];
                    const thisIdx = stepOrder[key as Step];
                    const isCompleted = thisIdx < currentIdx;
                    const isActive = thisIdx === currentIdx;

                    return (
                      <div key={key} className="flex items-center">
                        <div className="flex flex-col items-center gap-1.5">
                          <div
                            className={cn(
                              'step-circle w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold',
                              isCompleted && 'bg-success text-white step-glow',
                              isActive && 'bg-success text-white ring-2 ring-success/30 ring-offset-2 ring-offset-background',
                              !isCompleted && !isActive && 'bg-muted text-muted-foreground'
                            )}
                          >
                            {isCompleted ? <Check className="h-3.5 w-3.5" /> : thisIdx + 1}
                          </div>
                          <span className={cn(
                            'text-[10px] font-medium whitespace-nowrap',
                            isActive ? 'text-success' : isCompleted ? 'text-success/70' : 'text-muted-foreground'
                          )}>
                            {label}
                          </span>
                        </div>

                        {i < arr.length - 1 && (
                          <div className="relative w-10 h-0.5 bg-border mx-1 mb-5 overflow-hidden rounded-full">
                            {(isCompleted || (isActive && thisIdx < currentIdx)) && (
                              <div className="absolute inset-0 bg-success line-fill rounded-full" />
                            )}
                            {isCompleted && (
                              <div className="absolute inset-0 bg-success rounded-full" />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {step === 'details' && (
                <RegisterDetailsStep
                  formData={formData}
                  setFormData={setFormData}
                  countryCode={countryCode}
                  setCountryCode={setCountryCode}
                  loading={loading}
                  showTermsModal={showTermsModal}
                  setShowTermsModal={setShowTermsModal}
                  onNext={handleNextStep}
                  occupationOptions={OCCUPATION_OPTIONS}
                />
              )}

              {step === 'phone-otp' && (
                <RegisterPhoneOtpStep
                  countryCode={countryCode}
                  phoneNumber={formData.phoneNumber}
                  phoneOtp={phoneOtp}
                  setPhoneOtp={setPhoneOtp}
                  phoneOtpError={phoneOtpError}
                  setPhoneOtpError={setPhoneOtpError}
                  phoneOtpLoading={phoneOtpLoading}
                  phoneResendTimer={phoneResendTimer}
                  onBack={() => setStep('details')}
                  onVerify={verifyPhoneOtp}
                  onResend={sendPhoneOtp}
                />
              )}

              {step === 'email-otp' && (
                <RegisterEmailOtpStep
                  email={formData.email}
                  emailOtp={emailOtp}
                  setEmailOtp={setEmailOtp}
                  emailOtpError={emailOtpError}
                  setEmailOtpError={setEmailOtpError}
                  emailOtpLoading={emailOtpLoading}
                  emailResendTimer={emailResendTimer}
                  onBack={() => setStep('phone-otp')}
                  onVerify={verifyEmailOtp}
                  onResend={sendEmailOtp}
                />
              )}

              {step === 'pin' && (
                <RegisterPinStep
                  pin={pin}
                  handlePinChange={handlePinChange}
                  confirmPin={confirmPin}
                  handleConfirmPinChange={handleConfirmPinChange}
                  pinError={pinError}
                  loading={loading}
                  onBack={() => setStep('email-otp')}
                  onSubmit={handleSubmit}
                />
              )}

              <p className="text-center text-sm text-muted-foreground mt-4">
                Already have an account?{' '}
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
