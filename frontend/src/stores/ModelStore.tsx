import { create } from 'zustand';
import { promptStore } from '@/stores/PromptStore';
import { variableStore } from '@/stores/VariableStore';
import { Model } from '@/interfaces/model';
import { fetchFromPromptdesk } from '@/services/PromptdeskService'
import { useEffect } from 'react';

interface ModelStore {
  modelListSelector: { value: any; name: any; }[];
  models: Model[];
  selectedModeId: string;
  modelObject: Model;
  areVariablesSet: boolean;
  missingVariables: string[];
  fetchAllModels: () => Promise<Model[]>;
  checkVariables: () => void;
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

    const checkVariables = () => {
        //get current modelObject
        const { variables } = variableStore.getState();
        const { modelObject } = modelStore.getState();
        if(!modelObject || !variables) {
            return;
        }
        let api_call = JSON.stringify(modelObject.api_call);
        console.log(variables);
        const regex = /{{(.*?)}}/g;
        const matches = api_call.match(regex);
        const variableList = matches ? matches.map(m => m.slice(2, -2)) : [];
        console.log(variableList);

        var error = false;
        var missing_variable = undefined;
        var missingVariables: string[] = [];
        variableList.forEach(variableName => {
            const variable = variables.find(v => v.name === variableName);
            // Check if the variable exists and has a non-empty value
            if (variable && variable.value && variable.value !== '') {
                //console.log(`${variableName} exists and is not empty.`);
            } else {
                //add to missingVariables list
                error = true;
                missing_variable = variableName;
                missingVariables.push(variableName);
            }
        });
    
        if (error) {
            set({ areVariablesSet: false });
            set({ missingVariables: missingVariables })
            return;
        } else {
            set({ areVariablesSet: true });
            set({ missingVariables: [] })
            return;
        }

    }

    return {
        modelListSelector: [],
        models: [],
        selectedModeId: "",
        modelObject: { type: "chat" } as Model,
        areVariablesSet: false,
        missingVariables: [],

        fetchAllModels,
        checkVariables,

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

            checkVariables();
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
            checkVariables();
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
        },

    };
});

export { modelStore };