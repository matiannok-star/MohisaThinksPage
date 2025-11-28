import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Star } from "lucide-react";
import { useScrollAnimation } from "../../hooks/use-scroll-animation";
import { useToast } from "../../hooks/use-toast";

const SubmitReviewSection = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Review Submitted!",
      description: "Thank you for sharing your experience. Your review is under moderation.",
    });
    setRating(0);
    (e.target as HTMLFormElement).reset();
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
                  <Input required placeholder="John Doe" className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company (Optional)</label>
                  <Input placeholder="Tech Inc." className="bg-background/50" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Review</label>
                <textarea 
                  required
                  rows={4} 
                  className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Tell us about your project..."
                />
              </div>

              <Button type="submit" className="w-full text-lg font-semibold h-12">
                Submit Review
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubmitReviewSection;
