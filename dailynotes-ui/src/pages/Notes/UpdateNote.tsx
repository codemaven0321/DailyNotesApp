import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NoteForm, { NoteFormData } from "../../components/NoteForm";
import { fetchNotes, updateNote } from "../../services/noteService";

const UpdateNote: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [initialData, setInitialData] = useState<NoteFormData | undefined>(
    undefined
  );
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [isRecording, setIsRecording] = useState(false);
  const [userConfirmed, setUserConfirmed] = useState(false);
  const [updateData, setUpdateData] = useState<NoteFormData | null>(null);
  const audioRecorderRef = useRef<any>(null);
  
  useEffect(() => {
    const fetchNote = async () => {
      setLoading(true);
      setError(null);
      try {
        const notes = await fetchNotes();
        const selectedNote = notes.find(
          (note: NoteFormData) => String(note.id) === id
        );

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
    if (isRecording) {
      setUpdateData(data);
      setUserConfirmed(true);
    } else {
      await submitUpdate(data);
    }
  };

  const submitUpdate = async (data: NoteFormData) => {
    if (audioRecorderRef.current?.stopRecording) {
      await audioRecorderRef.current.stopRecording(); 
    }
  
    const audio_file = audioBlob ? URL.createObjectURL(audioBlob) : undefined;
    const saveData = {
      title: data.title,
      description: data.description,
      audio_file: audio_file || data.audio_file,
    };
  
    try {
      if (id) {
        await updateNote(id, saveData);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error updating note:", err);
      alert("Failed to update note");
    }
  };
  

  useEffect(() => {
    if (userConfirmed && updateData) {
      audioBlob && console.log("Stopping recording...");
      setUserConfirmed(false);
      submitUpdate(updateData);
    }
  }, [userConfirmed, updateData]);

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
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">
          Update Note
        </h1>
        <NoteForm
          onSubmit={handleUpdate}
          onAudioSave={setAudioBlob}
          initialData={initialData}
          isCreate="false"
        />
      </div>
    </div>
  );
};

export default UpdateNote;
