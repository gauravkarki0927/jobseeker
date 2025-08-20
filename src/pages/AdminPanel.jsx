import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, Briefcase, TrendingUp, User } from 'lucide-react';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import AddJobModal from '../components/AddJobModal';
import API_BASE from '../services/API_BASE';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalUsers: 0,
    totalApplications: 0,
    activeJobs: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Run both API calls in parallel
      const [jobsResponse, usersResponse] = await Promise.all([
        fetch(`${API_BASE}/jobs`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        }),
        fetch(`${API_BASE}/admin/users`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        })
      ]);

      const jobsData = jobsResponse.ok ? await jobsResponse.json() : { jobs: [] };
      const usersData = usersResponse.ok ? await usersResponse.json() : { users: [] };

      // Store data in state
      setJobs(jobsData.jobs || []);
      setUsers(Array.isArray(usersData) ? usersData : usersData.users || []);

      setStats({
        totalJobs: jobsData.pagination?.totalJobs || 0,
        totalUsers: usersData.length || 0,
        totalApplications: 45,
        activeJobs: (jobsData.jobs || []).filter(job => {
          const postedDate = new Date(job.postedDate || Date.now());
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return postedDate > thirtyDaysAgo;
        }).length
      });


    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddJob = async (jobData) => {
    try {
      const response = await fetch(`${API_BASE}/admin/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(jobData)
      });

      if (response.ok) {
        const { job } = await response.json(); // <-- your backend returns { message, job }
        setJobs(prevJobs => [...prevJobs, job]); // <-- update jobs with the correct object
        setShowAddJobModal(false);
        fetchData(); // Optional, you may skip this if you already updated jobs state
      } else {
        const errorData = await response.json();
        console.error('Failed to add job:', errorData.message);
      }
    } catch (error) {
      console.error('Error adding job:', error);
    }
  };


  const handleDeleteJob = async (jobId) => {
    if (!jobId) return;
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        const response = await fetch(`${API_BASE}/admin/jobs/${jobId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          setJobs(prevJobs => prevJobs.filter(job => (job.id || job._id) !== jobId));
          fetchData();
        }
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!userId) return;
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setUsers(prevUsers => prevUsers.filter(user => (user.id || user._id) !== userId));
        fetchData();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
    { id: 'jobs', name: 'Jobs Management', icon: Briefcase },
    { id: 'users', name: 'Users Management', icon: Users },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-2">Manage jobs, users, and view analytics</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Dashboard */}
        {activeTab === 'dashboard' && <AnalyticsDashboard />}

        {/* Jobs Management */}
        {activeTab === 'jobs' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Jobs Management</h2>
              <button
                onClick={() => setShowAddJobModal(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-[2px] hover:bg-green-600 transition-colors flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" /> Add New Job
              </button>
            </div>


            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                {/* Table Header */}
                <thead className="bg-gray-100 text-left text-gray-600 text-sm font-semibold">
                  <tr>
                    <th className="px-6 py-3">Job</th>
                    <th className="px-6 py-3">Company</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Salary</th>
                    <th className="px-6 py-3">Posted</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="bg-white divide-y divide-gray-200 text-sm">
                  {jobs?.length > 0 ? (
                    jobs.map((job) => (
                      <tr
                        key={job.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        {/* Job Title + Logo */}
                        <td className="px-6 py-4 flex items-center gap-3">
                          {job.imageUrl ? (
                            <img
                              src={job.imageUrl}
                              alt={job.company}
                              className="w-10 h-10 rounded-md object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-md">
                              <Briefcase className="w-5 h-5 text-gray-500" />
                            </div>
                          )}
                          <span className="font-medium text-gray-900">{job.title || "N/A"}</span>
                        </td>

                        {/* Company */}
                        <td className="px-6 py-4 text-gray-700">{job.company || "N/A"}</td>

                        {/* Job Type */}
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {job.jobType || "N/A"}
                          </span>
                        </td>

                        {/* Salary */}
                        <td className="px-6 py-4 text-gray-700">
                          {job.salary
                            ? `Rs. ${job.salary.toLocaleString()} / month`
                            : "Not specified"}
                        </td>

                        {/* Posted Date */}
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(job.postedDate || Date.now()).toLocaleDateString()}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right space-x-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-6 text-gray-500 text-sm"
                      >
                        No jobs listed yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Users Management */}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Users Management
            </h2>
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                {/* Table Head */}
                <thead className="bg-gray-100 text-left text-gray-600 text-sm font-semibold">
                  <tr>
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Joined</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="bg-white divide-y divide-gray-200 text-sm">
                  {users?.length > 0 ? (
                    users.map((user) => (
                      <tr
                        key={user.id || user._id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        {/* User Avatar + Name */}
                        <td className="px-6 py-4 flex items-center gap-3">
                          {user.avatarUrl ? (
                            <img
                              src={`http://localhost:5000/${user.avatarUrl}`}
                              alt={user.firstName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full">
                              <User className="w-5 h-5 text-gray-500" />
                            </div>
                          )}
                          <span className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </span>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-4 text-gray-700">{user.email}</td>

                        {/* Role with Badge */}
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === "admin"
                              ? "bg-red-100 text-red-700"
                              : user.role === "recruiter"
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                              }`}
                          >
                            {user.role}
                          </span>
                        </td>

                        {/* Joined Date */}
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right space-x-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteUser(user.id || user._id)
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-6 text-gray-500 text-sm"
                      >
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        )}

        {/* Add Job Modal */}
        {showAddJobModal && <AddJobModal onClose={() => setShowAddJobModal(false)} onSubmit={handleAddJob} />}
      </div>
    </div>
  );
};

export default AdminPanel;