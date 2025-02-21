import React from "react";
import Post from "./Post";
import posts from "../DummyData/PostDummy";

const Posts = () => {
  return (
    <div className="w-full p-4 sm:p-6">
      {/* Constrain width for small devices */}
      <div className="max-w-full mx-auto w-full sm:w-11/12 md:w-10/12 lg:w-full space-y-6">
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