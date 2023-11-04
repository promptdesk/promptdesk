
import React from "react";
import { modelStore } from "@/stores/ModelStore";
import { promptStore } from "@/stores/PromptStore";
import Plus from "@/components/Icons/Plus";

const AddMessage = () => {

  const { addMessage } = promptStore()
  const { modelObject } = modelStore()

  return (

    <div className="chat-pg-message add-message" onClick={(e) => addMessage(modelObject?.model_parameters.roles)}>
        <Plus />
        <span className="text">Add message</span>
    </div>
  );
};

export default AddMessage