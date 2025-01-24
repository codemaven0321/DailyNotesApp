import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Dashboard from "./Dashboard";
import { fetchNotes, deleteNote } from "../services/noteService";
import { useNavigate } from "react-router-dom";

jest.mock("../services/noteService", () => ({
  fetchNotes: jest.fn(),
  deleteNote: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("../components/NoteItem", () => ({
  __esModule: true,
  default: ({ note, onDelete, onEdit }: any) => (
    <div data-testid="note-item">
      <h3>{note.title}</h3>
      <p>{note.description}</p>
      <button onClick={() => onDelete(note.id)}>Delete</button>
      <button onClick={() => onEdit(note.id)}>Edit</button>
    </div>
  ),
}));

jest.spyOn(console, "error").mockImplementation((message) => {
  if (!message.includes("ReactDOMTestUtils.act")) {
    console.error(message);
  }
});

describe("Dashboard Component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });

  it("renders loading state initially", async () => {
    (fetchNotes as jest.Mock).mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<Dashboard />);

    expect(
      screen.getByText("Loading notes...", { exact: false })
    ).toBeInTheDocument();
  });

  it("renders error state when fetch fails", async () => {
    (fetchNotes as jest.Mock).mockRejectedValueOnce(new Error("Fetch failed"));

    render(<Dashboard />);

    await waitFor(() => {
      expect(
        screen.getByText("Fetch failed. Please try again later.")
      ).toBeInTheDocument();
    });
  });

  it("renders notes when fetch succeeds", async () => {
    (fetchNotes as jest.Mock).mockResolvedValueOnce([
      { id: "1", title: "Note 1", description: "Description 1" },
      { id: "2", title: "Note 2", description: "Description 2" },
    ]);

    render(<Dashboard />);

    await waitFor(() => {
      const noteItems = screen.getAllByTestId("note-item");
      expect(noteItems).toHaveLength(2);
    });
    await waitFor(() => {
      const noteItems = screen.getAllByTestId("note-item");
      expect(noteItems[0]).toHaveTextContent("Note 1");
    });
    await waitFor(() => {
      const noteItems = screen.getAllByTestId("note-item");
      expect(noteItems[1]).toHaveTextContent("Note 2");
    });
  });

  it("navigates to create note on button click", async () => {
    (fetchNotes as jest.Mock).mockResolvedValueOnce([]);

    render(<Dashboard />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Create Note/i })
      ).toBeInTheDocument();
    });

    const createButton = screen.getByRole("button", { name: /Create Note/i });
    fireEvent.click(createButton);

    expect(mockNavigate).toHaveBeenCalledWith("/notes/create");
  });

  it("deletes a note and updates the list", async () => {
    (fetchNotes as jest.Mock).mockResolvedValueOnce([
      { id: "1", title: "Note 1", description: "Description 1" },
    ]);

    (deleteNote as jest.Mock).mockResolvedValueOnce(true);

    render(<Dashboard />);

    await waitFor(() => {
      const noteItem = screen.getByTestId("note-item");
      expect(noteItem).toBeInTheDocument();
    });

    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteNote).toHaveBeenCalledWith("1");
    });
    await waitFor(() => {
      expect(screen.queryByTestId("note-item")).not.toBeInTheDocument();
    });
  });

  it("shows an alert when delete fails", async () => {
    jest.spyOn(window, "alert").mockImplementation(() => {});
    (fetchNotes as jest.Mock).mockResolvedValueOnce([
      { id: "1", title: "Note 1", description: "Description 1" },
    ]);

    (deleteNote as jest.Mock).mockRejectedValueOnce(new Error("Delete failed"));

    render(<Dashboard />);

    await waitFor(() => {
      const noteItem = screen.getByTestId("note-item");
      expect(noteItem).toBeInTheDocument();
    });

    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteNote).toHaveBeenCalledWith("1");
    });
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Failed to delete note");
    });
  });

  it("navigates to edit note on button click", async () => {
    (fetchNotes as jest.Mock).mockResolvedValueOnce([
      { id: "1", title: "Note 1", description: "Description 1" },
    ]);

    render(<Dashboard />);

    await waitFor(() => {
      const noteItem = screen.getByTestId("note-item");
      expect(noteItem).toBeInTheDocument();
    });

    const editButton = screen.getByText("Edit");
    fireEvent.click(editButton);

    expect(mockNavigate).toHaveBeenCalledWith("/notes/update/1");
  });
});
