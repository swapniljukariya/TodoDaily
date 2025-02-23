// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext"; // Ensure correct import
import { SocketProvider } from "./context/SocketContext"; // Import SocketProvider
import { FollowingProvider } from "./context/FollowingContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <SocketProvider>
    <AuthProvider>
     <FollowingProvider>
      <App/>
     </FollowingProvider>
    </AuthProvider>
  </SocketProvider>
);
