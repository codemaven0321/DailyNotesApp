import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "./Login";

const mockNavigate = jest.fn();
const mockLogin = jest.fn();

jest.mock("../../context/AuthContext", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: React.createContext(),
  };
});

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.spyOn(console, "error").mockImplementation((message) => {
  if (!message.includes("ReactDOMTestUtils.act")) {
    console.error(message);
  }
});

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    const AuthContext = require("../../context/AuthContext").default;
    return render(
      <AuthContext.Provider value={{ login: mockLogin }}>
        <Login />
      </AuthContext.Provider>
    );
  };

  it("renders the login form", () => {
    renderComponent();

    expect(screen.getByRole("heading", { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  });

  it("calls login function and navigates on form submit", async () => {
    mockLogin.mockResolvedValueOnce(true);

    renderComponent();

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole("button", { name: /Login/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123");
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows an alert when login fails", async () => {
    jest.spyOn(window, "alert").mockImplementation(() => {});
    mockLogin.mockRejectedValueOnce(new Error("Invalid credentials"));

    renderComponent();

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole("button", { name: /Login/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Login failed");
    });
  });
});
