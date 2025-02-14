import Cropper from "cropperjs";

/**
 * Crop the selected image based on user input
 * @param {string} imageSrc - The image source (URL or base64)
 * @param {object} cropArea - The cropped area in pixels
 * @returns {Promise<string>} - Cropped image as a base64 string
 */
export async function getCroppedImg(imageSrc, cropArea) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous"; // Fix CORS issues
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = cropArea.width;
      canvas.height = cropArea.height;

      ctx.drawImage(
        image,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        cropArea.width,
        cropArea.height
      );

      resolve(canvas.toDataURL("image/jpeg")); // Convert cropped image to base64
    };

    image.onerror = (error) => reject(error);
  });
}
