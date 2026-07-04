import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check, ChevronDown, BookOpen, Download, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SAMPLE_PDF_PATH, openSamplePdf } from '@/lib/pdf';
import { courseConfigList, courseConfig, nismConfig, pricingFaqConfig } from '@/config/courseConfig';
import { CourseLevelCard } from '@/components/course/CourseLevelCard';
import { useAuth } from '@/contexts/AuthContext';
import { startHostedCheckout } from '@/hooks/useCheckout';
import { isAuthRequired } from '@/config/appConfig';
import { useCourses } from '@/hooks/useCourses';
import { findCourseIdForConfig } from '@/lib/courseCatalog';

const plans = courseConfigList;

const faqs = pricingFaqConfig;

const FAQItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn('border border-border rounded-xl overflow-hidden transition-all duration-200 hover:border-success/30', open ? 'bg-card shadow-sm' : 'bg-card/50')}>
      <button className="w-full flex items-center justify-between px-5 py-4 text-left gap-4" onClick={() => setOpen(!open)}>
        <span className="font-semibold text-sm text-foreground">{q}</span>
        <ChevronDown className={cn('h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3">{a}</div>
      )}
    </div>
  );
};

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { courses } = useCourses();
  const logoSrc = `${import.meta.env.BASE_URL}logo.png`;

  const handleCourseCheckout = async (levelId: keyof typeof courseConfig) => {
    if (isAuthRequired() && !user) {
      navigate('/login');
      return;
    }

    const backendCourseId = findCourseIdForConfig(courseConfig[levelId], courses);
    if (!backendCourseId) {
      toast.error('This course is not available for purchase right now.');
      return;
    }

    try {
      await startHostedCheckout(backendCourseId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to start payment right now.';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <style>{`
        @keyframes pr-fade { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pr-orb1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-16px)} }
        @keyframes pr-orb2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-16px,12px)} }
        @keyframes pr-card { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .pr-f1 { animation: pr-fade 0.6s ease-out 0.1s both; }
        .pr-f2 { animation: pr-fade 0.6s ease-out 0.25s both; }
        .pr-f3 { animation: pr-fade 0.6s ease-out 0.4s both; }
        .pr-orb1 { animation: pr-orb1 10s ease-in-out infinite; }
        .pr-orb2 { animation: pr-orb2 13s ease-in-out infinite; }
        .pr-c1 { animation: pr-card 0.6s ease-out 0.3s both; }
        .pr-c2 { animation: pr-card 0.6s ease-out 0.5s both; }
        .pr-c3 { animation: pr-card 0.6s ease-out 0.7s both; }
        .pr-card-hover {
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease;
        }
        .pr-card-hover:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 24px 48px -12px hsla(160,72%,33%,0.2), 0 8px 16px -4px hsla(160,72%,33%,0.1);
        }
        .pr-btn {
          transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease;
        }
        .pr-btn:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 8px 24px -4px hsla(160,72%,33%,0.4);
        }
        .pr-btn:active {
          transform: scale(0.97);
        }
        .pr-btn-ghost:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 6px 20px -4px hsla(160,72%,33%,0.25);
        }
        .pr-btn-ghost:active {
          transform: scale(0.97);
        }
      `}</style>

      {/* ── TOP NAV ── */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0">
        <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <img src={logoSrc} alt="Easy Option Learning" className="h-8 w-8 object-contain rounded-lg" />
          <span className="font-bold text-sm text-foreground hidden sm:inline">Easy Option Learning</span>
        </Link>
      </div>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/40" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.04] dark:opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="pr-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pr-grid)" />
        </svg>
        <div className="pr-orb1 absolute top-0 left-0 w-80 h-80 rounded-full bg-emerald-300/15 dark:bg-emerald-500/8 blur-3xl pointer-events-none" />
        <div className="pr-orb2 absolute bottom-0 right-0 w-96 h-96 rounded-full bg-teal-200/15 dark:bg-teal-600/8 blur-3xl pointer-events-none" />

        <div className="relative container mx-auto px-4">
          <div className="pr-f2 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 border border-success/20 text-success text-xs font-medium mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              One-time payment. Lifetime access.
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
              Choose Your <span className="text-success">Trading Journey</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              Every expert trader started somewhere — pick your starting point and begin your journey.
            </p>
          </div>

          {/* Journey steps */}
          <div className="pr-f3 hidden md:flex items-center justify-center mt-10 mb-2">
            {['🌱 Foundation', '📈 Growth', '🏆 Mastery'].map((label, i) => (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-success/10 border-2 border-success/30 flex items-center justify-center text-sm font-semibold text-success">{i + 1}</div>
                  <span className="text-xs text-muted-foreground mt-1 font-medium">{label}</span>
                </div>
                {i < 2 && <div className="w-24 h-px bg-gradient-to-r from-success/40 to-success/20 mx-2 mb-4" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING CARDS ── */}
      <section className="relative pb-20 -mt-4">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
            {plans.map((plan, i) => (
              <CourseLevelCard
                key={plan.id}
                level={plan}
                variant="pricing"
                index={i}
                onCtaClick={() => handleCourseCheckout(plan.id)}
                className={cn(
                  i === 0 && 'pr-c1',
                  i === 1 && 'pr-c2',
                  i === 2 && 'pr-c3',
                  'pr-card-hover'
                )}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── NISM RESOURCE ── */}
      {nismConfig.enabled && (
        <section className="py-14 bg-muted/20">
          <div className="container mx-auto px-4">
            {/* Divider label */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px flex-1 max-w-20 bg-border" />
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Also Available</span>
              <div className="h-px flex-1 max-w-20 bg-border" />
            </div>

            <div
              className="relative max-w-4xl mx-auto overflow-hidden rounded-2xl border border-success/25 bg-card shadow-xl shadow-success/5"
              style={{ animation: 'pr-card 0.6s ease-out 0.9s both' }}
            >
              {/* Top shine */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-success/50 to-transparent" />

              {/* Orbs */}
              <div className="pr-orb1 absolute -top-10 -right-10 w-44 h-44 rounded-full bg-success/6 blur-3xl pointer-events-none" />
              <div className="pr-orb2 absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-success/5 blur-3xl pointer-events-none" />

              <div className="relative z-10 p-6 sm:p-8 md:p-10">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

                  {/* Left — content */}
                  <div className="flex-1 min-w-0">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 border border-success/20 text-success text-xs font-semibold mb-4">
                      <BookOpen className="w-3 h-3" />
                      {nismConfig.badge}
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 leading-tight">
                      {nismConfig.title.split('—')[0]}
                      {nismConfig.title.split('—')[1] && (
                        <>
                          —{' '}
                          <span className="text-success">{nismConfig.title.split('—')[1]}</span>
                        </>
                      )}
                    </h2>

                    <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
                      {nismConfig.description}
                    </p>

                    {/* Benefits */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-7">
                      {nismConfig.benefits.map((b) => (
                        <div key={b} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-success shrink-0" />
                          <span className="text-sm text-muted-foreground">{b}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a
                        href={nismConfig.purchaseUrl}
                        className="pr-btn inline-flex items-center justify-center gap-2 px-6 h-11 rounded-xl bg-success text-white text-sm font-semibold shadow-md"
                      >
                        {nismConfig.primaryCTA} — ₹{nismConfig.price}
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <a
                        href={SAMPLE_PDF_PATH}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={openSamplePdf}
                        className="pr-btn-ghost inline-flex items-center justify-center gap-2 px-6 h-11 rounded-xl border border-success/30 text-success bg-success/5 hover:bg-success/10 text-sm font-semibold transition-all duration-200"
                      >
                        <Download className="w-4 h-4" />
                        {nismConfig.secondaryCTA}
                      </a>
                    </div>
                  </div>

                  {/* Right — accent card */}
                  <div className="w-full lg:w-60 shrink-0">
                    <div className="rounded-xl border border-success/20 bg-success/5 p-5">
                      <div className="w-10 h-10 rounded-xl bg-success/15 flex items-center justify-center mb-4">
                        <BookOpen className="w-5 h-5 text-success" />
                      </div>
                      <p className="text-xs font-bold text-success uppercase tracking-widest mb-1">What's Inside</p>
                      <p className="text-sm font-bold text-foreground mb-3">{nismConfig.accentTitle}</p>
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
                        <p className="text-2xl font-bold text-foreground mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                          ₹{nismConfig.price}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      <section className="pb-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-10 pt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-sm">Everything you need to know before you start.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 text-center p-8 rounded-2xl bg-gradient-to-br from-success/10 to-teal-500/5 border border-success/20">
            <p className="text-base font-semibold text-foreground mb-1">Still not sure where to start?</p>
            <p className="text-sm text-muted-foreground mb-5">Start with the Foundation level — you can always progress from there.</p>
            <Button
              className="pr-btn bg-success hover:bg-success/90 text-white rounded-xl px-8 h-11 font-semibold shadow-lg shadow-success/20"
              onClick={() => handleCourseCheckout('beginner')}
            >
              Buy Foundation —{' '}
              <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>₹{courseConfig.beginner.price}</span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
