import React, { createContext, useState, ReactNode, useEffect } from "react";
import { loginUser, registerUser } from "../services/authService";

interface AuthContextProps {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  login: async () => {},
  logout: () => {},
});

interface AuthProviderProps {
    children: ReactNode; // Define children explicitly
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("AuthToken");
    if (token) {
      // Set user based on token (decode or fetch user info from API)
      setUser({ name: "Victor" }); // Replace with actual user fetching logic
    }
  }, []);

  const login = async (email: string, password: string) => {
    // const response = await loginUser({ email, password });
    // setUser(response.data.user);
    // localStorage.setItem("token", response.data.token);
    const response = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoidmljdG9yIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiI0IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsIkVtYWlsIjoidmljdG9yQGdtYWlsLmNvbSIsImV4cCI6MTczNjk0OTkwMSwiaXNzIjoiUmVzdEFwaSIsImF1ZCI6IlJlc3RBcGkifQ.K0_9ZOIiyRYM98yW-Keg28XKCY5Vye8c5pdyG4qgVo0";
    setUser({email: email, password: password});
    localStorage.setItem('AuthToken', response);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("AuthToken");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
