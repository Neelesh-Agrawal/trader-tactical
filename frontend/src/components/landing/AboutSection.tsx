import { Lightbulb, Layers, Brain, GraduationCap } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';
import { typography } from '@/design-system';
import { aboutConfig } from '@/config/courseConfig';
import { TacticalCard } from '@/components/ui/tactical-card';

const iconMap = {
  lightbulb: Lightbulb,
  layers: Layers,
  brain: Brain,
  graduationCap: GraduationCap
};

export const AboutSection = () => {
  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <AnimatedSection direction="up" delay={0}>
          <div className="max-w-3xl mx-auto text-center mb-10 md:mb-12">
            <span className={`${typography.ui.sm} font-ui font-medium text-success uppercase tracking-wider mb-3 block`}>
              {aboutConfig.badge}
            </span>
            <h2 className={`${typography.heading.h1} font-display font-bold mb-4 text-foreground`}>
              {aboutConfig.titlePart1}<span className="text-success">{aboutConfig.titlePart2}</span>
            </h2>
            <p className={`${typography.body.lg} font-body text-muted-foreground leading-relaxed`}>
              {aboutConfig.subtitle}
            </p>
          </div>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {aboutConfig.features.map((feature, index) => {
            const Icon = iconMap[feature.iconKey] || Lightbulb;
            return (
              <AnimatedSection key={feature.title} direction="up" delay={100 + index * 75}>
                <TacticalCard icon={<Icon className="h-6 w-6 text-success" />}>
                  <h3 className={`${typography.heading.h5} font-ui font-semibold mb-2 text-foreground`}>{feature.title}</h3>
                  <p className={`${typography.body.sm} font-body text-muted-foreground leading-relaxed`}>{feature.description}</p>
                </TacticalCard>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
};
