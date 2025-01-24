import React, { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { ReactMic } from "react-mic";
import '@fortawesome/fontawesome-free/css/all.min.css';

interface AudioRecorderProps {
  onSave: (audioBlob: Blob | null) => void;
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
}

const AudioRecorder = forwardRef((props: AudioRecorderProps, ref) => {
  const { onSave, isRecording, setIsRecording } = props;

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };
  
  const handleOnStop = (recordedData: any) => {
    onSave(recordedData.blob);
  };
  
  useImperativeHandle(ref, () => ({
    stopRecording: async () => {
      if (isRecording) {
        await new Promise((resolve) => {
          handleStopRecording();
        });
      }
    },
  }));
  

  return (
    <div className="m-4 bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <h3 className="text-2xl font-semibold text-blue-800 mb-6 text-center">Audio Recorder</h3>
      <div className="border-2 border-dashed border-blue-300 p-4 mb-6 rounded-lg">
        <ReactMic
          record={isRecording}
          onStop={handleOnStop}
          className="w-full"
        />
      </div>
      <div className="flex space-x-4 justify-center">
        {!isRecording ? (
          <button
            type="button"
            onClick={handleStartRecording}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
          >
            <i className="fas fa-microphone"></i>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleStopRecording}
            className="px-6 py-3 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition duration-300"
          >
            <i className="fas fa-stop"></i>
          </button>
        )}
      </div>
    </div>
  );
});

export default AudioRecorder;
