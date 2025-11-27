import React, { useEffect, useState } from "react";
import { useScrollAnimation } from "../../hooks/use-scroll-animation";
import { Database, Workflow, Zap, Brain, MessageSquare, Code, Cloud, Server, Box, Layers } from "lucide-react";

const stats = [
  { label: "Projects Completed", value: 50, suffix: "+" },
  { label: "Years Experience", value: 5, suffix: "+" },
  { label: "Technologies Mastered", value: 20, suffix: "+" },
  { label: "Happy Clients", value: 30, suffix: "+" },
];

const techStack = [
  { name: "MS Access", icon: Database },
  { name: "n8n", icon: Workflow },
  { name: "Supabase", icon: Zap },
  { name: "OpenAI", icon: Brain },
  { name: "Claude", icon: MessageSquare },
  { name: "Zapier", icon: Box },
  { name: "React", icon: Code },
  { name: "Cloud DB", icon: Cloud },
  { name: "Automation", icon: Layers },
  { name: "Serverless", icon: Server },
];

const FlipCard: React.FC<{ icon: any, name: string }> = ({ icon: Icon, name }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="group relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0 cursor-pointer perspective-1000 mx-4"
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ perspective: '1000px' }}
    >
      <div 
        className="w-full h-full relative transition-transform duration-500 transform-style-3d"
        style={{ 
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* Front */}
        <div 
          className="absolute inset-0 rounded-2xl bg-card border border-border flex items-center justify-center shadow-lg hover:border-primary/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <Icon className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>

        {/* Back */}
        <div 
          className="absolute inset-0 rounded-2xl bg-primary/10 border border-primary flex items-center justify-center shadow-lg backdrop-blur-sm"
          style={{ 
            backfaceVisibility: 'hidden', 
            transform: 'rotateY(180deg)' 
          }}
        >
          <span className="text-xs md:text-sm font-bold text-center px-2 break-words text-primary">{name}</span>
        </div>
      </div>
    </div>
  );
};

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
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

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

          {/* Tech Stack Carousel */}
          <div className="pt-16 pb-8">
            <div className="text-center mb-8">
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Tech Stack & Tools</span>
            </div>
            
            <div className="relative w-full overflow-hidden mask-linear-fade">
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
              
              <div className="flex animate-scroll w-max py-4">
                {/* First set */}
                {techStack.map((tech, i) => (
                  <FlipCard key={`1-${i}`} name={tech.name} icon={tech.icon} />
                ))}
                {/* Second set for infinite loop */}
                {techStack.map((tech, i) => (
                  <FlipCard key={`2-${i}`} name={tech.name} icon={tech.icon} />
                ))}
              </div>
            </div>
            
            <div className="text-center mt-4">
               <p className="text-xs text-muted-foreground animate-pulse">Click any card to flip</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;