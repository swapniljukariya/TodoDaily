import React from 'react';
import ReelCard from './ReelCard';
import { reels } from '../DummyData/ReelData';

const ReelList = () => {
  return (
    <div className="h-screen w-full flex flex-col items-center overflow-y-auto snap-y snap-mandatory scrollbar-hide">
      {reels.map((reel) => (
        <div key={reel._id} className="w-full flex justify-center snap-start">
          <ReelCard reel={reel} />
        </div>
      ))}
    </div>
  );
};

export default ReelList;
