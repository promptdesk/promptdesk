import React from 'react';

type ModelListProps = {
    models: any;
    selectedModel: any;
    setSelectedModel: any;
}

// ModelList Component
export function ModelList({ models, selectedModel, setSelectedModel }: ModelListProps) {
    return (
        <div className="w-1/4 p-4 border-r border-gray-200">
            <ul className="space-y-2">
                {models.map((model: any) => (
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
    );
}