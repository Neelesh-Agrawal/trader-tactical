import { TrendingUp, Shield, MapPin, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

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
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {trustSignals.map((signal) => (
              <div key={signal.text} className="flex items-center gap-2 text-sm text-muted-foreground">
                <signal.icon className="h-4 w-4 text-primary" />
                <span>{signal.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <span className="font-display text-xl font-bold">TradeMaster</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              A structured options trading education platform designed to help you think like a trader, 
              not guess like one.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-ui font-semibold mb-4 text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleAnchorClick(link.href)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-ui font-semibold mb-4 text-foreground">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="mono text-sm text-muted-foreground">
            © {new Date().getFullYear()} TradeMaster — Options Education Platform
          </p>
        </div>
      </div>
    </footer>
  );
};
