// ModelSettings.tsx
import React from 'react';
import InputField from "@/components/Form/InputField";
import DropDown from "@/components/Form/DropDown";
import PlaygroundButton from "@/components/Form/PlaygroundButton";
import CodeEditor from "@/components/Editors/CodeEditor";
import Warning from '../Alerts/Warning';
import Success from '../Alerts/Success';
import Error from '../Alerts/Error';

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
                    <pre className="bg-gray-800 text-white text-sm p-4 rounded-xl overflow-auto" style={{ whiteSpace: "pre-wrap" }}>
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


            <div className="flex justify-between mb-2 mt-4">
              <h3 className="mb-0">API Call</h3> <PlaygroundButton text="Test" onClick={async () => {
                var api_response = await testAPI({api_call:api, type:selectedModel.type})
                setApiResponse(api_response);
              }} />
            </div>
            <CodeEditor height="30vh" style={style} code={JSON.stringify(api, null, 4)} language="json"
              handleChange={(value) => {
                setFormattedApi(value);
              }}/>
            <Error display={apiResponse.status >= 500 || apiResponse.status === 404} text="Please verify the URL, headers and other API-related request information." />
            <Warning display={apiResponse.status < 500 && apiResponse.status !== 404} text="A 400 series response code may indicate that the API call was valid. If the response status code is not 404 or 500+, you may proceed to the next step. Make sure you define all {{environment_variables}} in Settings => Environment Variables
." />
            {generate_pre_compontent(apiResponse.status, JSON.stringify(apiResponse.data, null, 4))}


            <div className="flex justify-between mb-2 mt-4">
              <h3 className="mb-0">Input format</h3> <PlaygroundButton text="Test" onClick={async () => {
                var api_response = await testAPI({api_call:api, input_format:inputFormat, type:selectedModel.type})
                setInputFormatResponse(api_response);
              }} />
            </div>
            <CodeEditor height="50vh" style={style} code={inputFormat} language="javascript"
              handleChange={(value) => {
                setInputFormat(value as string);
              }}/>
            <Warning display={inputFormatResponse.status >= 300} text="This should output the raw API response from the LLM service. The status code should be in the 200 range." />
            <Success display={inputFormatResponse.status < 300} text="The 200 series status code indicates a possible success. Please double check to make sure the raw LLM API response is returned." />
            {generate_pre_compontent(inputFormatResponse.status, JSON.stringify(inputFormatResponse.data, null, 4))}

            
            <div className="flex justify-between mb-2 mt-4">
              <h3 className="mb-0">Output format</h3> <PlaygroundButton text="Test" onClick={async () => {
                var api_response = await testAPI({api_call:api, input_format:inputFormat, output_format:outputFormat, type:selectedModel.type})
                setOutputFormatResponse(api_response);
              }} />
            </div>
            <CodeEditor height="30vh" style={style} code={outputFormat} language="javascript"
              handleChange={(value) => {
                setOutputFormat(value as string);
              }}/>
            <Error display={outputFormatResponse.status && outputFormatResponse.status !== 200} text="Please re-format the output format function. This should return a single string for type completion or a single object of {'content':'[GENERATED TEXT]', 'role':[ASSISTANT/USER]}" />
            <Success display={outputFormatResponse.status === 200} text="This model was built successfully and can now be used in PromptDesk!" />
            {generate_pre_compontent(outputFormatResponse.status, JSON.stringify(outputFormatResponse.data, null, 4))}

              
            <div className="mb-2 mt-4">
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