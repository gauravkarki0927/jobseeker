import React from 'react';
import { Search, Users, TrendingUp } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-20 mb-10 rounded-xl shadow-lg">
          <h1 className="text-4xl font-bold mb-6">About JobSeeker</h1>
          <p className="text-xl text-white mb-12 max-w-3xl mx-auto">
            JobSeeker connects talented professionals with meaningful careers
            and empowers companies to find the right candidates faster.
          </p>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Search className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Job Matching</h3>
            <p className="text-gray-600">
              Our platform uses AI to recommend jobs tailored to your skills and career goals.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Trusted Network</h3>
            <p className="text-gray-600">
              Thousands of professionals and top companies trust JobSeeker to connect them.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Career Growth</h3>
            <p className="text-gray-600">
              Access resources, mentorship, and opportunities to level up your career.
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 py-16">
        {/* Story */}
        <section className="mb-20">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-dark mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4">
                JobSeeker was founded in 2021 with a clear vision: to make the job-hunting process simple, transparent, and effective. 
                We realized that both job seekers and employers were struggling with outdated hiring systems.
              </p>
              <p className="text-gray-700 mb-4">
                Today, JobSeeker is one of the fastest-growing career platforms, helping thousands of professionals discover new opportunities 
                while enabling companies to find talent quickly and efficiently.
              </p>
              <p className="text-gray-700">
                Our goal is to empower professionals everywhere to build careers they love.
              </p>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="Team collaboration"
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="bg-blue-50 rounded-xl p-12 mb-20">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-dark mb-6">Our Mission</h2>
            <p className="text-xl text-gray-700 mb-8">
              "To bridge the gap between talent and opportunity by creating a smarter, faster, and fairer job marketplace."
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md w-full sm:w-64">
                <h3 className="font-bold text-dark mb-2">Accessibility</h3>
                <p className="text-gray-600">
                  We believe finding a job should be simple, transparent, and accessible for everyone.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md w-full sm:w-64">
                <h3 className="font-bold text-dark mb-2">Empowerment</h3>
                <p className="text-gray-600">
                  Our tools give professionals the confidence to showcase their skills and grow their careers.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md w-full sm:w-64">
                <h3 className="font-bold text-dark mb-2">Innovation</h3>
                <p className="text-gray-600">
                  We continuously evolve with technology to improve hiring experiences for both candidates and companies.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-dark mb-12 text-center">Meet Our Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1590086783191-a0694c7d1e6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                alt="CEO"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="font-bold text-xl text-dark mb-1">Sarah Johnson</h3>
                <p className="text-blue-600 font-medium mb-3">CEO & Co-Founder</p>
                <p className="text-gray-600">
                  Passionate about connecting people with opportunities, Sarah has 15+ years of experience in HR tech.
                </p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                alt="CTO"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="font-bold text-xl text-dark mb-1">David Kim</h3>
                <p className="text-blue-600 font-medium mb-3">Chief Technology Officer</p>
                <p className="text-gray-600">
                  Former lead engineer at a global recruitment platform, expert in AI-powered job matching.
                </p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                alt="Head of Partnerships"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="font-bold text-xl text-dark mb-1">Maria Lopez</h3>
                <p className="text-blue-600 font-medium mb-3">Head of Partnerships</p>
                <p className="text-gray-600">
                  Building strong connections with global companies to create more opportunities for our users.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Impact */}
        <section className="bg-gray-100 rounded-xl p-12 mb-20">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-yellow-400 mb-2">50k+</div>
              <div className="text-gray-900">Jobs Posted</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-yellow-400 mb-2">120k+</div>
              <div className="text-gray-900">Active Users</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-yellow-400 mb-2">8k+</div>
              <div className="text-gray-900">Companies</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-yellow-400 mb-2">95%</div>
              <div className="text-gray-900">Placement Success</div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-100 text-black rounded-xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Find Your Next Opportunity</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who found their dream jobs with JobSeeker.
          </p>
          <button className="bg-white text-blue-700 font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition duration-300 shadow-lg">
            <a href="/">Get Started</a>
          </button>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
