import React, { useEffect, useState } from 'react';
import { logStore } from '@/stores/LogStore';
import { modelStore } from '@/stores/ModelStore';
import { promptStore } from '@/stores/PromptStore';
import { useRouter } from 'next/router';
import CodeEditor from '@/components/Editors/CodeEditor';
import moments from 'moment';
import InputField from '@/components/Form/InputField';
import { Log } from '@/interfaces/log';

export default function About() {

  var { logs, fetchLog } = logStore();
  var { prompts } = promptStore();
  var { models } = modelStore();

  const [log, setLog] = useState({} as Log);
  const [promptName, setPromptName] = useState(undefined);
  const [modelType, setModelType] = useState(undefined);
  const [modelName, setModelName] = useState(undefined);
  const [request, setRequest] = useState(undefined);
  const [response, setResponse] = useState(undefined);
  const [prompt, setPrompt] = useState(undefined);
  const [generated, setGenerated] = useState(undefined);

  const style = "rounded-xl mb-8 overflow-hidden shadow-lg"

  async function getLog(id:string) {
    let log = await fetchLog(id);
    setLog(log)
    //find prompts[x].name where prompts[x].id = log.prompt_id
    let prompt = prompts.find((prompt) => prompt.id === log.prompt_id)
    if(prompt as any) {
      setPromptName((prompt as any).name)
    }
    let model = models.find((model) => model.id === log.model_id);
    if(model) {
      setModelType((model as any).type)
      setModelName((model as any).name)
    }
    
    if((log as any).raw && (log as any).raw.request) {
      setRequest((log as any).raw.request)
    }

    if((log as any).raw && (log as any).raw.response) {
      setResponse((log as any).raw.response)
    }
  }

  //get id from path react
  const { push, query } = useRouter();

  useEffect(() => {
    getLog((query as any).id);
  }, [query.id, prompts, models]);

  function renderInputField(label: any, value: any) {
      return (
        <div>
        <InputField
        label={label}
        value={value}
        disabled={true}
        /></div>
      );
    }

  return (
    <div className="page-body full-width flush">
      <div className="pg-header">
        <div className="pg-header-title">
          <h1 className="pg-page-title" style={{display:'block'}}>Logs</h1>
        </div>
      </div>
      <div className="app-page">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 grid-cols-6 mb-4">
          {renderInputField("Prompt", promptName || "N/a")}
          {renderInputField("Model", modelName)}
          {renderInputField("Type", modelType)}
          {renderInputField("Duration", log.duration)}
          {renderInputField("Date", moments(log.createdAt).format('YYYY-MM-DD HH:mm:ss'))}
          {renderInputField("Status", log.status)}
        </div>
        <CodeEditor
          language="json"
          code={JSON.stringify(request, null, 4)}
          readOnly={true}
          height="30vh"
          style={style}
        />
        <CodeEditor
          language="json"
          code={JSON.stringify(response, null, 4)}
          readOnly={true}
          height="30vh"
          style={style}
        />
        <CodeEditor
          language="json"
          code={JSON.stringify(log, null, 4)}
          readOnly={true}
          style={style}
        />
      </div>
    </div>
  );
}
