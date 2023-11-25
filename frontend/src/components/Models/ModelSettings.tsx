// ModelSettings.tsx
import React from 'react';
import InputField from "@/components/Form/InputField";
import DropDown from "@/components/Form/DropDown";
import PlaygroundButton from "@/components/Form/PlaygroundButton";
import CodeEditor from "@/components/Editors/CodeEditor";

type ModelSettingsProps = {
    selectedModel: any;
    updateModel: any;
    setFormattedApi: any;
    api: any;
    apiResponse: any;
    setApiResponse: any;
    inputFormatResponse: any;
    setInputFormatResponse: any;
    parameters: any;
    inputFormat: any;
    setInputFormat: any;
    outputFormat: any;
    setOutputFormat: any;
    handleSave: any;
    setFormattedParameters: any;
    outputFormatResponse: any;
    setOutputFormatResponse: any;
    testAPI: any;
}

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
    handleSave,
    testAPI
}: ModelSettingsProps) => {
    const style = "rounded-xl overflow-hidden shadow-lg";

    function generate_pre_compontent(status:any, contents:any) {
        return (
            <>
                {status === undefined ? <></> :
                    <pre className="bg-gray-800 text-white text-sm p-4 rounded-xl overflow-auto mb-4" style={{ whiteSpace: "pre-wrap" }}>
                        RESPONSE STATUS: {status}<br />
                        {contents}
                    </pre>}
            </>
        )
    }

    return (
        <div className="w-3/4">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 grid-cols-8 m-2">
            <div className="col-span-2">
              <InputField label="Model Name" value={selectedModel.name || ""} onInputChange={(value) => updateModel("name", value)} />
            </div>
            <div className="col-span-2">
              <InputField label="Provider" value={selectedModel.provider || ""} onInputChange={(value) => updateModel("provider", value)} />
            </div>
            <div className="col-span-2">
              <DropDown label="Model Type" options={[{ name: "Completion", value: "completion" }, { name: "Chat", value: "chat" }]} selected={selectedModel.type} onChange={(value:any) => updateModel("type", value)} />
            </div>
            <div className="col-span-2">
              <DropDown label="Default model" options={[{ value: true, name: "True" }, { value: false, name: "False" }]} selected={selectedModel.default} onChange={(value:any) => updateModel("default", value === "true")} />
            </div>
          </div>
          <div className="m-2 mt-4">


            <div className="flex justify-between mb-2">
              <h3 className="mb-0">API Call</h3> <PlaygroundButton text="Test" onClick={async () => {
                var api_response = await testAPI({api_call:api})
                console.log(api_response)
                setApiResponse(api_response);
              }} />
            </div>
            <CodeEditor height="30vh" style={style} code={JSON.stringify(api, null, 4)} language="json"
              handleChange={(value) => {
                setFormattedApi(value);
              }}/>
            {generate_pre_compontent(apiResponse.status, JSON.stringify(apiResponse.data, null, 4))}


            <div className="flex justify-between mb-2">
              <h3 className="mb-0">Input format</h3> <PlaygroundButton text="Test" onClick={async () => {
                var api_response = await testAPI({api_call:api, input_format:inputFormat})
                setInputFormatResponse(api_response);
              }} />
            </div>
            <CodeEditor height="50vh" style={style} code={inputFormat} language="javascript"
              handleChange={(value) => {
                setInputFormat(value as string);
              }}/>
            {generate_pre_compontent(inputFormatResponse.status, JSON.stringify(inputFormatResponse.data, null, 4))}

            
            <div className="flex justify-between mb-2">
              <h3 className="mb-0">Output format</h3> <PlaygroundButton text="Test" onClick={handleSave} />
            </div>
            <CodeEditor height="30vh" style={style} code={outputFormat} language="javascript"
              handleChange={(value) => {
                setOutputFormat(value as string);
              }}/>
            {generate_pre_compontent(outputFormatResponse.status, JSON.stringify(outputFormatResponse.data, null, 4))}

            <div>
              <h3 className="mb-0">Model parameters</h3>
            </div>
            <CodeEditor height="50vh" style={style} code={JSON.stringify(parameters, null, 4)} language="json"
              handleChange={(value) => {
                setFormattedParameters(value);
              }}/>

          </div>
        </div>
    );
}

export default ModelSettings;