import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import RemoveMessage from "./RemoveMessage";
import { modelStore } from "@/stores/ModelStore";
import { promptStore } from "@/stores/PromptStore";
import ChatMessageRole from "@/components/Editors/Components/ChatMessageRole";

interface MessageContainerProps {
  index: number;
}

const MessageContainer: React.FC<MessageContainerProps> = ({ index }) => {
  const { promptObject, editMessageAtIndex, toggleRoleAtIndex, processVariables } = promptStore();
  const { modelObject } = modelStore();
  const textAreaRef = useRef<HTMLDivElement | null>(null);

  const messages = promptObject?.prompt_data?.messages || [];
  const currentMessage = messages[index] || {};
  const defaultRole = currentMessage.role || modelObject?.model_parameters.roles[1];

  useEffect(() => {
    const messageText = currentMessage.content || "";
    if (textAreaRef.current) {
      textAreaRef.current.innerHTML = messageText;
    }
  }, [currentMessage]);

  const handleRoleToggle = () => {
    const roles = modelObject?.model_parameters.roles;
    toggleRoleAtIndex(index, roles);
  };

  const handleTextAreaChange = () => {
    editMessageAtIndex(index, textAreaRef.current?.innerHTML || "");
    processVariables(`${promptObject.prompt_data.context} ${JSON.stringify(promptObject?.prompt_data.messages)}`);
  };
  
  const article = defaultRole.startsWith("u") ? "an" : "a";
  const placeholder = `Enter ${article} ${defaultRole} message here.`;

  return (
    <div className="chat-pg-message">
      <ChatMessageRole defaultRole={defaultRole} onRoleToggle={handleRoleToggle} />
      <div className="text-input-with-focus">
        <div
          className="text-input-md text-input"
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
};

export default MessageContainer;