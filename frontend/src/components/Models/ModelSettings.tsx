// ModelSettings.tsx
import React from "react";
import CodeEditor from "@/components/Editors/CodeEditor";
import Warning from "../Alerts/Warning";
import ModelSettingsOptions from "./ModelSettingsOptions";
import ModelAPISettings from "./ModelAPISettings";

const ModelSettings = ({
  selectedModel,
  updateModel,
  setFormattedApi,
  api,
  setApiResponse,
  setFormattedParameters,
  parameters,
  inputFormat,
  responseMapping,
  requestMapping,
  setRequestMapping,
  setResponseMapping,
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
          text={
            <>
              This model format is deprecated. Please download and upload sample
              models here:{" "}
              <a
                href="https://github.com/promptdesk/promptdesk/tree/main/models"
                target="_blank"
                className="text-yellow-700 underline decoration-solid text visited:text-yellow-700"
              >
                https://github.com/promptdesk/promptdesk/tree/main/models
              </a>
            </>
          }
        />
        <div className="flex justify-between mb-2 mt-4">
          <h3 className="mb-0">API Call</h3>
        </div>
        <ModelAPISettings
          api={api}
          selectedModel={selectedModel}
          setApiResponse={setApiResponse}
          style={style}
          setFormattedApi={setFormattedApi}
          generate_pre_compontent={generate_pre_compontent}
        />

        {inputFormat != undefined ? (
          <>
            <p>Please update this model.</p>
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
                setResponseMapping(value);
              }}
            />
          </>
        )}

        {parameters && (
          <>
            <div className="mb-2 mt-4">
              <h3 className="mb-0">Model parameters</h3>
            </div>
            <CodeEditor
              height="50vh"
              style={style}
              code={JSON.stringify(parameters || null, null, 4)}
              language="json"
              handleChange={(value) => {
                setFormattedParameters(value);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ModelSettings;
