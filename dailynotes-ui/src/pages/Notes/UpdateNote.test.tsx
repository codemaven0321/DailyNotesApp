import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import UpdateNote from "./UpdateNote";
import { fetchNotes, updateNote } from "../../services/noteService";

jest.mock("../../components/NoteForm", () => ({
  __esModule: true,
  default: ({ onSubmit }: any) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ title: "Updated Note", description: "Updated Description" });
      }}
    >
      <button type="submit">Mock Save</button>
    </form>
  ),
}));

jest.mock("../../services/noteService", () => ({
  fetchNotes: jest.fn(),
  updateNote: jest.fn(),
}));

jest.spyOn(console, "error").mockImplementation((message) => {
  if (!message.includes("ReactDOMTestUtils.act")) {
    console.error(message);
  }
});

describe("UpdateNote Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the loading state initially", () => {
    (fetchNotes as jest.Mock).mockResolvedValue([]);

    render(
      <MemoryRouter initialEntries={["/update-note/1"]}>
        <Routes>
          <Route path="/update-note/:id" element={<UpdateNote />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("should display an error message if note fetching fails", async () => {
    (fetchNotes as jest.Mock).mockRejectedValue(
      new Error("Failed to fetch notes")
    );

    render(
      <MemoryRouter initialEntries={["/update-note/1"]}>
        <Routes>
          <Route path="/update-note/:id" element={<UpdateNote />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch note/i)).toBeInTheDocument();
    });
  });

  it("should render the form with initial data", async () => {
    (fetchNotes as jest.Mock).mockResolvedValue([
      {
        id: "1",
        title: "Test Note",
        description: "Test Description",
        audio_file: "",
      },
    ]);

    render(
      <MemoryRouter initialEntries={["/update-note/1"]}>
        <Routes>
          <Route path="/update-note/:id" element={<UpdateNote />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Update Note/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/Mock Save/i)).toBeInTheDocument();
    });
  });

  it("should call updateNote service on form submit", async () => {
    (fetchNotes as jest.Mock).mockResolvedValue([
      {
        id: "1",
        title: "Test Note",
        description: "Test Description",
        audio_file: "",
      },
    ]);
    (updateNote as jest.Mock).mockResolvedValue({ success: true });

    render(
      <MemoryRouter initialEntries={["/update-note/1"]}>
        <Routes>
          <Route path="/update-note/:id" element={<UpdateNote />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Update Note/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Mock Save"));

    await waitFor(() => {
      expect(updateNote).toHaveBeenCalledWith("1", {
        title: "Updated Note",
        description: "Updated Description",
        audio_file: undefined,
      });
    });
  });

  it("should show an alert if updateNote fails", async () => {
    (fetchNotes as jest.Mock).mockResolvedValue([
      {
        id: "1",
        title: "Test Note",
        description: "Test Description",
        audio_file: "",
      },
    ]);
    (updateNote as jest.Mock).mockRejectedValue(
      new Error("Failed to update note")
    );

    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

    render(
      <MemoryRouter initialEntries={["/update-note/1"]}>
        <Routes>
          <Route path="/update-note/:id" element={<UpdateNote />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Update Note/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Mock Save"));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("Failed to update note");
    });

    alertMock.mockRestore();
  });
});
