import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AudioRecorder from "./AudioRecorder";

interface NoteFormProps {
  onSubmit: (data: NoteFormData) => void;
  onAudioSave: (audioBlob: Blob | null) => void;
  initialData?: NoteFormData;
  isCreate: string;
}

export interface NoteFormData {
  id?: string;
  title: string;
  description: string;
  audio_file?: string;
}

const NoteForm: React.FC<NoteFormProps> = ({
  onSubmit,
  onAudioSave,
  initialData,
  isCreate,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteFormData>({
    defaultValues: initialData,
  });

  const [isRecording, setIsRecording] = useState(false);
  const audioRecorderRef = useRef<any>(null);
  const [isCreating, setIsCreating] = useState(isCreate);

  const handleFormSubmit = async (formData: NoteFormData) => {
    onSubmit(formData);
    reset();
  };

  const navigate = useNavigate();

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6 bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto"
    >
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-600 mb-1"
        >
          Title
        </label>
        <input
          {...register("title", { required: "Title is required" })}
          id="title"
          type="text"
          placeholder="Note Title"
          className={`w-full px-4 py-2 border rounded-lg text-sm focus:ring focus:ring-blue-200 focus:outline-none ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-600 mb-1"
        >
          Description
        </label>
        <textarea
          {...register("description", { required: "Description is required" })}
          id="description"
          placeholder="Note Description"
          className={`w-full px-4 py-2 border rounded-lg text-sm focus:ring focus:ring-blue-200 focus:outline-none ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
          rows={4}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>

      {isCreating === "true" || !initialData?.audio_file ? (
        <AudioRecorder
          ref={audioRecorderRef}
          onSave={onAudioSave}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
        />
      ) : (
        <div className="mt-4">
          <h3 className="text-md font-bold mb-4">Recorded Audio</h3>
          <audio controls className="w-full">
            <source src={initialData?.audio_file} type="audio/webm" />
            Your browser does not support the audio tag.
          </audio>
          <div className="flex justify-end my-4">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setIsCreating("true");
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Update Audio
            </button>
          </div>
        </div>
      )}

      <div className="flex">
        <button
          type="submit"
          disabled={isRecording}
          className={`w-full px-4 py-2 text-sm font-medium text-white rounded-lg ${
            isRecording
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } focus:outline-none focus:ring focus:ring-blue-300`}
        >
          Save
        </button>
        &nbsp;
        <button
          className="w-full px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring focus:ring-blue-300"
          onClick={(e) => {
            e.preventDefault();
            navigate("/dashboard");
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
