import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatedSection } from './AnimatedSection';
import { typography } from '@/design-system';
import { ctaSectionConfig } from '@/config/courseConfig';

export const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12 md:py-16 relative overflow-hidden bg-muted/30">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-success/10 via-success/5 to-success/10" />
      
      <div className="container mx-auto px-4 relative">
        <AnimatedSection direction="up" delay={0}>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className={`${typography.heading.h1} font-display font-bold mb-4 text-foreground`}>
              {ctaSectionConfig.titlePart1} <span className="text-success">{ctaSectionConfig.titlePart2}</span>
            </h2>
            <p className={`${typography.body.lg} font-body text-muted-foreground mb-8 leading-relaxed`}>
              {ctaSectionConfig.subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className={`${typography.ui.lg} font-ui px-8 gap-2 h-12 md:h-14 bg-success hover:bg-success/90 text-white`}
                onClick={() => navigate('/register')}
              >
                {ctaSectionConfig.primaryCTA}
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className={`${typography.ui.lg} font-ui px-8 gap-2 h-12 md:h-14`}
                onClick={() => document.getElementById('levels')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <BookOpen className="h-5 w-5" />
                {ctaSectionConfig.secondaryCTA}
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
