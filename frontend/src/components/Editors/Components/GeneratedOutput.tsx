import React from "react";
import { promptStore } from "@/stores/PromptStore";

const RemoveMessage = () => {
  const { isPromptLoading, generatedText } = promptStore();

  return (
    <div className={`remove-message-component ${isPromptLoading || generatedText ? "visible" : ""}`}>
      {generatedText && (
        <div className="generated-output">{generatedText}</div>
      )}
    </div>
  );
};

export default RemoveMessage;