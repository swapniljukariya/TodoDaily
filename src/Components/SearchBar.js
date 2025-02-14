import React, { useState, useEffect } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const navigate = useNavigate();

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedRecentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(savedRecentSearches);
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = (user) => {
    const updatedRecentSearches = [
      user,
      ...recentSearches.filter((u) => u._id !== user._id),
    ].slice(0, 5); // Keep only the last 5 searches
    setRecentSearches(updatedRecentSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedRecentSearches));
  };

  const handleSearch = async (searchQuery) => {
    setQuery(searchQuery);
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:8001/api/users/search", {
        params: { query: searchQuery },
      });
      setResults(response.data.exists ? response.data.users : []);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserClick = (user) => {
    saveRecentSearch(user); // Save to recent searches
    navigate(`/profile/${user._id}`); // Navigate to the user's profile
    onClose(); // Close the search popup
  };

  // Dummy data for suggested users
  

  return (
    <div className="relative w-full h-screen">
      {/* Search Input */}
      <div className="flex items-center bg-gray-100 p-2 rounded-full absolute">
        <SearchIcon className="text-gray-500 ml-2" size={18} />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search users..."
          className="flex-grow px-2 py-1 bg-transparent outline-none text-gray-800"
        />
        {query && (
          <X
            className="text-gray-500 cursor-pointer mr-2"
            size={18}
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
          />
        )}
      </div>

      {/* Search Results Dropdown */}
      {query ? (
        <div className="absolute top-12 left-0 w-[350px] bg-white border rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-gray-500">Loading...</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-gray-500">No users found.</div>
          ) : (
            results.map((user) => (
              <div
                key={user._id}
                onClick={() => handleUserClick(user)}
                className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
              >
                <img
                  src={user.profilePic || "https://via.placeholder.com/150"}
                  className="w-10 h-10 rounded-full object-cover"
                  alt={user.username}
                />
                <div className="ml-3">
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500">@{user.username}</p>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="absolute top-12 left-0 w-[350px] bg-white border rounded-lg shadow-xl p-4">
          {/* Recent Searches */}
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800 mb-2">Recent</h3>
            {recentSearches.length > 0 ? (
              recentSearches.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleUserClick(user)}
                  className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                >
                  <img
                    src={user.profilePic || "https://via.placeholder.com/150"}
                    className="w-8 h-8 rounded-full object-cover"
                    alt={user.username}
                  />
                  <div className="ml-3">
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No recent searches.</p>
            )}
          </div>

          {/* Suggested Users */}
       
        </div>
      )}
    </div>
  );
};

export default SearchBar;