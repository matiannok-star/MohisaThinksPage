import React from 'react';
import HeroSection from '../sections/HeroSection';
import AboutSection from '../sections/AboutSection';
import FeaturesGrid from '../sections/FeaturesGrid';
import ServicesSection from '../sections/ServicesSection';
import PortfolioSection from '../sections/PortfolioSection';
import Testimonials from '../sections/Testimonials';
import PricingSection from '../sections/PricingSection';
import ContactFooter from '../sections/ContactFooter';
import InteractiveSection from '../sections/InteractiveSection';
import FAQSection from '../sections/FAQSection';
import Footer from '../sections/Footer';

const LandingPage = () => {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <FeaturesGrid />
      <InteractiveSection />
      <ServicesSection />
      <PortfolioSection />
      <Testimonials />
      <PricingSection />
      <FAQSection />
      <ContactFooter />
      <Footer />
    </>
  );
};

export default LandingPage;