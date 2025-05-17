import React from "react";

const About = () => (
  <div className="w-full max-w-md flex flex-col justify-center bg-white/90 rounded-2xl p-6 sm:p-8 md:p-10">
    <h3 className="text-2xl sm:text-3xl font-bold mt-0 mb-4 text-left">
      🚀 Start your free trial today
    </h3>
    <p className="mb-6 text-gray-700 text-left text-sm sm:text-base">
      No credit card required. Instantly explore the power of smart job recommendations.
    </p>
    <div className="mb-6 flex items-start gap-2">
      <span className="text-green-600 text-lg mt-1">✔</span>
      <div>
        <h4 className="font-semibold mb-1 text-lg text-left">Upload your CV</h4>
        <p className="text-gray-600 text-left text-sm sm:text-base">
          Our AI analyzes your skills and experience in seconds.
        </p>
      </div>
    </div>
    <div className="flex items-start gap-2">
      <span className="text-green-600 text-lg mt-1">✔</span>
      <div>
        <h4 className="font-semibold mb-2 text-left text-base sm:text-lg">Get personalized job matches</h4>
        <p className="text-gray-600 text-sm sm:text-base">
          Receive top job recommendations tailored to your profile.
        </p>
      </div>
    </div>
  </div>
);

export default About;