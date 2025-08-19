import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p>© {new Date().getFullYear()} JobSeeker. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
