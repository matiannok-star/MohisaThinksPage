import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useScrollAnimation } from "../../hooks/use-scroll-animation";

const faqs = [
  {
    question: "What services do you offer?",
    answer: "I specialize in AI workflow automation, cloud database solutions, AI-assisted web & app development, data analytics & visualization, and custom SaaS MVP development. Whether you need to migrate from MS Access to the cloud or build an AI-powered chatbot, I can help transform your ideas into functional solutions.",
  },
  {
    question: "How long does a typical project take?",
    answer: "Project timelines vary based on complexity. Simple automation workflows can be completed in 1-2 weeks, while custom AI integrations or full SaaS applications typically take 4-8 weeks. During our initial consultation, I'll provide a detailed timeline based on your specific requirements.",
  },
  {
    question: "Do I need technical knowledge to work with you?",
    answer: "Not at all! I specialize in translating business requirements into technical solutions. You bring your ideas and business goals, and I'll handle all the technical implementation. I'll keep you informed throughout the process with clear, non-technical updates.",
  },
  {
    question: "What's included in the pricing?",
    answer: "All plans include initial consultation, solution design, development, testing, deployment, and documentation. Professional and Enterprise plans also include ongoing support, monthly consulting calls, and priority assistance. No hidden fees—everything is transparent from the start.",
  },
  {
    question: "Can you integrate with my existing systems?",
    answer: "Yes! I have extensive experience integrating new AI and automation solutions with existing systems including MS Access, Supabase, various APIs, CRMs, and cloud platforms. I'll ensure seamless integration without disrupting your current operations.",
  },
  {
    question: "What AI platforms do you work with?",
    answer: "I work with leading AI platforms including OpenAI (GPT-4, ChatGPT), Claude, Google AI, and various specialized AI APIs. For automation, I use tools like n8n, Zapier, Make, and custom solutions. The choice depends on your specific needs and budget.",
  },
  {
    question: "Do you provide ongoing support and maintenance?",
    answer: "Yes! Professional and Enterprise plans include ongoing support. For Starter plan projects, support and maintenance can be added separately. I offer monthly retainers for continuous improvements, bug fixes, and feature additions.",
  },
  {
    question: "How do you ensure data security and privacy?",
    answer: "Security is a top priority. I implement industry-standard encryption, secure authentication, role-based access control, and follow best practices for data protection. All cloud databases are configured with proper security policies, and I can work within your compliance requirements (GDPR, HIPAA, etc.).",
  },
  {
    question: "Can you help migrate my MS Access database to the cloud?",
    answer: "Absolutely! MS Access to cloud migration is one of my specialties. I'll analyze your current database, design an optimized cloud structure, migrate your data safely, and ensure your team can easily adopt the new system with proper training and documentation.",
  },
  {
    question: "What if I'm not satisfied with the results?",
    answer: "Client satisfaction is my priority. All plans include a 14-day free trial period where we can refine the solution to meet your expectations. I work iteratively with regular check-ins to ensure the final product aligns with your vision before full deployment.",
  },
];

const FAQItem: React.FC<{ faq: typeof faqs[0], index: number }> = ({ faq, index }) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  
  return (
    <AccordionItem
      ref={ref}
      value={`item-${index}`}
      className={`bg-card border border-border rounded-xl px-6 hover:border-primary/50 transition-all duration-700 ${
        isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-4'
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <AccordionTrigger className="text-left hover:no-underline py-6">
        <span className="font-semibold text-base">{faq.question}</span>
      </AccordionTrigger>
      <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
        {faq.answer}
      </AccordionContent>
    </AccordionItem>
  );
};

const FAQSection = () => {
  const [showAll, setShowAll] = useState(false);
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();

  const displayedFaqs = showAll ? faqs : faqs.slice(0, 3);

  return (
    <section id="faq" className="py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/20 via-background to-muted/20" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Header Section */}
          <div 
            ref={headerRef}
            className={`text-center space-y-4 transition-all duration-700 ${
              headerVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="inline-block mb-2">
              <Badge variant="outline" className="border-primary/50 text-primary px-4 py-1">
                FREQUENTLY ASKED QUESTIONS
              </Badge>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold">
              Got <span className="text-primary">Questions?</span>
            </h2>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-8">
            <Accordion type="single" collapsible className="space-y-4">
              {displayedFaqs.map((faq, index) => (
                <FAQItem key={index} faq={faq} index={index} />
              ))}
            </Accordion>
            
            <div className="flex justify-center">
                <Button 
                    variant="outline" 
                    onClick={() => setShowAll(!showAll)}
                    className="gap-2 min-w-[140px]"
                >
                    {showAll ? (
                        <>Show Less <ChevronUp className="w-4 h-4" /></>
                    ) : (
                        <>Show More <ChevronDown className="w-4 h-4" /></>
                    )}
                </Button>
            </div>
          </div>

          {/* Footer Link */}
          <div className="text-center pt-8 animate-fade-in">
             <p className="text-muted-foreground">
                Still have questions? <a href="#contact" className="text-primary hover:text-primary/80 font-semibold hover:underline transition-colors">Get in touch</a>
             </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FAQSection;