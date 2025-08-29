import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  large?: boolean;
  autoFocus?: boolean;
}

export interface ChatInputRef {
  focus: () => void;
}

const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(({
  onSubmit,
  disabled = false,
  placeholder = "Message...",
  className = "",
  large = false,
  autoFocus = false,
}, ref) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      textareaRef.current?.focus();
    },
  }));

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;

    onSubmit(value.trim());
    setValue('');
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className={`relative bg-white border border-gray-300 ${
        large 
          ? 'rounded-2xl shadow-lg hover:shadow-xl' 
          : 'rounded-xl shadow-sm hover:shadow-md'
      } transition-shadow duration-200`}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full ${
            large 
              ? 'p-6 pr-16 text-lg min-h-[120px] max-h-[300px] rounded-2xl focus:ring-0' 
              : 'p-4 pr-16 min-h-[52px] max-h-[200px] rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          } border-0 resize-none focus:outline-none`}
          rows={large ? 3 : 1}
          disabled={disabled}
        />
        
        <button
          type="submit"
          disabled={!value.trim() || disabled}
          className={`absolute ${
            large 
              ? 'bottom-4 right-4 p-3 rounded-xl' 
              : 'bottom-3 right-3 p-2 rounded-lg'
          } bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200`}
        >
          <PaperAirplaneIcon className={large ? "w-5 h-5" : "w-4 h-4"} />
        </button>
      </div>
    </form>
  );
});

ChatInput.displayName = 'ChatInput';

export default ChatInput;
