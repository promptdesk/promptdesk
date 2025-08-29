import React from 'react';
import { modelStore } from '@/stores/ModelStore';
import { chatStore } from '@/stores/ChatStore';

interface ModelSelectorProps {
  compact?: boolean;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ compact = false }) => {
  const { models, modelObject, setModelById } = modelStore();
  const { isLoading, currentChat } = chatStore();

  // Filter models to only show chat type
  const chatModels = models.filter(model => model.type === 'chat');
  
  // Disable model selection if chat has started (has messages)
  const hasMessages = Boolean(currentChat && currentChat.messages.length > 0);
  const isModelSelectionDisabled = isLoading || hasMessages;

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const modelId = e.target.value;
    setModelById(modelId);
  };

  if (chatModels.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <div className="bg-white border border-gray-300 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Model:
          </span>
          <select
            value={modelObject?.id || ''}
            onChange={handleModelChange}
            disabled={isModelSelectionDisabled}
            className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {chatModels.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
          
          {modelObject && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                {modelObject.type}
              </span>
              {modelObject.default && (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
                  default
                </span>
              )}
            </div>
          )}
        </div>
        {hasMessages && (
          <p className="text-xs text-gray-500 mt-2">
            Model selection is locked during conversation
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-200 bg-gray-50">
      <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
        Model:
      </span>
      <select
        value={modelObject?.id || ''}
        onChange={handleModelChange}
        disabled={isModelSelectionDisabled}
        className="flex-1 max-w-xs text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {chatModels.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
      
      {modelObject && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
            {modelObject.type}
          </span>
          {modelObject.default && (
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
              default
            </span>
          )}
          {hasMessages && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
              locked
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
