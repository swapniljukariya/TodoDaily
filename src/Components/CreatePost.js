import React, { useState, useRef, useEffect } from "react";
import Picker from "@emoji-mart/react";
import { Camera, Smile, Image, Video, Send, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const CreatePost = () => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user } = useAuth();

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // ========================
  // Camera Functions
  // ========================
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      setCameraOpen(true);
    } catch (error) {
      alert("Camera access required for this feature!");
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraOpen(false);
  };

  // ========================
  // Media Handling
  // ========================
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    const newMedia = files.map(file => ({
      type: file.type.startsWith("video") ? "video" : "image",
      file,
      url: URL.createObjectURL(file),
    }));
    setMediaFiles(prev => [...prev, ...newMedia]);
  };

  const removeMedia = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  // ========================
  // Photo/Video Capture
  // ========================
  const takePicture = async () => {
    if (!streamRef.current) return;

    try {
      const track = streamRef.current.getVideoTracks()[0];
      const imageCapture = new ImageCapture(track);
      const blob = await imageCapture.takePhoto();

      const newMediaFile = {
        type: "image",
        file: blob,
        url: URL.createObjectURL(blob),
      };

      setMediaFiles(prev => [...prev, newMediaFile]);
    } catch (err) {
      console.error("Error taking photo:", err);
      alert("Failed to take photo. Please try again.");
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;

    recordedChunksRef.current = [];
    mediaRecorderRef.current = new MediaRecorder(streamRef.current);
    mediaRecorderRef.current.ondataavailable = (e) => {
      recordedChunksRef.current.push(e.data);
    };
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: "video/mp4" });
      recordedChunksRef.current = [];

      const newMediaFile = {
        type: "video",
        file: blob,
        url: URL.createObjectURL(blob),
      };

      setMediaFiles(prev => [...prev, newMediaFile]);
      setIsRecording(false);
    };
  };

  // ========================
  // Post Submission
  // ========================
  const handlePost = async () => {
    try {
      if (!text.trim() && mediaFiles.length === 0) {
        return alert("Post cannot be empty!");
      }

      const formData = new FormData();
      formData.append("userId", user._id);
      formData.append("text", text);
      formData.append("username", user.username);
      formData.append("avatar", user.avatar);

      mediaFiles.forEach((media, index) => {
        const file = new File([media.file], 
          `${media.type}-${Date.now()}.${media.type === 'video' ? 'mp4' : 'jpg'}`, 
          { type: media.file.type }
        );
        formData.append("mediaUrl", file);
      });

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/posts`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Post failed");
      }

      const result = await response.json();
      alert("Post created successfully!");
      setText("");
      setMediaFiles([]);
      setCameraOpen(false);

    } catch (error) {
      console.error("Post error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-2xl mx-auto">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's happening?"
        className="w-full p-4 border rounded-lg mb-4 resize-none"
        rows="3"
      />

      <div className="flex gap-4 mb-4">
        <label className="cursor-pointer text-blue-500 hover:text-blue-700">
          <Image size={24} />
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        <button
          onClick={cameraOpen ? closeCamera : openCamera}
          className="text-green-500 hover:text-green-700"
        >
          {cameraOpen ? <X size={24} /> : <Camera size={24} />}
        </button>

        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="text-yellow-500 hover:text-yellow-700"
        >
          <Smile size={24} />
        </button>
      </div>

      {showEmojiPicker && (
        <div className="mb-4">
          <Picker
            onEmojiSelect={(emoji) => setText(prev => prev + emoji.native)}
            theme="light"
          />
        </div>
      )}

      {cameraOpen && (
        <div className="mb-4">
          <video ref={videoRef} autoPlay className="w-full rounded-lg" />
          <div className="flex gap-4 mt-2">
            <button
              onClick={takePicture}
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Take Photo
            </button>
            {isRecording ? (
              <button
                onClick={stopRecording}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Stop Recording
              </button>
            ) : (
              <button
                onClick={startRecording}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Start Recording
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 mb-4">
        {mediaFiles.map((media, index) => (
          <div key={index} className="relative">
            {media.type === "video" ? (
              <video
                src={media.url}
                controls
                className="w-full h-32 object-cover rounded-lg"
              />
            ) : (
              <img
                src={media.url}
                alt={`Media ${index}`}
                className="w-full h-32 object-cover rounded-lg"
              />
            )}
            <button
              onClick={() => removeMedia(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handlePost}
        disabled={uploadProgress > 0 && uploadProgress < 100}
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
      >
        {uploadProgress > 0 ? `Uploading... ${uploadProgress}%` : "Post"}
      </button>
    </div>
  );
};

export default CreatePost;