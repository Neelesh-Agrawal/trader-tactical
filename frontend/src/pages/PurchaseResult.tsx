import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Clock3 } from 'lucide-react';

const PurchaseResult = () => {
  const [searchParams] = useSearchParams();
  const status = (searchParams.get('status') || 'failed').toLowerCase();
  const message = searchParams.get('message') || 'We could not complete your purchase.';

  const isSuccess = status === 'success';
  const isPending = status === 'pending';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-8 shadow-lg text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          {isSuccess ? (
            <CheckCircle className="h-8 w-8 text-success" />
          ) : isPending ? (
            <Clock3 className="h-8 w-8 text-warning" />
          ) : (
            <AlertTriangle className="h-8 w-8 text-destructive" />
          )}
        </div>

        <h1 className="text-2xl font-semibold text-foreground">
          {isSuccess ? 'Purchase complete' : isPending ? 'Payment pending' : 'Purchase failed'}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">{message}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to={isSuccess ? '/dashboard' : '/pricing'}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-success px-6 text-sm font-semibold text-white"
          >
            {isSuccess ? 'Go to Dashboard' : 'Back to Pricing'}
          </Link>
          <Link
            to="/"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border px-6 text-sm font-semibold text-foreground"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PurchaseResult;
