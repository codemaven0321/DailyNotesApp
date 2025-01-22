import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NoteForm, { NoteFormData } from "../../components/NoteForm";
import { fetchNotes, updateNote } from "../../services/noteService";
import AudioRecorder from "../../components/AudioRecorder";

const UpdateNote: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [initialData, setInitialData] = useState<NoteFormData | undefined>(undefined);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [show, setShow] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNote = async () => {
      setLoading(true);
      setError(null);
      try {
        const notes = await fetchNotes(); // Fetch notes from the server
        const selectedNote = notes.find((note: NoteFormData) => note.id === id);
        if (selectedNote) {
          setInitialData(selectedNote);
        } else {
          throw new Error("Note not found");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch note");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleUpdate = async (data: NoteFormData) => {
    const saveData = new FormData();
    saveData.append("title", data.title);
    saveData.append("description", data.description);
    if (audioBlob) {
      saveData.append("audio", audioBlob, "updated-audio.webm");
    }

    try {
      if (id) {
        await updateNote(id, saveData); // Update note on the server
        alert("Note updated successfully!");
        navigate("/dashboard");
      }
    } catch (err) {
      alert("Failed to update note");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg font-semibold text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg font-semibold text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="max-w-lg w-full my-24 bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">Update Note</h1>
        <NoteForm onSubmit={handleUpdate} initialData={initialData} />
        {initialData?.audioUrl && show ? (
          <div className="mt-4">
            <h3 className="text-md font-bold">Recorded Audio</h3>
            <audio controls className="w-full">
              <source src={initialData.audioUrl} type="audio/webm" />
              Your browser does not support the audio tag.
            </audio>
            <div className="flex justify-end my-2">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShow(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
              >
                Update Audio
              </button>
            </div>
          </div>
        ) : (
          <AudioRecorder noteId={id || "temp-note-id"} onSave={setAudioBlob} />
        )}
      </div>
    </div>
  );
};

export default UpdateNote;
