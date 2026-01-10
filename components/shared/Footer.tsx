import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white py-4 px-6 border-t lg:ml-52 border-gray-300">
      <div className="lg:max-w-6xl xl:max-w-5xl mx-auto text-center flex items-center justify-center w-full">
        <p className="lg:text-sm text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Lumina. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
