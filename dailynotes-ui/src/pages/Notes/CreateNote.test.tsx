import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { createNote } from "../../services/noteService";
import CreateNote from "./CreateNote";

// Mock `createNote` service
jest.mock("../../services/noteService", () => ({
  createNote: jest.fn(),
}));

// Mock `NoteForm` component
jest.mock("../../components/NoteForm", () => ({
  __esModule: true,
  default: ({ onSubmit, onAudioSave }: any) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const audioBlob = "mock-audio-blob"; // Mock audio blob
        onAudioSave(audioBlob); // Save the audio blob
        onSubmit({
          title: "Test Note",
          description: "Test Description",
          audio_file: audioBlob, // Include audio blob in the payload
        });
      }}
    >
      <button type="submit">Mock Submit</button>
    </form>
  ),
}));

jest.spyOn(console, "error").mockImplementation((message) => {
  if (!message.includes("ReactDOMTestUtils.act")) {
    console.error(message);
  }
});

// Mock `AudioRecorder` component
jest.mock("../../components/AudioRecorder", () => {
  const React = require("react");
  const forwardRef = React.forwardRef;
  const useImperativeHandle = React.useImperativeHandle;

  const AudioRecorder = forwardRef(({ onSave }: any, ref : any) => {
    useImperativeHandle(ref, () => ({
      stopRecording: jest.fn(() => {
        onSave("mock-audio-blob"); // Correctly mock the audio blob
      }),
    }));

    return <div>AudioRecorder Mock</div>;
  });

  return {
    __esModule: true,
    default: AudioRecorder,
  };
});

describe("CreateNote Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the CreateNote component correctly", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <CreateNote />
        </MemoryRouter>
      );
    });

    expect(screen.getByText(/Create Note/i)).toBeInTheDocument();
    expect(screen.getByText("Mock Submit")).toBeInTheDocument();
  });

  it("should call createNote service on form submit with audio file", async () => {
    const mockedCreateNote = createNote as jest.Mock;
    mockedCreateNote.mockResolvedValueOnce({ success: true });

    await act(async () => {
      render(
        <MemoryRouter>
          <CreateNote />
        </MemoryRouter>
      );
    });

    fireEvent.click(screen.getByText("Mock Submit"));

    await waitFor(() => {
      // Verify the `createNote` call
      expect(mockedCreateNote).toHaveBeenCalledTimes(1);
    });
  });

  it("should display an alert on failed submission", async () => {
    const mockedCreateNote = createNote as jest.Mock;
    mockedCreateNote.mockRejectedValueOnce(new Error("Failed to create note"));

    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

    await act(async () => {
      render(
        <MemoryRouter>
          <CreateNote />
        </MemoryRouter>
      );
    });

    fireEvent.click(screen.getByText("Mock Submit"));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("Failed to create note");
    });

    alertMock.mockRestore();
  });
});
