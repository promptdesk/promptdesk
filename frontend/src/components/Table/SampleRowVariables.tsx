import React from "react";
import { CustomJSONView } from "@/components/Viewers/CustomJSONView";

const SampleRowVariables: React.FC<any> = ({ variables }) => {
  return (
    <div style={{ maxWidth: "100%" }} onClick={(evt) => evt.stopPropagation()}>
      <CustomJSONView name={null} src={variables} collapsed={1} />
    </div>
  );
};

export default SampleRowVariables;
