import React from 'react';
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Mail, MapPin, Phone, Send } from "lucide-react";

const ContactFooter = () => {
  return (
    <section id="contact" className="py-24 relative bg-background border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-primary/50 text-primary">GET IN TOUCH</Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Let's Build Something <span className="text-primary">Together</span></h2>
          <p className="text-muted-foreground">Have a project in mind? Let's discuss how AI and automation can transform your business.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="space-y-8">
             <div className="glass-card p-8 rounded-2xl">
                <h3 className="text-xl font-bold mb-6">Contact Information</h3>
                <p className="text-sm text-muted-foreground mb-8">Reach out directly or fill out the form and I'll get back to you within 24 hours.</p>
                
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Mail size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Email</p>
                            <p className="text-sm text-muted-foreground">contact@mohisathinks.com</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                            <Phone size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Phone</p>
                            <p className="text-sm text-muted-foreground">+1 (234) 567-890</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Location</p>
                            <p className="text-sm text-muted-foreground">Available for remote projects worldwide</p>
                        </div>
                    </div>
                </div>
             </div>

             <div className="glass-card p-8 rounded-2xl">
                 <h3 className="text-xl font-bold mb-4">Business Hours</h3>
                 <div className="space-y-2 text-sm">
                     <div className="flex justify-between">
                         <span className="text-muted-foreground">Monday - Friday</span>
                         <span className="font-semibold">9:00 AM - 6:00 PM</span>
                     </div>
                     <div className="flex justify-between">
                         <span className="text-muted-foreground">Saturday</span>
                         <span className="font-semibold">10:00 AM - 4:00 PM</span>
                     </div>
                     <div className="flex justify-between">
                         <span className="text-muted-foreground">Sunday</span>
                         <span className="font-semibold text-primary">Closed</span>
                     </div>
                 </div>
             </div>
          </div>

          <form className="glass-card p-8 rounded-2xl space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">First Name *</label>
                    <input type="text" className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name *</label>
                    <input type="text" className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Email *</label>
                <input type="email" className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number (Optional)</label>
                <input type="tel" className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Subject *</label>
                <select className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all">
                    <option>General Inquiry</option>
                    <option>Project Proposal</option>
                    <option>Consultation</option>
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Your Message *</label>
                <textarea rows={5} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"></textarea>
            </div>
            <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-white font-semibold">
                Send Message <Send className="w-4 h-4 ml-2" />
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-4">By submitting this form, you agree to our privacy policy.</p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactFooter;
