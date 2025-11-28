import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Star, Loader2 } from "lucide-react";
import { useScrollAnimation } from "../../hooks/use-scroll-animation";
import { useToast } from "../../hooks/use-toast";
import { supabase } from "../../lib/supabase";

const SubmitReviewSection = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a star rating before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name');
    const role = formData.get('role');
    const message = formData.get('message');

    try {
      const { error } = await supabase.from('reviews').insert([
        {
          name,
          role,
          message,
          rating,
          // status defaults to 'pending'
          // approved defaults to false
        }
      ]);

      if (error) throw error;

      toast({
        title: "Review Submitted!",
        description: "Thank you for sharing your experience. Your review is pending moderation.",
      });
      
      setRating(0);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div 
            ref={ref}
            className={`glass-card p-8 md:p-12 rounded-2xl border border-primary/20 shadow-xl transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-3">Share Your <span className="text-primary">Experience</span></h2>
              <p className="text-muted-foreground">Your feedback helps me improve and serve you better.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Rating</label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none transition-transform hover:scale-110"
                      disabled={isSubmitting}
                    >
                      <Star 
                        className={`w-8 h-8 ${
                          star <= (hoverRating || rating) 
                            ? "fill-primary text-primary" 
                            : "text-muted-foreground"
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input 
                    required 
                    name="name"
                    placeholder="John Doe" 
                    className="bg-background/50" 
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company (Optional)</label>
                  <Input 
                    name="role"
                    placeholder="Tech Inc." 
                    className="bg-background/50" 
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Review</label>
                <textarea 
                  required
                  name="message"
                  rows={4} 
                  className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Tell us about your project..."
                  disabled={isSubmitting}
                />
              </div>

              <Button type="submit" className="w-full text-lg font-semibold h-12" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubmitReviewSection;