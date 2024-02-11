import React from "react";

const SampleRowGroundTruth: React.FC<any> = ({
  localResult,
  handleTextAreaChange,
  resultTextAreaRef,
}) => {
  return (
    <div className="text-input-wrapper h-full">
      <div
        className="sample-row-textarea"
        onClick={(evt) => evt.stopPropagation()}
        contentEditable={true}
        placeholder={"Enter ground truth here."}
        suppressContentEditableWarning={true}
        onInput={handleTextAreaChange}
        ref={resultTextAreaRef}
      >
        {localResult}
      </div>
    </div>
  );
};

export default SampleRowGroundTruth;
