import { Lightbulb, Target, Brain, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Lightbulb,
    title: 'Break Complex Concepts into Simple Ideas',
    description: 'We simplify derivatives trading into digestible lessons that build on each other logically.'
  },
  {
    icon: Target,
    title: 'Teach Why Things Work, Not Just What',
    description: 'Understanding the reasoning behind strategies gives you an edge in any market condition.'
  },
  {
    icon: Brain,
    title: 'Help You Think Like a Trader',
    description: 'Develop the analytical mindset that separates profitable traders from those who guess.'
  }
];

export const AboutSection = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground">
            What This Course Is <span className="text-primary">Really About</span>
          </h2>
          <p className="font-body text-lg text-muted-foreground leading-relaxed">
            A calm, structured approach to learning options trading—built on clarity, not hype.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto mb-12">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="group tactical-card p-6 md:p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-ui text-lg font-semibold mb-3 text-foreground">{feature.title}</h3>
              <p className="font-body text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-success/10 text-success border border-success/20">
            <ArrowRight className="h-4 w-4" />
            <span className="font-medium text-sm md:text-base">
              By the end of the Advanced Level, you'll be ready to trade professionally.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
