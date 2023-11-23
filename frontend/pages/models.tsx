import React, { useEffect, useState } from "react";
import { modelStore } from "@/stores/ModelStore";
import PlaygroundButton from "@/components/Form/PlaygroundButton";
import { ModelList } from "@/components/Models/ModelList";
import CodeEditor from "@/components/Editors/CodeEditor";
import InputField from "@/components/Form/InputField";
import DropDown from "@/components/Form/DropDown";

export default function About() {
  const { models, saveModel, duplicateModel, deleteModel } = modelStore();
  const [selectedModel, setSelectedModel] = useState({} as any);
  const [isValidJSON, setIsValidJSON] = useState(true);

  //model components
  const [api, setApi] = useState({} as any);
  const [inputFormat, setInputFormat] = useState("" as string);
  const [outputFormat, setOutputFormat] = useState("" as string);
  const [parameters, setParameters] = useState({} as any);

  const style = "rounded-xl mb-8 overflow-hidden shadow-lg"

  useEffect(() => {
    setSelectedModel(models[0] || {});
  }, [models]);

  useEffect(() => {
    setApi(selectedModel['api_call'])
    setInputFormat(selectedModel['input_format'])
    setOutputFormat(selectedModel['output_format'])
    setParameters(selectedModel['model_parameters'])
  }, [selectedModel]);

  const setFormattedApi = (json_string:any) => {
    try {
      const parsedJson = JSON.parse(json_string || "{}");
      setApi(parsedJson);
    } catch {
      //setIsValidJSON(false);
    }
  }

  const handleSave = () => {
    selectedModel['api_call'] = api;
    selectedModel['input_format'] = inputFormat;
    selectedModel['output_format'] = outputFormat;
    selectedModel['model_parameters'] = parameters;
    try {
      JSON.parse(JSON.stringify(selectedModel));
    } catch {
      alert("Invalid JSON");
      return;
    }
    saveModel(selectedModel);
  };

  const handleDuplicate = async () => {
    const newModelId = await duplicateModel(selectedModel);
    if (newModelId) {
      const model = models.find((model) => model.id === newModelId);
      setSelectedModel(model);
    }
  };

  const handleDelete = async () => {
    await deleteModel(selectedModel);
    const nextModel = models.find((_, index) => index !== models.indexOf(selectedModel)) || {};
    setSelectedModel(nextModel);
  };

  const updateModel = (key:string, value:any) => {
    const updatedModel = { ...selectedModel, [key]: value };
    setSelectedModel(updatedModel);
  };

  return (
    <div className="page-body full-width flush">
      <div className="pg-header">
        <div className="pg-header-section pg-header-title flex justify-between">
          <h1 className="pg-page-title">Models</h1>
          <div className="space-x-2">
            <PlaygroundButton text="Save" onClick={handleSave} />
            <PlaygroundButton text="Duplicate" onClick={handleDuplicate} />
            <PlaygroundButton text="Delete" onClick={handleDelete} />
          </div>
        </div>
      </div>
      <div className="flex flex-row">
        <ModelList models={models} selectedModel={selectedModel} setSelectedModel={setSelectedModel} />
        <div className="w-3/4">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 grid-cols-6 m-2">
            <div className="col-span-2">
              <InputField label="Model Name" value={selectedModel.name} onInputChange={(value) => updateModel("name", value)} />
            </div>
            <div className="col-span-2">
              <DropDown label="Model Type" options={[{ name: "Completion", value: "completion" }, { name: "Chat", value: "chat" }]} selected={selectedModel.type} onChange={(value:any) => updateModel("type", value)} />
            </div>
            <div className="col-span-2">
              <DropDown label="Default model" options={[{ value: true, name: "True" }, { value: false, name: "False" }]} selected={selectedModel.default} onChange={(value:any) => updateModel("default", value === "true")} />
            </div>
          </div>
          <div className="m-2 mt-4">
            <div>
              <h3 className="mb-1">API Call</h3>
            </div>
            <CodeEditor height="30vh" style={style} code={JSON.stringify(api, null, 4)} language="json"
              handleChange={(value) => {
                setFormattedApi(value);
              }}/>
            <div>
              <h3 className="mb-1">Input format</h3>
            </div>
            <CodeEditor height="50vh" style={style} code={inputFormat} language="javascript"
              handleChange={(value) => {
                setInputFormat(value as string);
              }}/>
            <div>
              <h3 className="mb-1">Output format</h3>
            </div>
            <CodeEditor height="30vh" style={style} code={outputFormat} language="javascript"
              handleChange={(value) => {
                setOutputFormat(value as string);
              }}/>
            <div>
              <h3 className="mb-1">Model parameters</h3>
            </div>
            <CodeEditor height="50vh" style={style} code={JSON.stringify(parameters, null, 4)} language="json"
              handleChange={(value) => {
                setParameters(value);
              }}/>
          </div>
        </div>
      </div>
    </div>
  );
}
