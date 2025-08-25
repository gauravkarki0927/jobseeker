import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddJobModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    jobType: 'Developer',
    employmentType: 'Full-time',
    seniorityLevel: 'Mid-Level',
    location: '',
    isRemote: false,
    salary: '',
    description: '',
    imageUrl: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const jobTypes = ['Developer', 'Designer', 'Marketing', 'Engineer', 'Architect', 'Manager'];
  const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance'];
  const seniorityLevels = ['Intern', 'Junior', 'Mid-Level', 'Senior'];

  // Validation rules
  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    else if (formData.title.length < 3) newErrors.title = 'Job title must be at least 3 characters';

    if (!formData.company.trim()) newErrors.company = 'Company name is required';

    if (!formData.location.trim()) newErrors.location = 'Location is required';

    if (!formData.salary) newErrors.salary = 'Salary is required';
    else if (isNaN(formData.salary) || parseInt(formData.salary) <= 0) newErrors.salary = 'Salary must be a positive number';

    if (!formData.description.trim()) newErrors.description = 'Job description is required';
    else if (formData.description.length < 20) newErrors.description = 'Description must be at least 20 characters';

    if (formData.imageUrl && !/^https?:\/\/.*\.(jpg|jpeg|png|gif|svg)$/i.test(formData.imageUrl)) {
      newErrors.imageUrl = 'Enter a valid image URL (jpg, png, gif, svg)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    // Clear error as user types
    setErrors({
      ...errors,
      [name]: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const jobData = {
        ...formData,
        salary: parseInt(formData.salary)
      };
      await onSubmit(jobData);
      onClose();
    } catch (error) {
      console.error('Error submitting job:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add New Job</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full border px-3 py-2 rounded-[2px] outline-none ${
                  errors.title ? 'border-red-500' : 'border-gray-300 focus:border-green-600'
                }`}
                placeholder="e.g., Frontend Developer"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company *
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className={`w-full border px-3 py-2 rounded-[2px] outline-none ${
                  errors.company ? 'border-red-500' : 'border-gray-300 focus:border-green-600'
                }`}
                placeholder="e.g., Tech Corp"
              />
              {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
            </div>

            {/* Job Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Type *</label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-[2px] px-3 py-2 outline-none focus:border-green-600"
              >
                {jobTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Employment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type *</label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-[2px] px-3 py-2 outline-none focus:border-green-600"
              >
                {employmentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Seniority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Seniority Level *</label>
              <select
                name="seniorityLevel"
                value={formData.seniorityLevel}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-[2px] px-3 py-2 outline-none focus:border-green-600"
              >
                {seniorityLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* Salary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Annual Salary (USD) *</label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                className={`w-full border px-3 py-2 rounded-[2px] outline-none ${
                  errors.salary ? 'border-red-500' : 'border-gray-300 focus:border-green-600'
                }`}
                placeholder="e.g., 75000"
              />
              {errors.salary && <p className="text-red-500 text-xs mt-1">{errors.salary}</p>}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`w-full border px-3 py-2 rounded-[2px] outline-none ${
                  errors.location ? 'border-red-500' : 'border-gray-300 focus:border-green-600'
                }`}
                placeholder="e.g., San Francisco, CA"
              />
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
            </div>

            {/* Remote Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isRemote"
                id="isRemote"
                checked={formData.isRemote}
                onChange={handleInputChange}
                className="h-4 w-4 text-green-600 border-gray-300 rounded"
              />
              <label htmlFor="isRemote" className="ml-2 block text-sm text-gray-900">
                Remote Position
              </label>
            </div>
          </div>

          {/* Company Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo URL</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              className={`w-full border px-3 py-2 rounded-[2px] outline-none ${
                errors.imageUrl ? 'border-red-500' : 'border-gray-300 focus:border-green-600'
              }`}
              placeholder="https://example.com/logo.png"
            />
            {errors.imageUrl && <p className="text-red-500 text-xs mt-1">{errors.imageUrl}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className={`w-full border px-3 py-2 rounded-[2px] outline-none ${
                errors.description ? 'border-red-500' : 'border-gray-300 focus:border-green-600'
              }`}
              placeholder="Describe the job responsibilities, requirements, and benefits..."
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-red-500 text-white rounded-[2px] hover:bg-red-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-500 text-white rounded-[2px] hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
              ) : (
                'Add Job'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobModal;
