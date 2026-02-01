import { Quote } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

const testimonials = [
  {
    quote: "Options finally made sense. The focus on 'why' changed how I look at trades.",
    author: 'Rahul M.',
    role: 'Beginner Level Graduate'
  },
  {
    quote: "This feels structured, practical, and refreshingly honest. No hype, just real learning.",
    author: 'Priya S.',
    role: 'Options Trader'
  }
];

export const TestimonialsSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <AnimatedSection direction="up" delay={0}>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground">
              What Learners <span className="text-success">Are Saying</span>
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <AnimatedSection key={testimonial.author} direction={index === 0 ? 'left' : 'right'} delay={100 + index * 100}>
              <div className="group tactical-card p-6 md:p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg h-full">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center mb-5">
                  <Quote className="h-5 w-5 text-success" />
                </div>
                <blockquote className="text-lg text-foreground leading-relaxed mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <span className="font-ui font-semibold text-sm text-muted-foreground">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.author}</p>
                    <p className="font-ui text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};
