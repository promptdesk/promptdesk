import React, { useEffect, useState } from "react";
import { modelStore } from "@/stores/ModelStore";
import PlaygroundButton from "@/components/Form/PlaygroundButton";
import { Model } from "@/interfaces/model";

export default function About() {
    // Destructure modelStore methods and state
    const {
        models,
        fetchAllModels,
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

    // Fetch models and set initial state on component mount
    useEffect(() => {
        const fetchData = async () => {
            const fetchedModels = await fetchAllModels();
            const defaultModel = fetchedModels[0] || { name: "" };
            setSelectedModel(defaultModel);
            setModifiedModel(JSON.stringify(defaultModel, null, 2));
        };

        fetchData();
    }, [fetchAllModels]);

    return (
        <div className="flex flex-row">
            {/* Left column */}
            <div className="w-1/4 p-4 border-r border-gray-200">
                <ul className="space-y-2">
                    {models.map((model) => (
                        <li
                            key={model.id}
                            onClick={() => setSelectedModel(model)}
                            className={`cursor-pointer p-2 rounded ${
                                selectedModel.id === model.id ? 'bg-gray-200' : 'hover:bg-gray-100'
                            }`}
                        >
                            {model.name}
                        </li>
                    ))}
                </ul>
            </div>

    
            {/* Right column */}
            <div className="w-3/4">
                <div className="pg-header">
                    <h4 className="pg-page-title">
                        {selectedModel?.name} ({isValidJSON ? "valid" : "invalid"})
                    </h4>
                    <div className="space-x-2">
                        <PlaygroundButton
                            text="Save"
                            onClick={() => saveModel(JSON.parse(modifiedModel))}
                        />
                        <PlaygroundButton
                            text="Duplicate"
                            onClick={() => {
                                const modelToDuplicate = isValidJSON
                                    ? JSON.parse(modifiedModel)
                                    : selectedModel as Model;
                                duplicateModel(modelToDuplicate);
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
    );      
  }