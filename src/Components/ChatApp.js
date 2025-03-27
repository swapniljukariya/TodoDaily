import React, { useState, useContext } from "react";
import SocketContext from "../context/SocketContext";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import UserSearch from "./UserSearch";
import { useAuth } from "../context/AuthContext";
import InputBar from "./InputBar";
import { Menu, X } from "lucide-react";

const ChatApp = () => {
  const { user } = useAuth();
  const currentUserId = user?._id;
  const socket = useContext(SocketContext);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
        prev.map((chat) => (chat.user._id === selectedChat.user._id ? updatedChat : chat))
      );
      socket.emit("sendMessage", {
        sender: currentUserId,
        receiver: selectedChat.user._id,
        message,
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-80" : "w-0"
        } bg-white border-r border-gray-200 shadow-lg transition-all duration-300 overflow-hidden`}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-700">Messages</h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>
        <UserSearch onSelectUser={handleSelectUser} />
        <ChatList chats={chats} onSelectChat={setSelectedChat} />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 bg-white border-b border-gray-200 flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mr-4"
          >
            <Menu className="w-6 h-6" />
          </button>
          {selectedChat ? (
            <h2 className="text-lg font-semibold text-gray-700">
              {selectedChat.user.name}
            </h2>
          ) : (
            <h2 className="text-lg text-gray-400">Select a chat</h2>
          )}
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col justify-between bg-gray-50 p-4">
          {selectedChat ? (
            <>
              <ChatWindow chat={selectedChat} />
              <InputBar onSendMessage={handleSendMessage} />
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p className="font-bold">Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
