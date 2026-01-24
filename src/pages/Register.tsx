import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    dateOfBirth: '',
    pin: '',
    confirmPin: ''
  });
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.pin.length !== 4) {
      toast({ title: 'Invalid PIN', description: 'PIN must be 4 digits', variant: 'destructive' });
      return;
    }

    if (formData.pin !== formData.confirmPin) {
      toast({ title: 'PIN Mismatch', description: 'PINs do not match', variant: 'destructive' });
      return;
    }

    setLoading(true);
    
    // Use phone+pin as password
    const password = formData.pin + formData.phoneNumber;
    
    const { error } = await signUp(formData.email, password, {
      name: formData.name,
      phone_number: formData.phoneNumber,
      email: formData.email,
      date_of_birth: formData.dateOfBirth,
      pin: formData.pin
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md tactical-card">
        <CardHeader className="text-center">
          <div className="caption text-primary mb-2">RECRUITMENT</div>
          <CardTitle className="text-2xl">Begin Your Journey</CardTitle>
          <CardDescription>Create your trading profile</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mono text-xs text-muted-foreground mb-2 block">FULL NAME</label>
              <Input
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="mono text-xs text-muted-foreground mb-2 block">PHONE NUMBER</label>
              <Input
                type="tel"
                placeholder="Enter phone number"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="mono text-xs text-muted-foreground mb-2 block">EMAIL</label>
              <Input
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="mono text-xs text-muted-foreground mb-2 block">DATE OF BIRTH</label>
              <Input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mono text-xs text-muted-foreground mb-2 block">CREATE PIN</label>
                <Input
                  type="password"
                  placeholder="••••"
                  maxLength={4}
                  value={formData.pin}
                  onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })}
                  required
                  className="text-center text-xl tracking-widest"
                />
              </div>
              <div>
                <label className="mono text-xs text-muted-foreground mb-2 block">CONFIRM PIN</label>
                <Input
                  type="password"
                  placeholder="••••"
                  maxLength={4}
                  value={formData.confirmPin}
                  onChange={(e) => setFormData({ ...formData, confirmPin: e.target.value.replace(/\D/g, '') })}
                  required
                  className="text-center text-xl tracking-widest"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating Profile...' : 'Enlist Now'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already registered?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
