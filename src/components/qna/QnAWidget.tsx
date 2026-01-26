import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Send, X, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface QnAWidgetProps {
  contextType: 'dashboard' | 'lesson' | 'level';
  contextId?: string;
}

export const QnAWidget = ({ contextType, contextId }: QnAWidgetProps) => {
  const { user, profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!question.trim() || !user || !profile) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('qna_inquiries')
        .insert({
          user_id: user.id,
          user_email: profile.email,
          context_type: contextType,
          context_id: contextId || null,
          question: question.trim()
        });

      if (error) throw error;

      setIsSubmitted(true);
      setQuestion('');
      toast.success('Question submitted! You\'ll receive an answer via email.');
      
      setTimeout(() => {
        setIsSubmitted(false);
        setIsOpen(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting question:', error);
      toast.error('Failed to submit question. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover-scale ${
          isOpen ? 'bg-destructive' : 'bg-primary'
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-primary-foreground" />
        ) : (
          <MessageCircle className="h-6 w-6 text-primary-foreground" />
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 tactical-card shadow-xl animate-scale-in overflow-hidden">
          <div className="bg-primary p-4">
            <h3 className="font-bold text-primary-foreground">Have a Question?</h3>
            <p className="text-sm text-primary-foreground/80">
              Ask us anything about the course
            </p>
          </div>

          <div className="p-4">
            {isSubmitted ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-success" />
                <h4 className="font-bold mb-2">Question Received!</h4>
                <p className="text-sm text-muted-foreground">
                  We'll send the answer to your email: {profile?.email}
                </p>
              </div>
            ) : (
              <>
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Type your question here..."
                  className="min-h-[120px] resize-none mb-4"
                  disabled={isSubmitting}
                />
                
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Answer will be sent to your email
                  </p>
                  <Button 
                    onClick={handleSubmit}
                    disabled={!question.trim() || isSubmitting}
                    size="sm"
                    className="gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    Send
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
