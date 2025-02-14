import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { users } from "../DummyData/UserDummyData";
import AuthContext from "../context/AuthContext";

const RightSidebar = () => {
  const { user } = useContext(AuthContext);

  // Function to generate the profile path
  const getDummyProfilePath = (username) => {
    const profile = users.find((u) => u.username === username);
    return profile ? `/dummy-profile/${profile._id}` : "#";
  };

  return (
    <div className="w-[400px] fixed right-0 top-0 h-full hidden bg-white lg:block p-6">
      {/* Current User Profile */}
      {user && (
        <div className="flex items-center justify-between mb-6">
          <NavLink
            to={getDummyProfilePath(user.username)}
            className="flex items-center gap-4"
          >
            <img
              src={user.avatar || "https://via.placeholder.com/150"}
              className="w-14 h-14 rounded-full border"
              alt="Profile"
            />
            <div>
              <p className="font-semibold text-base">{user.username}</p>
              <p className="text-gray-500 text-sm">{user.name}</p>
            </div>
          </NavLink>
          <button className="text-blue-500 text-sm font-semibold">Switch</button>
        </div>
      )}

      {/* Suggested Users */}
      <div className="mb-6 font-poppins font-semibold text-md">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-700 font-semibold text-sm">Suggested for you</span>
          <button className="text-black text-xs font-semibold">See All</button>
        </div>

        <div className="space-y-4">
          {users.map((suggestedUser) => (
            <div key={suggestedUser._id} className="flex items-center justify-between">
              <NavLink
                to={getDummyProfilePath(suggestedUser.username)}
                className="flex items-center gap-4"
              >
                <img
                  src={suggestedUser.avatar || "https://via.placeholder.com/150"}
                  className="w-16 h-16 rounded-full border"
                  alt={suggestedUser.username}
                />
                <div>
                  <p className="font-semibold text-sm text-gray-800">{suggestedUser.username}</p>
                  <p className="text-gray-500 text-xs">{suggestedUser.name}</p>
                </div>
              </NavLink>
              <button className="text-red-500  rounded-2xl  font-semibold  p-2 text-sm ">Follow</button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Links */}
      <div className="absolute bottom-4 left-6 right-6 text-gray-500 text-xs text-center space-y-2">
        {/* ... (existing footer links) */}
      </div>
    </div>
  );
};

export default RightSidebar;