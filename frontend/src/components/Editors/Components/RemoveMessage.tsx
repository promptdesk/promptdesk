import React from "react";
import { promptStore } from '@/stores/PromptStore';
import Delete from "@/components/Icons/Delete";


const RemoveMessage = ({ index }: { index: number }) => {

  const { removeAtIndex } = promptStore()

  return (

  <div className="chat-message-button-container" onClick={() => {
    removeAtIndex(index); 
    }}>
      <Delete />
    </div>
  );
};

export default RemoveMessage