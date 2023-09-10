"use client";
import React, { useEffect, useState } from 'react';
import AddMessage from './Components/AddMessage';
import MessageContainer from './Components/MessageContainer';
import EditorFooter from './Components/EditorFooter';
import Variables from '@/components/Editors/Variables';
import { promptStore } from '@/stores/PromptStore';
import Handlebars from 'handlebars';

function Editor() {
  const { promptObject, setPromptInformation, setPromptVariables } = promptStore();
  const [promptVariableData, setPromptVariableData] = useState(promptObject.prompt_variables || {});

  const processVariables = (inputValue:string) => {
    try {
      const ast = Handlebars.parse(inputValue);
      const variables = [...new Set(ast.body.filter(node => node.path).map(node => node.path.original))];
      const newPromptVariableData = variables.reduce((acc, variable) => {
        acc[variable] = promptVariableData[variable] || { type: 'text', value: '' };
        return acc;
      }, {});
      setPromptVariableData(newPromptVariableData);
      setPromptVariables(newPromptVariableData);
      console.log(newPromptVariableData);
    } catch (e) {
      console.error(e); // Handle the error appropriately
    }
  };

  const handleSystemInput = (e:any) => {
    const systemInput = e.target.value;
    setPromptInformation('prompt_data.context', systemInput);
    processVariables(`${systemInput} ${JSON.stringify(promptObject?.prompt_data.messages)}`);
  };

  useEffect(() => {
    const context = promptObject?.prompt_data.context || '';
    const messages = JSON.stringify(promptObject?.prompt_data.messages || []);
    processVariables(`${context} ${messages}`);
  }, [promptObject?.name]);

  return (
    <div className="flex flex-col">
      <Variables />
      <div className="chat-pg-body body-small flex-1">
        <div>
          <div className="text-input-with-header chat-pg-instructions">
            <div className="text-input-header-subheading subheading">System</div>
            <div className="text-input-header-wrapper overflow-wrapper text-input">
              <textarea
                aria-label="Input"
                className="text-input text-input-lg text-input-full text-input-header-buffer"
                placeholder="You are a helpful assistant."
                value={promptObject.prompt_data.context}
                onInput={handleSystemInput}
              />
            </div>
          </div>
        </div>
        <div className="chat-pg-mobile-divider" />
        <div className="chat-pg-right-wrapper">
          <div className="chat-pg-panel-wrapper">
            <div className="chat-pg-exchange-container">
              <div className="chat-pg-exchange">
                {promptObject.prompt_data.messages?.map((_, index) => (
                  <MessageContainer key={index} index={index} />
                ))}
                <AddMessage />
                <div className="chat-pg-bottom-div" />
              </div>
            </div>
          </div>
          <EditorFooter />
        </div>
      </div>
    </div>
  );
}

export default Editor;