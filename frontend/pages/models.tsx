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

  useEffect(() => {
    setSelectedModel(models[0] || {});
  }, [models]);

  const handleCodeChange = (json_string:any) => {
    try {
      const parsedJson = JSON.parse(json_string || "{}");
      setSelectedModel(parsedJson);
      setIsValidJSON(true);
    } catch {
      setIsValidJSON(false);
    }
  };

  const handleSave = () => {
    if (!isValidJSON) {
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
          <CodeEditor handleChange={handleCodeChange} code={JSON.stringify(selectedModel, null, 2)} language="json" />
        </div>
      </div>
    </div>
  );
}
