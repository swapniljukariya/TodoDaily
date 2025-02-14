import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { users } from "../DummyData/UserDummyData";
import { posts } from "../DummyData/PostDummy";
import { reels } from "../DummyData/ReelData"; // Import reels data
import Post from "../Components/Post";
import ReelCard from "../Components/ReelCard"; // Import ReelCard component

const DummyProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [userReels, setUserReels] = useState([]); // State for reels
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    console.log("Current userId from URL:", userId); // Debug: Check the userId from URL

    // Find the user
    const foundUser = users.find((u) => u._id === userId);
    console.log("Found User:", foundUser); // Debug: Check the found user
    setUser(foundUser || null);

    // Filter posts for the user
    const filteredPosts = posts.filter((post) => post.userId === userId);
    console.log("Filtered Posts:", filteredPosts); // Debug: Check filtered posts
    setUserPosts(filteredPosts);

    // Filter reels for the user
    const filteredReels = reels.filter((reel) => reel.userId === userId);
    console.log("Filtered Reels:", filteredReels); // Debug: Check filtered reels
    setUserReels(filteredReels);
  }, [userId]);

  if (!user) return <div className="text-center mt-10">User not found...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Profile Header */}
      <div className="flex items-center gap-6 mb-8">
        <img
          src={user.avatar || "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-600">@{user.username}</p>
          <p className="mt-2 text-gray-800">{user.bio}</p>
          <div className="mt-4 flex gap-4 text-gray-600">
            <span>{user.followers?.length || 0} followers</span>
            <span>{user.following?.length || 0} following</span>
          </div>
        </div>
      </div>

      {/* Stories Section */}
      {user.stories && user.stories.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Stories</h2>
          <div className="flex gap-2">
            {user.stories.map((story) => (
              <div key={story._id} className="relative">
                <img
                  src={story.mediaUrl}
                  alt={story.text}
                  className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Tabs */}
      <div className="flex justify-around border-b border-gray-300 mb-4">
        <button
          onClick={() => setActiveTab("posts")}
          className={`py-2 px-4 ${
            activeTab === "posts" ? "border-b-2 border-blue-600" : "text-gray-600"
          }`}
        >
          Posts ({userPosts.length})
        </button>
        <button
          onClick={() => setActiveTab("reels")}
          className={`py-2 px-4 ${
            activeTab === "reels" ? "border-b-2 border-blue-600" : "text-gray-600"
          }`}
        >
          Reels ({userReels.length}) {/* Display the number of reels */}
        </button>
        <button
          onClick={() => setActiveTab("media")}
          className={`py-2 px-4 ${
            activeTab === "media" ? "border-b-2 border-blue-600" : "text-gray-600"
          }`}
        >
          Media (0)
        </button>
      </div>

      {/* Posts Section */}
      {activeTab === "posts" && (
        <div>
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <Post
                key={post._id}
                username={post.username}
                handle={`@${post.username}`}
                timestamp={new Date(post.createdAt).toLocaleTimeString()}
                caption={post.text}
                mediaUrl={post.mediaUrl}
                mediaType={post.mediaType}
                likes={post.likes.length}
                comments={post.comments.length}
                shares={0} // Add shares if available in the data
              />
            ))
          ) : (
            <p>No posts available</p>
          )}
        </div>
      )}

      {/* Reels Section */}
      {activeTab === "reels" && (
        <div className="h-screen w-full flex flex-col items-center overflow-y-auto snap-y snap-mandatory scrollbar-hide">
          {userReels.length > 0 ? (
            userReels.map((reel) => (
              <div key={reel._id} className="w-full flex justify-center snap-start">
                <ReelCard reel={reel} />
              </div>
            ))
          ) : (
            <p>No reels available</p>
          )}
        </div>
      )}

      {/* Empty Content for Other Tabs */}
      {activeTab !== "posts" && activeTab !== "reels" && (
        <div className="text-center text-gray-500">No content available.</div>
      )}
    </div>
  );
};

export default DummyProfile;