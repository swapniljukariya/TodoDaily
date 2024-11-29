import React, { useState } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const ImageCropper = ({ image, setCroppedImage }) => {
  const [cropper, setCropper] = useState(null); // Reference to the cropper instance

  const onCrop = () => {
    if (cropper) {
      const croppedDataUrl = cropper.getCroppedCanvas().toDataURL(); // Get the cropped image as a Data URL
      setCroppedImage(croppedDataUrl); // Pass cropped image to parent component
    }
  };

  return (
    <div className="cropper-container flex justify-center items-center p-4">
      <Cropper
        src={image}
        style={{ width: '100%', height: '400px' }} // Cropper's display size
        initialAspectRatio={1} // Set aspect ratio (1:1 for square crop)
        aspectRatio={1}
        guides={true}
        ref={(cropperInstance) => setCropper(cropperInstance)} // Get reference to the cropper instance
      />
      
      {/* Crop Button */}
      <button onClick={onCrop} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Crop Image
      </button>
    </div>
  );
};

export default ImageCropper;
