import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);
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
    if (user) {
      setFormData({
        name: user.name,
        username: user.username,
        bio: user.bio,
        avatar: user.avatar
      });

      // Fetch posts
      axios.get(`http://localhost:8001/api/users/${user.id}/posts`)
        .then(res => setPosts(res.data))
        .catch(err => console.error("Posts error:", err));

      // Fetch reels
      axios.get(`http://localhost:8001/api/users/${user.id}/reels`)
        .then(res => setReels(res.data))
        .catch(err => console.error("Reels error:", err));
    }
  }, [user]);

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8001/api/users/${user.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      setUser(response.data.user);
      setIsEditing(false);
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);
    }
  };

  if (!user) return <div className="text-center mt-10">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Profile Header Section */}
      <div className="flex items-center gap-6 mb-8">
        <img
          src={user.avatar || "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover"
        />
        
        <div className="flex-1">
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
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
                  type="submit"
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

      {/* Content Tabs Section */}
      <div className="flex justify-around border-b border-gray-300 mb-4">
        <button 
          onClick={() => setActiveTab('posts')} 
          className={`py-2 px-4 ${activeTab === 'posts' ? 'border-b-2 border-blue-600' : 'text-gray-600'}`}
        >
          Posts ({posts.length})
        </button>
        <button 
          onClick={() => setActiveTab('reels')} 
          className={`py-2 px-4 ${activeTab === 'reels' ? 'border-b-2 border-blue-600' : 'text-gray-600'}`}
        >
          Reels ({reels.length})
        </button>
        <button 
          onClick={() => setActiveTab('media')} 
          className={`py-2 px-4 ${activeTab === 'media' ? 'border-b-2 border-blue-600' : 'text-gray-600'}`}
        >
          Media ({posts.length + reels.length})
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-3 gap-2">
        {activeTab === 'posts' && posts.map(post => (
          <img key={post.id} src={post.image} alt="Post" className="w-full h-48 object-cover" />
        ))}

        {activeTab === 'reels' && reels.map(reel => (
          <video key={reel.id} src={reel.video} controls className="w-full h-48 object-cover" />
        ))}

        {activeTab === 'media' && (
          <>
            {posts.map(post => (
              <img key={post.id} src={post.image} alt="Post" className="w-full h-48 object-cover" />
            ))}
            {reels.map(reel => (
              <video key={reel.id} src={reel.video} controls className="w-full h-48 object-cover" />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;