import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { apiFetch } from '@/lib/api';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';

type Step = 'request' | 'verify' | 'done';

const ForgotPin = () => {
  const RESEND_COOLDOWN_SECONDS = 30;
  const [step, setStep] = useState<Step>('request');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendingOtp, setResendingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = window.setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  const requestOtp = async ({ verifyStep }: { verifyStep: boolean }) => {
    await apiFetch('/api/auth/password-reset/request-otp/', {
      method: 'POST',
      auth: false,
      body: JSON.stringify({ email }),
    });

    setResendCooldown(RESEND_COOLDOWN_SECONDS);

    if (verifyStep) {
      setStep('verify');
      toast({ title: 'OTP Sent', description: 'Check your email for the reset OTP code.' });
      return;
    }

    toast({ title: 'OTP Resent', description: 'A new OTP has been sent to your email.' });
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !email.includes('@')) {
      toast({ title: 'Required', description: 'Please enter a valid email', variant: 'destructive' });
      return;
    }

    setLoading(true);

    try {
      await requestOtp({ verifyStep: true });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || resendingOtp) {
      return;
    }

    setResendingOtp(true);
    try {
      await requestOtp({ verifyStep: false });
    } catch (error: any) {
      toast({
        title: 'Resend Failed',
        description: error.message || 'Could not resend OTP',
        variant: 'destructive',
      });
    } finally {
      setResendingOtp(false);
    }
  };

  const handleResetPin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp.trim() || otp.length !== 6) {
      toast({ title: 'Invalid OTP', description: 'OTP must be 6 digits', variant: 'destructive' });
      return;
    }

    if (!newPin || !newPin.match(/^\d{4}$/)) {
      toast({ title: 'Invalid PIN', description: 'PIN must be exactly 4 digits', variant: 'destructive' });
      return;
    }

    if (newPin !== confirmPin) {
      toast({ title: 'PIN Mismatch', description: 'PIN confirmation does not match', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      await apiFetch('/api/auth/password-reset/confirm/', {
        method: 'POST',
        auth: false,
        body: JSON.stringify({
          email,
          otp,
          new_pin: newPin,
          confirm_pin: confirmPin,
        }),
      });
      setStep('done');
    } catch (error: any) {
      toast({
        title: 'Reset Failed',
        description: error.message || 'Could not reset PIN',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (step === 'done') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <main id="main-content" className="w-full max-w-md">
          <Card className="tactical-card">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">Check Your Email</CardTitle>
              <CardDescription>
                Your PIN has been reset successfully.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  You can now log in with your new 4-digit PIN.
                </AlertDescription>
              </Alert>
              
              <Link to="/login" className="block">
                <Button variant="outline" className="w-full gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (step === 'verify') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <main id="main-content" className="w-full max-w-md">
          <Card className="tactical-card">
            <CardHeader className="text-center">
              <div className="caption text-primary mb-2">VERIFY OTP</div>
              <CardTitle className="text-2xl">Reset Your PIN</CardTitle>
              <CardDescription>
                Enter the 6-digit OTP sent to {email} and set a new 4-digit PIN.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleResetPin} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="otp" className="mono text-xs text-muted-foreground mb-2 block">
                    EMAIL OTP
                  </label>
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">Didn't receive the code?</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleResendOtp}
                      disabled={resendingOtp || resendCooldown > 0}
                    >
                      {resendingOtp
                        ? 'Sending...'
                        : resendCooldown > 0
                          ? `Resend in ${resendCooldown}s`
                          : 'Resend OTP'}
                    </Button>
                  </div>
                </div>

                <div>
                  <label htmlFor="new-pin" className="mono text-xs text-muted-foreground mb-2 block">
                    NEW PIN
                  </label>
                  <Input
                    id="new-pin"
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="Enter 4-digit PIN"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="confirm-pin" className="mono text-xs text-muted-foreground mb-2 block">
                    CONFIRM PIN
                  </label>
                  <Input
                    id="confirm-pin"
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="Re-enter 4-digit PIN"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Resetting...' : 'Reset PIN'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setStep('request')}
                  disabled={loading}
                >
                  Back
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <main id="main-content" className="w-full max-w-md">
        <Card className="tactical-card">
            <CardHeader className="text-center">
              <div className="caption text-primary mb-2">ACCOUNT RECOVERY</div>
              <CardTitle className="text-2xl">Forgot Your PIN?</CardTitle>
              <CardDescription>
                Enter your email to receive an OTP for PIN reset
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRequestOtp} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="email" className="mono text-xs text-muted-foreground mb-2 block">
                    EMAIL ADDRESS
                  </label>
                  <Input
                  id="email"
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Remember your PIN?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign In
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ForgotPin;
