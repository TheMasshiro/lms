import { useContext } from "react";
import CallToAction from "../../components/learner/CallToAction";
import Footer from "../../components/learner/Footer";
import Hero from "../../components/learner/hero";
import InfoSection from "../../components/learner/InfoSection";
import { AppContext } from "../../context/AppContext";
import { useUser } from "@clerk/clerk-react";
import StudentHome from "./home/student";
import EducatorHome from "../instructor/home/educator";

const Home = () => {
  const { isStudent, isEducator } = useContext(AppContext);
  const { user } = useUser();

  if (user) {
    if (isEducator) {
      return (
        <EducatorHome />
      );
    } else if (isStudent) {
      return (
        <StudentHome />
      );
    }
  }

  return (
    <div className="flex flex-col items-center space-y-7 text-center">
      <Hero />
      <InfoSection />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Home;