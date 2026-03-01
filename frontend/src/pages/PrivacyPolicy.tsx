import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/landing/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { typography } from '@/design-system';
import { ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const PrivacyPolicy = () => {
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
            Privacy Policy
          </h1>
          
          <Card>
            <CardContent className="p-6 md:p-8">
              <div className="space-y-6 font-body">
                  <section>
                    <h2 className={`${typography.heading.h3} font-display mb-3`}>1. Introduction</h2>
                    <p className={`${typography.body.md} text-muted-foreground leading-relaxed`}>
                      Anata Securities Private Limited respects your privacy and is committed to protecting your personal data.
                    </p>
                  </section>

                  <section>
                    <h2 className={`${typography.heading.h3} font-display mb-3`}>2. Information Collected</h2>
                    <p className={`${typography.body.md} text-muted-foreground leading-relaxed mb-2`}>
                      We may collect:
                    </p>
                    <ul className={`${typography.body.md} text-muted-foreground leading-relaxed list-disc pl-6 space-y-2`}>
                      <li>Name</li>
                      <li>Email address</li>
                      <li>Phone number</li>
                      <li>Payment information (processed via third-party gateways)</li>
                      <li>IP address</li>
                      <li>Device/browser information</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className={`${typography.heading.h3} font-display mb-3`}>3. Purpose of Data Collection</h2>
                    <p className={`${typography.body.md} text-muted-foreground leading-relaxed mb-2`}>
                      Your information is used to:
                    </p>
                    <ul className={`${typography.body.md} text-muted-foreground leading-relaxed list-disc pl-6 space-y-2`}>
                      <li>Provide course access</li>
                      <li>Process payments</li>
                      <li>Send educational updates</li>
                      <li>Improve services</li>
                      <li>Respond to grievances</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className={`${typography.heading.h3} font-display mb-3`}>4. Data Protection</h2>
                    <ul className={`${typography.body.md} text-muted-foreground leading-relaxed list-disc pl-6 space-y-2`}>
                      <li>We implement reasonable technical and administrative safeguards.</li>
                      <li>Payment details are processed securely through third-party gateways.</li>
                      <li>We do not sell or rent personal data.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className={`${typography.heading.h3} font-display mb-3`}>5. Cookies</h2>
                    <p className={`${typography.body.md} text-muted-foreground leading-relaxed`}>
                      The Website may use cookies to enhance user experience and analyze traffic.
                    </p>
                    <p className={`${typography.body.md} text-muted-foreground leading-relaxed mt-2`}>
                      Users can disable cookies via browser settings.
                    </p>
                  </section>

                  <section>
                    <h2 className={`${typography.heading.h3} font-display mb-3`}>6. Data Sharing</h2>
                    <p className={`${typography.body.md} text-muted-foreground leading-relaxed mb-2`}>
                      We may share data with:
                    </p>
                    <ul className={`${typography.body.md} text-muted-foreground leading-relaxed list-disc pl-6 space-y-2`}>
                      <li>Payment processors</li>
                      <li>Hosting providers</li>
                      <li>Legal authorities (if required by law)</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className={`${typography.heading.h3} font-display mb-3`}>7. User Rights</h2>
                    <p className={`${typography.body.md} text-muted-foreground leading-relaxed mb-2`}>
                      Users may request:
                    </p>
                    <ul className={`${typography.body.md} text-muted-foreground leading-relaxed list-disc pl-6 space-y-2`}>
                      <li>Access to personal data</li>
                      <li>Correction of inaccurate data</li>
                      <li>Deletion of data (subject to legal obligations)</li>
                    </ul>
                    <p className={`${typography.body.md} text-muted-foreground leading-relaxed mt-4`}>
                      Requests may be sent to:{' '}
                      <a href="mailto:care@easyoptionlearning.com" className="text-primary hover:underline">
                        care@easyoptionlearning.com
                      </a>
                    </p>
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

export default PrivacyPolicy;
