import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import RemoveMessage from "./RemoveMessage";
import { modelStore } from "@/stores/ModelStore";
import { promptStore } from "@/stores/PromptStore";

interface MessageContainerProps {
  index: number;
}

const MessageContainer: React.FC<MessageContainerProps> = ({ index }) => {

  const { 
    promptObject, 
    editMessageAtIndex, 
    toggleRoleAtIndex, 
    processVariables 
  } = promptStore();
  
  const { modelObject } = modelStore();
  const textAreaRef = useRef<HTMLDivElement | null>(null);
  
  const id = promptObject?.id;
  const messages = promptObject?.prompt_data?.messages || [];
  const currentMessage = messages[index] || {};
  const defaultRole = currentMessage.role || modelObject?.model_parameters.roles[1];

  const [message, setMessage] = useState("");

  useEffect(() => {
      // Instead of using the state, update the contentEditable <div> directly.
      const messageText = currentMessage.content || "";
      if (textAreaRef.current) {
        textAreaRef.current.innerHTML = messageText;
      }
  }, [id]);


  const handleRoleToggle = () => {
    const roles = modelObject?.model_parameters.roles;
    toggleRoleAtIndex(index, roles);
  };

  function handleTextAreaChange() {
    editMessageAtIndex(index, textAreaRef.current?.innerHTML || "");
    processVariables(`${promptObject.prompt_data.context} ${JSON.stringify(promptObject?.prompt_data.messages)}`);
  }
  
  const article = defaultRole.startsWith("u") ? "an" : "a";
  
  const placeholder = `Enter ${article} ${defaultRole} message here.`;

  return (
    <div className="chat-pg-message">
      <div className="chat-message-role">
        <div className="chat-message-subheading subheading">
          <span className="chat-message-role-text" onClick={handleRoleToggle}>
            {defaultRole}
          </span>
        </div>
      </div>
      <div className="text-input-with-focus">
        <div
          className="text-input-md text-input"
          contentEditable={true}
          tabIndex={0}
          ref={textAreaRef}
          placeholder={placeholder}
          suppressContentEditableWarning={true}
          onInput={handleTextAreaChange}
        >
          {message}
        </div>
      </div>
      <RemoveMessage index={index} />
    </div>
  );
};

MessageContainer.propTypes = {
  index: PropTypes.number.isRequired,
};

export default MessageContainer;