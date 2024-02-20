"use client";
import React, { use, useEffect, useRef, useState } from "react";
import AddMessage from "@/components/Editors/Chat/AddMessage";
import MessageContainer from "@/components/Editors/Chat/MessageContainer";
import EditorFooter from "@/components/Editors/EditorFooter";
import Variables from "@/components/Editors/Variables";
import { promptStore, processVariables } from "@/stores/prompts";
import { modelStore } from "@/stores/ModelStore";
import { ParsingError } from "@/components/Editors/ParsingError";
import { toggleRoleAtIndex, editMessageAtIndex } from "@/services/PromptEditor";
import EnvironmentVariableWarning from "./EnvironmentVariableWarning";

function Editor() {
  const { promptObject, updateLocalPromptValues, parsingError } = promptStore();

  const { modelObject } = modelStore();

  const handleContextChange = (e: any) => {
    const systemInput = e.target.value;
    updateLocalPromptValues("prompt_data.context", systemInput);
    processVariables(
      `${systemInput} ${JSON.stringify(promptObject?.prompt_data.messages)}`,
    );
  };

  const [lastLength, setLastLength] = useState(0);

  const handleMessageChange = () => {
    const context = promptObject?.prompt_data.context || "";
    const messages = JSON.stringify(promptObject?.prompt_data.messages || []);
    processVariables(`${context} ${messages}`);
  };

  useEffect(() => {
    handleMessageChange();
  }, [
    promptObject?.name,
    promptObject.id,
    processVariables,
    promptObject?.prompt_data?.context,
    promptObject?.prompt_data?.messages,
  ]);

  useEffect(() => {
    var element = document.getElementById("myRef");
    let newLength = promptObject?.prompt_data?.messages?.length;

    if (newLength > lastLength && element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }

    setLastLength(promptObject?.prompt_data?.messages?.length);
  }, [promptObject?.prompt_data?.messages?.length]);

  //if promptObject.prompt_data is null, set it to an empty object
  if (!promptObject.prompt_data) {
    updateLocalPromptValues("prompt_data", {});
  }

  //render div if modelObject.model_parameters is null
  function renderDiv() {
    if (modelObject.model_parameters.context !== false) {
      return (
        <div>
          <div className="text-input-with-header chat-pg-instructions">
            <div className="text-input-header-subheading subheading">
              System
            </div>
            <div className="text-input-header-wrapper overflow-wrapper text-input">
              <textarea
                aria-label="Input"
                className="text-input text-input-lg text-input-full text-input-header-buffer"
                placeholder="You are a helpful assistant."
                value={promptObject.prompt_data.context}
                onInput={handleContextChange}
              />
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="flex flex-col">
      <EnvironmentVariableWarning />
      <Variables />
      <div className="chat-pg-body body-small flex-1 overflow-hidden">
        {renderDiv()}
        <div className="chat-pg-mobile-divider" />
        <div className="chat-pg-right-wrapper">
          <div className="chat-pg-panel-wrapper">
            <div className="chat-pg-exchange-container">
              <div className="chat-pg-exchange">
                {promptObject.prompt_data.messages?.map(
                  (message: any, index: any) => (
                    <MessageContainer
                      key={index}
                      index={index}
                      message={message}
                      roles={modelObject?.model_parameters.roles || ["user"]}
                      onEditMessage={(index: any, content: string) => {
                        editMessageAtIndex(index, content);
                        handleMessageChange();
                      }}
                      onToggleRole={(index: any, roles: any) => {
                        toggleRoleAtIndex(index, roles);
                      }}
                    />
                  ),
                )}
                <AddMessage />
                <div id="myRef" className="chat-pg-bottom-div" />
              </div>
            </div>
          </div>
          <ParsingError error={parsingError} />
          <div>
            <EditorFooter />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Editor;
