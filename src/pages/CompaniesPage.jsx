import React from 'react';

const CompaniesPage = () => {
  const companies = ['Google', 'Microsoft', 'Apple', 'Amazon', 'Facebook', 'Netflix', 'Tesla', 'Uber'];
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-8">Trusted by Top Companies</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {companies.map(c => <div key={c} className="text-2xl font-semibold text-gray-600">{c}</div>)}
        </div>
      </div>
    </div>
  );
};

export default CompaniesPage;
