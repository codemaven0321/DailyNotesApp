import axios from "axios";

const API = axios.create({ baseURL: "/api" });

export const fetchNotes = () => API.get("/notes");
export const createNote = (data: { title: string; content: string }) =>
  API.post("/notes", data);
export const updateNote = (id: string, data: { title: string; content: string }) =>
  API.put(`/notes/${id}`, data);
export const deleteNote = (id: string) => API.delete(`/notes/${id}`);
