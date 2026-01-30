import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatedSection } from './AnimatedSection';

export const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-success/10" />
      
      <div className="container mx-auto px-4 relative">
        <AnimatedSection direction="up" delay={0}>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Start Learning Options the <span className="text-primary">Right Way</span>
            </h2>
            <p className="font-body text-lg text-muted-foreground mb-8 leading-relaxed">
              Build clarity first. Confidence next. Capital last.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-base md:text-lg px-8 gap-2 h-12 md:h-14" 
                onClick={() => navigate('/register')}
              >
                Start with Beginner Level
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-base md:text-lg px-8 gap-2 h-12 md:h-14"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <BookOpen className="h-5 w-5" />
                View Course Structure
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
