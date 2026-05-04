import { Shield, MapPin, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatedSection } from './AnimatedSection';
import { typography } from '@/design-system';

const legalLinks = [
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Refund Policy', href: '/refund' },
  { label: 'Risk Disclosure', href: '/risk' },
  { label: 'Disclaimer', href: '/disclaimer' }
];

const trustSignals = [
  { icon: BookOpen, text: 'Education-first, risk-aware approach' },
  { icon: MapPin, text: 'Designed for Indian markets' },
  { icon: Shield, text: 'No tips. No guarantees. Only structured learning.' }
];

export const Footer = () => {
  const logoSrc = `${import.meta.env.BASE_URL}logo.png`;

  return (
    <footer className="border-t border-border bg-card" role="contentinfo">
      {/* Trust Signals */}
      <AnimatedSection direction="up" delay={0}>
        <div className="border-b border-border">
          <div className="container mx-auto px-4 py-5 sm:py-6">
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
              {trustSignals.map((signal) => (
                <div key={signal.text} className={`flex items-center gap-2 ${typography.body.sm} font-body text-muted-foreground`}>
                  <signal.icon className="h-4 w-4 text-primary shrink-0" />
                  <span>{signal.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-8 sm:py-10 md:py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Brand */}
          <AnimatedSection direction="up" delay={100} className="sm:col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img 
                src={logoSrc}
                alt="Easy Option Learning" 
                className="h-10 w-10 object-contain shrink-0 rounded-md"
              />
              <span className={`${typography.heading.h4} font-display font-bold`}>Easy Option Learning</span>
            </Link>
            <p className={`${typography.body.sm} font-body text-muted-foreground max-w-sm leading-relaxed`}>
              A structured options trading education platform designed to help you think like a trader, 
              not guess like one.
            </p>
          </AnimatedSection>

          {/* Legal */}
          <AnimatedSection direction="up" delay={150}>
            <h4 className={`${typography.heading.h6} font-ui font-semibold mb-4 text-foreground`}>Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className={`${typography.body.sm} font-ui text-muted-foreground hover:text-primary transition-colors`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </AnimatedSection>
        </div>

        {/* Company Info & Copyright */}
        <AnimatedSection direction="up" delay={250}>
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border text-center space-y-4">
            <div className={`${typography.body.xs} font-body text-muted-foreground space-y-1 max-w-2xl mx-auto`}>
              <p className="font-semibold text-foreground">Operated By: Ananta Securities Private Limited</p>
              <p>
                CIN:{' '}
                <span className="font-mono tabular-nums tracking-wide text-foreground/90">
                  U66120KL2024PTC086709
                </span>
              </p>
              <p>Registered Address: Door No. 1001 B, 2502 B, KunjanBava Road, Vytilla, Ernakulam, Kerala – 682019</p>
              <p>
                Contact Us:{' '}
                <a href="mailto:care@easyoptionlearning.com" className="text-primary hover:underline">
                  care@easyoptionlearning.com
                </a>
              </p>
            </div>
            <p className={`${typography.body.sm} font-mono text-muted-foreground`}>
              © {new Date().getFullYear()} Easy Option Learning — Options Education Platform
            </p>
          </div>
        </AnimatedSection>
      </div>
    </footer>
  );
};
