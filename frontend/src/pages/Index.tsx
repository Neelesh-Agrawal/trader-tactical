import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/landing/HeroSection';
import { AboutSection } from '@/components/landing/AboutSection';
import { LevelsSection } from '@/components/landing/LevelsSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { WhyChooseUsSection } from '@/components/landing/WhyChooseUsSection';
import { CTASection } from '@/components/landing/CTASection';
import { FAQSection } from '@/components/landing/FAQSection';
import { ContactSection } from '@/components/landing/ContactSection';
import { Footer } from '@/components/landing/Footer';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="mono text-muted-foreground">INITIALIZING...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showAuth />
      <main id="main-content">
        <HeroSection />
        <AboutSection />
        <LevelsSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <WhyChooseUsSection />
        <CTASection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
