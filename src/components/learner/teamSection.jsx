import React from 'react';
import { dummyTestimonial } from '../../assets/assets';


const TeamSection = () => {
  return (
    <div className='pb-20 px-6 md:px-0 text-center bg-white'>

      <section className="bg-gradient-to-b from-white to-gray-50 py-20 px-6 md:px-12 text-center rounded-xl shadow-sm">
        {/* About Us */}
        <h2 className="text-4xl font-extrabold text-gray-800 mb-4">About Learnify</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Learnify is an interactive e-learning platform designed for aspiring developers and tech enthusiasts.
          We combine bite-sized lessons with real-time coding challenges to make learning fun and effective.
        </p>

        {/* Divider */}
        <div className="h-1 w-20 bg-cyan-600 mx-auto my-10 rounded-full" />

        {/* Mission Section */}
        <div className="max-w-4xl mx-auto text-left">
          <h3 className="text-3xl font-semibold text-cyan-600 mb-2">Our Mission</h3>
          <p className="text-gray-700 mb-6">
            To provide accessible, hands-on learning that helps you build real-world coding skills and
            become confident in your tech journey.
          </p>

          {/* Core Values */}
          <h3 className="text-3xl font-semibold text-cyan-600 mb-4">Core Values</h3>
          <ul className="space-y-4 text-gray-700 list-disc list-inside">
            <li><strong>Accessibility:</strong> Everyone deserves to learn, regardless of background.</li>
            <li><strong>Practice-Based:</strong> We believe in learning by doing, not just watching.</li>
            <li><strong>Community:</strong> We grow better when we grow together.</li>
            <li><strong>Progress:</strong> We focus on continuous learning and improvement.</li>
          </ul>
        </div>

        {/* How It Works */}
        <div className="mt-16">
          <h3 className="text-3xl font-semibold text-cyan-600 mb-6">How It Works</h3>
          <div className="grid md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto text-gray-700">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h4 className="font-bold mb-2">📺 Watch</h4>
              <p>Learn through fun and engaging videos that explain tech concepts step-by-step.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h4 className="font-bold mb-2">💻 Code</h4>
              <p>Practice coding with our built-in compiler — no installations needed.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h4 className="font-bold mb-2">🧠 Quiz</h4>
              <p>Test your knowledge after lessons with quizzes to help retain what you’ve learned.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h4 className="font-bold mb-2">📊 Progress</h4>
              <p>Track your progress, improve over time, and get closer to your goals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16 px-6 md:px-12 mt-12 rounded-xl shadow-md">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center">How the Platform Works</h2>
        <p className="mt-4 text-gray-600 text-base md:text-lg max-w-3xl mx-auto text-center leading-relaxed">
          Our e-learning platform is built to help you learn by doing:
        </p>
        <div className="mt-10 space-y-6 max-w-2xl mx-auto text-gray-700 text-left md:text-base">
          <div>
            <span className="font-semibold text-cyan-600">📺 Watch Lessons:</span> Learn coding and tech skills with easy-to-follow video tutorials.
          </div>
          <div>
            <span className="font-semibold text-cyan-600">💻 Practice in the Compiler:</span> Type and test your code directly inside our browser-based compiler. No need to download or install anything!
          </div>
          <div>
            <span className="font-semibold text-cyan-600">🧠 Take Quizzes:</span> After each module, check your knowledge with short quizzes to help reinforce what you’ve learned.
          </div>
          <div>
            <span className="font-semibold text-cyan-600">📊 Track Progress:</span> Monitor your improvements and achievements as you go.
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="mt-24 text-center bg-gray-50 py-20 px-6 md:px-12 rounded-xl shadow-inner">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-4">Meet Our Team</h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Get to know the passionate people behind Learnify — dedicated to helping you grow every step of the way.
        </p>

        <div className="flex flex-col items-center gap-12 max-w-7xl mx-auto">
          {/* First Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {dummyTestimonial.slice(0, 3).map((testimonial, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl shadow-md p-6 text-left transition duration-300 hover:shadow-xl"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    className="h-14 w-14 rounded-full border-2 "
                    src={testimonial.image}
                    alt={testimonial.name}
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{testimonial.name}</h3>
                    <p className="text-cyan-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{testimonial.feedback}</p>
              </div>
            ))}
          </div>

          {/* Second Row */}
          <div className="flex flex-col md:flex-row justify-center gap-10">
            {dummyTestimonial.slice(3, 5).map((testimonial, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl shadow-md p-6 text-left transition duration-300 hover:shadow-xl w-full md:w-[350px]"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    className="h-14 w-14 rounded-full border-2 "
                    src={testimonial.image}
                    alt={testimonial.name}
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{testimonial.name}</h3>
                    <p className="text-cyan-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{testimonial.feedback}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};


export default TeamSection;
