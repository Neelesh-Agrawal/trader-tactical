import { useState } from 'react';
import { Mail, MessageSquare, Send } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';
import { typography } from '@/design-system';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Drawer, 
  DrawerClose, 
  DrawerContent, 
  DrawerDescription, 
  DrawerFooter, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerTrigger 
} from '@/components/ui/drawer';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export const ContactSection = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.message.trim()) {
      toast({ title: 'Required', description: 'Please enter your message', variant: 'destructive' });
      return;
    }

    setLoading(true);

    try {
      await apiFetch('/api/feedback/', {
        method: 'POST',
        auth: false,
        body: JSON.stringify({
          name: formData.name || profile?.name || 'Anonymous',
          email: formData.email || profile?.email || '',
          message: formData.message
        })
      });

      toast({ title: 'Feedback Sent', description: 'Thank you for your feedback!' });
      setFormData({ name: '', email: '', message: '' });
      setFeedbackOpen(false);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to send feedback. Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <AnimatedSection direction="up" delay={0}>
          <div className="max-w-xl mx-auto text-center">
            <h2 className={`${typography.heading.h1} font-display font-bold mb-4 text-foreground`}>
              Contact <span className="text-success">Us</span>
            </h2>
            <p className={`${typography.body.lg} font-body text-muted-foreground mb-8`}>
            Got a question? We're happy to help.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Drawer open={feedbackOpen} onOpenChange={setFeedbackOpen}>
                <DrawerTrigger asChild>
                  <button className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-card border border-border hover:border-success/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group cursor-pointer">
                    <MessageSquare className="h-5 w-5 text-success" />
                    <span className={`${typography.body.md} font-ui font-medium text-foreground`}>Send us a message</span>
                  </button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Send Feedback</DrawerTitle>
                    <DrawerDescription>
                      We value your feedback. Let us know how we can improve!
                    </DrawerDescription>
                  </DrawerHeader>
                  <form onSubmit={handleSubmit} className="px-4">
                    <div className="space-y-4">
                      {!user && (
                        <>
                          <div>
                            <label htmlFor="feedback-name" className="text-sm font-medium">Name</label>
                            <Input
                              id="feedback-name"
                              placeholder="Your name"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                          </div>
                          <div>
                            <label htmlFor="feedback-email" className="text-sm font-medium">Email</label>
                            <Input
                              id="feedback-email"
                              type="email"
                              placeholder="your@email.com"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                          </div>
                        </>
                      )}
                      <div>
                        <label htmlFor="feedback-message" className="text-sm font-medium">Message</label>
                        <Textarea
                          id="feedback-message"
                          placeholder="Tell us what's on your mind..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="min-h-[120px]"
                        />
                      </div>
                    </div>
                    <DrawerFooter className="mt-6">
                      <Button type="submit" disabled={loading} className="w-full gap-2">
                        {loading ? 'Sending...' : (
                          <>
                            Send Feedback
                            <Send className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                      <DrawerClose asChild>
                        <Button type="button" variant="outline" className="w-full">
                          Cancel
                        </Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </form>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
