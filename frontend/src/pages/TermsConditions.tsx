import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/landing/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { typography } from '@/design-system';
import { ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const TermsConditions = () => {
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
            Terms & Conditions
          </h1>
          
          <Card>
            <CardContent className="p-6 md:p-8">
              <div className="space-y-6 font-body">
                  <section>
                    <h2 className={`${typography.heading.h3} font-display mb-3`}>1. Introduction</h2>
                    <p className={`${typography.body.md} text-muted-foreground leading-relaxed`}>
                      These Terms and Conditions ("Terms") govern the use of the website www.easyoptionlearning.com ("Website"), 
                      owned and operated by Ananta Securities Private Limited ("Company", "We", "Us", "Our").
                    </p>
                    <p className={`${typography.body.md} text-muted-foreground leading-relaxed mt-2`}>
                      By accessing or enrolling in any course offered on this Website, you agree to be legally bound by these Terms.
                    </p>
                  </section>

                  <section>
                    <h2 className={`${typography.heading.h3} font-display mb-3`}>2. Nature of Services</h2>
                    <ul className={`${typography.body.md} text-muted-foreground leading-relaxed list-disc pl-6 space-y-2`}>
                      <li>The Website provides educational content related to options trading and financial markets.</li>
                      <li>The content includes video lectures, written materials, webinars, downloadable resources, and community interaction.</li>
                      <li>The services are strictly educational in nature.</li>
                      <li>The Company does not provide investment advisory services, stock tips, or portfolio management services through this Website.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className={`${typography.heading.h3} font-display mb-3`}>3. Eligibility</h2>
                    <ul className={`${typography.body.md} text-muted-foreground leading-relaxed list-disc pl-6 space-y-2`}>
                      <li>Users must be at least 18 years of age.</li>
                      <li>By enrolling, you confirm you are legally competent to enter into a binding contract.</li>
                      <li>You are responsible for ensuring compliance with local laws applicable to you.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className={`${typography.heading.h3} font-display mb-3`}>4. User Account & Responsibilities</h2>
                    <ul className={`${typography.body.md} text-muted-foreground leading-relaxed list-disc pl-6 space-y-2`}>
                      <li>You must provide accurate and complete information during registration.</li>
                      <li>Login credentials are confidential and non-transferable.</li>
                      <li>Sharing course access with others is strictly prohibited.</li>
                      <li>The Company reserves the right to suspend or terminate accounts for misuse.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className={`${typography.heading.h3} font-display mb-3`}>5. Intellectual Property Rights</h2>
                    <ul className={`${typography.body.md} text-muted-foreground leading-relaxed list-disc pl-6 space-y-2`}>
                      <li>All content (videos, graphics, PDFs, logos, trademarks) is the exclusive property of Ananta Securities Private Limited.</li>
                      <li>No content may be copied, reproduced, redistributed, recorded, or resold without written permission.</li>
                      <li>Unauthorized distribution may lead to legal action under applicable laws.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className={`${typography.heading.h3} font-display mb-3`}>6. Payment Terms</h2>
                    <ul className={`${typography.body.md} text-muted-foreground leading-relaxed list-disc pl-6 space-y-2`}>
                      <li>All course fees must be paid in full before access is granted.</li>
                      <li>Prices are subject to change without prior notice.</li>
                      <li>Payments once processed are governed by our Refund Policy.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className={`${typography.heading.h3} font-display mb-3`}>7. Limitation of Liability</h2>
                    <p className={`${typography.body.md} text-muted-foreground leading-relaxed mb-2`}>
                      The Company shall not be liable for:
                    </p>
                    <ul className={`${typography.body.md} text-muted-foreground leading-relaxed list-disc pl-6 space-y-2`}>
                      <li>Any trading losses</li>
                      <li>Indirect or consequential damages</li>
                      <li>Loss of profits arising from reliance on course material</li>
                    </ul>
                    <p className={`${typography.body.md} text-muted-foreground leading-relaxed mt-2 font-semibold`}>
                      Users are solely responsible for their trading decisions.
                    </p>
                  </section>

                  <section>
                    <h2 className={`${typography.heading.h3} font-display mb-3`}>8. Termination</h2>
                    <p className={`${typography.body.md} text-muted-foreground leading-relaxed mb-2`}>
                      The Company reserves the right to:
                    </p>
                    <ul className={`${typography.body.md} text-muted-foreground leading-relaxed list-disc pl-6 space-y-2`}>
                      <li>Terminate access for violation of Terms</li>
                      <li>Modify course structure or content</li>
                      <li>Discontinue services without prior notice</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className={`${typography.heading.h3} font-display mb-3`}>9. Governing Law & Jurisdiction</h2>
                    <p className={`${typography.body.md} text-muted-foreground leading-relaxed`}>
                      These Terms shall be governed by the laws of India.
                    </p>
                    <p className={`${typography.body.md} text-muted-foreground leading-relaxed mt-2`}>
                      Any disputes shall be subject to the jurisdiction of courts in Ernakulam, Kerala.
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

export default TermsConditions;
