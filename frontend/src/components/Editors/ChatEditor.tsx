"use client";
import React, { use, useEffect, useRef, useState } from 'react';
import AddMessage from '@/components/Editors/Chat/AddMessage';
import MessageContainer from '@/components/Editors/Chat/MessageContainer';
import EditorFooter from '@/components/Editors/EditorFooter';
import Variables from '@/components/Editors/Variables';
import { promptStore } from '@/stores/PromptStore';

function Editor() {
  const { promptObject, setPromptInformation, setPromptVariables, processVariables, prompts } = promptStore();

  const handleSystemInput = (e:any) => {
    const systemInput = e.target.value;
    setPromptInformation('prompt_data.context', systemInput);
    processVariables(`${systemInput} ${JSON.stringify(promptObject?.prompt_data.messages)}`);
  };

  const [lastLength, setLastLength] = useState(0);

  useEffect(() => {
    const context = promptObject?.prompt_data.context || '';
    const messages = JSON.stringify(promptObject?.prompt_data.messages || []);
    processVariables(`${context} ${messages}`);
  }, [promptObject?.name, promptObject.id, processVariables, promptObject?.prompt_data?.context, promptObject?.prompt_data?.messages]);

  useEffect(() => {
    var element = document.getElementById("myRef");
    let newLength = promptObject?.prompt_data?.messages?.length;

    if(newLength > lastLength && element) {
      element.scrollIntoView({behavior:"smooth", block: "end", inline:"nearest"});    
      console.log("newLength", newLength)
    }

    setLastLength(promptObject?.prompt_data?.messages?.length);
  }, [promptObject?.prompt_data?.messages?.length])

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
                {promptObject.prompt_data.messages?.map((message: any, index: any) => (
                  <MessageContainer
                    key={index}
                    index={index}
                    message={message}
                    roles={promptObject?.prompt_variables?.roles}
                    onEditMessage={(message: any) => {
                      setPromptInformation(`prompt_data.messages[${index}]`, message);
                    }}
                    onToggleRole={(role: any) => {
                      setPromptInformation(`prompt_data.messages[${index}].role`, role);
                    }}
                  />
                ))}
                <AddMessage />
                <div id="myRef" className="chat-pg-bottom-div" />
              </div>
            </div>
          </div>
          <div>
            <EditorFooter />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Editor;