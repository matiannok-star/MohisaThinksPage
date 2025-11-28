import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = (href: string, isHash: boolean) => {
    setIsMobileMenuOpen(false);
    
    if (!isHash) {
      navigate(href);
      window.scrollTo(0, 0);
      return;
    }

    if (href.includes("#")) {
      const [path, hash] = href.split("#");
      
      if (location.pathname === path || (path === '/' && location.pathname === '/')) {
        const element = document.getElementById(hash);
        element?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate(href);
      }
    }
  };

  const getNavConfig = () => {
    const path = location.pathname;

    if (path === '/about') {
      return {
        links: [
          { label: 'Services', href: '/about#services', isHash: true },
          { label: 'Portfolio', href: '/about#portfolio', isHash: true },
          { label: 'FAQs', href: '/about#faq', isHash: true },
          { label: 'Testimonials', href: '/about#testimonials', isHash: true },
          { label: 'Contact', href: '/about#contact', isHash: true },
        ],
        cta: {
          label: "Contact Us",
          href: "/about#contact"
        }
      };
    }

    return {
      links: [
        { label: 'Home', href: '/', isHash: false },
        { label: 'About', href: '/about', isHash: false },
        { label: 'Blog', href: '/blog', isHash: false },
      ],
      cta: {
        label: "Get Started",
        href: "/#pricing"
      }
    };
  };

  const navConfig = getNavConfig();

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? "bg-background/95 backdrop-blur-lg border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      {/* Header Container: z-[10001] ensures it is ALWAYS on top of the overlay (z-[9999]) */}
      <div className="container mx-auto px-4 relative z-[10001]">
        <div className="flex items-center justify-between h-16 md:h-20 relative">
          
          {/* 1. Hamburger/Close Button (Left on Mobile) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-foreground p-2 -ml-2 hover:bg-muted/50 rounded-md transition-colors relative z-50"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* 2. Logo (Center on Mobile, Left on Desktop) */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:static md:translate-x-0 md:translate-y-0"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center transition-all group-hover:scale-110 group-hover:border-primary/50">
              <span className="text-xl font-bold text-primary">MT</span>
            </div>
            <span className="text-lg font-bold hidden sm:block">Mohisa Thinks</span>
          </Link>

          {/* 3. Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navConfig.links.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href, link.isHash)}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group flex items-center gap-2"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </button>
            ))}
          </div>

          {/* 4. CTA Button (Right) */}
          <div className="flex items-center gap-2 md:gap-4">
            {navConfig.cta && (
              <Button
                onClick={() => handleNavClick(navConfig.cta!.href, true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold hidden sm:flex"
              >
                {navConfig.cta.label}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay: z-[9999] (High, but below Header z-[10001]) */}
      {/* Deploys from Left using 'animate-slide-in-left-full' */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-background z-[9999] overflow-y-auto animate-slide-in-left-full">
          <div className="container mx-auto px-4 pt-24 pb-8 flex flex-col gap-8 items-center">
            <div className="flex flex-col gap-4 w-full max-w-sm">
              {navConfig.links.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href, link.isHash)}
                  className="w-full text-center px-4 py-3 text-xl font-medium text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-lg transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
            {navConfig.cta && (
              <div className="w-full max-w-sm px-4">
                <Button
                  onClick={() => handleNavClick(navConfig.cta!.href, true)}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6 shadow-lg shadow-primary/20"
                >
                  {navConfig.cta.label}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
