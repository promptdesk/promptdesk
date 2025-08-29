import React from 'react';
import { ChatMessage } from '@/../../shared/interfaces/chat';
import { CpuChipIcon } from '@heroicons/react/24/outline';

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  return (
    <div
      className={`flex gap-4 ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      {message.role === 'assistant' && (
        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <CpuChipIcon className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div
        className={`max-w-[80%] p-4 rounded-2xl ${
          message.role === 'user'
            ? 'bg-blue-600 text-white ml-auto'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        {message.isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-sm text-gray-500">Thinking...</span>
          </div>
        ) : (
          <div className="whitespace-pre-wrap">{message.content}</div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
