import { useRef, useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';
import { typography } from '@/design-system';
import { useCountUp } from '@/hooks/useCountUp';
import { whyChooseUsConfig, courseConfigList } from '@/config/courseConfig';
import { TacticalCard } from '@/components/ui/tactical-card';

const StatCounter = ({ end, suffix, label, animate }: { end: number; suffix: string; label: string; animate: boolean }) => {
  const { count } = useCountUp({ end: animate ? end : 0, duration: 1800, easing: 'easeOut' });
  return (
    <div className="text-center">
      <div className={`${typography.mono.xl} font-mono font-bold text-success`}>
        {animate ? count : 0}{suffix}
      </div>
      <div className={`${typography.ui.sm} font-ui text-muted-foreground mt-1`}>{label}</div>
    </div>
  );
};

export const WhyChooseUsSection = () => {
  const statsRef = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setAnimate(true); observer.disconnect(); } },
      { threshold: 0.4 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const totalModules = courseConfigList.reduce((acc, level) => acc + level.modules, 0);
  const totalLessons = courseConfigList.reduce((acc, level) => acc + level.lessons, 0);

  const stats = [
    { end: totalModules, suffix: '+', label: 'Modules' },
    { end: totalLessons, suffix: '+', label: 'Lessons' },
    ...whyChooseUsConfig.stats.map(s => ({ end: 100, suffix: s.suffix, label: s.label }))
  ];

  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center max-w-6xl mx-auto">
          {/* Left Content */}
          <AnimatedSection direction="left" delay={0}>
            <div>
              <span className={`${typography.ui.sm} font-ui font-medium text-success uppercase tracking-wider mb-3 block`}>
                {whyChooseUsConfig.badge}
              </span>
              <h2 className={`${typography.heading.h1} font-display font-bold mb-4 text-foreground leading-tight`}>
                {whyChooseUsConfig.titlePart1}{' '}
                <span className="text-success">{whyChooseUsConfig.titlePart2}</span>
              </h2>
              <p className={`${typography.body.lg} font-body text-muted-foreground leading-relaxed mb-8`}>
                {whyChooseUsConfig.subtitle}
              </p>

              {/* Stats */}
              <div ref={statsRef} className="flex items-center gap-8 md:gap-10">
                {stats.map((stat) => (
                  <StatCounter key={stat.label} {...stat} animate={animate} />
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Right Cards */}
          <AnimatedSection direction="right" delay={100}>
            <div className="grid sm:grid-cols-2 gap-4">
              {whyChooseUsConfig.reasons.map((reason) => (
                <TacticalCard
                  key={reason.title}
                  animateHover={true}
                  className="p-4"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-success/10 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-success" />
                    </div>
                    <h3 className={`${typography.heading.h6} font-ui font-semibold text-foreground`}>{reason.title}</h3>
                  </div>
                  <p className={`${typography.body.sm} font-body text-muted-foreground leading-relaxed pl-10`}>
                    {reason.description}
                  </p>
                </TacticalCard>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};
