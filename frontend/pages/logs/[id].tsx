import React, { useEffect, useState } from "react";
import { logStore } from "@/stores/LogStore";
import { modelStore } from "@/stores/ModelStore";
import { promptStore } from "@/stores/prompts";
import { useRouter } from "next/router";
import moments from "moment";
import InputField from "@/components/Form/InputField";
import { Log } from "@/interfaces/log";
import { CustomJSONView } from "@/components/Viewers/CustomJSONView";
import "./[id].scss";
import Head from "next/head";

function LogAttribute({ label, value }: { label: string; value: string }) {
  return (
    <div className={"log-attribute"}>
      <InputField label={label} value={value} disabled={true} />
    </div>
  );
}

export default function SingleLogPage() {
  var { logs, fetchLog } = logStore();
  var { prompts, activateLocalPrompt } = promptStore();
  var { models } = modelStore();

  const [log, setLog] = useState({} as Log);
  const [promptName, setPromptName] = useState(undefined);
  const [modelType, setModelType] = useState(undefined);
  const [modelName, setModelName] = useState(undefined);
  const [request, setRequest] = useState(undefined);
  const [response, setResponse] = useState(undefined);
  const [prompt, setPrompt] = useState(undefined);
  const [generated, setGenerated] = useState(undefined);

  const style = "rounded-xl mb-8 overflow-hidden shadow-lg";

  async function getLog(id: string) {
    let log = await fetchLog(id);
    setLog(log);
    //find prompts[x].name where prompts[x].id = log.prompt_id
    let prompt = prompts.find((prompt) => prompt.id === log.prompt_id);
    if (prompt as any) {
      setPromptName((prompt as any).name);
    }
    let model = models.find((model) => model.id === log.model_id);
    if (model) {
      setModelType((model as any).type);
      setModelName((model as any).name);
    }

    if ((log as any).raw && (log as any).raw.request) {
      setRequest((log as any).raw.request);
    }

    if ((log as any).raw && (log as any).raw.response) {
      setResponse((log as any).raw.response);
    }

    if ((log as any).raw && (log as any).data) {
      activateLocalPrompt((log as any).data);
      setPrompt((log as any).data);
    }

    if ((log as any).raw && (log as any).generated) {
      setGenerated((log as any).generated);
    }
  }

  //get id from path react
  const { push, query } = useRouter();

  useEffect(() => {
    getLog((query as any).id);
  }, [query.id, prompts, models]);

  return (
    <>
      <Head>
        <title>View Log {log.id} - PromptDesk</title>
      </Head>
      <div className="page-body full-width flush">
        <div className="pg-header">
          <div className="pg-header-title">
            <h1 className="pg-page-title" style={{ display: "block" }}>
              Logs
            </h1>
          </div>
        </div>
        <div className="app-page">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 grid-cols-6 mb-4">
            <LogAttribute label="Prompt" value={promptName || "N/a"} />
            <LogAttribute label="Model" value={modelName || ""} />
            <LogAttribute label="Type" value={modelType || ""} />
            <LogAttribute
              label="Duration"
              value={log.duration?.toString() || ""}
            />
            <LogAttribute
              label="Date"
              value={moments(log.createdAt).format("YYYY-MM-DD HH:mm:ss") || ""}
            />
            <LogAttribute label="Status" value={log.status?.toString() || ""} />
          </div>

          {(log as any).status !== 200 && (
            <>
              <h3>Error</h3>
              <CustomJSONView name="response" src={response} />
            </>
          )}

          <h3>Generated</h3>
          <CustomJSONView name="generated" src={{ data: log.message }} />

          <h3>Prompt</h3>
          <CustomJSONView name="prompt" src={prompt} />

          <h3>Request</h3>
          <CustomJSONView name="request" src={request} />

          <h3>Response</h3>
          <CustomJSONView name="response" src={response} />
        </div>
      </div>
    </>
  );
}
