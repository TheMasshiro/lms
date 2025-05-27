import { assets } from "../../assets/assets";


const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full pt-16 sm:pt-20 md:pt-24 lg:pt-30 px-4 sm:px-6 md:px-8 lg:px-0 space-y-4 sm:space-y-6 md:space-y-7 text-center bg-gradient-to-b from-cyan-100/70">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-home-heading-large relative font-bold text-gray-800 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto leading-tight">
        "Unlock your potential with courses designed{" "}
        <span className="text-blue-600">just for you."</span>
        <img
          src={assets.sketch}
          alt="sketch"
          className="hidden lg:block absolute -bottom-7 right-0"
        />
      </h1>

      <p className="hidden md:block text-sm md:text-base text-gray-500 max-w-md md:max-w-xl lg:max-w-2xl mx-auto px-2">
        Learnify is built to bridge the gap between learners and educators,
        whether you're looking to gain new skills or share your expertise.
      </p>
      <p className="block md:hidden text-sm text-gray-500 max-w-xs sm:max-w-sm mx-auto px-2 leading-relaxed">
        Learnify empowers you to grow and succeed in a supportive and
        interactive learning environment.
      </p>
    </div>
  );
};

export default Hero;
