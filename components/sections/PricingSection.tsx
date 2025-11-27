import React, { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Check } from "lucide-react";
import { useScrollAnimation } from "../../hooks/use-scroll-animation";

const pricingTiers = [
  {
    name: "Starter",
    description: "Perfect for small projects and testing",
    monthlyPrice: 499,
    annualPrice: 4990,
    features: [
      "1 Automation Workflow",
      "Basic AI Integration",
      "Email Support",
      "Cloud Database Setup",
      "Up to 1,000 Tasks/Month",
    ],
    highlighted: false,
  },
  {
    name: "Professional",
    description: "Ideal for growing businesses",
    monthlyPrice: 1499,
    annualPrice: 14990,
    features: [
      "5 Automation Workflows",
      "Advanced AI Features",
      "Priority Support",
      "Custom Database Design",
      "Up to 10,000 Tasks/Month",
      "API Integrations",
      "Monthly Consulting Call",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    description: "For large-scale operations",
    monthlyPrice: 3999,
    annualPrice: 39990,
    features: [
      "Unlimited Workflows",
      "Full AI Suite Access",
      "24/7 Dedicated Support",
      "Enterprise Database Solutions",
      "Unlimited Tasks",
      "Custom Integrations",
      "Weekly Strategy Sessions",
      "White-Label Options",
    ],
    highlighted: false,
  },
];

const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Header Section */}
          <div 
            ref={headerRef}
            className={`text-center space-y-4 transition-all duration-700 ${
              headerVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="inline-block mb-2">
              <Badge variant="outline" className="border-primary/50 text-primary px-4 py-1">
                FLEXIBLE PRICING
              </Badge>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold">
              Choose Your <span className="text-primary">Perfect Plan</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Scale your automation needs with transparent pricing. No hidden fees.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 pt-6">
              <span className={`text-sm font-medium transition-colors ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  isAnnual ? 'bg-primary' : 'bg-input'
                }`}
                role="switch"
                aria-checked={isAnnual}
              >
                <span
                  className={`${
                    isAnnual ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200`}
                />
              </button>
              <span className={`text-sm font-medium transition-colors ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
                Annual <span className="text-primary text-xs ml-1 font-bold">(Save 20%)</span>
              </span>
            </div>
          </div>

          {/* Pricing cards */}
          <div className="grid md:grid-cols-3 gap-8 pt-4">
            {pricingTiers.map((tier, index) => {
              const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
              const price = isAnnual ? Math.floor(tier.annualPrice / 12) : tier.monthlyPrice;
              
              return (
                <div
                  key={index}
                  ref={ref}
                  className={`relative p-8 rounded-2xl border transition-all duration-700 flex flex-col ${
                    tier.highlighted
                      ? 'bg-card border-primary shadow-lg shadow-primary/20 scale-105 z-10'
                      : 'bg-card/50 border-border hover:border-primary/50'
                  } ${isVisible ? 'animate-scale-up' : 'opacity-0 scale-95'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                {tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className="space-y-6 flex-1">
                  {/* Tier name */}
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {tier.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">
                      ${price}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  {isAnnual && (
                     <p className="text-xs text-primary font-medium">Billed ${tier.annualPrice} yearly</p>
                  )}

                  {/* Features */}
                  <ul className="space-y-3 pt-6">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <Button
                  className={`w-full mt-8 ${
                    tier.highlighted
                      ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80 text-foreground border border-border'
                  }`}
                  size="lg"
                >
                  Get Started
                </Button>
              </div>
              );
            })}
          </div>

          {/* Footer note */}
          <p className="text-center text-sm text-muted-foreground pt-8">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;