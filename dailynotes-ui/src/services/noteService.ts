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

export const createNote = async (data: any) => {
  try {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    let file = await fetch(data.audio_file)
      .then((r) => r.blob())
      .then((blobFile) => {
        const timestamp = new Date().toISOString().replace(/[:.-]/g, "");
        const fileName = `recorded_audio_${timestamp}.webm`; 
        return new File([blobFile], fileName, {
          type: "audio/webm",
        });
      });
    if (data.audio_file) {
      formData.append("audio_file", file);
    } else {
      formData.append("audio_file", "");
    }

    const response = await API.post("/notes/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating note:", error);
    throw error;
  }
};

export const updateNote = async (id: string, data: any) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description);
  let file = await fetch(data.audio_file)
    .then((r) => r.blob())
    .then((blobFile) => {
      const timestamp = new Date().toISOString().replace(/[:.-]/g, "");
      const fileName = `recorded_audio_${timestamp}.webm`;
      return new File([blobFile], fileName, {
        type: "audio/webm",
      });
    });
  if (data.audio_file) {
    formData.append("audio_file", file);
  } else {
    formData.append("audio_file", "");
  }

  const response = await API.put(`/notes/${id}/`, formData, { 
    headers: { "Content-Type": "multipart/form-data" },
  });
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
