import React from "react";

interface ChatMessageRoleProps {
  defaultRole: string;
  onRoleToggle: () => void;
}

const ChatMessageRole: React.FC<ChatMessageRoleProps> = ({ defaultRole, onRoleToggle }) => {
  return (
    <div className="chat-message-role">
      <div className="chat-message-subheading subheading">
        <span className="chat-message-role-text" onClick={onRoleToggle}>
          {defaultRole}
        </span>
      </div>
    </div>
  );
};

export default ChatMessageRole;