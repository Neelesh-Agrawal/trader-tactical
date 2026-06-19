import { AnimatedSection } from './AnimatedSection';
import { typography } from '@/design-system';
import { Download, BookOpen, CheckCircle, ExternalLink } from 'lucide-react';
import { SAMPLE_PDF_PATH, openSamplePdf } from '@/lib/pdf';
import { nismConfig } from '@/config/courseConfig';

export const NISMSection = () => {
  if (!nismConfig.enabled) {
    return null;
  }

  // Handle title highlighting dynamically
  const titleParts = nismConfig.title.split('—');
  const mainTitle = titleParts[0];
  const subTitle = titleParts[1] || '';

  return (
    <section id="nism" className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <AnimatedSection direction="up" delay={0}>
          {/* Label — distinguishes from the 3 learning levels */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px flex-1 max-w-16 bg-border" />
            <span className={`${typography.ui.sm} font-ui font-medium text-muted-foreground uppercase tracking-widest`}>
              Certification Resource
            </span>
            <div className="h-px flex-1 max-w-16 bg-border" />
          </div>
        </AnimatedSection>

        <AnimatedSection direction="up" delay={100}>
          <div className="relative max-w-4xl mx-auto overflow-hidden rounded-2xl border border-success/25 bg-card shadow-xl shadow-success/5">
            <style>{`
              @keyframes nism-orb1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(16px,-12px)} }
              @keyframes nism-orb2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-12px,10px)} }
              @keyframes nism-shine {
                0% { transform: translateX(-100%) skewX(-15deg); }
                100% { transform: translateX(300%) skewX(-15deg); }
              }
              .nism-orb1 { animation: nism-orb1 8s ease-in-out infinite; }
              .nism-orb2 { animation: nism-orb2 10s ease-in-out infinite; }
              .nism-btn-primary {
                transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease;
              }
              .nism-btn-primary:hover {
                transform: translateY(-2px) scale(1.03);
                box-shadow: 0 8px 24px -4px hsla(160,72%,33%,0.4);
              }
              .nism-btn-primary:active { transform: scale(0.97); }
              .nism-btn-secondary {
                transition: transform 0.2s ease, background 0.2s ease;
              }
              .nism-btn-secondary:hover { transform: translateY(-1px); }
            `}</style>

            {/* Background orbs */}
            <div className="nism-orb1 absolute -top-12 -right-12 w-48 h-48 rounded-full bg-success/8 blur-3xl pointer-events-none" />
            <div className="nism-orb2 absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-success/6 blur-3xl pointer-events-none" />

            {/* Shine sweep on the top border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-success/60 to-transparent" />

            <div className="relative z-10 p-6 sm:p-8 md:p-10">
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

                {/* Left — content */}
                <div className="flex-1 min-w-0">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 border border-success/20 text-success text-xs font-semibold mb-4">
                    <BookOpen className="w-3 h-3" />
                    {nismConfig.badge}
                  </div>

                  <h2 className={`${typography.heading.h2} font-display font-bold text-foreground mb-3 leading-tight`}>
                    {mainTitle}
                    {subTitle && (
                      <>
                        —{' '}
                        <span className="text-success">{subTitle}</span>
                      </>
                    )}
                  </h2>

                  <p className={`${typography.body.lg} font-body text-muted-foreground mb-6 leading-relaxed`}>
                    {nismConfig.description}
                  </p>

                  {/* Benefits */}
                  <ul className="space-y-2.5 mb-7">
                    {nismConfig.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-success shrink-0" />
                        <span className={`${typography.body.sm} font-body text-muted-foreground leading-snug`}>{b}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={nismConfig.purchaseUrl}
                      className="nism-btn-primary inline-flex items-center justify-center gap-2 px-6 h-11 rounded-xl bg-success text-white text-sm font-semibold shadow-md"
                    >
                      {nismConfig.primaryCTA} — ₹{nismConfig.price}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <a
                      href={SAMPLE_PDF_PATH}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={openSamplePdf}
                      className="nism-btn-secondary inline-flex items-center justify-center gap-2 px-6 h-11 rounded-xl border border-success/30 text-success bg-success/5 hover:bg-success/10 text-sm font-semibold"
                    >
                      <Download className="w-4 h-4" />
                      {nismConfig.secondaryCTA}
                    </a>
                  </div>
                </div>

                {/* Right — visual accent card */}
                <div className="w-full lg:w-64 shrink-0">
                  <div className="rounded-xl border border-success/20 bg-success/5 p-5">
                    <div className="w-10 h-10 rounded-xl bg-success/15 flex items-center justify-center mb-4">
                      <BookOpen className="w-5 h-5 text-success" />
                    </div>
                    <p className="text-xs font-bold text-success uppercase tracking-widest mb-1">What's Inside</p>
                    <p className={`${typography.heading.h3} font-display font-bold text-foreground mb-3`}>
                      {nismConfig.accentTitle}
                    </p>
                    <div className="space-y-2">
                      {nismConfig.accentItems.map((ch) => (
                        <div key={ch} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-success/60 shrink-0" />
                          <span className="text-xs text-muted-foreground">{ch}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-success/10">
                      <p className="text-xs text-muted-foreground">One-time access</p>
                      <p className="text-2xl font-bold font-mono text-foreground mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        ₹{nismConfig.price}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
