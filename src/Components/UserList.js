// components/MessageList.jsx
import React, { useState } from 'react';

const UserList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample data matching your screenshot structure
  const [messages] = useState([
    {
      id: 1,
      user: {
        name: "Simple Bhabhi Simps",
        username: "support",
        avatar: "https://example.com/avatar1.jpg"
      },
      content: "sent a photo",
      time: "56m"
    },
    {
      id: 2,
      user: {
        name: "haunting_tales",
        username: "haunting_tales",
        avatar: "https://example.com/avatar2.jpg"
      },
      content: "sent an attachment",
      time: "1h"
    },
    // Add other entries from your screenshot
  ]);

  // Filter messages based on search query
  const filteredMessages = messages.filter(message =>
    message.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen bg-gray-100 p-4">
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search messages"
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Your Note Section */}
      <div className="bg-white rounded-lg p-4 mb-6 shadow-md">
        <h2 className="text-lg font-bold mb-2">Your note</h2>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-300"></div>
          <div>
            <p className="font-semibold">SAMBIT</p>
            <p className="text-gray-600 text-sm">Shwendra Prat...</p>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">Messages</h2>
        </div>

        {filteredMessages.map((message) => (
          <div 
            key={message.id}
            className="p-4 border-b hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <img
                src={message.user.avatar}
                alt={message.user.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{message.user.name}</h3>
                  <span className="text-sm text-gray-500">{message.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600 text-sm">
                    @{message.user.username} · {message.content}
                  </p>
                  {/* Add reaction indicators here */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Haunting Tales Section */}
      <div className="mt-6 bg-white rounded-lg p-4 shadow-md">
        <h2 className="text-lg font-bold mb-4">haunting_tales</h2>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-gray-600">
            <span>•</span>
            <span>Weld 10:20</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <span>•</span>
            <span>normie_aseku</span>
          </div>
          {/* Add other list items */}
        </div>
      </div>
    </div>
  );
};

export default UserList;