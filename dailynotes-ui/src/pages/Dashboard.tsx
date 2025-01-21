import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NoteItem from "../components/NoteItem";
import { fetchNotes, deleteNote } from "../services/noteService";
import { mockData } from "../data/mockData";

interface Note {
  id: string;
  title: string;
  content: string;
  audioUrl?: string;
}

const Dashboard: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllNotes = async () => {
      try {
        const response = mockData;
        setNotes(response);
      } catch (error) {
        alert("Failed to fetch notes");
      }
    };
    fetchAllNotes();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteNote(id);
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
      alert("Note deleted successfully!");
    } catch (error) {
      alert("Failed to delete note");
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/notes/update/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="my-16">
        <h1 className="text-3xl font-bold mb-6 text-blue-800">My Notes</h1>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 mb-4"
          onClick={() => navigate("/notes/create")}
        >
          Create Note
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {notes.map((note) => (
            <div key={note.id} className="p-4 bg-white rounded-lg shadow-lg">
              <NoteItem
                note={note}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
