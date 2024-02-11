// ModelSettings.tsx
import React from "react";
import CodeEditor from "@/components/Editors/CodeEditor";
import Warning from "../Alerts/Warning";
import ModelSettingsOptions from "./ModelSettingsOptions";
import ModelAPISettings from "./ModelAPISettings";
import ModelInputFormatSettings from "./ModelInputFormatSettings";
import ModelOutputFormatSettings from "./ModelOutputFormatSettings";

const ModelSettings = ({
  selectedModel,
  updateModel,
  setFormattedApi,
  api,
  apiResponse,
  setApiResponse,
  inputFormatResponse,
  setInputFormatResponse,
  setFormattedParameters,
  outputFormatResponse,
  setOutputFormatResponse,
  parameters,
  inputFormat,
  setInputFormat,
  outputFormat,
  setOutputFormat,
  testAPI,
  responseMapping,
  requestMapping,
  setRequestMapping,
}: any) => {
  const style = "rounded-xl overflow-hidden shadow-lg";

  function generate_pre_compontent(status: any, contents: any) {
    return (
      <>
        {status === undefined ? (
          <></>
        ) : (
          <pre
            className="bg-gray-800 text-white text-sm p-4 rounded-xl overflow-auto"
            style={{ whiteSpace: "pre-wrap" }}
          >
            RESPONSE STATUS: {status}
            <br />
            {contents}
          </pre>
        )}
      </>
    );
  }

  return (
    <div className="w-3/4">
      <ModelSettingsOptions
        selectedModel={selectedModel}
        updateModel={updateModel}
      />

      <div className="m-2 mt-4">
        <Warning
          display={inputFormat != undefined}
          text="This model format is deprecated. Please download and upload sample models here: https://github.com/promptdesk/promptdesk/tree/main/models."
        />
        <ModelAPISettings
          api={api}
          testAPI={testAPI}
          selectedModel={selectedModel}
          apiResponse={apiResponse}
          setApiResponse={setApiResponse}
          style={style}
          setFormattedApi={setFormattedApi}
          generate_pre_compontent={generate_pre_compontent}
        />

        {inputFormat != undefined ? (
          <>
            <ModelInputFormatSettings
              api={api}
              testAPI={testAPI}
              selectedModel={selectedModel}
              inputFormat={inputFormat}
              setInputFormat={setInputFormat}
              inputFormatResponse={inputFormatResponse}
              setInputFormatResponse={setInputFormatResponse}
              style={style}
              generate_pre_compontent={generate_pre_compontent}
            />
            <ModelOutputFormatSettings
              api={api}
              testAPI={testAPI}
              selectedModel={selectedModel}
              inputFormat={inputFormat}
              outputFormat={outputFormat}
              setOutputFormat={setOutputFormat}
              outputFormatResponse={outputFormatResponse}
              setOutputFormatResponse={setOutputFormatResponse}
              style={style}
              generate_pre_compontent={generate_pre_compontent}
            />
          </>
        ) : (
          <>
            <div className="flex justify-between mb-2 mt-4">
              <h3 className="mb-0">Request Mapping</h3>
            </div>
            <CodeEditor
              height="50vh"
              style={style}
              code={JSON.stringify(requestMapping, null, 4)}
              language="json"
              handleChange={(value: any) => {
                value = JSON.parse(value);
                setRequestMapping(value);
              }}
            />

            <div className="flex justify-between mb-2 mt-4">
              <h3 className="mb-0">Response Mapping</h3>
            </div>
            <CodeEditor
              height="50vh"
              style={style}
              code={JSON.stringify(responseMapping, null, 4)}
              language="json"
              handleChange={(value: any) => {
                value = JSON.parse(value);
                setRequestMapping(value);
              }}
            />
          </>
        )}

        <div className="mb-2 mt-4">
          <h3 className="mb-0">Model parameters</h3>
        </div>
        <CodeEditor
          height="50vh"
          style={style}
          code={JSON.stringify(parameters, null, 4)}
          language="json"
          handleChange={(value) => {
            setFormattedParameters(value);
          }}
        />
      </div>
    </div>
  );
};

export default ModelSettings;
