import React, { useState, useContext } from "react";
import SocketContext from "../context/SocketContext";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import UserSearch from "./UserSearch";
import { useAuth } from "../context/AuthContext";
import InputBar from "./InputBar";

const ChatApp = () => {
  const { user } = useAuth();
  const currentUserId = user?._id;
  const socket = useContext(SocketContext);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);

  const handleSelectUser = (selectedUser) => {
    const existingChat = chats.find((chat) => chat.user._id === selectedUser._id);

    if (existingChat) {
      setSelectedChat(existingChat);
    } else {
      const newChat = { user: selectedUser, messages: [] };
      setChats((prev) => [...prev, newChat]);
      setSelectedChat(newChat);
    }

    if (currentUserId && selectedUser?._id) {
      socket.emit("joinRoom", { sender: currentUserId, receiver: selectedUser._id });
    }
  };

  const handleSendMessage = (message) => {
    if (selectedChat) {
      const updatedChat = {
        ...selectedChat,
        messages: [...selectedChat.messages, { text: message, sender: currentUserId }],
      };
      setSelectedChat(updatedChat);
      setChats((prev) =>
        prev.map((chat) =>
          chat.user._id === selectedChat.user._id ? updatedChat : chat
        )
      );
      socket.emit("sendMessage", {
        sender: currentUserId,
        receiver: selectedChat.user._id,
        message,
      });
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br ml-16 from-pink-100 to-purple-100">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 shadow-lg">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
            Messages
          </h1>
        </div>
        <UserSearch onSelectUser={handleSelectUser} />
        <ChatList chats={chats} onSelectChat={setSelectedChat} />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <ChatWindow chat={selectedChat} />
            <InputBar onSendMessage={handleSendMessage} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p className="font-bold">  Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;