import React, { useState, useRef, useContext } from "react";
import Picker from "@emoji-mart/react";
import { Camera, Smile, Image, Video, Send } from "lucide-react";
import { useAuth } from "../context/AuthContext";




const CreatePost = () => {
  // State to hold post text, media files, and UI flags
  const [mediaFiles, setMediaFiles] = useState([]);
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user } = useAuth() 

  // Refs for video, media stream, recorder, and recorded chunks
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  // Simulated compression function (replace with a real compression function if needed)
  const compressMedia = (fileBlob) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(fileBlob), 1000);
    });
  };

  // ==============================
  // 1) MULTIPLE FILE UPLOAD
  // ==============================
  const handleFileChange = async (e) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const filesArray = Array.from(selectedFiles);
    for (const file of filesArray) {
      const isVideo = file.type.startsWith("video");
      const compressed = await compressMedia(file);
      const previewUrl = URL.createObjectURL(compressed);
      setMediaFiles((prev) => [
        ...prev,
        { type: isVideo ? "video" : "image", url: previewUrl },
      ]);
    }
  };

  // ==============================
  // 2) CAMERA OPEN / CLOSE
  // ==============================
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraOpen(true);
    } catch (error) {
      console.error("Error opening camera:", error);
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraOpen(false);
  };

  // ==============================
  // 3) TAKE PHOTO
  // ==============================
  const takePicture = async () => {
    if (!streamRef.current) return;

    try {
      const track = streamRef.current.getVideoTracks()[0];
      const imageCapture = new ImageCapture(track);
      const blob = await imageCapture.takePhoto();
      const compressed = await compressMedia(blob);
      const previewUrl = URL.createObjectURL(compressed);

      setMediaFiles((prev) => [
        ...prev,
        { type: "image", url: previewUrl },
      ]);
    } catch (err) {
      console.error("Error taking photo:", err);
    }
  };

  // ==============================
  // 4) RECORD VIDEO (Manual Start/Stop)
  // ==============================
  const startRecording = () => {
    if (!streamRef.current) return;

    recordedChunksRef.current = [];
    const recorder = new MediaRecorder(streamRef.current);

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    recorder.onstop = async () => {
      const videoBlob = new Blob(recordedChunksRef.current, { type: "video/mp4" });
      recordedChunksRef.current = [];
      const compressed = await compressMedia(videoBlob);
      const previewUrl = URL.createObjectURL(compressed);

      setMediaFiles((prev) => [
        ...prev,
        { type: "video", url: previewUrl },
      ]);
    };

    recorder.start();
    mediaRecorderRef.current = recorder;
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  // ==============================
  // 5) EMOJI HANDLER
  // ==============================
  const addEmoji = (emoji) => {
    setText((prev) => prev + emoji.native);
  };

  // ==============================
  // 6) POST HANDLER
  // ==============================
  const handlePost = async () => {
    const postData = {
      userId: user.id, // Use dynamic user ID
      username: user.username, // Use dynamic username
      avatar: user.avatar, // Use dynamic avatar URL
      text,
      mediaUrl: mediaFiles,
      mediaType: mediaFiles.length > 0 ? mediaFiles[0].type : null,
      likes: [],
      comments: [],
    };

    try {
      const response = await fetch("http://localhost:8001/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        console.error("Failed to post data");
        return;
      }
      const result = await response.json();
      console.log("Post saved:", result);

      // Clear the form after a successful post
      setText("");
      setMediaFiles([]);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  return (
    <div className="p-6 border rounded-2xl shadow-lg w-full max-w-lg mx-auto bg-white flex flex-col items-center">
      {/* Caption Textarea */}
      <textarea
        className="w-full p-4 border rounded-xl text-lg outline-none resize-none focus:ring-2 focus:ring-blue-500 shadow-md"
        placeholder="What's on your mind?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {/* Buttons Row */}
      <div className="flex items-center justify-center gap-4 mt-4">
        {/* Multi-file upload */}
        <label className="cursor-pointer flex flex-col items-center text-blue-500 hover:text-blue-700 bg-gray-100 p-2 rounded-full shadow-md">
          <Image size={24} />
          <input
            type="file"
            multiple
            accept="image/*, video/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* Open/Close Camera */}
        {!cameraOpen ? (
          <button
            className="flex flex-col items-center text-green-500 hover:text-green-700 bg-gray-100 p-2 rounded-full shadow-md"
            onClick={openCamera}
          >
            <Camera size={24} />
          </button>
        ) : (
          <button
            className="flex flex-col items-center text-gray-500 hover:text-gray-700 bg-gray-100 p-2 rounded-full shadow-md"
            onClick={closeCamera}
          >
            Close
          </button>
        )}

        {/* Emoji Picker */}
        <button
          className="flex flex-col items-center text-yellow-500 hover:text-yellow-700 bg-gray-100 p-2 rounded-full shadow-md"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <Smile size={24} />
        </button>
      </div>

      {/* If camera is open, show Photo + Video Recording buttons */}
      {cameraOpen && (
        <div className="mt-4 flex gap-4">
          <button
            onClick={takePicture}
            className="bg-green-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-green-700 flex items-center gap-2"
          >
            <Camera size={20} />
            Take Photo
          </button>

          {!isRecording ? (
            <button
              onClick={startRecording}
              className="bg-red-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-red-700 flex items-center gap-2"
            >
              <Video size={20} />
              Start Video
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="bg-red-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-red-700 flex items-center gap-2"
            >
              <Video size={20} />
              Stop Video
            </button>
          )}
        </div>
      )}

      {/* Upload Progress Bar */}
      {uploadProgress > 0 && (
        <div className="w-full bg-gray-200 rounded-full mt-4">
          <div
            className="bg-blue-600 text-xs font-medium text-white text-center p-0.5 leading-none rounded-full"
            style={{ width: `${uploadProgress}%` }}
          >
            {uploadProgress}%
          </div>
        </div>
      )}

      {/* Media Preview */}
      {mediaFiles.length > 0 && (
        <div className="mt-4 w-full flex flex-col items-center gap-4">
          {mediaFiles.map((media, idx) => (
            <div key={idx} className="w-4/5 flex justify-center">
              {media.type === "video" ? (
                <video
                  src={media.url}
                  controls
                  className="rounded-xl shadow-lg w-full"
                />
              ) : (
                <img
                  src={media.url}
                  alt={`Preview ${idx}`}
                  className="rounded-xl shadow-lg w-full"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="mt-2 flex justify-center bg-white p-3 rounded-xl shadow-lg border">
          <Picker onEmojiSelect={addEmoji} />
        </div>
      )}

      {/* Live Camera Preview */}
      {cameraOpen && (
        <video
          ref={videoRef}
          autoPlay
          className="mt-4 w-4/5 rounded-xl shadow-lg"
        />
      )}

      {/* Post Button */}
      <button
        onClick={handlePost}
        className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-blue-700 flex items-center gap-2"
      >
        <Send size={20} />
        Post
      </button>
    </div>
  );
};

export default CreatePost;
