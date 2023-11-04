"use client";
import React, { useEffect, useState, useRef } from 'react';
import AddMessage from './Components/AddMessage';
import MessageContainer from './Components/MessageContainer';
import EditorFooter from './Components/EditorFooter';
import Variables from '@/components/Editors/Variables';
import GeneratedOutput from './Components/GeneratedOutput';
import { promptStore } from '@/stores/PromptStore';

function Editor() {
  const { promptObject, setPromptInformation, processVariables } = promptStore();

  const { context = '', messages = [] } = promptObject?.prompt_data || {};
  const messagesLength = messages.length;

  const handleSystemInput = (e: any) => {
    const systemInput = e.target.value;
    setPromptInformation('prompt_data.context', systemInput);
  };

  const [lastLength, setLastLength] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    processVariables(`${context} ${JSON.stringify(messages)}`);
  }, [context, messages, processVariables]);

  useEffect(() => {
    if (messagesLength > lastLength && scrollRef.current) {
      (scrollRef.current as any).scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
      console.log("newLength", messagesLength)
    }
    setLastLength(messagesLength);
  }, [messagesLength, lastLength]);

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
        <div className="chat-pg-right-wrapper">
          <div className="chat-pg-panel-wrapper">
            <div className="chat-pg-exchange-container">
              <div className="chat-pg-exchange">
                {promptObject.prompt_data.messages?.map((_: any, index: any) => (
                  <MessageContainer key={index} index={index} />
                ))}
                <AddMessage />
                <div id="myRef" className="chat-pg-bottom-div" />
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