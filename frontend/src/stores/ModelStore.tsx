/* Refactored on September 4th 2023 */
import { create } from 'zustand'
import { promptStore } from '@/stores/PromptStore';
import { Model } from '@/interfaces/model';

interface ModelStore {
  modelListSelector: { id: any; name: any; }[];
  models: Model[];
  selectedModeId: string;
  modelObject: Model;
  fetchAllModels: () => Promise<Model[]>;
  setModelById: (id: string) => void;
  saveModel: (model: Model) => Promise<void>;
  duplicateModel: (model: Model) => Promise<void>;
  deleteModel: (model: Model) => Promise<void>;
}

const modelStore = create<ModelStore>((set) => ({
  modelListSelector: [],
  models: [],
  selectedModeId: "",
  modelObject: {type:"chat"} as Model,
  fetchAllModels: async () => {
    try {
      const response = await fetch('http://localhost:4000/api/models');
      const models = await response.json();
      console.log("FETCH", models)
      set({ models });
      const dropdownModelList = models.map((model: Model) => ({
        id: model.id,
        name: model.name,
      }));
      set({ modelListSelector: dropdownModelList });
      const defaultModel = models.find((model:any) => model.default === true);
      set({ modelObject: defaultModel });
      set({ selectedModeId: defaultModel?.id });
      return models;
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  },
  saveModel: async (model: Model) => {
    try {
      const response = await fetch(`http://localhost:4000/api/model/${model.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(model),
      });
      const data = await response.json();
      const models = await modelStore.getState().fetchAllModels();
      const dropdownModelList = models.map((m: Model) => ({
        id: m.id,
        name: m.name,
      }));
      set({
        models,
        modelListSelector: dropdownModelList,
      });
    } catch (error) {
      console.error('Error:', error);
    }
  },
  duplicateModel: async (model: Model) => {
    try {
      const models = modelStore.getState().models;
      const exists = models.some((m: { name: any; }) => m.name === model.name);
      if (exists) {
        model.name = model.name + " (copy)";
      }
      const response = await fetch('http://localhost:4000/api/model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(model)
      });
      const data = await response.json();
      const updatedModels = await modelStore.getState().fetchAllModels();
      const dropdownModelList = updatedModels.map((m) => ({
        id: m.id,
        name: m.name
      }));
      set({ models: updatedModels, modelListSelector: dropdownModelList });
    } catch (error) {
      console.error('Error:', error);
    }
  },
  deleteModel: async (model: Model) => {
    try {
      const modelId = model.id;
      const response = await fetch(`http://localhost:4000/api/model/${modelId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(model)
      });
      //call fetchAllModels
      const updatedModels = await modelStore.getState().fetchAllModels();
    } catch (error) {
      console.error('Error:', error);
    }
  },
  setModelById: (id: string) => {
    if (!id) {
      return;
    }
    const model = modelStore.getState().models.find((m) => m.id === id);
    if (!model) {
      return;
    }
    set({ modelObject: model, selectedModeId: model.id });
    promptStore.setState((state) => ({
      promptObject: { ...state.promptObject, model: model.id },
      prompts: state.prompts.map((prompt) => {
        if (prompt.id === state.promptObject.id) {
          return { ...prompt, model: model.id };
        }
        return prompt;
      })
    }));
  },
  setModelByName: (name: string) => {
    const model = modelStore.getState().models.find((m) => m.name === name);
    set({ modelObject: model, selectedModeId: model?.id });
    promptStore.setState((state) => ({
      promptObject: { ...state.promptObject, model: model?.id },
    }));
  }
}));

export { modelStore }