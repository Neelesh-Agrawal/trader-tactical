import { Mail, Linkedin } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';
import { typography } from '@/design-system';

export const ContactSection = () => {
  return (
    <section id="contact" className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <AnimatedSection direction="up" delay={0}>
          <div className="max-w-xl mx-auto text-center">
            <h2 className={`${typography.heading.h1} font-display font-bold mb-4 text-foreground`}>
              Contact <span className="text-success">Us</span>
            </h2>
            <p className={`${typography.body.lg} font-body text-muted-foreground mb-8`}>
              Have questions? We're happy to help.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:care@easyoptionlearning.com"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-card border border-border hover:border-success/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
              >
                <Mail className="h-5 w-5 text-success" />
                <span className={`${typography.body.md} font-ui font-medium text-foreground`}>care@easyoptionlearning.com</span>
              </a>
              <a 
                href="https://linkedin.com/company/easyoptionlearning"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-card border border-border hover:border-success/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
              >
                <Linkedin className="h-5 w-5 text-success" />
                <span className={`${typography.body.md} font-ui font-medium text-foreground`}>LinkedIn</span>
              </a>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
