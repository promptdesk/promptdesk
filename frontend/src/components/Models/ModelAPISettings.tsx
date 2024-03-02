import React from "react";
import PlaygroundButton from "@/components/Form/PlaygroundButton";
import CodeEditor from "@/components/Editors/CodeEditor";
import Error from "@/components/Alerts/Error";
import Warning from "@/components/Alerts/Warning";

const ModelAPISettings: React.FC<any> = ({
  api,
  testAPI,
  selectedModel,
  apiResponse,
  setApiResponse,
  style,
  setFormattedApi,
  generate_pre_compontent,
}) => {
  return (
    <>
      <CodeEditor
        height="30vh"
        style={style}
        code={JSON.stringify(api, null, 4)}
        language="json"
        handleChange={(value) => {
          setFormattedApi(value);
        }}
      />
    </>
  );
};

export default ModelAPISettings;
