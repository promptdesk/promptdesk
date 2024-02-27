import React from "react";
import { CustomJSONView } from "@/components/Viewers/CustomJSONView";

interface SampleRowPromptProps {
  localPromptInfo: any;
  promptText: string;
}

const SampleRowPrompt: React.FC<SampleRowPromptProps> = ({
  localPromptInfo,
  promptText,
}) => {
  return (
    <>
      {localPromptInfo.prompt || localPromptInfo.content ? (
        <div className="text-input-wrapper">
          <div
            className={
              "text-input-md text-input prompt-value-display text-gray-500 font-medium leading-relaxed"
            }
            onClick={(evt) => evt.stopPropagation()}
          >
            {promptText}
          </div>
        </div>
      ) : (
        <div onClick={(evt) => evt.stopPropagation()}>
          <CustomJSONView name={null} src={localPromptInfo} collapsed={false} />
        </div>
      )}
    </>
  );
};

export default SampleRowPrompt;
