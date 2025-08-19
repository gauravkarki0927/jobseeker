import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, Briefcase, TrendingUp, Eye } from 'lucide-react';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import AddJobModal from '../components/AddJobModal';

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

  const API_BASE = 'http://localhost:5000/api';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch jobs
      const jobsResponse = await fetch(`${API_BASE}/jobs`);
      let jobsData = [];
      if (jobsResponse.ok) {
        jobsData = await jobsResponse.json();
        setJobs(jobsData);
      }
      // Calculate stats safely
      setStats({
        totalJobs: jobsData?.length || 0,
        totalUsers: mockUsers?.length || 0,
        totalApplications: 45, // Mock data
        activeJobs: jobsData?.filter(job => {
          const postedDate = new Date(job.postedDate || Date.now());
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return postedDate > thirtyDaysAgo;
        }).length || 0
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
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" /> Add New Job
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th>Job Details</th>
                    <th>Company</th>
                    <th>Type</th>
                    <th>Salary</th>
                    <th>Posted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobs?.length > 0 ? (
                    jobs.map(job => (
                      <tr key={job.id || job._id}>
                        <td>{job.title || 'N/A'}</td>
                        <td>{job.company || 'N/A'}</td>
                        <td>{job.jobType || 'N/A'}</td>
                        <td>${job.salary?.toLocaleString() || 0}</td>
                        <td>{new Date(job.postedDate || Date.now()).toLocaleDateString()}</td>
                        <td>
                          <button><Edit /></button>
                          <button onClick={() => handleDeleteJob(job.id || job._id)}><Trash2 /></button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-gray-500">No jobs listed yet</td>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Users Management</h2>
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users?.map(user => (
                    <tr key={user.id || user._id}>
                      <td>{user.firstName} {user.lastName}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{new Date(user.createdAt || Date.now()).toLocaleDateString()}</td>
                      <td>
                        <button className="text-blue-600 hover:text-blue-900"><Edit /></button>
                        <button onClick={() => handleDeleteUser(user.id || user._id)} className="text-red-600 hover:text-red-900"><Trash2 /></button>
                      </td>
                    </tr>
                  ))}
                  {!users?.length && (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-gray-500">No users found</td>
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