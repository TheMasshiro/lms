import React from "react";
import Footer from "../../components/learner/Footer";
import TeamSection from "../../components/learner/teamSection";

const About = () => {
  return (
    <div className="flex flex-col items-center space-y-7 text-center">
      <TeamSection />
      <Footer />
    </div>
  );
};

export default About;
