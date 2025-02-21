import React from "react";
import { Link } from "react-router-dom";
import { HomeIcon, ExploreIcon, AddIcon, HeartIcon, ProfileIcon } from "./Icons"; // Import your icons

const MobileNav = () => {
  return (
    <div className="flex justify-around items-center p-2">
      <Link to="/" className="flex flex-col items-center text-gray-700 hover:text-black">
        <HomeIcon className="h-6 w-6" />
        <span className="text-xs">Home</span>
      </Link>
      <Link to="/explore" className="flex flex-col items-center text-gray-700 hover:text-black">
        <ExploreIcon className="h-6 w-6" />
        <span className="text-xs">Explore</span>
      </Link>
      <Link to="/create" className="flex flex-col items-center text-gray-700 hover:text-black">
        <AddIcon className="h-6 w-6" />
        <span className="text-xs">Create</span>
      </Link>
      <Link to="/messages" className="flex flex-col items-center text-gray-700 hover:text-black">
        <HeartIcon className="h-6 w-6" />
        <span className="text-xs">Messages</span>
      </Link>
      <Link to="/profile" className="flex flex-col items-center text-gray-700 hover:text-black">
        <ProfileIcon className="h-6 w-6" />
        <span className="text-xs">Profile</span>
      </Link>
    </div>
  );
};

export default MobileNav;