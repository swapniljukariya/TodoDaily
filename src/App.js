// App.js
import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthContext from "./context/AuthContext";
import './index.css';

// Import Components
import SignUp from "./Components/SignUp";
import SignIn from "./Components/SignIn";
import Home from "./Components/Home";
import Profile from "./Components/Profile";
import Layout from "./Components/Layout";
import ReelPage from "./Components/ReelPage";
import Sidebar from "./Components/Sidebar";
import Explore from "./Components/Explore";
import DummyProfile from "./Components/DummyProfile";
import CreatePost from "./Components/CreatePost";
import Message from "./Components/Message";
import ChatApp from "./Components/ChatApp";
import SearchBar from "./Components/SearchBar";
// Import Mobile Navigation Component

const App = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <Router>
      <div className="flex">
        {/* Sidebar for large screens */}
        {user && (
          <div className="hidden lg:block">
            <Sidebar />
          </div>
        )}

        {/* Mobile Navigation for small screens */}
        
        {/* Main Content */}
        <div className="flex-1">
          <Routes>
            {/* Home Route */}
            <Route path="/" element={user ? <Home /> : <Navigate to="/signin" />} />

            {/* Dynamic Profile Route */}
            <Route
              path="/profile/:username"
              element={
                user ? (
                  <Layout user={user} onLogout={logout}>
                    <Profile />
                  </Layout>
                ) : (
                  <Navigate to="/signin" />
                )
              }
            />

            {/* Reels Route */}
            <Route path="/reels" element={user ? <ReelPage /> : <Navigate to="/signin" />} />

            {/* Explore Route */}
            <Route path="/explore" element={user ? <Explore /> : <Navigate to="/signin" />} />

            {/* Dummy Profile Route */}
            <Route path="/dummy-profile/:userId" element={user ? <DummyProfile /> : <Navigate to="/signin" />} />

            {/* Create Post Route */}
            <Route path="/create" element={user ? <CreatePost /> : <Navigate to="/signin" />} />

            {/* Messages Route */}
            <Route path="/messages" element={user ? <ChatApp /> : <Navigate to="/signin" />} />

            <Route path="/search" element={user ? <SearchBar /> : <Navigate to="/signin" />} />

            {/* Auth Routes */}
            <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/" />} />
            <Route path="/signin" element={!user ? <SignIn /> : <Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
