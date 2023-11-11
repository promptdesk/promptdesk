import React, { use, useEffect, useState } from "react";
import { modelStore } from "@/stores/ModelStore";
import PlaygroundButton from "@/components/Form/PlaygroundButton";
import { Model } from "@/interfaces/model";
import {ModelList} from "@/components/Models/ModelList";
export default function About() {
    // Destructure modelStore methods and state
    const {
        models,
        saveModel,
        duplicateModel,
        deleteModel
    } = modelStore();

    // Initialize state variables
    const [selectedModel, setSelectedModel] = useState({
        name: "",
        id: "",
    });
    const [modifiedModel, setModifiedModel] = useState("");
    const [isValidJSON, setIsValidJSON] = useState(true);

    useEffect(() => {
        const defaultModel = models[0] || { name: "" };
        setSelectedModel(defaultModel);
        setModifiedModel(JSON.stringify(defaultModel, null, 2));
    }, []);

    function ModelButtons() {
        return (
            <div className="space-x-2">
            <PlaygroundButton
                text="Save"
                onClick={() => {
                    if(!isValidJSON) {
                        alert("Invalid JSON");
                        return;
                    }
                    saveModel(JSON.parse(modifiedModel))
                }}
            />
            <PlaygroundButton
                text="Duplicate"
                onClick={async () => {
                    const modelToDuplicate = selectedModel;
                    let newModelId = await duplicateModel(modelToDuplicate as any);
                    if(newModelId as string) {
                        const model = modelStore.getState().models.find((model) => model.id === newModelId);
                        setSelectedModel(model as any);
                    }
                }}
            />
            <PlaygroundButton
                text="Delete"
                onClick={async () => {

                    //find index of selectedModel
                    const index = models.findIndex((model) => model.id === selectedModel.id);

                    const modelToDelete = selectedModel as Model;
                    await deleteModel(modelToDelete);

                    //set selectedModel to the next model in the list if it exists
                    if (index < models.length - 1) {
                        setSelectedModel(models[index + 1]);
                    } else if (index > 0) {
                        setSelectedModel(models[index - 1]);
                    } else {
                        setSelectedModel({ name: "", id: "" });
                    }
                    
                }}
            />
        </div>
        );
    }

    return (
        <div className="page-body full-width flush">
            <div className="pg-header">
            <div className="pg-header-section pg-header-title flex justify-between">
                <h1 className="pg-page-title">Models</h1>
                <ModelButtons />
            </div>
            </div>
        <div className="flex flex-row">
            {/* Left column */}
            <ModelList
                models={models}
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
            />
            {/* Right column */}
            <div className="w-3/4">
                <div className="p-2 bg-slate-600 text-white">
                    {selectedModel?.name} ({isValidJSON ? "valid" : "invalid"})
                </div>
                <pre
                    style={{ whiteSpace: "pre-wrap" }}
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    className={`hljs syntax-highlighter dark code-sample-pre ${isValidJSON ? "bg-white" : "bg-red-100"}`}
                    onInput={(e) => {
                        const text = e.currentTarget.innerText;
                        try {
                            const parsedJson = JSON.parse(text);
                            setModifiedModel(text);
                            setIsValidJSON(true);
                        } catch (e) {
                            setIsValidJSON(false);
                        }
                    }}
                >
                    {JSON.stringify(selectedModel, null, 2)}
                </pre>
            </div>
        </div>
        </div>
    );      
  }