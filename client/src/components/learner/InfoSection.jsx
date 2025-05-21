import { FaCheckCircle } from "react-icons/fa";

const InfoSection = () => {
  return (
    <div className="py-20 px-6 md:px-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-12">
        {/* Left Side: Headline */}
        <div className="max-w-xl">
          <h2 className="uppercase text-gray-400 text-sm font-semibold mb-2">
            What is Learnify?
          </h2>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-snug">
            An <span className="bg-blue-200 text-blue-600 px-2">innovative</span>{" "}
            <br />
            <span className="bg-blue-200 text-blue-600 px-2">learning platform</span> <br />
            for programming education.
          </h1>
        </div>

        {/* Right Side: Feature List */}
        <ul className="space-y-5 text-lg text-gray-700">
          {[
            "Personalized learning paths tailored to your goals",
            "Expert instructors and mentors to guide you",
            "Access to a wide range of programming languages and technologies",
            "Real-world applications and case studies for practical learning",
            "Flexible learning schedule to fit your lifestyle",
          ].map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <FaCheckCircle className="w-6 h-6 mt-1 text-blue-500 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InfoSection;