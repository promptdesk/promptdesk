import { create } from 'zustand';
import { promptStore } from '@/stores/PromptStore';
import { Model } from '@/interfaces/model';
import { fetchFromPromptdesk } from '@/services/PromptdeskService'

interface ModelStore {
  modelListSelector: { value: any; name: any; }[];
  models: Model[];
  selectedModeId: string;
  modelObject: Model;
  fetchAllModels: () => Promise<Model[]>;
  setModelById: (id: string) => void;
  saveModel: (model: Model) => Promise<void>;
  duplicateModel: (model: Model) => Promise<string>;
  deleteModel: (model: Model) => Promise<void>;
  importModel: (model: Model) => Promise<string>;
}

const modelStore = create<ModelStore>(set => {

    const fetchAllModels = async () => {
        const models = await fetchFromPromptdesk('/api/models');
        const dropdownModelList = models.map(({ id, name, type, provider }: Model) => {
            return { value: id, name: `${name} (${type.slice(0, 4)}) ${provider ? `| ${provider}` : ''}` };
        });
        const defaultModel = models.find((model: any) => model.default === true);

        set({ 
            models,
            modelListSelector: dropdownModelList,
            modelObject: defaultModel,
            selectedModeId: defaultModel?.id
        });

        return models;
    };

    return {
        modelListSelector: [],
        models: [],
        selectedModeId: "",
        modelObject: { type: "chat" } as Model,

        fetchAllModels,

        setModelById: (id: string) => {
            const model = modelStore.getState().models.find(m => m.id === id);
            if (!model) return;

            const updateData: any = {};
            if (model.type === "completion") {
                updateData.prompt_data = { prompt: "" };
            } else if (model.type === "chat") {
                updateData.prompt_data = { messages: [], context: "" };
            }


            //get current modelObject
            const { modelObject } = modelStore.getState();
            let currentType = modelObject.type;
            //get existing promptData.prompt_data
            let currentPromptData = promptStore.getState().promptObject.prompt_data;
            console.log(currentPromptData, currentType, model.type);

            if(currentType === model.type) {
                updateData.prompt_data = currentPromptData;
                updateData.prompt_parameters = {};
            }

            console.log(updateData)

            set({ modelObject: model, selectedModeId: model.id });

            promptStore.setState(state => ({
                promptObject: { ...state.promptObject, ...updateData, model: model.id },
                prompts: state.prompts.map(prompt => {
                    if (prompt.id === state.promptObject.id) {
                        return { ...prompt, model: model.id };
                    }
                    return prompt;
                })
            }));
        },

        saveModel: async (model: Model) => {
            await fetchFromPromptdesk(`/api/model/${model.id}`, 'PUT', model);
            await fetchAllModels();
        },

        duplicateModel: async (model: Model) => {
            const exists = modelStore.getState().models.some(m => m.name === model.name);
            if (exists) {
                model.name += " (copy)";
                (model as any).id = undefined;
            }
            let newModel = await fetchFromPromptdesk(`/api/model`, 'POST', model);
            await fetchAllModels();
            return newModel.id;
        },

        deleteModel: async (model: Model) => {
            await fetchFromPromptdesk(`/api/model/${model.id}`, 'DELETE');
            await fetchAllModels();
        },

        setModelByName: (name: string) => {
            const model = modelStore.getState().models.find(m => m.name === name);
            set({ modelObject: model, selectedModeId: model?.id });
            promptStore.setState(state => ({ promptObject: { ...(state as any).promptObject, model: model?.id } }));
        },

        importModel: async (model: Model) => {
            const exists = modelStore.getState().models.some(m => m.name === model.name);
            if (exists) {
                model.name += " (copy)";
                (model as any).id = undefined;
            }
            let newModel = await fetchFromPromptdesk(`/api/model`, 'POST', model);
            await fetchAllModels();
            return newModel.id;
        }
    };
});

export { modelStore };