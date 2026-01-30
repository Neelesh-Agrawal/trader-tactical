import { Quote } from 'lucide-react';

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
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground">
            What Learners <span className="text-primary">Are Saying</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.author}
              className="group tactical-card p-6 md:p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                <Quote className="h-5 w-5 text-primary" />
              </div>
              <blockquote className="font-body text-lg text-foreground leading-relaxed mb-6 italic">
                "{testimonial.quote}"
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <span className="font-semibold text-sm text-muted-foreground">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-ui font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
