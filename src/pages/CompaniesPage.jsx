import React from "react";

const CompaniesPage = () => {
  const companies = [
    {
      name: "Google",
      logo: "https://logo.clearbit.com/google.com",
      industry: "Technology · Search Engine",
    },
    {
      name: "Microsoft",
      logo: "https://logo.clearbit.com/microsoft.com",
      industry: "Technology · Software & Cloud",
    },
    {
      name: "Apple",
      logo: "https://logo.clearbit.com/apple.com",
      industry: "Consumer Electronics",
    },
    {
      name: "Amazon",
      logo: "https://logo.clearbit.com/amazon.com",
      industry: "E-commerce · Cloud Computing",
    },
    {
      name: "Meta (Facebook)",
      logo: "https://logo.clearbit.com/meta.com",
      industry: "Social Media · Metaverse",
    },
    {
      name: "Netflix",
      logo: "https://logo.clearbit.com/netflix.com",
      industry: "Entertainment · Streaming",
    },
    {
      name: "Tesla",
      logo: "https://logo.clearbit.com/tesla.com",
      industry: "Automotive · Clean Energy",
    },
    {
      name: "Uber",
      logo: "https://logo.clearbit.com/uber.com",
      industry: "Transportation · Mobility",
    },
    {
      name: "Airbnb",
      logo: "https://logo.clearbit.com/airbnb.com",
      industry: "Travel · Hospitality",
    },
    {
      name: "Spotify",
      logo: "https://logo.clearbit.com/spotify.com",
      industry: "Music Streaming",
    },
    {
      name: "Adobe",
      logo: "https://logo.clearbit.com/adobe.com",
      industry: "Software · Creative Tools",
    },
    {
      name: "Intel",
      logo: "https://logo.clearbit.com/intel.com",
      industry: "Semiconductors · Hardware",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-12">Trusted by Top Companies</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {companies.map((c) => (
            <div
              key={c.name}
              className="bg-gray-50 shadow-md rounded-xl p-6 flex flex-col items-center hover:shadow-lg transition"
            >
              <img
                src={c.logo}
                alt={c.name}
                className="w-16 h-16 object-contain mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800">{c.name}</h3>
              <p className="text-sm text-gray-500 mt-2">{c.industry}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompaniesPage;
