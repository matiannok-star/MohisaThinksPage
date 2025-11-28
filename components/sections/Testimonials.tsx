import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "../ui/card";
import { Star } from "lucide-react";
import { useScrollAnimation } from "../../hooks/use-scroll-animation";
import { supabase } from "../../lib/supabase";

const initialTestimonials = [
  {
    name: "Sarah Mitchell",
    role: "Operations Director, TechFlow Inc",
    content: "Mohisa transformed our manual invoice processing into a fully automated system. What took us 3 days now happens in minutes. Incredible ROI!",
    rating: 5,
  },
  {
    name: "David Chen",
    role: "Founder, DataSync Solutions",
    content: "The MS Access to cloud migration was seamless. Our team can now access data from anywhere, and the performance improvements are remarkable.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Product Manager, StartupLab",
    content: "From concept to working MVP in just 3 weeks. The AI integrations and automation features exceeded our expectations. Highly recommended!",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('name, role, message, rating')
          .eq('approved', true)
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (data && data.length > 0) {
          // Map database 'message' field to 'content' for display
          const formattedReviews = data.map(review => ({
            name: review.name,
            role: review.role,
            content: review.message,
            rating: review.rating
          }));
          // Add fetched reviews to the start of the list
          setTestimonials([...formattedReviews, ...initialTestimonials]);
        }
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      }
    };

    fetchReviews();
  }, []);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
  };

  useEffect(() => {
    // Only start timer once we have testimonials (though we always have initial ones)
    if (testimonials.length > 0) {
      startTimer();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testimonials.length]);

  const handleManualChange = (index: number) => {
    setCurrentIndex(index);
    startTimer(); // Reset timer on manual interaction
  };

  return (
    <section id="testimonials" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Section header */}
          <div 
            ref={headerRef}
            className={`text-center space-y-4 transition-all duration-700 ${
              headerVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold">
              Client <span className="text-primary">Success Stories</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Real results from businesses that transformed with automation
            </p>
          </div>

          {/* Testimonials carousel */}
          <div className="relative h-[400px] md:h-[300px]">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className={`transition-all duration-700 ease-in-out absolute inset-0 w-full h-full ${
                  index === currentIndex
                    ? "opacity-100 scale-100 z-10 translate-x-0"
                    : "opacity-0 scale-95 z-0"
                } bg-card border-primary/30 flex items-center justify-center`}
              >
                <CardContent className="p-8 md:p-12 text-center space-y-6">
                  {/* Rating */}
                  <div className="flex justify-center gap-1">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-lg md:text-xl text-foreground leading-relaxed italic">
                    "{testimonial.content}"
                  </blockquote>

                  {/* Author */}
                  <div className="pt-4">
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    {testimonial.role && (
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Carousel indicators */}
          <div className="flex justify-center gap-2 pt-4 flex-wrap">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleManualChange(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-primary w-8" : "bg-border hover:bg-primary/50"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;