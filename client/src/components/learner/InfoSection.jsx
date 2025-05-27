import { FaCheckCircle } from "react-icons/fa";

const InfoSection = () => {
  return (
    <div className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-8 sm:gap-10 md:gap-12">
        <div className="max-w-xl w-full text-center md:text-left">
          <h2 className="uppercase text-gray-400 text-xs sm:text-sm font-semibold mb-2">
            What is Learnify?
          </h2>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight sm:leading-snug">
            An{" "}
            <span className="bg-blue-200 text-blue-600 px-1 sm:px-2">
              innovative
            </span>{" "}
            <br className="hidden sm:block" />
            <span className="bg-blue-200 text-blue-600 px-1 sm:px-2">
              learning platform
            </span>{" "}
            <br />
            for programming education.
          </h1>
        </div>

        <ul className="space-y-3 sm:space-y-4 md:space-y-5 text-sm sm:text-base md:text-lg text-gray-700 w-full md:max-w-md lg:max-w-lg">
          {[
            "Personalized learning paths tailored to your goals",
            "Expert instructors and mentors to guide you",
            "Access to a wide range of programming languages and technologies",
            "Real-world applications and case studies for practical learning",
            "Flexible learning schedule to fit your lifestyle",
          ].map((feature, index) => (
            <li
              key={index}
              className="flex items-start justify-center md:justify-start gap-2 sm:gap-3"
            >
              <FaCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mt-1 text-blue-500 flex-shrink-0" />
              <span className="text-center md:text-left">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InfoSection;