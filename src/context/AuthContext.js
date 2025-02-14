import React, { createContext, useContext, useState } from "react";

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user data

  // Login function (example)
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("token", userData.token); // Store token in localStorage
  };

  // Logout function (example)
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token"); // Remove token from localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth hook
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;