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
    const token = localStorage.getItem("authToken");
    if (token) {
      // Set user based on token (decode or fetch user info from API)
      setUser({ name: "Victor" }); // Replace with actual user fetching logic
    }
  }, []);

  const login = async (email: string, password: string) => {
    await loginUser({ email, password });
    setUser({email: email, password: password});
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken");

  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
