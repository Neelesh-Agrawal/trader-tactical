import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/landing/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { typography } from '@/design-system';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const RiskDisclosure = () => {
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
            <AlertTriangle className="h-8 w-8 text-warning" />
            <h1 className={`${typography.heading.h1} font-display text-center`}>
              Risk Disclosure
            </h1>
          </div>
          
          <Card className="border-warning/50">
            <CardContent className="p-6 md:p-8">
              <div className="space-y-6 font-body">
                  <div className="bg-warning/10 border border-warning/30 rounded-lg p-5">
                    <p className={`${typography.body.lg} font-semibold text-foreground text-center leading-relaxed`}>
                      Options trading involves substantial risk and is not suitable for all investors. Please read this disclosure carefully.
                    </p>
                  </div>

                  <section>
                    <h2 className={`${typography.heading.h3} font-display mb-3`}>1. Market Risk</h2>
                    <p className={`${typography.body.md} text-muted-foreground leading-relaxed`}>
                      Options trading involves substantial risk and may not be suitable for all investors.
                    </p>
                    <p className={`${typography.body.md} text-muted-foreground leading-relaxed mt-2 font-semibold text-destructive`}>
                      You may lose part or all of your capital.
                    </p>
                    <p className={`${typography.body.md} text-muted-foreground leading-relaxed mt-3`}>
                      The Indian stock market, including options trading, is subject to market volatility, economic conditions, 
                      regulatory changes, and other factors beyond our control or prediction. Historical performance is not 
                      indicative of future results.
                    </p>
                  </section>

                  <section>
                    <h2 className={`${typography.heading.h3} font-display mb-3`}>2. No Guarantee of Profits</h2>
                    <ul className={`${typography.body.md} text-muted-foreground leading-relaxed list-disc pl-6 space-y-2`}>
                      <li>Past performance does not guarantee future results.</li>
                      <li>Examples shown in the course are for educational purposes only.</li>
                      <li>The Company does not guarantee any returns or profits.</li>
                      <li>Success stories shared are individual experiences and not typical results.</li>
                      <li>Market conditions change constantly and strategies that worked in the past may not work in the future.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className={`${typography.heading.h3} font-display mb-3`}>3. Leverage Risk</h2>
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                      <p className={`${typography.body.md} text-foreground leading-relaxed font-semibold mb-2`}>
                        Important: Options trading involves leverage
                      </p>
                      <p className={`${typography.body.md} text-muted-foreground leading-relaxed`}>
                        Leverage can magnify both gains and losses. A small movement in the underlying asset can result in 
                        significant profits or losses. You should only trade with capital you can afford to lose.
                      </p>
                    </div>
                  </section>

                  <section>
                    <h2 className={`${typography.heading.h3} font-display mb-3`}>4. Decision Responsibility</h2>
                    <p className={`${typography.body.md} text-muted-foreground leading-relaxed font-semibold`}>
                      All trading decisions are made solely at your own discretion and risk.
                    </p>
                    <p className={`${typography.body.md} text-muted-foreground leading-relaxed mt-3`}>
                      You are solely responsible for:
                    </p>
                    <ul className={`${typography.body.md} text-muted-foreground leading-relaxed list-disc pl-6 space-y-2 mt-2`}>
                      <li>Conducting your own research and due diligence</li>
                      <li>Understanding the risks before entering any trade</li>
                      <li>Managing your own capital and risk exposure</li>
                      <li>Complying with all applicable laws and regulations</li>
                      <li>Consulting with qualified financial advisors if needed</li>
                      <li>Any losses incurred from your trading activities</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className={`${typography.heading.h3} font-display mb-3`}>5. Suitability</h2>
                    <p className={`${typography.body.md} text-muted-foreground leading-relaxed mb-2`}>
                      Options trading may not be suitable for you if:
                    </p>
                    <ul className={`${typography.body.md} text-muted-foreground leading-relaxed list-disc pl-6 space-y-2`}>
                      <li>You have limited financial resources</li>
                      <li>You cannot afford to lose your investment capital</li>
                      <li>You have limited knowledge of financial markets</li>
                      <li>You have a low risk tolerance</li>
                      <li>You are investing money needed for essential expenses</li>
                    </ul>
                    <p className={`${typography.body.md} text-muted-foreground leading-relaxed mt-3`}>
                      Please consult with a qualified financial advisor to determine if options trading is appropriate for your 
                      individual circumstances.
                    </p>
                  </section>

                  <section>
                    <h2 className={`${typography.heading.h3} font-display mb-3`}>6. Educational Purpose</h2>
                    <p className={`${typography.body.md} text-muted-foreground leading-relaxed`}>
                      This platform provides educational content only. We do not:
                    </p>
                    <ul className={`${typography.body.md} text-muted-foreground leading-relaxed list-disc pl-6 space-y-2 mt-2`}>
                      <li>Provide investment advice or recommendations</li>
                      <li>Guarantee results from applying course concepts</li>
                      <li>Manage your portfolio or make trading decisions for you</li>
                      <li>Act as your broker or financial advisor</li>
                    </ul>
                  </section>

                  <div className="mt-8 p-5 bg-warning/10 border border-warning/30 rounded-lg">
                    <p className={`${typography.body.md} text-foreground font-semibold text-center leading-relaxed`}>
                      By enrolling in our courses, you acknowledge that you have read, understood, and accepted all risks associated 
                      with options trading.
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

export default RiskDisclosure;
