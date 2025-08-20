import React, { useState, useEffect, useRef } from 'react';
import { Search, Briefcase, Users, TrendingUp } from 'lucide-react';
import SearchFilters from '../components/SearchFilters';
import JobCard from '../components/JobCard';
import API_BASE from '../services/API_BASE';


const LandingPage = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    jobType: '', employmentType: '', seniorityLevel: '', location: '', isRemote: '', minSalary: '', maxSalary: ''
  });

  useEffect(() => { fetchJobs(); }, []);
  useEffect(() => { filterJobs(); }, [jobs, searchTerm, filters]);

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${API_BASE}/jobs`);
      if (response.ok) {
        const data = await response.json();

        // Normalize isRemote: ensure it's always true/false
        const normalized = (data.jobs || []).map(job => ({
          ...job,
          isRemote: job.isRemote === true || job.isRemote === 1 || job.isRemote === "1"
        }));

        setJobs(normalized);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally { setLoading(false); }
  };


  // --- FILTER JOBS ---
  const filterJobs = () => {
    let filtered = jobs;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();

      filtered = filtered.filter((job) =>
        job.title?.toLowerCase().includes(term) ||
        job.company?.toLowerCase().includes(term) ||
        job.description?.toLowerCase().includes(term) ||
        job.jobType?.toLowerCase().includes(term) ||
        job.employmentType?.toLowerCase().includes(term) ||
        job.seniorityLevel?.toLowerCase().includes(term) ||
        job.location?.toLowerCase().includes(term) ||
        (job.isRemote ? "remote" : "onsite").includes(term)
      );
    }

    if (filters.jobType) filtered = filtered.filter(job => job.jobType === filters.jobType);
    if (filters.employmentType) filtered = filtered.filter(job => job.employmentType === filters.employmentType);
    if (filters.seniorityLevel) filtered = filtered.filter(job => job.seniorityLevel === filters.seniorityLevel);
    if (filters.location) filtered = filtered.filter(job => job.location?.toLowerCase().includes(filters.location.toLowerCase()));
    if (filters.isRemote) {
      const remoteFilter = filters.isRemote.toLowerCase();
      filtered = filtered.filter(job =>
        remoteFilter === 'remote' ? job.isRemote : !job.isRemote
      );
    }
    if (filters.minSalary) filtered = filtered.filter(job => Number(job.salary) >= parseInt(filters.minSalary));
    if (filters.maxSalary) filtered = filtered.filter(job => Number(job.salary) <= parseInt(filters.maxSalary));

    setFilteredJobs(filtered);
  };


  // --- HANDLE SEARCH CHANGE ---
  const [suggestions, setSuggestions] = useState([]);
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length > 0) {
      const term = value.toLowerCase();
      const matched = jobs.filter((job) =>
        job.title?.toLowerCase().includes(term) ||
        job.company?.toLowerCase().includes(term) ||
        job.description?.toLowerCase().includes(term) ||
        job.jobType?.toLowerCase().includes(term) ||
        job.employmentType?.toLowerCase().includes(term) ||
        job.seniorityLevel?.toLowerCase().includes(term) ||
        job.location?.toLowerCase().includes(term) ||
        (job.isRemote ? "remote" : "onsite").includes(term)
      );

      const suggestionSet = new Set();

      matched.forEach((job) => {
        if (job.title) suggestionSet.add(job.title);
        if (job.company) suggestionSet.add(job.company);
        if (job.jobType) suggestionSet.add(job.jobType);
        if (job.employmentType) suggestionSet.add(job.employmentType);
        if (job.seniorityLevel) suggestionSet.add(job.seniorityLevel);
        if (job.location) suggestionSet.add(job.location);
        suggestionSet.add(job.isRemote ? "remote" : "onsite"); // ✅ lowercase to match filtering
      });

      setSuggestions(Array.from(suggestionSet).slice(0, 8)); // max 8 suggestions
    } else {
      setSuggestions([]);
    }
  };

  const searchRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestions([]); // hide dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]); // close dropdown
  };


  return (
    <div className="min-h-screen bg-white">
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Your <span className="text-green-600">Dream Job</span> Today
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Discover thousands of job opportunities from top companies around the world.
          </p>

          {/* Search Bar */}
          <div ref={searchRef} className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for jobs, companies, or keywords..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-3 outline-none border border-gray-300 rounded-[2px] focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                />

                {/* Suggestions Dropdown */}
                {suggestions.length > 0 && (
                  <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                    {suggestions.map((s, i) => (
                      <li
                        key={i}
                        onClick={() => handleSuggestionClick(s)}
                        className="px-4 py-2 text-left border-b border-gray-100 cursor-pointer hover:bg-blue-100 text-gray-800"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button className="bg-green-500 text-white px-8 py-3 rounded-[2px] hover:bg-green-600 transition-colors font-medium">
                Search Jobs
              </button>
            </div>
          </div>


          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-300 bg-opacity-20 rounded-full mb-4">
                <Briefcase className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-bold text-red-600">{jobs.length ? jobs.length : 0}+</h3>
              <p className="text-blue-600">Active Jobs</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-300 bg-opacity-20 rounded-full mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-bold text-yellow-600">10K+</h3>
              <p className="text-blue-600">Companies</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-300 bg-opacity-20 rounded-full mb-4">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-bold text-green-600">95%</h3>
              <p className="text-blue-600">Success Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters + Jobs */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <SearchFilters filters={filters} onFilterChange={setFilters} />
        </div>
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredJobs.length > 0 ? filteredJobs.map((job, i) => (
                <JobCard key={job.id || job._id || i} job={job} />
              )) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">No jobs found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
