import { Mail, Linkedin } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

export const ContactSection = () => {
  return (
    <section id="contact" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <AnimatedSection direction="up" delay={0}>
          <div className="max-w-xl mx-auto text-center">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Contact <span className="text-primary">Us</span>
            </h2>
            <p className="font-body text-lg text-muted-foreground mb-8">
              Have questions? We're happy to help.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:support@trademaster.com"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <Mail className="h-5 w-5 text-primary" />
                <span className="font-ui font-medium text-foreground">support@trademaster.com</span>
              </a>
              <a 
                href="https://linkedin.com/company/trademaster"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <Linkedin className="h-5 w-5 text-primary" />
                <span className="font-ui font-medium text-foreground">LinkedIn</span>
              </a>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
