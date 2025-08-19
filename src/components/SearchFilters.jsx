import React from 'react';
import { Filter } from 'lucide-react';

const SearchFilters = ({ filters, onFilterChange }) => {
  const handleFilterChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFilterChange({
      jobType: '',
      employmentType: '',
      seniorityLevel: '',
      location: '',
      isRemote: '',
      minSalary: '',
      maxSalary: ''
    });
  };

  const jobTypes = ['Developer', 'Designer', 'Marketing', 'Engineer', 'Architect', 'Manager'];
  const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance'];
  const seniorityLevels = ['Intern', 'Junior', 'Mid-Level', 'Senior'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filters
        </h3>
        <button 
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-6">
        {/* Job Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Job Type</label>
          <select
            value={filters.jobType}
            onChange={(e) => handleFilterChange('jobType', e.target.value)}
            className="w-full border border-gray-300 outline-none rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            {jobTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Employment Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Employment Type</label>
          <select
            value={filters.employmentType}
            onChange={(e) => handleFilterChange('employmentType', e.target.value)}
            className="w-full border border-gray-300 outline-none rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            {employmentTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Seniority Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Seniority Level</label>
          <select
            value={filters.seniorityLevel}
            onChange={(e) => handleFilterChange('seniorityLevel', e.target.value)}
            className="w-full border border-gray-300 outline-none rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Levels</option>
            {seniorityLevels.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        {/* Remote/On-site */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Work Style</label>
          <select
            value={filters.isRemote}
            onChange={(e) => handleFilterChange('isRemote', e.target.value)}
            className="w-full border border-gray-300 outline-none rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All</option>
            <option value="remote">Remote</option>
            <option value="onsite">On-site</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Location</label>
          <input
            type="text"
            placeholder="Enter city or state"
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="w-full border border-gray-300 outline-none rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Salary Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Salary Range</label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Min"
              value={filters.minSalary}
              onChange={(e) => handleFilterChange('minSalary', e.target.value)}
              className="border border-gray-300 outline-none rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxSalary}
              onChange={(e) => handleFilterChange('maxSalary', e.target.value)}
              className="border border-gray-300 outline-none rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;