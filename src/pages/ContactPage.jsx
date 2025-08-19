import React from 'react';
import Footer from '../components/Footer';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-6">Get in Touch</h1>
        <p className="text-xl text-gray-600 mb-12">Have questions? We'd love to hear from you.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-lg font-semibold mb-2">Email</h3>
            <p className="text-gray-600">support@jobseeker.com</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Phone</h3>
            <p className="text-gray-600">+1 (555) 123-4567</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Address</h3>
            <p className="text-gray-600">123 Tech Street, Silicon Valley, CA 94025</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
