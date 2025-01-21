import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NoteForm, { NoteFormData } from "../../components/NoteForm";
import { fetchNotes, updateNote } from "../../services/noteService";
import AudioRecorder from "../../components/AudioRecorder";
import { mockData } from "../../data/mockData";
const UpdateNote: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [initialData, setInitialData] = useState<NoteFormData | null>(null);
  const navigate = useNavigate();
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = mockData;
        const selectedNote = response.find((note: NoteFormData) => note.id === id);
        if (selectedNote) {
          setInitialData(selectedNote);
        }
      } catch (error) {
        alert("Failed to fetch note");
      }
    };
    fetchNote();
  }, [id]);

  const handleUpdate = async (data: NoteFormData) => {
    const saveData = {
      title: data.title,
      content: data.content,
      audio: audioBlob,
    };

    try {
      if (id) {
        await updateNote(id, saveData);
        alert("Note updated successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      alert("Failed to update note");
    }
  };

  if (!initialData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg font-semibold text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="max-w-lg w-full my-24 bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">Update Note</h1>
        <NoteForm onSubmit={handleUpdate} initialData={initialData} />
        {initialData.audioUrl && show ? (
          <div className="mt-4">
            <h3 className="text-md font-bold">Recorded Audio</h3>
            <audio controls className="w-full">
              <source src={initialData.audioUrl} type="audio/webm" />
              Your browser does not support the audio tag.
            </audio>
            <div className="flex justify-end my-2">
              <button
                type="button"
                onClick={e => { e.preventDefault(); setShow(false); }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
              >
                Do you want to update?
              </button>
            </div>
          </div>
        ) : (
          <AudioRecorder noteId="temp-note-id" onSave={setAudioBlob} />
        )}
      </div>
    </div>
  );
};

export default UpdateNote;