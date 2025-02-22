import React, { useState } from 'react';
import { FaHeart, FaRegHeart, FaComment, FaRetweet, FaShare, FaTimes, FaExpand, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Post = ({ 
  _id, // Destructure _id
  username,
  handle,
  timestamp,
  caption,
  mediaUrl = [],
  mediaType = "",
  likes = [],
  comments = [],
  shares = 0,
  avatar,
  onLike, // Destructure onLike
  onComment,
}) => {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false); // Add follow state
  const [isLiked, setIsLiked] = useState(likes.includes(user?._id));
  const [likeCount, setLikeCount] = useState(likes.length);
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentList, setCommentList] = useState(comments);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const handleLike = () => {
    if (!user) {
      alert("Please log in to like this post.");
      return;
    }

    const newLikes = isLiked
      ? likes.filter((userId) => userId !== user._id) // Unlike
      : [...likes, user._id]; // Like

    setIsLiked(!isLiked);
    setLikeCount(newLikes.length);
    onLike(_id, newLikes); // Notify parent component
  };

  const handleCommentSubmit = () => {
    if (!user) {
      alert("Please log in to comment on this post.");
      return;
    }

    if (commentText.trim()) {
      const newComment = {
        userId: user._id, // Use the current user's ID
        username: user.username, // Use the current user's username
        text: commentText,
        createdAt: new Date().toISOString(),
      };

      const updatedComments = [...comments, newComment];
      setCommentList(updatedComments);
      setCommentText("");
      onComment(_id, updatedComments); // Notify parent component
    }
  };

  const normalizedMedia = Array.isArray(mediaUrl) 
    ? mediaUrl 
    : mediaUrl 
      ? [{ url: mediaUrl, type: mediaType }] 
      : [];

  const getGridClasses = (count) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    if (count === 3) return "grid-cols-2 grid-rows-2";
    if (count >= 4) return "grid-cols-2";
    return "grid-cols-1";
  };

  const handleNextMedia = () => {
    setCurrentMediaIndex((prevIndex) => (prevIndex + 1) % normalizedMedia.length);
  };

  const handlePrevMedia = () => {
    setCurrentMediaIndex((prevIndex) => (prevIndex - 1 + normalizedMedia.length) % normalizedMedia.length);
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl mb-6 w-full max-w-full mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <div className="flex items-center">
          <img 
            src={avatar} 
            alt="Profile"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover mr-2 sm:mr-3 border-2 border-blue-300"
          />
          <div>
            <div className="flex items-center gap-1 sm:gap-2">
              <h3 className="font-bold text-gray-900 text-base sm:text-lg">{username}</h3>
              <p className="text-xs sm:text-sm text-gray-400">{handle}</p>
            </div>
            <p className="text-xs sm:text-sm text-gray-400">{timestamp}</p>
          </div>
        </div>
        {/* Follow Button */}
        <button
          onClick={() => setIsFollowing(!isFollowing)}
          className={`px-4 py-1 sm:px-5 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-md ${
            isFollowing 
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      </div>

      {/* Caption */}
      {caption && <p className="text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed">{caption}</p>}

      {/* Media (Images or Videos) */}
      {normalizedMedia.length > 0 && (
        <div className="mb-3 sm:mb-4 rounded-xl overflow-hidden border border-gray-300 shadow-sm">
          <div className={`grid gap-0.5 ${getGridClasses(normalizedMedia.length)}`}>
            {normalizedMedia.map((media, index) => (
              <div
                key={index}
                className={`
                  relative group cursor-pointer
                  ${normalizedMedia.length === 3 && index === 0 ? 'row-span-2' : ''}
                  aspect-square
                `}
                onClick={() => setSelectedMedia(media)}
              >
                {media.type === "image" ? (
                  <img
                    src={media.url}
                    alt={`Post content ${index + 1}`}
                    className="w-full h-full object-cover hover:brightness-95"
                  />
                ) : (
                  <video
                    className="w-full h-full object-cover"
                    controls={false}
                  >
                    <source src={media.url} type="video/mp4" />
                  </video>
                )}
                
                {/* Fullscreen Button */}
                <div className="absolute bottom-2 right-2 p-1.5 bg-black/50 rounded-full text-white">
                  <FaExpand className="text-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Media Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            className="absolute top-4 right-4 text-white text-2xl"
            onClick={() => setSelectedMedia(null)}
          >
            <FaTimes />
          </button>
          
          <div className="max-w-full max-h-full">
            {selectedMedia.type === "image" ? (
              <img
                src={selectedMedia.url}
                alt="Full size media"
                className="max-w-full max-h-[90vh] object-contain"
              />
            ) : (
              <video
                className="max-w-full max-h-[90vh]"
                controls
                autoPlay
              >
                <source src={selectedMedia.url} type="video/mp4" />
              </video>
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4">
        <span className="mr-4 sm:mr-5">{commentList.length.toLocaleString()} replies</span>
        <span className="mr-4 sm:mr-5">{shares.toLocaleString()} reposts</span>
        <span>{likeCount.toLocaleString()} likes</span>
      </div>

      {/* Interaction Buttons */}
      <div className="flex justify-between border-t border-gray-300 pt-2 sm:pt-3">
        <button 
          onClick={handleLike}
          className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-red-600 transition-colors font-medium text-xs sm:text-sm"
        >
          {isLiked ? <FaHeart className="text-red-600" /> : <FaRegHeart />}
          <span>Like</span>
        </button>
        
        <button 
          onClick={() => setIsCommenting(true)}
          className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium text-xs sm:text-sm"
        >
          <FaComment />
          <span>Comment</span>
        </button>
        
        <button className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-green-600 transition-colors font-medium text-xs sm:text-sm">
          <FaRetweet />
          <span>Repost</span>
        </button>
        
        <button className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-purple-600 transition-colors font-medium text-xs sm:text-sm">
          <FaShare />
          <span>Share</span>
        </button>
      </div>

      {/* Comment Modal */}
      {isCommenting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl h-[90vh] flex">
            {/* Left Side: Post Media Carousel */}
            <div className="flex-1 bg-gray-100 p-4 flex items-center justify-center relative">
              {normalizedMedia.length > 0 && (
                <>
                  <button
                    onClick={handlePrevMedia}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                  >
                    <FaChevronLeft />
                  </button>
                  <div className="w-full h-full flex items-center justify-center">
                    {normalizedMedia[currentMediaIndex].type === "image" ? (
                      <img 
                        src={normalizedMedia[currentMediaIndex].url} 
                        alt={`Post content ${currentMediaIndex + 1}`} 
                        className="w-full h-full object-contain max-h-[80vh]"
                      />
                    ) : (
                      <video 
                        key={currentMediaIndex} // Force re-render by changing the key
                        controls 
                        className="w-full h-full object-contain max-h-[80vh]"
                        autoPlay
                      >
                        <source src={normalizedMedia[currentMediaIndex].url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                  <button
                    onClick={handleNextMedia}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}
            </div>

            {/* Right Side: Comments Section */}
            <div className="flex-1 p-4 flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center border-b pb-3">
                <div className="flex items-center">
                  <img 
                    src={avatar} 
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover mr-2 border-2 border-blue-300"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{username}</h3>
                    <p className="text-xs text-gray-400">{timestamp}</p>
                  </div>
                </div>
                <button onClick={() => setIsCommenting(false)}>
                  <FaTimes className="text-gray-600 hover:text-gray-800" />
                </button>
              </div>

              {/* Caption */}
              {caption && (
                <div className="border-b py-3">
                  <p className="text-sm text-gray-700">{caption}</p>
                </div>
              )}

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto py-3">
                {commentList.map((comment, index) => (
                  <div key={index} className="text-sm text-gray-700 py-2 border-b">
                    <span className="font-semibold">{comment.username}</span> {comment.text}
                  </div>
                ))}
              </div>

              {/* Comment Input */}
              <div className="border-t pt-3">
                <textarea 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a comment..."
                  rows="2"
                ></textarea>
                <button 
                  onClick={handleCommentSubmit}
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;