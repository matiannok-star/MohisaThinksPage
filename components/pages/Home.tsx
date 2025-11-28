import React from 'react';
import HeroSection from '../sections/HeroSection';
import FeaturesGrid from '../sections/FeaturesGrid';
import TechStackSection from '../sections/TechStackSection';
import PricingSection from '../sections/PricingSection';
import InteractiveSection from '../sections/InteractiveSection';
import Footer from '../sections/Footer';

const Home = () => {
  return (
    <>
      <HeroSection />
      <FeaturesGrid />
      <TechStackSection />
      <PricingSection />
      <InteractiveSection />
      <Footer />
    </>
  );
};

export default Home;
