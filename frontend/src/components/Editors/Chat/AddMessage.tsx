import React from "react";
import { modelStore } from "@/stores/ModelStore";
import { addMessage } from "@/services/PromptEditor";
import Plus from "@/components/Icons/Plus";

const AddMessage = () => {
  const { modelObject } = modelStore();

  return (
    <div
      className="chat-pg-message add-message"
      onClick={(e) =>
        addMessage(modelObject?.model_parameters.roles || ["user"])
      }
    >
      <Plus />
      <span className="text">Add message</span>
    </div>
  );
};

export default AddMessage;
