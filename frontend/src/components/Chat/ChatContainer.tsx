import React, { useRef, useEffect } from 'react';
import { chatStore } from '@/stores/ChatStore';
import MessageBubble from './MessageBubble';
import ChatInput, { ChatInputRef } from './ChatInput';
import ModelSelector from './ModelSelector';

const ChatContainer: React.FC = () => {
  const {
    currentChat,
    isLoading,
    isInitialized,
    shouldFocus,
    sendMessage,
    initializeChat,
    setShouldFocus,
  } = chatStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<ChatInputRef>(null);
  const largeInputRef = useRef<ChatInputRef>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  useEffect(() => {
    if (!isInitialized) {
      initializeChat();
    }
  }, [isInitialized, initializeChat]);

  // Auto-focus when loading is complete or when shouldFocus is triggered
  useEffect(() => {
    if ((!isLoading && isInitialized) || shouldFocus) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        // Always focus on large input for new chats (empty state)
        if (!currentChat || currentChat.messages.length === 0) {
          largeInputRef.current?.focus();
        } else {
          chatInputRef.current?.focus();
        }
        
        // Reset the shouldFocus flag
        if (shouldFocus) {
          setShouldFocus(false);
        }
      }, 100);
    }
  }, [isLoading, isInitialized, shouldFocus, currentChat, setShouldFocus]);

  const handleSendMessage = async (message: string) => {
    await sendMessage(message);
  };

  const isEmpty = !currentChat || currentChat.messages.length === 0;

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing chat...</p>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-4xl">
          {/* Welcome Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              How can I help you today?
            </h1>
            <p className="text-gray-600 text-lg">
              Start a conversation by typing your message below
            </p>
          </div>

          {/* Large Input Box */}
          <div className="relative">
            <div className="mb-4">
              <ModelSelector compact={true} />
            </div>
            <ChatInput
              ref={largeInputRef}
              onSubmit={handleSendMessage}
              disabled={isLoading}
              placeholder="Message..."
              className="w-full"
              large={true}
              autoFocus={true}
            />
            <p className="text-sm text-gray-500 text-center mt-4">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {currentChat.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Container */}
      <div className="border-t border-gray-200">
        <ModelSelector />
        <div className="p-4">
          <div className="max-w-4xl mx-auto">
            <ChatInput
              ref={chatInputRef}
              onSubmit={handleSendMessage}
              disabled={isLoading}
              placeholder="Message..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
