import React from "react";
import Post from "./Post";
import posts from "../DummyData/PostDummy";

const Posts = () => {
  return (
    <div className="sm:w-[800px] lg:w-full p-4  ">
      {/* Remove max-w-full constraint for small devices */}
      <div className="w-full space-y-6 ">
        {posts.map((post) => (
          <Post
            key={post._id}
            username={post.username}
            handle={`@${post.username}`}
            timestamp={post.createdAt}
            caption={post.text}
            mediaUrl={post.mediaUrl}
            mediaType={post.mediaType}
            likes={post.likes} // Pass the array of user IDs, not the length
            comments={post.comments}
            shares={post.shares || 0}
            avatar={post.avatar}
          />
        ))}
      </div>
    </div>
  );
};

export default Posts;