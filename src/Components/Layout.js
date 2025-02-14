// src/Components/Layout.js
import React from "react";
import Sidebar from "./Sidebar"; // Import Sidebar

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar (Static) */}
      <Sidebar />

      {/* Main Content Area (Changes with Route) */}
      <div className="flex-1 overflow-y-auto p-4">{children}</div>
    </div>
  );
};

export default Layout;
