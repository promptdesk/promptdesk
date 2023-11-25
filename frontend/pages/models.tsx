import React, { useEffect, useState } from "react";
import { modelStore } from "@/stores/ModelStore";
import PlaygroundButton from "@/components/Form/PlaygroundButton";
import { ModelList } from "@/components/Models/ModelList";
import { testAPI } from "@/services/LLMTests";
import ModelSettings from "@/components/Models/ModelSettings";

export default function ModelsPage() {
  const { models, saveModel, duplicateModel, deleteModel, fetchAllModels } = modelStore();
  const [selectedModel, setSelectedModel] = useState({} as any);
  const [isValidJSON, setIsValidJSON] = useState(true);
  const [apiResponse, setApiResponse] = useState({} as any);
  const [inputFormatResponse, setInputFormatResponse] = useState({} as any);
  const [outputFormatResponse, setOutputFormatResponse] = useState({} as any);

  //model components
  const [api, setApi] = useState({} as any);
  const [parameters, setParameters] = useState({} as any);
  const [inputFormat, setInputFormat] = useState("" as string);
  const [outputFormat, setOutputFormat] = useState("" as string);

  const style = "rounded-xl overflow-hidden shadow-lg"

  useEffect(() => {
    if(Object.keys(selectedModel).length === 0) {
      setSelectedModel(models[0] || {});
    }
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

  const setFormattedParameters = (json_string:any) => {
    try {
      const parsedJson = JSON.parse(json_string || "{}");
      setParameters(parsedJson);
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
    await fetchAllModels();
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

  function generate_pre_compontent(status:number, contents:any) {
    return (
      <>
      {status === undefined ? <></> : 
      <pre className="bg-gray-800 text-white text-sm p-4 rounded-xl overflow-auto mb-4" style={{whiteSpace: "pre-wrap"}}>
RESPONSE STATUS: {status}<br/>
{contents}
      </pre>}
      </>
    )
  }

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
        <ModelSettings
          selectedModel={selectedModel}
          updateModel={updateModel}
          setFormattedApi={setFormattedApi}
          api={api}
          apiResponse={apiResponse}
          setApiResponse={setApiResponse}
          inputFormatResponse={inputFormatResponse}
          setInputFormatResponse={setInputFormatResponse}
          outputFormatResponse={outputFormatResponse}
          setOutputFormatResponse={setOutputFormatResponse}
          parameters={parameters}
          inputFormat={inputFormat}
          setInputFormat={setInputFormat}
          outputFormat={outputFormat}
          setOutputFormat={setOutputFormat}
          handleSave={handleSave}
          setFormattedParameters={setFormattedParameters}
          testAPI={testAPI} />
      </div>
    </div>
  );
}
