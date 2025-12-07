import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white py-4 px-6 border-t border-gray-300">
      <div className="lg:max-w-6xl xl:max-w-5xl mx-auto flex items-center justify-center w-full">
        <p className="lg:text-sm text-xs text-gray-500">
          &copy; {new Date().getFullYear()} SimplyLearn.it. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
