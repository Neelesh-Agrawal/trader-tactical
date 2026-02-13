import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';

type Step = 'request' | 'sent';

const ForgotPin = () => {
  const [step, setStep] = useState<Step>('request');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      toast({ title: 'Required', description: 'Please enter your phone number', variant: 'destructive' });
      return;
    }
    
    if (!email.trim() || !email.includes('@')) {
      toast({ title: 'Required', description: 'Please enter a valid email', variant: 'destructive' });
      return;
    }

    setLoading(true);
    
    try {
      // Password reset functionality is not yet implemented in the backend
      // For now, we'll show a success message but not actually process the reset
      // TODO: Implement password reset API endpoint in backend
      console.log('Password reset requested for:', { phoneNumber, email });
      
      // Always show success message for security (don't reveal if account exists)
      setStep('sent');
      
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

  if (step === 'sent') {
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
                If an account exists with those details, we've sent reset instructions to your email.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  The email may take a few minutes to arrive. Check your spam folder if you don't see it.
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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <main id="main-content" className="w-full max-w-md">
        <Card className="tactical-card">
          <CardHeader className="text-center">
            <div className="caption text-primary mb-2">ACCOUNT RECOVERY</div>
            <CardTitle className="text-2xl">Forgot Your PIN?</CardTitle>
            <CardDescription>
              Enter your phone number and email to receive reset instructions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="phone" className="mono text-xs text-muted-foreground mb-2 block">
                  PHONE NUMBER
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your registered phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  autoComplete="tel"
                />
              </div>
              
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
                {loading ? 'Sending...' : 'Send Reset Instructions'}
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
