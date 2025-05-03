import React from "react";
import Footer from "../../components/learner/Footer";
import Hero from "../../components/learner/hero";
import CourseSection from "../../components/learner/courseSection";
import CallToAction from "../../components/learner/CallToAction";

const Home = () => {
  return (
    <div className="flex flex-col items-center space-y-7 text-center">
      <Hero />
      <CourseSection />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Home;
