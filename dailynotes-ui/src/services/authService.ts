import axios from "axios";

// Create an Axios instance with the base URL from environment variables
const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "/api", // Use REACT_APP_API_BASE_URL or fallback to "/api"
});

// Interceptor to attach token to requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // Retrieve token from local storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Register a new user
export const registerUser = async (data: { username: string; email: string; password: string }) => {
  try {
    const response = await API.post("/auth/register/", data);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// Log in a user
export const loginUser = async (data: { email: string; password: string }) => {
  try {
    const response = await API.post("/auth/login/", data);
    const accessToken = response.data.access;
    const refreshToken = response.data.refresh;

    // Store the token in local storage
    if (accessToken) {
      localStorage.setItem("authToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    }
    return response.data;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

// Log out a user
export const logoutUser = () => {
  localStorage.removeItem("token"); // Remove the token from local storage
  console.info("User logged out successfully");
};

// Get the current user (example of authenticated API call)
export const getCurrentUser = async () => {
  try {
    const response = await API.get("/me"); // Assuming `/me` endpoint returns the current user's data
    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};
