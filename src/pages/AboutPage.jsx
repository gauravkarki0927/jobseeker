import React from 'react';
import { Search, Users, TrendingUp } from 'lucide-react';
import Footer from '../components/Footer';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-6">About JobSeeker</h1>
        <p className="text-xl text-gray-600 mb-12">
          We connect talented professionals with their dream careers and help companies find the perfect candidates.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Search className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Job Matching</h3>
            <p className="text-gray-600">AI-powered system matches you with jobs that fit your skills.</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Trusted Network</h3>
            <p className="text-gray-600">Join thousands of professionals and top-tier companies.</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Career Growth</h3>
            <p className="text-gray-600">Resources and opportunities to help you advance in your career.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
