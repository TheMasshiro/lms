import React from "react";

const Privacy = () => {
  return (
    <section className="bg-white py-16 px-6 md:px-12 text-center">
      {/* Main Heading */}
      <h2 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">
        Privacy Policy
      </h2>
      <p className="text-lg text-gray-700 mb-10 max-w-3xl mx-auto">
        Your privacy is important to us. Learn how we protect your data and what
        information we collect.
      </p>

      {/* Main Content with Sections */}
      <div className="max-w-4xl mx-auto text-left text-gray-700 space-y-10">
        {/* Section: What Information We Collect */}
        <div className="relative bg-gray-50 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-400 opacity-30 rounded-2xl"></div>
          <h3 className="text-2xl font-semibold text-gray-800 z-10 relative mb-4">
            What Information We Collect
          </h3>
          <p className="text-gray-600 z-10 relative">
            We collect personal information such as your name, email address,
            and other details when you sign up or use our platform. This data
            allows us to offer personalized experiences and improve our
            services.
          </p>
          <ul className="text-gray-600 z-10 relative list-disc pl-6">
            <li>Your name and contact details</li>
            <li>Payment information (if applicable)</li>
            <li>Device information and browser usage data</li>
            <li>
              Interaction with the platform (pages visited, actions performed)
            </li>
          </ul>
        </div>

        {/* Section: How We Use Your Information */}
        <div className="relative bg-gray-50 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-400 opacity-30 rounded-2xl"></div>
          <h3 className="text-2xl font-semibold text-gray-800 z-10 relative mb-4">
            How We Use Your Information
          </h3>
          <p className="text-gray-600 z-10 relative">
            We use your data to enhance your learning experience, improve
            recommendations, and keep you informed with platform updates. By
            understanding your preferences, we can deliver a more customized and
            engaging service.
          </p>
          <ul className="text-gray-600 z-10 relative list-disc pl-6">
            <li>Personalizing recommendations based on your activity</li>
            <li>
              Sending platform updates, newsletters, and marketing
              communications (with your consent)
            </li>
            <li>Improving overall platform performance and user experience</li>
            <li>Providing customer support and resolving issues</li>
          </ul>
        </div>

        {/* Section: How We Protect Your Information */}
        <div className="relative bg-gray-50 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-400 opacity-30 rounded-2xl"></div>
          <h3 className="text-2xl font-semibold text-gray-800 z-10 relative mb-4">
            How We Protect Your Information
          </h3>
          <p className="text-gray-600 z-10 relative">
            We prioritize the security of your data. Our platform uses
            industry-standard encryption and secure protocols to protect your
            information from unauthorized access. We continuously review our
            security practices to stay ahead of potential risks.
          </p>
          <ul className="text-gray-600 z-10 relative list-disc pl-6">
            <li>Data encryption both in transit and at rest</li>
            <li>Secure access controls to limit data exposure</li>
            <li>Regular security audits and vulnerability testing</li>
            <li>
              Partnerships with trusted third-party providers for security
              enhancements
            </li>
          </ul>
        </div>

        {/* Section: Third-Party Services */}
        <div className="relative bg-gray-50 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-pink-400 opacity-30 rounded-2xl"></div>
          <h3 className="text-2xl font-semibold text-gray-800 z-10 relative mb-4">
            Third-Party Services
          </h3>
          <p className="text-gray-600 z-10 relative">
            We may share your data with third-party service providers who assist
            in the operation of our platform. However, these parties are
            strictly bound by our privacy policy and are committed to protecting
            your information.
          </p>
          <ul className="text-gray-600 z-10 relative list-disc pl-6">
            <li>Payment processors for transaction completion</li>
            <li>Analytics services to understand platform usage</li>
            <li>Email service providers for newsletters and updates</li>
            <li>Cloud storage services to securely store your data</li>
          </ul>
        </div>

        {/* Learn More Link */}
        <div className="mt-16">
          <a
            href="#learn-more"
            className="inline-block text-indigo-600 font-semibold text-lg hover:text-indigo-800 hover:underline transform transition duration-500 ease-in-out"
          >
            Learn More
          </a>
        </div>
      </div>

      {/* Detailed Information Section */}
      <div
        id="learn-more"
        className="mt-24 max-w-4xl mx-auto text-left text-gray-700"
      >
        <h3 className="text-3xl font-semibold text-gray-800 mb-6">
          Detailed Information
        </h3>
        <p className="text-gray-600 mb-6">
          For more detailed information, you can review our full privacy policy
          and data protection practices below.
        </p>

        {/* Add more detailed privacy policy content here */}
        <p className="text-gray-600 mb-6">
          We are committed to your privacy and ensure your data will always be
          handled with the utmost care and confidentiality. We encourage you to
          review this policy periodically, as it may be updated to reflect
          changes in our services or legal requirements.
        </p>

        {/* Separator for Sections */}
        <hr className="my-12 border-t-2 border-gray-300" />

        {/* Changes to Privacy Policy */}
        <h4 className="text-xl font-medium text-gray-800 mb-2 hover:text-indigo-600 transition duration-300">
          Changes to Our Privacy Policy
        </h4>
        <p className="text-gray-600 mb-6">
          We regularly review and update our Privacy Policy to ensure compliance
          with new regulations and the evolving needs of our users. Last updated
          on April 09, 2025. Any significant changes will be communicated via
          email or on this page.
        </p>

        {/* Contact */}
        <h4 className="text-xl font-medium text-gray-800 mb-2 hover:text-indigo-600 transition duration-300">
          How to Contact Us
        </h4>
        <p className="text-gray-600 mb-6">
          If you have any questions or concerns regarding this policy or wish to
          exercise your data rights, feel free to contact us at{" "}
          <a
            href="mailto:dpo@codechum.com"
            className="text-indigo-600 hover:underline transition duration-300"
          >
            learnify2025@gmail.com
          </a>
          .
        </p>
      </div>
    </section>
  );
};

export default Privacy;
