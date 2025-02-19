import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { users } from "../DummyData/UserDummyData";
import { posts } from "../DummyData/PostDummy";
import { reels } from "../DummyData/ReelData";
import Post from "../Components/Post"; // Your existing Post component
import ReelCard from "../Components/ReelCard";

const DummyProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [userReels, setUserReels] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    bio: "",
    avatar: ""
  });

  // Initialize form data and fetch content
  useEffect(() => {
    // Find user
    const foundUser = users.find((u) => u._id === userId);
    setUser(foundUser || null);

    // Set form data if user is found
    if (foundUser) {
      setFormData({
        name: foundUser.name,
        username: foundUser.username,
        bio: foundUser.bio,
        avatar: foundUser.avatar
      });
    }

    // Filter posts for the user
    const filteredPosts = posts.filter((post) => post.userId === userId);
    setUserPosts(filteredPosts);

    // Filter reels for the user
    const filteredReels = reels.filter((reel) => reel.userId === userId);
    setUserReels(filteredReels);
  }, [userId]);

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = () => {
    // Update user data (for dummy data, we just update the state)
    setUser((prevUser) => ({
      ...prevUser,
      ...formData
    }));
    setIsEditing(false);
  };

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
        
        <div className="flex-1">
          {isEditing ? (
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="Full Name"
              />
              <input
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="Username"
              />
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="Bio"
                rows="3"
              />
              <input
                name="avatar"
                value={formData.avatar}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="Avatar URL"
              />
              
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleEditToggle}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-gray-600">@{user.username}</p>
              <p className="mt-2 text-gray-800">{user.bio}</p>
              
              <div className="mt-4 flex gap-4">
                <span className="text-gray-600">
                  {user.followers?.length || 0} followers
                </span>
                <span className="text-gray-600">
                  {user.following?.length || 0} following
                </span>
              </div>
              
              <button
                onClick={handleEditToggle}
                className="mt-4 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>

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
          Reels ({userReels.length})
        </button>
        <button
          onClick={() => setActiveTab("media")}
          className={`py-2 px-4 ${
            activeTab === "media" ? "border-b-2 border-blue-600" : "text-gray-600"
          }`}
        >
          Media ({userPosts.length + userReels.length})
        </button>
      </div>

      {/* Posts Section */}
      {activeTab === "posts" && (
        <div className="space-y-6">
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <Post
                key={post._id}
                _id={post._id}
                username={post.username}
                handle={`@${post.username}`}
                timestamp={new Date(post.createdAt).toLocaleTimeString()}
                caption={post.text}
                mediaUrl={post.mediaUrl}
                mediaType={post.mediaType}
                likes={post.likes}
                comments={post.comments}
                shares={0} // Add shares if available in the data
                avatar={post.avatar}
                onLike={(postId, newLikes) => {
                  // Handle like logic (update state or API call)
                  console.log("Liked post:", postId, "New likes:", newLikes);
                }}
                onComment={(postId, newComments) => {
                  // Handle comment logic (update state or API call)
                  console.log("Commented on post:", postId, "New comments:", newComments);
                }}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">No posts available</p>
          )}
        </div>
      )}

      {/* Reels Section */}
      {activeTab === "reels" && (
        <div className="space-y-6">
          {userReels.length > 0 ? (
            userReels.map((reel) => (
              <ReelCard key={reel._id} reel={reel} />
            ))
          ) : (
            <p className="text-center text-gray-500">No reels available</p>
          )}
        </div>
      )}

      {/* Media Section */}
      {activeTab === "media" && (
        <div className="grid grid-cols-3 gap-8">
          {userPosts.map((post) => (
            post.mediaUrl.map((media, index) => (
              <div key={`${post._id}-${index}`} className="relative">
                {media.type === "image" ? (
                  <img
                    src={media.url}
                    alt={`Post ${post._id} media ${index}`}
                    className="w-96  h-96 object-cover rounded-lg"
                  />
                ) : (
                  <video
                    src={media.url}
                    className="w-96 h-96 object-cover rounded-lg"
                    controls
                  />
                )}
              </div>
            ))
          ))}
        </div>
      )}
    </div>
  );
};

export default DummyProfile;