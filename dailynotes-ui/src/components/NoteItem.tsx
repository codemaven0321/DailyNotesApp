import React, { useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

interface NoteItemProps {
  note: { id: string; title: string; description: string; audio_file?: string };
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, onDelete, onEdit }) => {
  return (
    <div className="note-item bg-gray-100 p-4 rounded shadow-md">
      <h3 className="text-lg font-bold overflow-ellipsis" id="noteTitle">
        {note.title}
      </h3>
      <p className="text-gray-700 text-multiline" id="noteDescription">
        {note.description}
      </p>
      {note.audio_file && (
        <div className="mt-4">
          <h3 className="text-md font-bold">Audio Recording</h3>
          <audio controls className="w-full">
            <source src={note.audio_file} type="audio/webm" />
            Your browser does not support the audio tag.
          </audio>
        </div>
      )}
      <div className="flex justify-end space-x-2 mt-2">
        <button
          onClick={() => onEdit(note.id)}
          className="text-blue-500 hover:text-blue-700 focus:outline-none"
          aria-label="Edit"
        >
          <FaEdit size={18} />
        </button>
        <button
          onClick={() => onDelete(note.id)}
          className="text-red-500 hover:text-red-700 focus:outline-none"
          aria-label="Delete"
        >
          <FaTrash size={18} />
        </button>
      </div>
    </div>
  );
};

export default NoteItem;
