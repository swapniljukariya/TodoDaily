import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create Context
const FollowingContext = createContext();

// Context Provider Component
export const FollowingProvider = ({ children }) => {
  const [following, setFollowing] = useState([]); // List of users you are following
  const [followers, setFollowers] = useState([]); // List of users following you
  const [loading, setLoading] = useState(true);

  // Fetch following and followers data from the backend
  const fetchFollowingData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/follow`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFollowing(response.data.following);
      setFollowers(response.data.followers);
    } catch (error) {
      console.error("Error fetching following data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add a user to the following list
  const followUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/follow/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchFollowingData(); // Refresh the list
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  // Remove a user from the following list
  const unfollowUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/follow/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchFollowingData(); // Refresh the list
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchFollowingData();
  }, []);

  return (
    <FollowingContext.Provider
      value={{ following, followers, loading, followUser, unfollowUser }}
    >
      {children}
    </FollowingContext.Provider>
  );
};

// Custom Hook to use the context
export const useFollowing = () => useContext(FollowingContext);