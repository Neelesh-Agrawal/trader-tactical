import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/landing/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { typography } from '@/design-system';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Disclaimer = () => {
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
          
          <div className="flex items-center justify-center gap-3 mb-8">
            <AlertCircle className="h-8 w-8 text-primary" />
            <h1 className={`${typography.heading.h1} font-display text-center`}>
              Disclaimer
            </h1>
          </div>
          
          <Card>
            <CardContent className="p-6 md:p-8">
              <div className="space-y-6 font-body">
                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-5">
                    <p className={`${typography.body.lg} font-semibold text-foreground text-center leading-relaxed`}>
                      Please read this disclaimer carefully before using our services.
                    </p>
                  </div>

                  <section>
                    <h2 className={`${typography.heading.h3} font-display mb-3`}>1. Educational Purpose Only</h2>
                    <p className={`${typography.body.md} text-muted-foreground leading-relaxed mb-3`}>
                      The content provided on this Website is strictly for educational purposes.
                    </p>
                    <p className={`${typography.body.md} text-muted-foreground leading-relaxed font-semibold mb-2`}>
                      It should NOT be construed as:
                    </p>
                    <ul className={`${typography.body.md} text-muted-foreground leading-relaxed list-disc pl-6 space-y-2`}>
                      <li>Investment advice</li>
                      <li>Trading recommendations</li>
                      <li>Portfolio management services</li>
                      <li>Financial planning services</li>
                      <li>Stock tips or calls</li>
                      <li>Buy or sell recommendations</li>
                    </ul>
                    <p className={`${typography.body.md} text-muted-foreground leading-relaxed mt-3`}>
                      All examples, case studies, and demonstrations are purely for illustrative and educational purposes. 
                      They do not constitute recommendations to buy, sell, or hold any security.
                    </p>
                  </section>

                  <section>
                    <h2 className={`${typography.heading.h3} font-display mb-3`}>2. No SEBI Registration Claim</h2>
                    <div className="bg-muted/50 border border-border rounded-lg p-4">
                      <p className={`${typography.body.md} text-foreground leading-relaxed`}>
                        <strong>Important Notice:</strong> Unless separately registered and specifically disclosed, 
                        the Company does not claim to be a SEBI-registered Investment Adviser through this Website.
                      </p>
                      <p className={`${typography.body.md} text-muted-foreground leading-relaxed mt-3`}>
                        This platform operates solely as an educational service provider. We teach concepts, strategies, 
                        and risk management principles related to options trading. We do not provide personalized investment 
                        advice or portfolio management services.
                      </p>
                    </div>
                  </section>

                  <section>
                    <h2 className={`${typography.heading.h3} font-display mb-3`}>3. No Client Relationship</h2>
                    <p className={`${typography.body.md} text-muted-foreground leading-relaxed mb-2`}>
                      Enrollment in a course does NOT create:
                    </p>
                    <ul className={`${typography.body.md} text-muted-foreground leading-relaxed list-disc pl-6 space-y-2`}>
                      <li>Advisor-client relationship</li>
                      <li>Broker-client relationship</li>
                      <li>Fiduciary relationship</li>
                      <li>Financial planner-client relationship</li>
                      <li>Any duty of care beyond providing educational content</li>
                    </ul>
                    <p className={`${typography.body.md} text-muted-foreground leading-relaxed mt-3`}>
                      You remain solely responsible for your own trading and investment decisions.
                    </p>
                  </section>

                  <section>
                    <h2 className={`${typography.heading.h3} font-display mb-3`}>4. Third-Party Links</h2>
                    <p className={`${typography.body.md} text-muted-foreground leading-relaxed`}>
                      The Website may contain links to third-party websites, resources, or services.
                    </p>
                    <ul className={`${typography.body.md} text-muted-foreground leading-relaxed list-disc pl-6 space-y-2 mt-2`}>
                      <li>We are not responsible for the content, accuracy, or practices of third-party websites</li>
                      <li>We do not endorse any third-party products or services unless explicitly stated</li>
                      <li>You access third-party links at your own risk</li>
                      <li>We are not liable for any loss or damage arising from your use of third-party resources</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className={`${typography.heading.h3} font-display mb-3`}>5. Accuracy of Information</h2>
                    <p className={`${typography.body.md} text-muted-foreground leading-relaxed`}>
                      While we strive to provide accurate and up-to-date information:
                    </p>
                    <ul className={`${typography.body.md} text-muted-foreground leading-relaxed list-disc pl-6 space-y-2 mt-2`}>
                      <li>We do not warrant the completeness or accuracy of any content</li>
                      <li>Information may become outdated due to market changes or regulatory updates</li>
                      <li>We are not liable for errors, omissions, or inaccuracies in the content</li>
                      <li>You should verify all information independently before making trading decisions</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className={`${typography.heading.h3} font-display mb-3`}>6. No Guarantee of Results</h2>
                    <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
                      <p className={`${typography.body.md} text-foreground leading-relaxed font-semibold`}>
                        We make NO guarantees regarding:
                      </p>
                      <ul className={`${typography.body.md} text-muted-foreground leading-relaxed list-disc pl-6 space-y-2 mt-2`}>
                        <li>Your trading profitability or success</li>
                        <li>The effectiveness of any strategy in your specific situation</li>
                        <li>Any particular outcome from applying course concepts</li>
                        <li>Your ability to recover losses or generate income</li>
                      </ul>
                      <p className={`${typography.body.md} text-muted-foreground leading-relaxed mt-3`}>
                        Individual results will vary based on your capital, risk tolerance, market conditions, execution, 
                        and countless other factors beyond our control.
                      </p>
                    </div>
                  </section>

                  <section>
                    <h2 className={`${typography.heading.h3} font-display mb-3`}>7. Consult Qualified Professionals</h2>
                    <p className={`${typography.body.md} text-muted-foreground leading-relaxed`}>
                      Before making any investment or trading decisions, you should consult with:
                    </p>
                    <ul className={`${typography.body.md} text-muted-foreground leading-relaxed list-disc pl-6 space-y-2 mt-2`}>
                      <li>A qualified financial advisor</li>
                      <li>A SEBI-registered investment adviser (if seeking personalized advice)</li>
                      <li>A tax professional regarding tax implications</li>
                      <li>A legal professional for legal concerns</li>
                    </ul>
                  </section>

                  <div className="mt-8 p-5 bg-primary/10 border border-primary/30 rounded-lg">
                    <p className={`${typography.body.md} text-foreground font-semibold leading-relaxed`}>
                      By using this Website, you acknowledge that you have read, understood, and agree to this Disclaimer 
                      in its entirety.
                    </p>
                  </div>

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

export default Disclaimer;
