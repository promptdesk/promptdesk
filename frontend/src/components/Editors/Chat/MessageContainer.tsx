import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import RemoveMessage from "./RemoveMessage";
import ChatMessageRole from "@/components/Editors/Chat/ChatMessageRole";
import "./MessageContainer.scss";

interface MessageContainerProps {
  index: number;
  message: any;
  roles: string[];
  onEditMessage: (index: number, content: string) => void;
  onToggleRole: (index: number, roles: string[]) => void;
}

const MessageContainer: React.FC<MessageContainerProps> = ({ index, message, roles, onEditMessage, onToggleRole }) => {
  const textAreaRef = useRef<HTMLDivElement | null>(null);

  let defaultRole = message.role || roles[0];

  useEffect(() => {
    const messageText = message.content || "";
    if (textAreaRef.current) {
      textAreaRef.current.innerHTML = messageText;
    }
  }, [message]);

  const handleRoleToggle = () => {
    onToggleRole(index, roles);
  };

  const handleTextAreaChange = () => {
    let text = textAreaRef.current?.innerHTML || "";

    //remove all formatting
    //text = text.replace(/(<([^>]+)>)/gi, "");

    onEditMessage(index, text);
  };
  
  const article = defaultRole.startsWith("u") ? "an" : "a";
  const placeholder = `Enter ${article} ${defaultRole} message here.`;

  return (
    <div className="chat-pg-message">
      <ChatMessageRole defaultRole={defaultRole} onRoleToggle={handleRoleToggle} />
      <div className="text-input-with-focus">
        <div
          className="text-input-md text-input chat-message-input"
          contentEditable={true}
          tabIndex={0}
          ref={textAreaRef}
          placeholder={placeholder}
          suppressContentEditableWarning={true}
          onInput={handleTextAreaChange}
        />
      </div>
      <RemoveMessage index={index} />
    </div>
  );
};

MessageContainer.propTypes = {
  index: PropTypes.number.isRequired,
  message: PropTypes.object.isRequired,
  onEditMessage: PropTypes.func.isRequired,
  onToggleRole: PropTypes.func.isRequired,
  roles: PropTypes.array.isRequired,
};

export default MessageContainer;