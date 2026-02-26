import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Check, MessageSquare, Mail, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

type Step = 'phone' | 'email' | 'complete';

const Verify = () => {
  const [step, setStep] = useState<Step>('phone');
  const [loading, setLoading] = useState(false);
  
  // Phone OTP state
  const [phoneOtp, setPhoneOtp] = useState('');
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtpError, setPhoneOtpError] = useState('');
  const [phoneResendTimer, setPhoneResendTimer] = useState(0);
  
  // Email OTP state
  const [emailOtp, setEmailOtp] = useState('');
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpError, setEmailOtpError] = useState('');
  const [emailResendTimer, setEmailResendTimer] = useState(0);
  
  const { profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Determine which verifications are needed
  const needsPhoneVerification = profile && !profile.phone_verified;
  const needsEmailVerification = profile && !profile.email_verified;

  useEffect(() => {
    // If no verifications needed, redirect to dashboard
    if (profile && !needsPhoneVerification && !needsEmailVerification) {
      navigate('/dashboard');
    }
    
    // Start with email if phone is already verified
    if (profile && needsPhoneVerification === false && needsEmailVerification) {
      setStep('email');
      sendEmailOtp();
    }
  }, [profile]);

  const sendPhoneOtp = async () => {
    if (!profile?.phone_number) {
      toast({ title: 'Error', description: 'No phone number on file', variant: 'destructive' });
      return;
    }
    
    setLoading(true);
    setPhoneOtpError('');
    
    try {
      const response = await apiFetch<{ message: string; otp?: string }>('/api/auth/send-otp/', {
        method: 'POST',
        auth: false,
        body: JSON.stringify({ phone: profile.phone_number }),
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
      setLoading(false);
    }
  };

  const verifyPhoneOtp = async () => {
    if (!profile?.phone_number) return;
    if (phoneOtp.length !== 6) {
      setPhoneOtpError('Please enter the 6-digit code');
      return;
    }
    
    setLoading(true);
    setPhoneOtpError('');
    
    try {
      await apiFetch('/api/auth/verify-otp/', {
        method: 'POST',
        auth: false,
        body: JSON.stringify({ phone: profile.phone_number, otp: phoneOtp }),
      });
      
      await refreshProfile();
      
      // Move to email if needed
      if (needsEmailVerification) {
        setStep('email');
        sendEmailOtp();
      } else {
        setStep('complete');
        toast({ title: 'Verified!', description: 'All verifications complete' });
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (error: any) {
      setPhoneOtpError(error.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendEmailOtp = async () => {
    if (!profile?.email) return;
    
    setLoading(true);
    setEmailOtpError('');
    
    try {
      const response = await apiFetch<{ message: string; otp?: string }>('/api/auth/send-email-otp/', {
        method: 'POST',
        auth: false,
        body: JSON.stringify({ email: profile.email }),
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
      setLoading(false);
    }
  };

  const verifyEmailOtp = async () => {
    if (!profile?.email) return;
    if (emailOtp.length !== 6) {
      setEmailOtpError('Please enter the 6-digit code');
      return;
    }
    
    setLoading(true);
    setEmailOtpError('');
    
    try {
      await apiFetch('/api/auth/verify-email-otp/', {
        method: 'POST',
        auth: false,
        body: JSON.stringify({ email: profile.email, otp: emailOtp }),
      });
      
      await refreshProfile();
      setStep('complete');
      toast({ title: 'Verified!', description: 'All verifications complete' });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error: any) {
      setEmailOtpError(error.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return null;
  }

  const currentStep = step === 'complete' ? 'complete' : (step === 'email' ? 'email' : 'phone');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="tactical-card w-full max-w-md">
        <CardHeader className="text-center">
          <div className="caption text-primary mb-2">VERIFICATION</div>
          <CardTitle className="text-2xl">
            {currentStep === 'complete' ? 'All Verified!' : 
             currentStep === 'email' ? 'Verify Your Email' : 'Verify Your Phone'}
          </CardTitle>
          <CardDescription>
            {currentStep === 'complete' 
              ? 'Redirecting to dashboard...' 
              : currentStep === 'email' 
                ? 'Enter the code sent to your email'
                : 'Enter the code sent to your phone'}
          </CardDescription>
        
          {/* Step Indicator */}
          {(needsPhoneVerification && needsEmailVerification) && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                step === 'email' || step === 'complete' ? "bg-primary text-primary-foreground" : "bg-primary/20 text-primary"
              )}>
                {step === 'email' || step === 'complete' ? <Check className="h-4 w-4" /> : '1'}
              </div>
              <div className="w-8 h-0.5 bg-border" />
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                step === 'email' ? "bg-primary text-primary-foreground" : 
                step === 'complete' ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
              )}>
                {step === 'complete' ? <Check className="h-4 w-4" /> : '2'}
              </div>
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          {currentStep === 'phone' && needsPhoneVerification && (
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
                <p className="font-medium">{profile.phone_number}</p>
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
                  onClick={() => navigate('/login')}
                  className="flex-1 gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button 
                  type="button"
                  onClick={verifyPhoneOtp}
                  disabled={loading || phoneOtp.length !== 6}
                  className="flex-1"
                >
                  {loading ? 'Verifying...' : 'Verify'}
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
                    disabled={loading}
                    className="text-sm"
                  >
                    Didn't receive the code? Resend
                  </Button>
                )}
              </div>
            </div>
          )}

          {currentStep === 'email' && needsEmailVerification && (
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
                <p className="font-medium">{profile.email}</p>
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
                    if (needsPhoneVerification) {
                      setStep('phone');
                    } else {
                      navigate('/login');
                    }
                  }}
                  className="flex-1 gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button 
                  type="button"
                  onClick={verifyEmailOtp}
                  disabled={loading || emailOtp.length !== 6}
                  className="flex-1"
                >
                  {loading ? 'Verifying...' : 'Verify'}
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
                    disabled={loading}
                    className="text-sm"
                  >
                    Didn't receive the code? Resend
                  </Button>
                )}
              </div>
            </div>
          )}

          {currentStep === 'complete' && (
            <div className="space-y-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-green-500" />
                </div>
              </div>
              
              <p className="text-muted-foreground">
                Your account has been fully verified!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Verify;
