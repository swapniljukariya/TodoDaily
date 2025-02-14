// Message.jsx
import React from 'react';

const Message = ({ message, isSender }) => {
  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isSender
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100'
        }`}
      >
        <p>{message.text}</p>
        <div className="flex items-center justify-end space-x-1 mt-1">
          <span className="text-xs opacity-70">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
          {isSender && (
            <span className="text-xs">
              {message.seen ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
export default Message;