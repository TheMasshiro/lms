import React from 'react';
import Footer from '../../components/learner/Footer';
import Privacy from '../../pages/learner/privacy';


const About = () => {
  return (
    <div className="flex flex-col items-center space-y-7 text-center">
 
      <Privacy />
      <Footer />
    </div>
  );
};

export default About;