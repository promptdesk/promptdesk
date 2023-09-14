import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import RemoveMessage from "./RemoveMessage";
import { modelStore } from "@/stores/ModelStore";
import { promptStore } from "@/stores/PromptStore";
import Handlebars from 'handlebars';

interface MessageContainerProps {
  index: number;
}

const MessageContainer: React.FC<MessageContainerProps> = ({ index }) => {
  const { promptObject, editMessageAtIndex, toggleRoleAtIndex, setPromptVariables } = promptStore();
  const { modelObject } = modelStore();

  const textAreaRef = useRef<HTMLDivElement | null>(null);

  const { messages } = promptObject?.prompt_data || {};
  const { role: defaultRole } = messages?.[index] || { role: "user" };
  const article = defaultRole.charAt(0).toLowerCase() === "u" ? "an" : "a";

  const [message, setMessage] = React.useState(messages[index]?.content || "");

  useEffect(() => {
    setMessage(messages[index]?.content || "");
  })

  const processVariables = React.useMemo(() => (inputValue: string) => {
    try {
      const ast = Handlebars.parse(inputValue);
      const variables = [...new Set(ast.body.filter(node => node.path).map(node => node.path.original))];

      const newPromptVariableData = variables.reduce((acc, variable) => {
        acc[variable] = promptObject.prompt_variables[variable] || { type: 'text', value: '' };
        return acc;
      }, {});

      setPromptVariables(newPromptVariableData);
      //console.log(newPromptVariableData);
    } catch (e) {
      // Ignore handlebars parsing errors
    }
  }, [promptObject.prompt_variables, setPromptVariables]);

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLDivElement>) => {
    editMessageAtIndex(index, e.target.textContent || "");
    processVariables(`${promptObject.prompt_data.context} ${JSON.stringify(promptObject?.prompt_data.messages)}`);
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
        <div
          className="text-input-md text-input"
          contentEditable={true}
          tabIndex={0}
          ref={textAreaRef}
          placeholder={placeholder}
          suppressContentEditableWarning={true}
          onInput={handleTextAreaChange}
        >
          {message || ""}
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