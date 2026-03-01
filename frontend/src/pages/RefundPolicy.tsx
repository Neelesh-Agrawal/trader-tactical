import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/landing/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { typography } from '@/design-system';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const RefundPolicy = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header showAuth={true} />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <h1 className={`${typography.heading.h1} font-display text-center mb-8`}>
            Refund Policy
          </h1>
          
          <Card>
            <CardContent className="p-6 md:p-8">
              <div className="space-y-6 font-body">
                  <section>
                    <h2 className={`${typography.heading.h3} font-display mb-3`}>1. General Policy</h2>
                    <p className={`${typography.body.md} text-muted-foreground leading-relaxed`}>
                      All course fees are non-refundable, unless otherwise specifically mentioned at the time of enrollment.
                    </p>
                  </section>

                  <section>
                    <h2 className={`${typography.heading.h3} font-display mb-3`}>2. Exceptions</h2>
                    <p className={`${typography.body.md} text-muted-foreground leading-relaxed mb-2`}>
                      Refunds may be considered in the following exceptional circumstances:
                    </p>
                    <ul className={`${typography.body.md} text-muted-foreground leading-relaxed list-disc pl-6 space-y-2`}>
                      <li>48-hour refund window (if less than 10% content consumed)</li>
                      <li>Technical access issue refund (if unresolved by our support team)</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className={`${typography.heading.h3} font-display mb-3`}>3. No Refund Conditions</h2>
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-3">
                      <div className="flex gap-3">
                        <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                        <div>
                          <p className={`${typography.body.md} text-foreground font-semibold mb-2`}>
                            Refunds shall NOT be granted in case of:
                          </p>
                          <ul className={`${typography.body.md} text-muted-foreground leading-relaxed list-disc pl-6 space-y-2`}>
                            <li>Change of mind</li>
                            <li>Lack of time</li>
                            <li>Dissatisfaction due to trading losses</li>
                            <li>Failure to understand concepts</li>
                            <li>Completion of more than 10% of course content</li>
                            <li>After 48 hours from the time of purchase</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h2 className={`${typography.heading.h3} font-display mb-3`}>4. Refund Processing</h2>
                    <p className={`${typography.body.md} text-muted-foreground leading-relaxed mb-2`}>
                      If your refund request is approved:
                    </p>
                    <ul className={`${typography.body.md} text-muted-foreground leading-relaxed list-disc pl-6 space-y-2`}>
                      <li>Refunds will be processed within 7–14 working days</li>
                      <li>The amount will be credited to the original payment method</li>
                      <li>You will receive an email confirmation once the refund is initiated</li>
                      <li>Bank processing times may vary (typically 5-7 business days)</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className={`${typography.heading.h3} font-display mb-3`}>5. How to Request a Refund</h2>
                    <p className={`${typography.body.md} text-muted-foreground leading-relaxed mb-2`}>
                      To request a refund, please:
                    </p>
                    <ol className={`${typography.body.md} text-muted-foreground leading-relaxed list-decimal pl-6 space-y-2`}>
                      <li>Send an email to <a href="mailto:care@easyoptionlearning.com" className="text-primary hover:underline">care@easyoptionlearning.com</a></li>
                      <li>Include your order ID and registered email address</li>
                      <li>Clearly state the reason for your refund request</li>
                      <li>Allow 2-3 business days for our team to review your request</li>
                    </ol>
                  </section>

                  <section>
                    <h2 className={`${typography.heading.h3} font-display mb-3`}>6. Contact for Queries</h2>
                    <p className={`${typography.body.md} text-muted-foreground leading-relaxed`}>
                      For any questions or concerns regarding refunds, please contact us at:
                    </p>
                    <div className="mt-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <p className={`${typography.body.md} text-foreground`}>
                        <strong>Email:</strong>{' '}
                        <a href="mailto:care@easyoptionlearning.com" className="text-primary hover:underline">
                          care@easyoptionlearning.com
                        </a>
                      </p>
                    </div>
                  </section>

                  <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      variant="outline"
                      onClick={() => navigate(-1)}
                      className="gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Go Back
                    </Button>
                    <Button
                      onClick={() => navigate(user ? '/dashboard' : '/')}
                      className="gap-2"
                    >
                      <Home className="h-4 w-4" />
                      {user ? 'Back to Dashboard' : 'Back to Home'}
                    </Button>
                  </div>

                  <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                    <p className={`${typography.body.sm} text-muted-foreground text-center italic`}>
                      Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RefundPolicy;
