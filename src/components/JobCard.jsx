import React from 'react';
import { MapPin, Clock, DollarSign, Calendar, Building2 } from 'lucide-react';

const JobCard = ({ job }) => {
  const formatSalary = (salary) => {
    if (salary >= 1000000) return `$${(salary / 1000000).toFixed(1)}M`;
    if (salary >= 1000) return `$${(salary / 1000).toFixed(0)}K`;
    return `$${salary}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const getJobTypeColor = (jobType) => {
    const colors = {
      Developer: 'bg-blue-100 text-blue-800',
      Designer: 'bg-purple-100 text-purple-800',
      Marketing: 'bg-green-100 text-green-800',
      Engineer: 'bg-red-100 text-red-800',
      Architect: 'bg-yellow-100 text-yellow-800',
      Manager: 'bg-indigo-100 text-indigo-800',
    };
    return colors[jobType] || 'bg-gray-100 text-gray-800';
  };

  const getSeniorityColor = (level) => {
    const colors = {
      Intern: 'bg-gray-100 text-gray-800',
      Junior: 'bg-blue-100 text-blue-800',
      'Mid-Level': 'bg-green-100 text-green-800',
      Senior: 'bg-purple-100 text-purple-800',
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Company Logo */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
            {job.imageUrl ? (
              <img
                src={job.imageUrl}
                alt={`${job.company} logo`}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Building2 className="h-8 w-8 text-gray-400" />
            )}
          </div>
        </div>

        {/* Job Details */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h3>
              <p className="text-lg text-gray-600 mb-3">{job.company}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getJobTypeColor(
                    job.jobType
                  )}`}
                >
                  {job.jobType}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getSeniorityColor(
                    job.seniorityLevel
                  )}`}
                >
                  {job.seniorityLevel}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                  {job.employmentType}
                </span>
                {job.isRemote ? (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Remote
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                    On-site
                  </span>
                )}
              </div>

              {/* Job Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{formatSalary(job.salary)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{job.employmentType}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{formatDate(job.postedDate)}</span>
                </div>
              </div>

              {/* Job Description */}
              <p className="text-gray-600 mt-4 line-clamp-2">{job.description}</p>
            </div>

            {/* Apply Button */}
            <div className="flex-shrink-0">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
