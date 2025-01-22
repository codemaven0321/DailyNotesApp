import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface NoteFormProps {
  onSubmit: (data: NoteFormData) => void;
  initialData?: NoteFormData;
}

export interface NoteFormData {
  id: string;
  title: string;
  description: string;
  audioUrl?: string;
}

const NoteForm: React.FC<NoteFormProps> = ({ onSubmit, initialData }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NoteFormData>({
    defaultValues: initialData,
  });

  const handleFormSubmit = (data: NoteFormData) => {
    onSubmit(data);
    reset();
  };

  const navigate = useNavigate();

  return (
    <form 
      onSubmit={handleSubmit(handleFormSubmit)} 
      className="space-y-6 bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto"
    >
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-600 mb-1">
          Title
        </label>
        <input
          {...register("title", { required: "Title is required" })}
          id="title"
          type="text"
          placeholder="Note Title"
          className={`w-full px-4 py-2 border rounded-lg text-sm focus:ring focus:ring-blue-200 focus:outline-none ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-600 mb-1">
          Description
        </label>
        <textarea
          {...register("description", { required: "Description is required" })}
          id="description"
          placeholder="Note Description"
          className={`w-full px-4 py-2 border rounded-lg text-sm focus:ring focus:ring-blue-200 focus:outline-none ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
          rows={4}
        />
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
      </div>

      <div className="flex">
        <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        >
            Save
        </button>
        &nbsp;
        <button
            className="w-full px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring focus:ring-blue-300"
            onClick={(e) => {e.preventDefault(); navigate('/dashboard');}}
        >
            Cancel
        </button>

      </div>
    </form>
  );
};

export default NoteForm;