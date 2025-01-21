import React, { useState } from "react";
import { ReactMic } from "react-mic";

interface AudioRecorderProps {
  noteId: string;
  onSave: (audioBlob: Blob) => void;
  existingAudioUrl?: string; // Optional: URL of existing audio for playback
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  noteId,
  onSave,
  existingAudioUrl,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const handleStartRecording = () => setIsRecording(true);
  const handleStopRecording = () => setIsRecording(false);

  const handleSaveAudio = () => {
    if (audioBlob) {
      onSave(audioBlob);
    }
  };

  return (
    <div className="m-4 bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <h3 className="text-2xl font-semibold text-blue-800 mb-6 text-center">
        Audio Recorder
      </h3>
      <div className="border-2 border-dashed border-blue-300 p-4 mb-6 rounded-lg">
        <ReactMic
          record={isRecording}
          onStop={(data) => setAudioBlob(data.blob)}
          className="w-full"
        />
      </div>
      <div className="flex space-x-4 justify-center">
        {!isRecording ? (
          <button
            onClick={handleStartRecording}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={handleStopRecording}
            className="px-6 py-3 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition duration-300"
          >
            Stop Recording
          </button>
        )}
        {audioBlob && (
          <button
            onClick={handleSaveAudio}
            className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition duration-300"
          >
            Save Recording
          </button>
        )}
      </div>

      {/* Play Existing Audio */}
      {existingAudioUrl && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-blue-800 mb-2">Playback</h4>
          <audio controls className="w-full">
            <source src={existingAudioUrl} type="audio/webm" />
            Your browser does not support the audio tag.
          </audio>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
