import React, { useEffect, useState } from "react";
import { posts } from "../DummyData/PostDummy";

const Explore = () => {
  const [postList, setPostList] = useState([]);

  useEffect(() => {
    // Simulating API fetch
    setTimeout(() => {
      setPostList(posts);
    }, 500);
  }, []);

  return (
    <div className="explore-container p-4">
      <h1 className="text-2xl font-bold mb-4">Explore</h1>
      {postList.length === 0 ? (
        <p>Loading posts...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-4">
          {postList.map((post) => {
            const firstMedia = Array.isArray(post.mediaUrl) && post.mediaUrl.length > 0 ? post.mediaUrl[0] : null;

            return (
              firstMedia && (
                <div key={post._id} className="media-card bg-white rounded-lg overflow-hidden shadow-md">
                  {firstMedia.type === "image" ? (
                    <img src={firstMedia.url} alt="post-media" className="w-full h-80 object-cover" />
                  ) : (
                    <video controls className="w-full h-52">
                      <source src={firstMedia.url} type="video/mp4" />
                    </video>
                  )}
                </div>
              )
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Explore;
