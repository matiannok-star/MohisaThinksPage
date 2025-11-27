import React from 'react';
import { Button } from "../ui/button";
import { ArrowDown, Sparkles, Send, Mic, MicOff } from "lucide-react";
import { Badge } from "../ui/badge";
import { useTypingEffect } from "../../hooks/use-typing-effect";
import { useParallax } from "../../hooks/use-parallax";
import { useScrollAnimation } from "../../hooks/use-scroll-animation";
import { useVoiceAgent } from "../voice/voice-agent";

const HeroSection = () => {
  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  const { toggleSession, isActive } = useVoiceAgent();

  const { displayedText: typedHeadline1, isComplete: isLine1Complete } = useTypingEffect(
    "Automate Your",
    80,
    300
  );
  const { displayedText: typedHeadline2 } = useTypingEffect(
    "AI Workflows",
    80,
    isLine1Complete ? 300 : 5000
  );
  const { displayedText: typedHeadline3 } = useTypingEffect(
    "with Smart Systems",
    80,
    isLine1Complete ? 1500 : 8000
  );

  const parallaxOffset = useParallax(0.3);
  const parallaxSlow = useParallax(0.15);
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation();
  const { ref: chatRef, isVisible: chatVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Gradient background with diagonal lines effect - with parallax */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted" />
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
            {typedHeadline1}
            {typedHeadline1 === "Automate Your" && <span className="animate-pulse">|</span>}
            <br />
            <span className="text-primary text-glow-cyan">
              {typedHeadline2}
              {typedHeadline2 === "AI Workflows" && typedHeadline1 === "Automate Your" && <span className="animate-pulse">|</span>}
            </span>
            <br />
            {typedHeadline3}
            {typedHeadline3 && typedHeadline3 !== "with Smart Systems" && <span className="animate-pulse">|</span>}
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

        {/* Right: Interactive Chat Mockup with Voice Trigger */}
        <div 
          ref={chatRef}
          className={`relative max-w-full transition-all duration-700 delay-200 ${
            chatVisible ? 'animate-fade-in-right' : 'opacity-0 translate-x-8'
          }`}
        >
          {/* Main chat interface */}
          <div className="relative bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden shadow-2xl scale-90 md:scale-100 max-h-[500px]">
            {/* Chat header */}
            <div className="border-b border-border/50 p-4 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex items-center gap-2 ml-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">MT</span>
                </div>
                <span className="font-semibold">Mohisa AI</span>
              </div>
            </div>

            {/* Chat content */}
            <div className="p-6 space-y-4 min-h-[200px]">
              {/* User message */}
              <div className="flex justify-end">
                <div className="bg-primary text-primary-foreground px-4 py-3 rounded-2xl rounded-tr-sm max-w-[80%]">
                  <p className="text-sm">Generate weekly sales summary report</p>
                </div>
              </div>

              {/* AI response */}
              <div className="flex justify-start">
                <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-sm max-w-[80%]">
                  <p className="text-sm">I'll analyze your sales data and create a comprehensive report. Would you like me to include customer segmentation?</p>
                </div>
              </div>

              {/* Typing indicator */}
              <div className="flex justify-start">
                <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Input area */}
            <div className="border-t border-border/50 p-4">
              <div className="flex items-center gap-2 bg-background/50 rounded-xl p-3 border border-border/50">
                <div className="flex items-center gap-2 flex-1">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Ask AI to automate anything...</span>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-xs">Chat</Badge>
                  <Badge variant="outline" className="text-xs">Workflow</Badge>
                </div>
                <Button 
                  size="sm" 
                  className={`transition-all ${isActive ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-primary hover:bg-primary/90'}`}
                  onClick={toggleSession}
                >
                  {isActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              </div>
            </div>
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