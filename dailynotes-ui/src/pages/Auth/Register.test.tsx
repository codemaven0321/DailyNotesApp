import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "./Register";
import { registerUser } from "../../services/authService";
import { cleanup } from "@testing-library/react";
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../services/authService", () => ({
  registerUser: jest.fn(),
}));

jest.spyOn(console, "error").mockImplementation((message) => {
  if (!message.includes("ReactDOMTestUtils.act")) {
    console.error(message);
  }
});

describe("Register Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, "alert").mockImplementation(() => {}); // Mock alert
  });
  afterEach(() => {
    cleanup();
  });

  const renderComponent = () => {
    render(<Register />);
  };

  it("renders the registration form", () => {
    renderComponent();

    expect(
      screen.getByRole("heading", { name: /Register/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/User Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Register/i })
    ).toBeInTheDocument();
  });

  it("calls registerUser and navigates on successful form submit", async () => {
    (registerUser as jest.Mock).mockResolvedValueOnce(true);

    renderComponent();

    const usernameInput = screen.getByLabelText(/User Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByPlaceholderText("Your Password");
    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm Password");
    const registerButton = screen.getByRole("button", { name: /Register/i });

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123" },
    });

    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });
    });
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Registration successful! Please log in."
      );
    });
  });

  it("shows an alert when registration fails", async () => {
    (registerUser as jest.Mock).mockRejectedValueOnce(
      new Error("Registration failed")
    );

    renderComponent();

    const usernameInput = screen.getByLabelText(/User Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByPlaceholderText("Your Password");
    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm Password");
    const registerButton = screen.getByRole("button", { name: /Register/i });

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123" },
    });

    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Registration failed. Please try again."
      );
    });
  });
});
