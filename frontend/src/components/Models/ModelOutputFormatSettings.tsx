import React from 'react';
import PlaygroundButton from '@/components/Form/PlaygroundButton';
import CodeEditor from '@/components/Editors/CodeEditor';
import Error from '@/components/Alerts/Error';
import Success from '@/components/Alerts/Success';

const ModelOutputFormatSettings:React.FC<any> = ({
  api,
  testAPI,
  selectedModel,
  inputFormat,
  outputFormat,
  setOutputFormat,
  outputFormatResponse,
  setOutputFormatResponse,
  style,
  generate_pre_compontent
}) => {
  return (
    <>
      <div className="flex justify-between mb-2 mt-4">
        <h3 className="mb-0">Output format</h3>
        <PlaygroundButton text="Test" onClick={async () => {
          const api_response = await testAPI({
            api_call: api,
            input_format: inputFormat,
            output_format: outputFormat,
            type: selectedModel.type
          });
          setOutputFormatResponse(api_response);
        }} />
      </div>
      <CodeEditor
        height="30vh"
        style={style}
        code={outputFormat}
        language="javascript"
        handleChange={(value) => {
          setOutputFormat(value);
        }}
      />
      <Error
        display={outputFormatResponse.status && outputFormatResponse.status !== 200}
        text="Please re-format the output format function. This should return a single string for type completion or a single object of {'content':'[GENERATED TEXT]', 'role':[ASSISTANT/USER]}"
      />
      <Success
        display={outputFormatResponse.status === 200}
        text="This model was built successfully and can now be used in PromptDesk!"
      />
      {generate_pre_compontent(outputFormatResponse.status, JSON.stringify(outputFormatResponse.data, null, 4))}
    </>
  );
};

export default ModelOutputFormatSettings;