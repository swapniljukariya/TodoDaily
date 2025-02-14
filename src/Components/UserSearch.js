import React, { useState } from "react";
import axios from "axios";

const UserSearch = ({ onSelectUser }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Handle search input changes
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
      if (response.data.exists) {
        setResults(response.data.users);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative p-4 border-b border-gray-200">
      {/* Search Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search for users..."
        className="w-full p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300"
      />

      {/* Search Results */}
      {query && (
        <div className="absolute w-full mt-2 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
          {isLoading ? (
            <div className="p-2 text-gray-500">Loading...</div>
          ) : results.length === 0 ? (
            <div className="p-2 text-gray-500">No users found.</div>
          ) : (
            results.map((user) => (
              <div
                key={user._id}
                onClick={() => {
                  onSelectUser(user);
                  setQuery(""); // Clear search bar after selection
                  setResults([]);
                }}
                className="flex items-center p-2 hover:bg-gray-50 cursor-pointer"
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
      )}
    </div>
  );
};

export default UserSearch;