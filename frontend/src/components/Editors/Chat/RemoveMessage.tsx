import React from "react";
import { removeAtIndex } from "@/services/PromptEditor";
import Delete from "@/components/Icons/Delete";

const RemoveMessage = ({ index }: { index: number }) => {
  return (
    <div
      className="chat-message-button-container"
      onClick={() => {
        removeAtIndex(index);
      }}
    >
      <Delete />
    </div>
  );
};

export default RemoveMessage;
