import React from 'react';
import Header from '../Header/Header.js';
import HeroSection from './HeroSection.js';
import FeaturesSection from './FeaturesSection.js';
import { useMatch  } from 'react-router-dom';
import CallToAction from './CallToAction.js';

function LandingPage() {
  const match = useMatch('/features');
  const renderSection = () => {
    if (match) {
      return <FeaturesSection />;
    }
    return <FeaturesSection />;
  };
  return (
    <div>
     <Header/>
      <div className="container my-5 mt-500 justify-content-center align-items-center d-flex">
        <HeroSection />
      </div>
      <div className="container my-5">
        {renderSection()}
      </div>
      <div className="container my-5">
        <CallToAction />
      </div>
    </div>
  );
}

export default LandingPage