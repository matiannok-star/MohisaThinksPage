import React, { useState, useRef } from 'react';
import { Button } from "../ui/button";
import { ArrowDown, Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";
import { useTypingEffect } from "../../hooks/use-typing-effect";
import { useParallax } from "../../hooks/use-parallax";
import { useScrollAnimation } from "../../hooks/use-scroll-animation";

const HeroSection = () => {
  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Smooth chained typing effects
  const { displayedText: typedHeadline1, isComplete: isLine1Complete } = useTypingEffect(
    "Automate Your",
    80,
    300
  );

  const { displayedText: typedHeadline2, isComplete: isLine2Complete } = useTypingEffect(
    "AI Workflows",
    80,
    isLine1Complete ? 300 : 999999
  );

  const { displayedText: typedHeadline3, isComplete: isLine3Complete } = useTypingEffect(
    "with Smart Systems",
    80,
    isLine2Complete ? 300 : 999999
  );

  // Parallax effects
  const parallaxOffset = useParallax(0.3); // Background decorative lines
  const parallaxSlow = useParallax(0.15); // Background gradient
  const contentParallax = useParallax(0.12); // Content - subtle movement against scroll

  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation();
  const { ref: chatRef, isVisible: chatVisible } = useScrollAnimation({ threshold: 0.2 });

  // 3D Tilt Logic
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg rotation
    const rotateY = ((x - centerX) / centerX) * 10;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => setIsHovering(true);
  
  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 perspective-container">
      {/* Vanta background is visible behind this section */}
      <div 
        className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-primary/10 via-secondary/10 to-transparent opacity-50 pointer-events-none"
        style={{ transform: `translateY(${parallaxSlow}px)` }}
      />
      
      {/* Animated diagonal lines - with parallax */}
      <div 
        className="absolute top-0 right-0 w-1/2 h-full overflow-hidden opacity-20 pointer-events-none"
        style={{ transform: `translateY(${parallaxOffset}px)` }}
      >
        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-primary via-secondary to-accent transform rotate-12 translate-x-32" />
        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-primary via-secondary to-accent transform rotate-12 translate-x-48" />
        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-primary via-secondary to-accent transform rotate-12 translate-x-64" />
      </div>

      <div className="relative z-10 container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center py-20">
        {/* Left: Content */}
        <div 
          className="relative z-10"
          style={{ transform: `translateY(${contentParallax}px)` }}
        >
          <div 
            ref={contentRef}
            className={`space-y-8 transition-all duration-700 ${
              contentVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Badge */}
            <div className="inline-block">
              <Badge className="px-4 py-2 bg-primary/10 text-foreground border border-primary/30 backdrop-blur-sm hover:border-primary/50 transition-colors">
                <Sparkles className="w-3 h-3 mr-2 text-primary" />
                SUPERCHARGE YOUR WORKFLOWS
              </Badge>
            </div>

            {/* Main headline with typing effect */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight min-h-[240px] md:min-h-[280px]">
              <span className="block">
                {typedHeadline1}
                {(!isLine1Complete || (isLine1Complete && typedHeadline2 === "")) && <span className="inline-block w-[3px] h-[0.9em] bg-primary ml-1 align-baseline cursor-blink rounded-full"></span>}
              </span>
              
              <span className="block text-primary text-glow-cyan">
                {typedHeadline2}
                {typedHeadline2 !== "" && (!isLine2Complete || (isLine2Complete && typedHeadline3 === "")) && <span className="inline-block w-[3px] h-[0.9em] bg-foreground ml-1 align-baseline cursor-blink rounded-full"></span>}
              </span>
              
              <span className="block">
                {typedHeadline3}
                {typedHeadline3 !== "" && <span className="inline-block w-[3px] h-[0.9em] bg-primary ml-1 align-baseline cursor-blink rounded-full"></span>}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              Connect your favorite apps, set triggers and watch AI handle the rest - 
              no coding required. Get up and running in minutes.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                onClick={scrollToServices}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 shadow-lg hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
              >
                Get Started - Free
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-primary/30 text-foreground hover:border-primary hover:bg-primary/10 hover:text-primary transition-all"
              >
                View Portfolio
              </Button>
            </div>

            {/* Trust badge */}
            <p className="text-sm text-muted-foreground pt-4">
              Trusted by 50+ businesses worldwide
            </p>
          </div>
        </div>

        {/* Right: Interactive 3D Chat Mockup */}
        <div 
          ref={chatRef}
          className={`relative max-w-full transition-all duration-700 delay-200 perspective-[1200px] ${
            chatVisible ? 'animate-fade-in-right' : 'opacity-0 translate-x-8'
          }`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Main chat interface wrapper for tilt */}
          <div 
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative transition-transform duration-100 ease-out cursor-default preserve-3d"
            style={{ 
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            }}
          >
            {/* The Chat Card */}
            <div className="relative bg-card/60 backdrop-blur-xl border border-primary/20 rounded-2xl overflow-hidden shadow-2xl scale-90 md:scale-100 max-h-[500px] group-hover:border-primary/40 transition-colors">
              
              {/* Glare Effect */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300"
                style={{
                  opacity: isHovering ? 0.15 : 0,
                  background: `linear-gradient(${115 + rotation.y * 2}deg, transparent 30%, rgba(255,255,255,0.8) 45%, transparent 60%)`
                }}
              />

              {/* Chat header */}
              <div className="border-b border-border/50 p-4 flex items-center gap-3 bg-muted/20">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm" />
                  <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm" />
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">MT</span>
                  </div>
                  <span className="font-semibold">Mohisa AI</span>
                </div>
              </div>

              {/* Chat content with slight z-depth */}
              <div className="p-6 space-y-4 min-h-[200px] transform-style-preserve-3d">
                {/* User message */}
                <div className="flex justify-end" style={{ transform: 'translateZ(20px)' }}>
                  <div className="bg-primary text-primary-foreground px-4 py-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-md">
                    <p className="text-sm">Generate weekly sales summary report</p>
                  </div>
                </div>

                {/* AI response */}
                <div className="flex justify-start" style={{ transform: 'translateZ(30px)' }}>
                  <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-sm max-w-[80%] shadow-md border border-border/50">
                    <p className="text-sm">I'll analyze your sales data and create a comprehensive report. Would you like me to include customer segmentation?</p>
                  </div>
                </div>

                {/* Typing indicator */}
                <div className="flex justify-start" style={{ transform: 'translateZ(25px)' }}>
                  <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-sm border border-border/50">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Input area */}
              <div className="border-t border-border/50 p-4 bg-muted/10">
                <div className="flex items-center gap-2 bg-background/50 rounded-xl p-3 border border-border/50 shadow-inner">
                  <div className="flex items-center gap-2 flex-1">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Ask AI to automate anything...</span>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">Chat</Badge>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background decorative elements for the 3D scene */}
             <div 
                className="absolute -right-8 -top-8 w-24 h-24 bg-primary/20 rounded-full blur-2xl -z-10"
                style={{ transform: 'translateZ(-50px)' }}
             />
             <div 
                className="absolute -left-8 -bottom-8 w-32 h-32 bg-secondary/20 rounded-full blur-2xl -z-10"
                style={{ transform: 'translateZ(-50px)' }}
             />
          </div>
        </div>
      </div>

      {/* Background image overlay with parallax */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ transform: `translateY(${parallaxOffset * 0.5}px)` }}
      >
        <img 
          src="https://picsum.photos/1920/1080" 
          alt="" 
          className="w-full h-full object-cover grayscale"
        />
      </div>

       {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
        <ArrowDown className="text-primary w-8 h-8" />
      </div>
    </section>
  );
};

export default HeroSection;