import React from 'react';
import { Button } from '@/components/ui/button';
import { PinInput } from '@/components/ui/pin-input';
import { ArrowLeft, Shield } from 'lucide-react';

interface RegisterPinStepProps {
  pin: string;
  handlePinChange: (value: string) => void;
  confirmPin: string;
  handleConfirmPinChange: (value: string) => void;
  pinError: string;
  loading: boolean;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const RegisterPinStep: React.FC<RegisterPinStepProps> = ({
  pin,
  handlePinChange,
  confirmPin,
  handleConfirmPinChange,
  pinError,
  loading,
  onBack,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="flex justify-center mb-3">
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
          onClick={onBack}
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
  );
};
