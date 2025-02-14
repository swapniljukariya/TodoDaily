import React, { useState, useEffect, useContext } from "react";
import Message from "./Message";
import InputBar from "./InputBar";
import SocketContext from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";

const ChatWindow = ({ chat, socket }) => {
  const { user } = useAuth(); // Get logged-in user
  const currentUserId = user?._id; // Use actual user ID
  const [messages, setMessages] = useState(chat.messages || []);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;

    const handler = (newMessage) => {
      console.log("Received message:", newMessage); // Debugging log

      // Check if the message belongs to the current chat
      if (
        (newMessage.sender === chat.user._id && newMessage.receiver === currentUserId) ||
        (newMessage.sender === currentUserId && newMessage.receiver === chat.user._id)
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.on("receiveMessage", handler);

    return () => {
      socket.off("receiveMessage", handler);
    };
  }, [chat.user._id, currentUserId, socket]);

  // Handle sending a new message
  const handleNewMessage = (text) => {
    if (!text || typeof text !== "string") return;
    const trimmedText = text.trim();
    if (!trimmedText) return;

    const newMessage = {
      sender: currentUserId, // Use actual sender ID
      receiver: chat.user._id,
      text: trimmedText,
      timestamp: new Date(),
    };

    // Emit the message to the server
    socket.emit("privateMessage", newMessage);

    // Optimistically update the UI
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center">
        <img
          src={chat.user.profilePic || "https://via.placeholder.com/150"}
          className="w-10 h-10 rounded-full"
          alt={chat.user.username}
        />
        <h2 className="ml-4 font-semibold">{chat.user.name}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <Message
            key={index} // Use index as key (or message._id if available)
            message={message}
            isSender={message.sender === currentUserId}
          />
        ))}
      </div>

      {/* Input Bar */}
      <InputBar onSendMessage={handleNewMessage} />
    </div>
  );
};

export default ChatWindow;