import React, { useState } from "react";
import { MapPin, Clock, Wallet, Calendar, Building2 } from "lucide-react";
import toast from "react-hot-toast";

const JobCard = ({ job }) => {
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cv: null,
  });

  const API_BASE = "http://localhost:5000/api/jobs"; // adjust backend URL
  const isLoggedIn = Boolean(localStorage.getItem("token")); // ✅ check login status

  const formatSalary = (salary) => {
    if (salary >= 1000000) return `Rs.${(salary / 1000000).toFixed(1)}M`;
    if (salary >= 1000) return `Rs.${(salary / 1000).toFixed(0)}K`;
    return `Rs.${salary}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const getJobTypeColor = (jobType) => {
    const colors = {
      Developer: "bg-blue-100 text-blue-800",
      Designer: "bg-purple-100 text-purple-800",
      Marketing: "bg-green-100 text-green-800",
      Engineer: "bg-red-100 text-red-800",
      Architect: "bg-yellow-100 text-yellow-800",
      Manager: "bg-indigo-100 text-indigo-800",
    };
    return colors[jobType] || "bg-gray-100 text-gray-800";
  };

  const getSeniorityColor = (level) => {
    const colors = {
      Intern: "bg-gray-100 text-gray-800",
      Junior: "bg-blue-100 text-blue-800",
      "Mid-Level": "bg-green-100 text-green-800",
      Senior: "bg-purple-100 text-purple-800",
    };
    return colors[level] || "bg-gray-100 text-gray-800";
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("cv", formData.cv);

      const response = await fetch(`${API_BASE}/${job.id}/apply`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        setApplied(true);
        setShowForm(false);
        toast.success("Application submitted successfully!");
      } else {
        setShowForm(false);
      }
    } catch (err) {
      console.error("Error applying:", err);
      toast.error("Something went wrong.");
    } finally {
      setApplying(false);
    }
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
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {job.title}
              </h3>

              {/* Hide company name if not logged in */}
              {isLoggedIn ? (
                <p className="text-lg text-gray-600 mb-3">{job.company}</p>
              ) : (
                <p className="text-md text-gray-400 italic mb-3">
                  Login to view company
                </p>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getSeniorityColor(
                    job.seniorityLevel
                  )}`}
                >
                  {job.seniorityLevel}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getJobTypeColor(
                    job.jobType
                  )}`}
                >
                  {job.jobType}
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
                {/* Location - hidden if not logged in */}
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  <span>
                    {isLoggedIn ? job.location : "Login to view location"}
                  </span>
                </div>
                <div className="flex items-center">
                  <Wallet className="h-4 w-4 mr-2 text-gray-400" />
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
              <p className="text-gray-600 mt-4 line-clamp-2">
                {job.description}
              </p>
            </div>

            {/* Apply Button */}
            <div className="flex-shrink-0 flex flex-col items-end">
              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    toast.error("Please log in to apply for this job.", {
                      position: "top-right",
                    });
                    return;
                  }
                  setShowForm(true);
                }}
                disabled={applying || applied}
                className={`px-6 py-2 rounded-[2px] font-medium transition-colors ${
                  applied
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {applying ? "Applying..." : applied ? "Applied" : "Apply Now"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Application Form Modal */}
      {showForm && isLoggedIn && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              Apply for {job.title}
            </h3>
            <form onSubmit={handleApply} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="border rounded-[4px] outline-none px-3 py-2"
              />
              <input
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="border rounded-[4px] outline-none px-3 py-2"
              />
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) =>
                  setFormData({ ...formData, cv: e.target.files[0] })
                }
                required
                className="border rounded-lg px-3 py-2"
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-[2px] outline-none border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="px-4 py-2 rounded-[2px] outline-none bg-blue-600 text-white hover:bg-blue-700"
                >
                  {applying ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCard;
