import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, ArrowRight, Play, Target, Users, Shield, Zap, 
  CheckCircle, Star, Crown, Award, ChevronDown, Lock 
} from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

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

  const levels = [
    {
      id: 'beginner',
      number: 1,
      title: 'Basic',
      subtitle: 'Foundation of Trading',
      icon: Star,
      color: 'bg-primary',
      features: ['Understanding Markets', 'Basic Chart Reading', 'Risk Management 101', 'Trading Psychology', 'Order Types & Execution'],
      popular: false
    },
    {
      id: 'intermediate',
      number: 2,
      title: 'Intermediate',
      subtitle: 'Advanced Strategies',
      icon: Crown,
      color: 'bg-warning',
      features: ['Technical Analysis', 'Pattern Recognition', 'Advanced Risk Control', 'Position Sizing', 'Multi-Timeframe Analysis'],
      popular: true
    },
    {
      id: 'advanced',
      number: 3,
      title: 'Advanced',
      subtitle: 'Pro-Level Techniques',
      icon: Award,
      color: 'bg-success',
      features: ['Algorithmic Strategies', 'Market Making', 'Portfolio Management', 'Professional Tools', 'Live Trading Simulation'],
      popular: false
    }
  ];

  const benefits = [
    {
      icon: Target,
      title: 'Clear Path to Success',
      description: 'Our structured curriculum takes you from complete beginner to professional trader with measurable milestones.'
    },
    {
      icon: Users,
      title: 'Expert Mentorship',
      description: 'Learn from experienced traders who have navigated the markets successfully for years.'
    },
    {
      icon: Shield,
      title: 'Risk-Free Learning',
      description: 'Practice with simulated trading before risking real capital. Your success is our priority.'
    },
    {
      icon: Zap,
      title: 'Funded Opportunity',
      description: 'Top performers get hired and receive company capital to trade. Keep your profits, we share the risk.'
    }
  ];

  const stats = [
    { value: '500+', label: 'Trained Traders' },
    { value: '87%', label: 'Completion Rate' },
    { value: '45%', label: 'Get Funded' },
    { value: '$2M+', label: 'Profits Generated' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header showAuth />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-success/5" />
        
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 text-warning text-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                Learn. Trade. Get Hired.
              </div>
              
              <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight text-foreground">
                Master the Art of{' '}
                <span className="text-gradient-primary">Professional Trading</span>
              </h1>
              
              <p className="font-body text-lg md:text-xl text-muted-foreground mb-10 max-w-xl" style={{ lineHeight: '1.75' }}>
                Complete our 3-level certification program and get hired by our firm. 
                We provide the funds, you bring the skills.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8 gap-2" onClick={() => navigate('/register')}>
                  Start Your Journey
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 gap-2">
                  <Play className="h-5 w-5" />
                  Watch Demo
                </Button>
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-8 mt-12">
                {[
                  { value: '500+', label: 'Traders Trained' },
                  { value: '95%', label: 'Success Rate' },
                  { value: '$2M+', label: 'Funds Deployed' }
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trading Card Visual */}
            <div className="relative hidden lg:block animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="tactical-card p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-success" />
                    <span className="font-medium">BTC/USD</span>
                  </div>
                  <span className="text-success font-bold">+12.5%</span>
                </div>
                
                {/* Chart bars */}
                <div className="flex items-end gap-2 h-40 mb-4">
                  {[40, 55, 45, 70, 60, 80, 75, 90, 85, 95, 88, 92].map((height, i) => (
                    <div 
                      key={i}
                      className="flex-1 bg-success rounded-t-sm transition-all hover:bg-success/80"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="caption text-muted-foreground">24h High</p>
                    <p className="font-bold">$68,245</p>
                  </div>
                  <div>
                    <p className="caption text-muted-foreground">24h Low</p>
                    <p className="font-bold">$65,102</p>
                  </div>
                  <div>
                    <p className="caption text-muted-foreground">Volume</p>
                    <p className="font-bold">$2.4B</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-muted-foreground" />
        </div>
      </section>

      {/* Levels Section */}
      <section id="levels" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-ui text-3xl md:text-4xl font-semibold mb-4 text-foreground">
              <span className="text-primary">Three Levels</span> to Mastery
            </h2>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto" style={{ lineHeight: '1.75' }}>
              Progress through our comprehensive curriculum and earn certifications at each level.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {levels.map((level) => (
              <div 
                key={level.id}
                className={`tactical-card p-6 relative transition-all hover:-translate-y-1 ${
                  level.popular ? 'border-primary ring-2 ring-primary/20' : ''
                }`}
              >
                {level.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full uppercase">
                    Most Popular
                  </div>
                )}

                <div className={`w-12 h-12 rounded-xl ${level.color}/20 flex items-center justify-center mb-4`}>
                  <level.icon className={`h-6 w-6 ${level.color === 'bg-primary' ? 'text-primary' : level.color === 'bg-warning' ? 'text-warning' : 'text-success'}`} />
                </div>

                <div className="caption text-muted-foreground mb-1">LEVEL {level.number}</div>
                <h3 className="font-ui text-xl font-semibold mb-1">{level.title}</h3>
                <p className="font-body text-muted-foreground text-sm mb-6">{level.subtitle}</p>

                <ul className="space-y-3 mb-6">
                  {level.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-success shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full" 
                  variant={level.popular ? 'default' : 'outline'}
                  onClick={() => navigate('/register')}
                >
                  Start {level.title} Level
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-ui text-3xl md:text-4xl font-semibold mb-6 text-foreground">
                Why Choose <span className="text-primary">TradeMaster</span>?
              </h2>
              <p className="font-body text-lg text-muted-foreground mb-8" style={{ lineHeight: '1.75' }}>
                We're not just another trading course. We're a pathway to a career. 
                Our unique model aligns our success with yours – when you succeed, we succeed.
              </p>

              <div className="space-y-6">
                {benefits.map((benefit) => (
                  <div key={benefit.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <benefit.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-ui font-semibold mb-1">{benefit.title}</h4>
                      <p className="font-body text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="tactical-card p-8 rounded-2xl">
              <h3 className="font-ui text-xl font-semibold mb-6 text-center">Our Track Record</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center p-4 bg-muted/50 rounded-xl">
                    <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-muted/30 rounded-xl text-center">
                <p className="text-sm italic mb-2">
                  "TradeMaster transformed my understanding of the markets. Within 6 months, 
                  I went from complete beginner to funded trader."
                </p>
                <p className="font-bold">Sarah Johnson</p>
                <p className="text-xs text-muted-foreground">Funded Trader, Class of 2025</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-success/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-ui text-3xl md:text-4xl font-semibold mb-6 text-foreground">Ready to Transform Your Trading?</h2>
          <p className="font-body text-lg text-muted-foreground mb-8 max-w-xl mx-auto" style={{ lineHeight: '1.75' }}>
            Join thousands of traders who have accelerated their careers through our program.
          </p>
          <Button size="lg" className="text-lg px-10 gap-2" onClick={() => navigate('/register')}>
            Start Free Today
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-card">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="font-bold">TradeMaster</span>
            </div>
            <p className="mono text-sm text-muted-foreground">
              © 2024 TradeMaster — Options Education Platform
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
