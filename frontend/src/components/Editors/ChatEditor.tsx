"use client";
import React, { useEffect, useState } from 'react';
import AddMessage from './Components/AddMessage';
import MessageContainer from './Components/MessageContainer';
import EditorFooter from './Components/EditorFooter';
import Variables from '@/components/Editors/Variables';
import GeneratedOutput from './Components/GeneratedOutput';
import { promptStore } from '@/stores/PromptStore';

function Editor() {
  const { promptObject, setPromptInformation, setPromptVariables, processVariables, prompts } = promptStore();

  const handleSystemInput = (e:any) => {
    const systemInput = e.target.value;
    setPromptInformation('prompt_data.context', systemInput);
    processVariables(`${systemInput} ${JSON.stringify(promptObject?.prompt_data.messages)}`);
  };

  useEffect(() => {
    const context = promptObject?.prompt_data.context || '';
    const messages = JSON.stringify(promptObject?.prompt_data.messages || []);
    processVariables(`${context} ${messages}`);
  }, [promptObject?.name, promptObject.id, promptObject?.prompt_data?.messages?.length, processVariables, promptObject?.prompt_data?.context, promptObject?.prompt_data?.messages]);

  return (
    <div className="flex flex-col">
      <Variables />
      <div className="chat-pg-body body-small flex-1 overflow-hidden">
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
                {promptObject.prompt_data.messages?.map((_: any, index: any) => (
                  <MessageContainer key={index} index={index} />
                ))}
                <AddMessage />
                <div className="chat-pg-bottom-div" />
              </div>
            </div>
          </div>
          <div>
            <GeneratedOutput />
            <EditorFooter />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Editor;