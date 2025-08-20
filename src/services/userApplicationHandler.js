// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// Fetch all applications of logged-in user
export const getUserApplications = async () => {
  const response = await fetch(`${API_BASE_URL}/jobs/applications/my`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch applications");
  return response.json();
};

// Cancel a job application
export const cancelApplication = async (applicationId) => {
  const response = await fetch(`${API_BASE_URL}/jobs/applications/${applicationId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to cancel application");
  return response.json();
};
