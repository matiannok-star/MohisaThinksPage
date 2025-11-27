import React from 'react';
import { useScrollAnimation } from "../../hooks/use-scroll-animation";
import { Badge } from "../ui/badge";
import { ExternalLink } from "lucide-react";
import { Project } from "../../types";

const projects: Project[] = [
  {
    id: '1',
    title: 'Enterprise Database Migration',
    category: 'Database Architecture',
    image: 'https://picsum.photos/600/400?random=1',
    tech: ['Supabase', 'PostgreSQL', 'React'],
    link: '#',
  },
  {
    id: '2',
    title: 'AI Workflow Automation Platform',
    category: 'Automation',
    image: 'https://picsum.photos/600/400?random=2',
    tech: ['n8n', 'OpenAI', 'Supabase'],
    link: '#',
  },
  {
    id: '3',
    title: 'SaaS Analytics Dashboard',
    category: 'Web Development',
    image: 'https://picsum.photos/600/400?random=3',
    tech: ['React', 'Supabase', 'Recharts'],
    link: '#',
  },
];

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <div 
      ref={ref}
      className={`group relative rounded-xl overflow-hidden aspect-video cursor-pointer transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
    >
      <img 
        src={project.image} 
        alt={project.title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
        <span className="text-primary text-sm font-medium mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{project.category}</span>
        <h3 className="text-xl font-bold mb-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{project.title}</h3>
        <div className="flex gap-2 flex-wrap mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
          {project.tech.map((t) => (
            <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
          ))}
        </div>
        <div className="flex items-center text-sm font-semibold text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-150">
          View Project <ExternalLink className="ml-2 w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

const PortfolioSection = () => {
  return (
    <section id="portfolio" className="py-24 relative bg-black/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Featured <span className="text-primary">Projects</span></h2>
          <p className="text-muted-foreground">Real-world solutions that demonstrate the power of automation and intelligent systems</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;