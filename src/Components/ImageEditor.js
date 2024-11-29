import React from 'react';

const ImageEditor = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Photo Editor</h1>
      <p className="text-lg text-gray-600 mb-8">
        Here you can crop, rotate, apply filters, adjust brightness, and add text to your photo!
      </p>
      {/* Add functionality here */}
      <div className="w-96 h-96 border-2 border-dashed border-gray-300 flex items-center justify-center">
        <p className="text-gray-500">Photo editor functionality goes here.</p>
      </div>
    </div>
  );
};

export default ImageEditor;
