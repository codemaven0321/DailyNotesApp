import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NoteForm, { NoteFormData } from "../../components/NoteForm";
import { createNote } from "../../services/noteService";
import AudioRecorder from "../../components/AudioRecorder";

const CreateNote: React.FC = () => {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const navigate = useNavigate();

  const handleCreate = async (data: NoteFormData) => {
    const saveData = {
      title: data.title,
      description: data.description,
      audio: audioBlob,
    };

    try {
      await createNote(saveData);
      alert("Note created successfully!");
      navigate("/dashboard");
    } catch (error) {
      alert("Failed to create note");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-lg my-36 w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-blue-800 text-center mb-6">Create Note</h1>
        <NoteForm onSubmit={handleCreate} />
        <AudioRecorder noteId="temp-note-id" onSave={setAudioBlob} />
      </div>
    </div>
  );
};

export default CreateNote;