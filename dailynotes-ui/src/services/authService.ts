import axios from "axios";


const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "/api", 
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const registerUser = async (data: { username: string; email: string; password: string }) => {
  try {
    const response = await API.post("/auth/register/", data);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const loginUser = async (data: { email: string; password: string }) => {
  try {
    const response = await API.post("/auth/login/", data);
    const accessToken = response.data.access;
    const refreshToken = response.data.refresh;

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

export const logoutUser = () => {
  localStorage.removeItem("token");
  console.info("User logged out successfully");
};

export const getCurrentUser = async () => {
  try {
    const response = await API.get("/me");
    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};
