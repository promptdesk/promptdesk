import React from "react";

interface ChatMessageRoleProps {
  defaultRole: string;
  onRoleToggle: () => void;
}

const ChatMessageRole: React.FC<ChatMessageRoleProps> = ({ defaultRole, onRoleToggle }) => {
  return (
    <div className="chat-message-role">
      <div className="chat-message-subheading subheading">
        <button className="chat-message-role-text" onClick={onRoleToggle}>
          {defaultRole}
        </button>
      </div>
    </div>
  );
};

export default ChatMessageRole;