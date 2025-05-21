import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaPaperPlane } from 'react-icons/fa';

const Contact = () => {
  return (
    <section className="bg-white py-16 px-6 md:px-12 text-center">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">
        Contact Us
      </h2>
      <p className="text-lg text-gray-700 mb-10 max-w-3xl mx-auto">
        We’d love to hear from you! Whether you have a question about features,
        pricing, need a demo, or anything else — our team is ready to answer all
        your questions.
      </p>

      <div className="max-w-4xl mx-auto text-left text-gray-700 space-y-10">
        {/* Contact Information */}
        <div className="bg-gray-50 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 transform hover:scale-105">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Reach Us At
          </h3>
          <ul className="space-y-4 text-gray-600">
            <li className="flex items-center">
              <FaMapMarkerAlt className="text-indigo-600 mr-3 h-5 w-5 flex-shrink-0" />
              <span>
                <strong>Address:</strong> 01 Upper Kalaklan, Olongapo City
              </span>
            </li>
            <li className="flex items-center">
              <FaPhone className="text-indigo-600 mr-3 h-5 w-5 flex-shrink-0" />
              <span>
                <strong>Phone:</strong>{" "}
                <a
                  href="tel:+639955068344"
                  className="text-blue-600 hover:underline"
                >
                  +63 995 506 8344
                </a>
              </span>
            </li>
            <li className="flex items-center">
              <FaEnvelope className="text-indigo-600 mr-3 h-5 w-5 flex-shrink-0" />
              <span>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:learnify2025@gmail.com"
                  className="text-blue-600 hover:underline"
                >
                  learnify2025@gmail.com
                </a>
              </span>
            </li>
          </ul>
        </div>

        {/* Contact Form */}
        <div className="bg-gray-50 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 transform hover:scale-105">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Send Us a Message
          </h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                rows="5"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition transform hover:scale-105 flex items-center justify-center"
            >
              <FaPaperPlane className="mr-2 h-4 w-4" />
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
