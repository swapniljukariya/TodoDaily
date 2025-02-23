// Sidebar.js
import { NavLink } from "react-router-dom";
import { useState, useContext } from "react";
import {
  HomeIcon,
  Search,
  Compass,
  Clapperboard,
  MessageCircle,
  Bell,
  PlusSquare,
  User,
  Sparkles,
  LayoutTemplate,
  Menu,
  X,
} from "lucide-react";
import AuthContext from "../context/AuthContext";
import SearchBar from "./SearchBar";

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSearch = () => setIsSearchOpen(false);

  return (
    <>
      {/* Mobile Hamburger Menu */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar Container */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed left-0 top-0 h-screen w-64 bg-white text-black p-8 flex flex-col font-sans shadow-lg z-30 transition-transform duration-300`}
      >
        {/* Mobile Close Button */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        {/* Brand Logo */}
        <h1 className="text-2xl font-bold mb-6 px-2 text-red-500">BuzzSocial</h1>

        {/* Navigation Menu */}
        <nav className="space-y-2 flex-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 ${
                isActive ? "bg-gray-100 font-semibold" : ""
              }`
            }
          >
            <HomeIcon size={20} />
            <span>Home</span>
          </NavLink>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 w-full text-left"
          >
            <Search size={20} />
            <span>Search</span>
          </button>

          <NavLink
            to="/explore"
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 ${
                isActive ? "bg-gray-100 font-semibold" : ""
              }`
            }
          >
            <Compass size={20} />
            <span>Explore</span>
          </NavLink>

          <NavLink
            to="/reels"
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 ${
                isActive ? "bg-gray-100 font-semibold" : ""
              }`
            }
          >
            <Clapperboard size={20} />
            <span>Reels</span>
          </NavLink>

          <NavLink
            to="/messages"
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 ${
                isActive ? "bg-gray-100 font-semibold" : ""
              }`
            }
          >
            <MessageCircle size={20} />
            <span>Messages</span>
          </NavLink>

          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 ${
                isActive ? "bg-gray-100 font-semibold" : ""
              }`
            }
          >
            <Bell size={20} />
            <span>Notifications</span>
          </NavLink>

          <NavLink
            to="/create"
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 ${
                isActive ? "bg-gray-100 font-semibold" : ""
              }`
            }
          >
            <PlusSquare size={20} />
            <span>Create</span>
          </NavLink>

          <NavLink
            to={`/profile/${user?.username}`}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 ${
                isActive ? "bg-gray-100 font-semibold" : ""
              }`
            }
          >
            <User size={20} />
            <span>Profile</span>
          </NavLink>

          <NavLink
            to="/ai-studio"
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 ${
                isActive ? "bg-gray-100 font-semibold" : ""
              }`
            }
          >
            <Sparkles size={20} />
            <span>AI Studio</span>
          </NavLink>

          <NavLink
            to="/threads"
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 ${
                isActive ? "bg-gray-100 font-semibold" : ""
              }`
            }
          >
            <LayoutTemplate size={20} />
            <span>Threads</span>
          </NavLink>

          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
            <Menu size={20} />
            <span>More</span>
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          {user ? (
            <NavLink
              to={`/profile/${user.username}`}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <img
                src= {user.avatar || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}
                className="w-8 h-8 rounded-full object-cover"
                alt="Profile"
              />
              <div>
                <p className="font-semibold text-sm">{user.name || "User"}</p>
                <p className="text-gray-600 text-xs">@{user.username || "username"}</p>
              </div>
            </NavLink>
          ) : (
            <p className="text-gray-400 text-sm">Please log in</p>
          )}
        </div>
      </div>

      {/* Search Modal */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeSearch}
        >
          <div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[450px] bg-white shadow-2xl rounded-lg p-4 border z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeSearch}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <SearchBar onClose={closeSearch} />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;