import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "../ui/card";
import { Workflow, Database, Brain, Zap, Shield, Globe, Cpu } from "lucide-react";
import { useScrollAnimation } from "../../hooks/use-scroll-animation";
import { Badge } from "../ui/badge";
import { useIsMobile } from "../../hooks/use-mobile";

const features = [
  {
    icon: Workflow,
    title: "Seamless Integrations",
    description: "Connect n8n, Supabase, & Zapier instantly.",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/20"
  },
  {
    icon: Brain,
    title: "Conversational Actions",
    description: "Trigger complex workflows with natural language.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20"
  },
  {
    icon: Database,
    title: "Visual Database",
    description: "No-code database design and migration tools.",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
    border: "border-pink-400/20"
  },
  {
    icon: Zap,
    title: "Multi-Channel",
    description: "Automate across email, SMS, and Slack.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20"
  },
  {
    icon: Shield,
    title: "Secure Processing",
    description: "Enterprise-grade security for your data.",
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20"
  },
  {
    icon: Cpu,
    title: "Edge Computing",
    description: "Low-latency execution worldwide.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20"
  }
];

const FeaturesGrid = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoRotateRef = useRef<number>(0);
  const lastRotationRef = useRef<number>(0);
  const isMobile = useIsMobile();

  // Carousel Configuration
  const cardCount = features.length;
  // Reduce radius on mobile to keep cards closer together
  const radius = isMobile ? 140 : 350; 
  const theta = 360 / cardCount;

  // Auto-rotation logic
  useEffect(() => {
    let animationFrame: number;

    const animate = () => {
      if (!isDragging) {
        setRotation(prev => prev - 0.2); // Slow auto-rotation speed
      }
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isDragging]);

  // Drag interaction handlers
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    lastRotationRef.current = rotation;
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const delta = clientX - startX;
    setRotation(lastRotationRef.current + delta * 0.5);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <section className="py-24 md:py-32 relative bg-transparent overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div 
          ref={headerRef}
          className={`text-center space-y-4 mb-16 md:mb-24 transition-all duration-700 ${
            headerVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
          }`}
        >
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
            NEXT-GEN CAPABILITIES
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold max-w-3xl mx-auto">
            Build, Scale, <span className="text-primary">Automate</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Drag to rotate the core features of the Mohisa intelligent ecosystem.
          </p>
        </div>

        {/* 3D Carousel Container */}
        <div 
          className="relative h-[350px] md:h-[450px] w-full flex items-center justify-center perspective-container"
          style={{ perspective: isMobile ? '800px' : '1200px' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
        >
          <div
            ref={carouselRef}
            className="relative w-[180px] h-[260px] md:w-[300px] md:h-[380px] preserve-3d transition-transform duration-100 ease-linear cursor-grab active:cursor-grabbing"
            style={{ 
              transformStyle: 'preserve-3d', 
              transform: `rotateY(${rotation}deg)` 
            }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const angle = theta * index;
              
              return (
                <div
                  key={index}
                  className="absolute inset-0 backface-visible"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  }}
                >
                  <Card className={`w-full h-full bg-slate-900/80 backdrop-blur-xl border ${feature.border} shadow-2xl hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-300 group transform-style-preserve-3d`}>
                    <CardContent className="flex flex-col items-center justify-center h-full p-4 md:p-8 text-center space-y-3 md:space-y-6 transform-style-preserve-3d">
                      <div 
                        className={`w-12 h-12 md:w-20 md:h-20 rounded-xl md:rounded-2xl ${feature.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}
                        style={{ transform: 'translateZ(30px)' }}
                      >
                        <Icon className={`w-6 h-6 md:w-10 md:h-10 ${feature.color}`} />
                      </div>
                      
                      <div style={{ transform: 'translateZ(20px)' }}>
                        <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-3">{feature.title}</h3>
                        <p className="text-xs md:text-base text-muted-foreground leading-relaxed line-clamp-3 md:line-clamp-none">
                          {feature.description}
                        </p>
                      </div>

                      <div 
                        className={`h-1 w-8 md:w-12 rounded-full ${feature.bg.replace('/10', '')} opacity-50`}
                        style={{ transform: 'translateZ(10px)' }}
                      />
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>

          {/* Floor Reflection Effect */}
          <div 
            className="absolute -bottom-24 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary/20 rounded-full blur-[60px] md:blur-[100px] opacity-20 transform rotate-x-90 pointer-events-none"
            style={{ transform: `rotateX(90deg) translateZ(-200px)` }}
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;