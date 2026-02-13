import { TrendingUp, Shield, MapPin, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatedSection } from './AnimatedSection';
import { typography } from '@/design-system';

const quickLinks = [
  { label: 'Levels', href: '#levels' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'FAQs', href: '#faqs' },
  { label: 'Contact', href: '#contact' }
];

const legalLinks = [
  { label: 'Disclaimer', href: '/disclaimer' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms & Conditions', href: '/terms' }
];

const trustSignals = [
  { icon: BookOpen, text: 'Education-first, risk-aware approach' },
  { icon: MapPin, text: 'Designed for Indian markets' },
  { icon: Shield, text: 'No tips. No guarantees. Only structured learning.' }
];

export const Footer = () => {
  const handleAnchorClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.getElementById(href.slice(1));
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <AnimatedSection direction="up" delay={100} className="sm:col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <span className={`${typography.heading.h4} font-display font-bold`}>TradeMaster</span>
            </Link>
            <p className={`${typography.body.sm} font-body text-muted-foreground max-w-sm leading-relaxed`}>
              A structured options trading education platform designed to help you think like a trader, 
              not guess like one.
            </p>
          </AnimatedSection>

          {/* Quick Links */}
          <AnimatedSection direction="up" delay={150}>
            <h4 className={`${typography.heading.h6} font-ui font-semibold mb-4 text-foreground`}>Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleAnchorClick(link.href)}
                    className={`${typography.body.sm} font-ui text-muted-foreground hover:text-primary transition-colors text-left`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </AnimatedSection>

          {/* Legal */}
          <AnimatedSection direction="up" delay={200}>
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

        {/* Copyright */}
        <AnimatedSection direction="up" delay={250}>
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border text-center">
            <p className={`${typography.body.sm} font-mono text-muted-foreground`}>
              © {new Date().getFullYear()} TradeMaster — Options Education Platform
            </p>
          </div>
        </AnimatedSection>
      </div>
    </footer>
  );
};
