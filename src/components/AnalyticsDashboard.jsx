import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const AnalyticsDashboard = () => {
  // Mock data for charts
  const jobApplicationsData = [
    { month: 'Jan', applications: 45, jobs: 12 },
    { month: 'Feb', applications: 52, jobs: 18 },
    { month: 'Mar', applications: 38, jobs: 15 },
    { month: 'Apr', applications: 67, jobs: 22 },
    { month: 'May', applications: 72, jobs: 25 },
    { month: 'Jun', applications: 88, jobs: 30 },
  ];

  const jobTypeData = [
    { name: 'Developer', value: 35, color: '#3B82F6' },
    { name: 'Designer', value: 25, color: '#10B981' },
    { name: 'Marketing', value: 20, color: '#F59E0B' },
    { name: 'Engineer', value: 15, color: '#EF4444' },
    { name: 'Manager', value: 5, color: '#8B5CF6' },
  ];

  const userActivityData = [
    { day: 'Mon', activeUsers: 120 },
    { day: 'Tue', activeUsers: 135 },
    { day: 'Wed', activeUsers: 148 },
    { day: 'Thu', activeUsers: 142 },
    { day: 'Fri', activeUsers: 156 },
    { day: 'Sat', activeUsers: 89 },
    { day: 'Sun', activeUsers: 76 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Analytics Dashboard</h2>
        
        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Job Applications Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Job Applications & Postings</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={jobApplicationsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="applications" fill="#3B82F6" name="Applications" />
                <Bar dataKey="jobs" fill="#10B981" name="Jobs Posted" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Job Types Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Job Types Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={jobTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {jobTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* User Activity Chart */}
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly User Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userActivityData} >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="activeUsers" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Average Applications per Job</h4>
            <p className="text-3xl font-bold text-blue-600">8.5</p>
            <p className="text-sm text-green-600 mt-1">↑ 12% from last month</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Job Success Rate</h4>
            <p className="text-3xl font-bold text-green-600">73%</p>
            <p className="text-sm text-green-600 mt-1">↑ 5% from last month</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Average Time to Fill</h4>
            <p className="text-3xl font-bold text-purple-600">18 days</p>
            <p className="text-sm text-red-600 mt-1">↓ 2 days from last month</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;