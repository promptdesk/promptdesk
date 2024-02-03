import React from 'react';
import PlaygroundButton from '@/components/Form/PlaygroundButton';
import CodeEditor from '@/components/Editors/CodeEditor';
import Warning from '@/components/Alerts/Warning';
import Success from '@/components/Alerts/Success';

const ModelInputFormatSettings:React.FC<any> = ({
  api,
  testAPI,
  selectedModel,
  inputFormat,
  setInputFormat,
  inputFormatResponse,
  setInputFormatResponse,
  style,
  generate_pre_compontent
}) => {
  return (
    <>
        <div className="flex justify-between mb-2 mt-4">
        <h3 className="mb-0">Input format</h3>
        <PlaygroundButton text="Test" onClick={async () => {
            const api_response = await testAPI({
            api_call: api,
            input_format: inputFormat,
            type: selectedModel.type
            });
            setInputFormatResponse(api_response);
        }} />
        </div>
        <CodeEditor
        height="50vh"
        style={style}
        code={inputFormat}
        language="javascript"
        handleChange={(value) => {
            setInputFormat(value);
        }}
        />
        <Warning
        display={inputFormatResponse.status >= 300}
        text="This should output the raw API response from the LLM service. The status code should be in the 200 range."
        />
        <Success
        display={inputFormatResponse.status < 300}
        text="The 200 series status code indicates a possible success. Please double check to make sure the raw LLM API response is returned."
        />
        {generate_pre_compontent(inputFormatResponse.status, JSON.stringify(inputFormatResponse.data, null, 4))}
    </>
)};

export default ModelInputFormatSettings;