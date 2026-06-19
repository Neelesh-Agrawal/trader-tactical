import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Mail } from 'lucide-react';

interface RegisterEmailOtpStepProps {
  email: string;
  emailOtp: string;
  setEmailOtp: (val: string) => void;
  emailOtpError: string;
  setEmailOtpError: (val: string) => void;
  emailOtpLoading: boolean;
  emailResendTimer: number;
  onBack: () => void;
  onVerify: () => void;
  onResend: () => void;
}

export const RegisterEmailOtpStep: React.FC<RegisterEmailOtpStepProps> = ({
  email,
  emailOtp,
  setEmailOtp,
  emailOtpError,
  setEmailOtpError,
  emailOtpLoading,
  emailResendTimer,
  onBack,
  onVerify,
  onResend,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-center mb-3">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Mail className="h-8 w-8 text-primary" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          We've sent a verification code to
        </p>
        <p className="font-medium">
          {email}
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
          onClick={onBack}
          className="flex-1 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          type="button"
          onClick={onVerify}
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
            onClick={onResend}
            disabled={emailOtpLoading}
            className="text-sm"
          >
            Didn't receive the code? Resend
          </Button>
        )}
      </div>
    </div>
  );
};
