import React, { useEffect, useState } from "react";
import { useScrollAnimation } from "../../hooks/use-scroll-animation";

const stats = [
  { label: "Projects Completed", value: 50, suffix: "+" },
  { label: "Years Experience", value: 5, suffix: "+" },
  { label: "Technologies Mastered", value: 20, suffix: "+" },
  { label: "Happy Clients", value: 30, suffix: "+" },
];

const AboutSection = () => {
  const [counts, setCounts] = useState(stats.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          stats.forEach((stat, index) => {
            let current = 0;
            const increment = stat.value / 50;
            const timer = setInterval(() => {
              current += increment;
              if (current >= stat.value) {
                current = stat.value;
                clearInterval(timer);
              }
              setCounts((prev) => {
                const newCounts = [...prev];
                newCounts[index] = Math.floor(current);
                return newCounts;
              });
            }, 30);
          });
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById("about");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* About text */}
          <div 
            ref={headerRef}
            className={`text-center space-y-6 transition-all duration-700 ${
              headerVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold">
              About <span className="text-primary">Mohisa Thinks</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Hi, I'm Mohisa — I build intelligent systems, automate workflows, and 
              simplify operations using AI, cloud, and no-code tools. My expertise 
              spans from MS Access database migrations to cutting-edge AI integrations, 
              helping businesses and individuals transform their ideas into functional, 
              automated solutions.
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
            {stats.map((stat, index) => {
              const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });
              
              return (
                <div
                  key={index}
                  ref={ref}
                  className={`text-center p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-700 card-glow-hover ${
                    isVisible ? 'animate-scale-up' : 'opacity-0 scale-95'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {counts[index]}
                  {stat.suffix}
                </div>
                <div className="text-sm md:text-base text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
