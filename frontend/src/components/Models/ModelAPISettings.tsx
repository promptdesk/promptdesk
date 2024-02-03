import React from 'react';
import PlaygroundButton from '@/components/Form/PlaygroundButton';
import CodeEditor from '@/components/Editors/CodeEditor';
import Error from '@/components/Alerts/Error';
import Warning from '@/components/Alerts/Warning';

const ModelAPISettings:React.FC<any> = ({
    api,
    testAPI,
    selectedModel,
    apiResponse,
    setApiResponse,
    style,
    setFormattedApi,
    generate_pre_compontent }) => {
    return (
        <>
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
        <Warning display={apiResponse.status < 500 && apiResponse.status !== 404} text="A 400 series response code may indicate that the API call was valid. If the response status code is not 404 or 500+, you may proceed to the next step. Make sure you define all {{environment_variables}} in Settings => Environment Variables." />
        {generate_pre_compontent(apiResponse.status, JSON.stringify(apiResponse.data, null, 4))}
        </>
    );
};

export default ModelAPISettings;
