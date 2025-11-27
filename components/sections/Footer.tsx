import React from "react";
import { Github, Linkedin, Mail, Youtube } from "lucide-react";
import { Button } from "../ui/button";

const Footer = () => {
  const socialLinks = [
    { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
    { icon: Github, label: "GitHub", href: "https://github.com" },
    { icon: Youtube, label: "YouTube", href: "https://youtube.com" },
  ];

  return (
    <footer id="footer" className="py-12 border-t border-border bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Main footer content */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Brand and description */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">MT</span>
                </div>
                <span className="text-xl font-bold">Mohisa Thinks</span>
              </div>
              <p className="text-muted-foreground max-w-md">
                Turning ideas into smart automated systems through AI, automation, and cloud technologies.
              </p>
            </div>

            {/* Contact and social */}
            <div className="space-y-4 md:text-right">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  Get In Touch
                </h3>
                <a
                  href="mailto:hello@mohisathinks.com"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors md:justify-end group"
                >
                  <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  hello@mohisathinks.com
                </a>
              </div>

              {/* Social links */}
              <div className="flex gap-3 md:justify-end">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <Button
                      key={social.label}
                      variant="outline"
                      size="icon"
                      asChild
                      className="hover:border-primary/50 hover:text-primary transition-all hover:scale-110"
                    >
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Mohisa Thinks. All rights reserved.</p>
            <p>Built with AI, automation, and passion for innovation.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
