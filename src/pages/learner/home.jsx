import React from 'react';
import Footer from '../../components/learner/Footer';
import Hero from '../../components/learner/Hero';
import CourseSection from '../../components/learner/courseSection';
import CallToAction from '../../components/learner/CallToAction';
{/*import TeamSection from '../../components/learner/teamSection';*/}

const Home = () => {
  return (
    <div className="flex flex-col items-center space-y-7 text-center">
      <Hero />
      <CourseSection />
      {/*<TeamSection />*/}
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Home;