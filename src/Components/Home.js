// Home.js
import React, { useState } from "react";
import Sidebar from "../Components/Sidebar";
import RightSidebar from "../Components/RightSidebar";
import Stories from "../Components/Stories";
import Posts from "../Components/Posts";
import CreatePost from "../Components/CreatePost";

const Home = () => {
  const [posts, setPosts] = useState([]);

  const handleNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="flex w-full h-screen bg-white-400 overflow-hidden i">
      {/* Left Sidebar */}
      <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 mr-80 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          {/* Stories & CreatePost in Same Wrapper */}
          <div className="w-full flex flex-col gap-4">
            <Stories />
           
          </div>

          {/* Posts */}
          <Posts posts={posts} />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="fixed right-0 top-0 h-screen w-96 bg-white border-l ">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Home;