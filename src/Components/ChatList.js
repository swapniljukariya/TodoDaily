import React from "react";

const ChatList = ({ chats, onSelectChat }) => {
  return (
    <div className="overflow-y-auto w-48 ">
      {chats.map((chat) => (
        <div
          key={chat.user._id}
          onClick={() => onSelectChat(chat)}
          className="p-3 hover:bg-gray-50 cursor-pointer flex items-center"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            {chat.user.name[0]}
          </div>
          <div className="ml-3">
            <p className="font-semibold text-gray-800">{chat.user.name}</p>
            <p className="text-sm text-gray-500">
              {chat.messages.length > 0
                ? chat.messages[chat.messages.length - 1].text
                : "No messages yet"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;