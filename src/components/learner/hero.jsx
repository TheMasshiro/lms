import { assets } from "../../assets/assets";


const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full md:pt-30 pt-20 px-7 md:px-0 space-y-7 text-center bg-gradient-to-b from-cyan-100/70">
      <h1 className="md:text-home-heading-large text-home-heading-small relative font-bold text-gray-800 max-w-3xl mx-auto">
        "Unlock your potential with courses designed{" "}
        <span className="text-blue-600">just for you."</span>
        <img
          src={assets.sketch}
          alt="sketch"
          className="md:block hidden absolute -bottom-7 right-0"
        />
      </h1>

      <p className="md:block hidden text-gray-500 max-w-2xl mx-auto">
        Learnify is built to bridge the gap between learners and educators,
        whether you're looking to gain new skills or share your expertise.
      </p>
      <p className="md:hidden text-gray-500 max-w-sm mx-auto">
        Learnify empowers you to grow and succeed in a supportive and
        interactive learning environment.
      </p>
    </div>
  );
};

export default Hero;
