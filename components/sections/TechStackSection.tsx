import React, { useState } from "react";
import { Database, Workflow, Zap, Brain, MessageSquare, Code, Cloud, Server, Box, Layers } from "lucide-react";

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

const TechStackSection = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
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
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Tech Stack <span className="text-primary">& Tools</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Leveraging the latest technologies to build robust and scalable solutions.
          </p>
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
        
        <div className="text-center mt-8">
           <p className="text-xs text-muted-foreground animate-pulse">Click any card to flip</p>
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
