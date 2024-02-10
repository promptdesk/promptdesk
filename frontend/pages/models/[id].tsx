import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { modelStore } from "@/stores/ModelStore";
import PlaygroundButton from "@/components/Form/PlaygroundButton";
import { ModelList } from "@/components/Models/ModelList";
import { testAPI } from "@/services/LLMTests";
import ModelSettings from "@/components/Models/ModelSettings";
import Head from "next/head";
import ConfirmModal from "@/components/Modals/ConfirmModal";
import toast, { Toaster } from "react-hot-toast";
import _ from "lodash";

export default function ModelsPage() {

  const { push, query } = useRouter();
  const { id } = query;

  const { models, saveModel, duplicateModel, deleteModel, fetchAllModels, importModel } = modelStore();
  const [selectedModel, setSelectedModel] = useState({} as any);
  const [apiResponse, setApiResponse] = useState({} as any);
  const [inputFormatResponse, setInputFormatResponse] = useState({} as any);
  const [outputFormatResponse, setOutputFormatResponse] = useState({} as any);

  //model components
  const [api, setApi] = useState({} as any);
  const [parameters, setParameters] = useState({} as any);
  const [inputFormat, setInputFormat] = useState("" as string);
  const [outputFormat, setOutputFormat] = useState("" as string);
  const [responseMapping, setResponseMapping] = useState({} as any);
  const [requestMapping, setRequestMapping] = useState({} as any);

  // model components
  const [isShowingConfirmDeleteModal, setIsShowingConfirmDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      const model = models.find((model) => model.id === id);
      setSelectedModel(model);
    } else {
      setSelectedModel(models[0] || {});
    }

  }, [models, query.id]);

  useEffect(() => {
    setApi(selectedModel['api_call'])
    setInputFormat(selectedModel['input_format'])
    setOutputFormat(selectedModel['output_format'])
    setParameters(selectedModel['model_parameters'])
    setResponseMapping(selectedModel['response_mapping'])
    setRequestMapping(selectedModel['request_mapping'])
    setOutputFormatResponse({})
    setInputFormatResponse({})
    setApiResponse({})
  }, [selectedModel]);

  const setFormattedApi = (json_string: any) => {
    try {
      const parsedJson = JSON.parse(json_string || "{}");
      setApi(parsedJson);
    } catch {
    }
  }

  const setFormattedParameters = (json_string: any) => {
    try {
      const parsedJson = JSON.parse(json_string || "{}");
      setParameters(parsedJson);
    } catch {
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
    const newUrl = `/models/${newModelId}`;
    push(newUrl);
  };

  const handleDelete = () => {
    deleteModel(selectedModel).then(() => {
      const nextModel = models.find((_, index) => index !== models.indexOf(selectedModel)) || {};
      setSelectedModel(nextModel);
    }).catch((err: Error) => {
      const msg = err?.message;
      toast.error(msg, { position: 'bottom-right' });
    })
  };

  const handleExport = () => {
    const element = document.createElement("a");
    var json_file = JSON.parse(JSON.stringify(selectedModel));
    delete json_file.organization_id;
    delete json_file.createdAt;
    delete json_file.updatedAt;
    delete json_file.__v;
    delete json_file.id;
    json_file['default'] = false;
    const file = new Blob([JSON.stringify(json_file, null, 4)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = "model.json";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  const handleImport = () => {
    //import json file and call the importModel function
    const element = document.createElement("input");
    element.type = "file";
    element.accept = ".json";
    element.onchange = async (event: any) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = async (readerEvent: any) => {
        const content = readerEvent.target.result;
        const json_file = JSON.parse(content);
        const newModelId = await importModel(json_file);
        const newUrl = `/models/${newModelId}`;
        push(newUrl);
      }
    }
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  const updateModel = (key: string, value: any) => {
    if (key === 'default' && value) {
      if (_.filter(models, (model) => model.id !== selectedModel.id).find(model => model.default)) {
        toast.error("Default model exist, can't set this model as default", { position: 'bottom-right' });
        return;
      }
    }
    const updatedModel = { ...selectedModel, [key]: value };
    setSelectedModel(updatedModel);
  };

  const setModel = (model: any) => {
    setSelectedModel(model);
    const newUrl = `/models/${model.id}`;
    push(newUrl);
  }

  return (
    <>
      <Head>
        <title>Models - PromptDesk</title>
      </Head>
      <div className="page-body full-width flush">
        <div className="pg-header">
          <div className="pg-header-section pg-header-title flex justify-between">
            <h1 className="pg-page-title">Models</h1>
            <div className="space-x-2">
              <PlaygroundButton text="Save" onClick={handleSave} />
              <PlaygroundButton text="Duplicate" onClick={handleDuplicate} />
              <PlaygroundButton text="Export" onClick={handleExport} />
              <PlaygroundButton text="Import" onClick={handleImport} />
              <PlaygroundButton text="Delete" onClick={() => setIsShowingConfirmDeleteModal(true)} color="negative" />
            </div>
          </div>
        </div>
        <div className="flex flex-row">
          <ModelList models={models} selectedModel={selectedModel} setSelectedModel={setModel} />
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
            responseMapping={responseMapping}
            setResponseMapping={setResponseMapping}
            requestMapping={requestMapping}
            setRequestMapping={setRequestMapping}
            handleSave={handleSave}
            setFormattedParameters={setFormattedParameters}
            testAPI={testAPI} />
        </div>
        {isShowingConfirmDeleteModal ?
          <ConfirmModal
            acceptText="Yes"
            bodyText="This action will delete model, you sure?"
            cancelText="Cancel"
            onAccept={() => {
              handleDelete()
              setIsShowingConfirmDeleteModal(false)
            }}
            onCancel={() => {
              setIsShowingConfirmDeleteModal(false)
            }}
            title="Delete Model" />
          : null}
        <Toaster />
      </div>
    </>
  );
}
