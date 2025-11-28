import React, { useEffect, useState } from 'react';
import { Workflow, Database, Brain, BarChart3, Rocket } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "../ui/carousel";
import { useScrollAnimation } from "../../hooks/use-scroll-animation";

const services = [
  {
    icon: Workflow,
    title: "AI Workflow Automation",
    description: "Streamline your business processes with intelligent automation using n8n, Zapier, and Supabase integrations.",
    color: "text-primary",
  },
  {
    icon: Database,
    title: "Cloud Database Solutions",
    description: "Migrate from MS Access to modern cloud databases. Scalable, secure, and accessible from anywhere.",
    color: "text-secondary",
  },
  {
    icon: Brain,
    title: "AI-Assisted Development",
    description: "Build smart web applications and tools powered by AI. Integrate OpenAI, Claude, and custom AI models.",
    color: "text-accent",
  },
  {
    icon: BarChart3,
    title: "Data Analytics & Visualization",
    description: "Transform raw data into actionable insights with custom dashboards and real-time analytics.",
    color: "text-primary",
  },
  {
    icon: Rocket,
    title: "Custom SaaS MVP Development",
    description: "Launch your product idea quickly with no-code and low-code solutions. From prototype to production.",
    color: "text-secondary",
  },
];

const ServicesSection = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) {
      return;
    }

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <section id="services" className="py-24 relative bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Section header */}
          <div 
            ref={headerRef}
            className={`text-center space-y-4 transition-all duration-700 ${
              headerVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold">
              What I <span className="text-primary">Can Do</span> For You
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive solutions tailored to automate, optimize, and elevate your business operations
            </p>
          </div>

          {/* Services Carousel */}
          <div className="px-12">
            <Carousel
              setApi={setApi}
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-6">
                {services.map((service, index) => {
                  const Icon = service.icon;
                  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
                  
                  return (
                    <CarouselItem key={index} className="pl-6 md:basis-1/2 lg:basis-1/3">
                      <div ref={ref} className="h-full py-2">
                        <Card
                          className={`h-full group hover:border-primary/50 transition-all duration-700 card-glow-hover bg-card/50 backdrop-blur-sm ${
                            isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
                          }`}
                          style={{ animationDelay: `${(index % 3) * 100}ms` }}
                        >
                          <CardHeader>
                            <div className={`w-12 h-12 rounded-lg bg-background flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${service.color}`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <CardTitle className="text-xl">{service.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="text-base leading-relaxed">
                              {service.description}
                            </CardDescription>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
