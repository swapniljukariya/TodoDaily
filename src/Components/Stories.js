import React, { useState, useEffect, useRef } from "react";
import { users } from "../DummyData/UserDummyData";
import { FaArrowLeft, FaArrowRight, FaTimes, FaPlus } from "react-icons/fa";

const Stories = () => {
  const [activeStory, setActiveStory] = useState(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef(null);

  const [myStories, setMyStories] = useState([]);
  const fileInputRef = useRef(null);

  // Handle File Upload and call backend API
  const handleFileUpload = async (e) => {
    console.log("Upload triggered");
    const file = e.target.files[0];
    if (!file) return;

    // Create a story object
    const newStory = {
      type: file.type.startsWith("video") ? "video" : "image",
      mediaUrl: URL.createObjectURL(file),
      createdAt: new Date().toISOString(),
    };

    // Update the UI immediately
    setMyStories((prev) => [newStory, ...prev]);

    // Prepare the payload (backend expects an array of stories)
    const payload = {
      stories: [newStory],
    };

    try {
      // Get the auth token if available (adjust based on your auth implementation)
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8001/stories/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error uploading story:", errorData);
      } else {
        const data = await response.json();
        console.log("Story uploaded successfully:", data);
      }
    } catch (error) {
      console.error("Error uploading story:", error);
    }

    e.target.value = null; // Reset file input
  };

  // Render "Your Story" section
  const renderYourStory = () => (
    <div className="flex-shrink-0 cursor-pointer">
      <div
        className={`relative w-24 h-24 rounded-full p-1 flex items-center justify-center hover:scale-105 transition-all ${
          myStories.length > 0
            ? "border-2 border-pink-500"
            : "border-2 border-gray-300 bg-gray-100"
        }`}
        onClick={() => {
          if (myStories.length > 0) {
            handleStoryClick({
              _id: "currentUser",
              username: "Your Story",
              avatar: myStories[0].mediaUrl,
              stories: myStories,
            });
          } else {
            fileInputRef.current?.click();
          }
        }}
      >
        {myStories.length > 0 ? (
          <img
            src={myStories[0].mediaUrl}
            alt="Your story"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <FaPlus className="text-gray-600 text-3xl" />
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*, video/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      <p className="text-center mt-1 text-sm text-gray-700 w-24">Your Story</p>
    </div>
  );

  // Handle Story Click
  const handleStoryClick = (user) => {
    setActiveStory(user);
    setCurrentStoryIndex(0);
    setProgress(0);
  };

  const handleCloseStory = () => {
    setActiveStory(null);
  };

  const handleNextStory = () => {
    if (currentStoryIndex < activeStory.stories.length - 1) {
      setCurrentStoryIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      handleCloseStory();
    }
  };

  const handlePreviousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  return (
    <div className="relative mb-1">
      <div className="flex space-x-6 px-6 py-4 bg-white overflow-x-auto scrollbar-hide max-w-5xl mx-auto">
        {renderYourStory()}
        {users.map((user) => (
          <div key={user._id} className="flex-shrink-0 cursor-pointer">
            <div
              className="relative w-24 h-24 border-2 border-pink-500 rounded-full p-1 hover:scale-105 transition-all"
              onClick={() => handleStoryClick(user)}
            >
              <img
                src={user.avatar}
                alt={user.username}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <p className="text-center mt-1 text-sm text-gray-700 truncate w-24">
              {user.username}
            </p>
          </div>
        ))}
      </div>

      {activeStory && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-[999]">
          <div className="relative w-full max-w-xl aspect-[9/16] bg-black shadow-lg flex flex-col">
            <div className="absolute top-4 left-4 right-4 flex space-x-1">
              {activeStory.stories.map((_, index) => (
                <div
                  key={index}
                  className="h-1 flex-1 bg-gray-600 rounded-full overflow-hidden"
                >
                  <div
                    className={`h-full ${
                      index <= currentStoryIndex ? "bg-white" : "bg-gray-500"
                    }`}
                    style={{
                      width:
                        index === currentStoryIndex ? `${progress}%` : "100%",
                    }}
                  ></div>
                </div>
              ))}
            </div>

            <button
              onClick={handleCloseStory}
              className="absolute top-4 right-4 text-white text-2xl"
            >
              <FaTimes />
            </button>

            <div
              className="relative h-full w-full flex items-center justify-center"
              onMouseDown={() => setIsPaused(true)}
              onMouseUp={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
            >
              {activeStory.stories[currentStoryIndex]?.type === "image" ? (
                <img
                  src={activeStory.stories[currentStoryIndex].mediaUrl}
                  alt="story"
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  ref={videoRef}
                  src={activeStory.stories[currentStoryIndex].mediaUrl}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                />
              )}
            </div>

            <div className="absolute inset-0 flex items-center justify-between px-4">
              <button
                onClick={handlePreviousStory}
                className="text-white text-2xl bg-black/50 rounded-full p-2 hover:bg-black/70 transition-all"
              >
                <FaArrowLeft />
              </button>
              <button
                onClick={handleNextStory}
                className="text-white text-2xl bg-black/50 rounded-full p-2 hover:bg-black/70 transition-all"
              >
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stories;
