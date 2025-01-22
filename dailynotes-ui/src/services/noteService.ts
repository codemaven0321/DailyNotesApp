import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "/api", 
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); 
    console.log(`Auth Token : ${token}`);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);


export const fetchNotes = async () => {
  try {
    const response = await API.get("/notes/");
    return response.data; 
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw error;
  }
};


export const createNote = async (data: { title: string; description: string }) => {
  try {
    const response = await API.post("/notes/", data);
    return response.data; 
  } catch (error) {
    console.error("Error creating note:", error);
    throw error;
  }
};

export const updateNote = async (id: string, data: { title: string; content: string } | FormData) => {
  const headers =
    data instanceof FormData
      ? { "Content-Type": "multipart/form-data" }
      : { "Content-Type": "application/json" };

  const response = await API.put(`/notes/${id}/`, data, { headers });
  return response.data;
};


export const deleteNote = async (id: string) => {
  try {
    const response = await API.delete(`/notes/${id}/`);
    return response.data; 
  } catch (error) {
    console.error(`Error deleting note with ID ${id}:`, error);
    throw error;
  }
};
