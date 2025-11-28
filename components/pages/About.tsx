import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AboutSection from '../sections/AboutSection';
import ServicesSection from '../sections/ServicesSection';
import PortfolioSection from '../sections/PortfolioSection';
import ContactFooter from '../sections/ContactFooter';
import FAQSection from '../sections/FAQSection';
import TestimonialsSection from '../sections/Testimonials';
import SubmitReviewSection from '../sections/SubmitReviewSection';
import Footer from '../sections/Footer';

const About = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <>
      <AboutSection />
      <ServicesSection />
      <PortfolioSection />
      <FAQSection />
      <TestimonialsSection />
      <SubmitReviewSection />
      <ContactFooter />
      <Footer />
    </>
  );
};

export default About;