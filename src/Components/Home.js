import React, { useState } from "react";
import Sidebar from "../Components/Sidebar";
import RightSidebar from "../Components/RightSidebar";
import Stories from "../Components/Stories";
import Posts from "../Components/Posts";
import MobileNav from "../Components/MobileNav"; // Import Mobile Navigation Component

const Home = () => {
  const [posts, setPosts] = useState([]);

  const handleNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="flex w-full h-screen bg-white-400 overflow-hidden">
      {/* Left Sidebar - Hidden on small screens */}
      <div className="hidden lg:block fixed left-0 top-0 h-screen w-64 bg-white">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 lg:mr-80 overflow-y-auto">
        {/* Constrain width for small devices */}
        <div className="w-full max-w-full lg:max-w-4xl mx-auto px-4 sm:px-6 py-6">
          {/* Stories Section */}
          <div className="w-full">
            <Stories />
          </div>

          {/* Posts Section */}
          <div className="w-full mt-4">
            <Posts posts={posts} />
          </div>
        </div>
      </div>

      {/* Right Sidebar - Hidden on small screens */}
      <div className="hidden lg:block fixed right-0 top-0 h-screen w-96 bg-white">
        <RightSidebar />
      </div>

      {/* Mobile Navigation - Visible only on small screens */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200">
        <MobileNav />
      </div>
    </div>
  );
};

export default Home;