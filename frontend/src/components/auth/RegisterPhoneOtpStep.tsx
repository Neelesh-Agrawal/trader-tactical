import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, MessageSquare } from 'lucide-react';

interface RegisterPhoneOtpStepProps {
  countryCode: string;
  phoneNumber: string;
  phoneOtp: string;
  setPhoneOtp: (val: string) => void;
  phoneOtpError: string;
  setPhoneOtpError: (val: string) => void;
  phoneOtpLoading: boolean;
  phoneResendTimer: number;
  onBack: () => void;
  onVerify: () => void;
  onResend: () => void;
}

export const RegisterPhoneOtpStep: React.FC<RegisterPhoneOtpStepProps> = ({
  countryCode,
  phoneNumber,
  phoneOtp,
  setPhoneOtp,
  phoneOtpError,
  setPhoneOtpError,
  phoneOtpLoading,
  phoneResendTimer,
  onBack,
  onVerify,
  onResend,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-center mb-3">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <MessageSquare className="h-8 w-8 text-primary" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          We've sent a verification code to
        </p>
        <p className="font-medium">
          {countryCode} {phoneNumber}
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
          onClick={onBack}
          className="flex-1 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          type="button"
          onClick={onVerify}
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
            onClick={onResend}
            disabled={phoneOtpLoading}
            className="text-sm"
          >
            Didn't receive the code? Resend
          </Button>
        )}
      </div>
    </div>
  );
};
