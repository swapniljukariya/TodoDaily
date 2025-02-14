import React, { useRef, useState } from 'react';
import { FiHeart, FiMessageCircle, FiShare2, FiMusic } from 'react-icons/fi';
import { AiFillHeart } from 'react-icons/ai';

const ReelCard = ({ reel }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(reel.likes.length);
  const [isMuted, setIsMuted] = useState(true);

  // Handle like/unlike
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <div className="relative w-[600px] h-[90vh] bg-black rounded-lg overflow-hidden shadow-lg m-4">
      {/* Video */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        loop
        muted={isMuted}
        onClick={() => {
          if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
          } else {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }}
      >
        <source src={reel.mediaUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Like & Action Buttons */}
      <div className="absolute right-4 bottom-20 flex flex-col items-center gap-5 text-white">
        {/* Like Button */}
        <div className="flex flex-col items-center">
          <button onClick={handleLike} className="p-2 hover:scale-110 transition-transform">
            {isLiked ? <AiFillHeart className="w-8 h-8 text-red-500" /> : <FiHeart className="w-8 h-8" />}
          </button>
          <span className="text-xs font-medium">{likesCount}</span>
        </div>

        {/* Comment Button */}
        <div className="flex flex-col items-center">
          <FiMessageCircle className="w-8 h-8" />
          <span className="text-xs font-medium">{reel.comments.length}</span>
        </div>

        {/* Share Button */}
        <button className="hover:scale-110 transition-transform">
          <FiShare2 className="w-8 h-8" />
        </button>

        {/* Mute Button */}
        <button className="mt-4 hover:scale-110 transition-transform" onClick={() => setIsMuted(!isMuted)}>
          <FiMusic className="w-8 h-8" />
          <span className="text-xs block mt-1">{isMuted ? 'Unmute' : 'Mute'}</span>
        </button>
      </div>

      {/* Caption & User Info */}
      <div className="absolute bottom-4 left-4 text-white">
        {/* User Info */}
        <div className="flex items-center gap-2 mb-2">
          <img
            src={reel.profilePic} // Access `profilePic` directly from `reel`
            alt={reel.userId} // Use `userId` as the alt text
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-sm font-medium">{reel.userId}</span> {/* Use `userId` as the username */}
        </div>

        {/* Caption */}
        <p className="text-sm">{reel.caption}</p>
      </div>
    </div>
  );
};

export default ReelCard;