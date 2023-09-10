import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import RemoveMessage from "./RemoveMessage";
import { modelStore } from "@/stores/ModelStore"; // Combine imports if possible
import { promptStore } from "@/stores/PromptStore";
import useAutosizeTextArea from "@/stores/useAutosizeTextArea";
import Handlebars from 'handlebars';


const MessageContainer = ({ index }: { index: number }) => {
  const { promptObject, editMessageAtIndex, toggleRoleAtIndex, setPromptVariables } = promptStore();
  const { modelObject } = modelStore();
  const [promptVariableData, setPromptVariableData] = useState(promptObject.prompt_variables || {});


  const textAreaRef = useRef(null);

  const { messages } = promptObject?.prompt_data || {};
  const { role: defaultRole } = messages?.[index] || { role: "user" };
  const article = defaultRole.charAt(0).toLowerCase() === "u" ? "an" : "a";

  function processVariables(inputValue:string) {
      try {
          const ast = Handlebars.parse(inputValue);
          const variables = [...new Set(ast.body.filter(node => node.path).map(node => node.path.original))];

          const newPromptVariableData = variables.reduce((acc, variable) => {
              acc[variable] = promptVariableData[variable] || { type: 'text', value: '' };
              return acc;
          }, {});

          setPromptVariableData(newPromptVariableData);
          setPromptVariables(newPromptVariableData);
          console.log(newPromptVariableData)
      } catch (e) {
          // Handle the error appropriately
          console.log(e)
      }
  }

  const handleTextAreaChange = (e:any) => {
    editMessageAtIndex(index, e.target.value);
    processVariables(promptObject?.prompt_data.context + " " + e.target.value);
  };

  const handleRoleToggle = () => {
    const roles = modelObject?.model_parameters.roles;
    toggleRoleAtIndex(index, roles);
  };

  const placeholder = `Enter ${article} ${defaultRole} message here.`;

  return (
    <div className="chat-pg-message">
      <div className="chat-message-role">
        <div className="chat-message-subheading subheading">
          <span className="chat-message-role-text" onClick={handleRoleToggle}>
            {messages[index]?.role}
          </span>
        </div>
      </div>
      <div className="text-input-with-focus">
        {/*<div
          className="text-input-md text-input"
          rows={1}
          tabIndex={0}
          ref={textAreaRef}
          placeholder={placeholder}
          style={{ height: 36 }}
          value={messages[index]?.content || ""}
          onChange={handleTextAreaChange}
          />*/}
          <div
          className="text-input-md text-input"
          contentEditable={true}
          tabIndex={0}
          ref={textAreaRef}
          placeholder={placeholder}
          onChange={handleTextAreaChange}
          >{messages[index]?.content || ""}</div>
      </div>
      <RemoveMessage index={index} />
    </div>
  );
};

MessageContainer.propTypes = {
  index: PropTypes.number.isRequired,
};

export default MessageContainer;