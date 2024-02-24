import React from "react";
import { CustomJSONView } from "@/components/Viewers/CustomJSONView";

const SampleRowVariables: React.FC<any> = ({ variables }) => {
  const handleClick = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    evt.stopPropagation();
  };

  return (
    <div style={{ maxWidth: "100%" }} onClick={handleClick} className="sample-head">
      <CustomJSONView name={null} src={variables} collapsed={1} />
    </div>
  );
};

export default SampleRowVariables;
