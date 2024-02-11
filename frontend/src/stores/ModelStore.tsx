import { create } from "zustand";
import { promptStore } from "@/stores/prompts";
import { variableStore } from "@/stores/VariableStore";
import { Model } from "@/interfaces/model";
import { fetchFromPromptdesk } from "@/services/PromptdeskService";

interface ModelStore {
  modelListSelector: { value: any; name: any }[];
  models: Model[];
  selectedModel: string;
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

const modelStore = create<ModelStore>((set) => {
  const fetchAllModels = async () => {
    const models = await fetchFromPromptdesk("/models");
    const dropdownModelList = models.map(
      ({ id, name, type, provider }: Model) => {
        return {
          value: id,
          name: `${name} (${type.slice(0, 4)}) ${provider ? `| ${provider}` : ""}`,
        };
      },
    );
    const defaultModel = models.find((model: any) => model.default === true);

    set({
      models,
      modelListSelector: dropdownModelList,
      modelObject: defaultModel,
      selectedModel: defaultModel?.id,
    });

    return models;
  };

  const checkVariables = () => {
    //get current modelObject
    const { variables } = variableStore.getState();
    const { modelObject } = modelStore.getState();
    if (!modelObject || !variables || !modelObject.api_call) {
      return;
    }
    let api_call = JSON.stringify(modelObject.api_call);
    const regex = /{{(.*?)}}/g;
    const matches = api_call.match(regex);
    const variableList = matches ? matches.map((m) => m.slice(2, -2)) : [];

    var error = false;
    var missing_variable = undefined;
    var missingVariables: string[] = [];
    variableList.forEach((variableName) => {
      const variable = variables.find((v) => v.name === variableName);
      // Check if the variable exists and has a non-empty value
      if (variable && variable.value && variable.value !== "") {
      } else {
        error = true;
        missing_variable = variableName;
        missingVariables.push(variableName);
      }
    });

    if (error) {
      set({ areVariablesSet: false });
      set({ missingVariables: missingVariables });
      return;
    } else {
      set({ areVariablesSet: true });
      set({ missingVariables: [] });
      return;
    }
  };

  return {
    modelListSelector: [],
    models: [],
    selectedModel: "",
    modelObject: { type: "chat" } as Model,
    areVariablesSet: false,
    missingVariables: [],

    fetchAllModels,
    checkVariables,

    setModelById: (id: string) => {
      let model = modelStore.getState().models.find((m) => m.id === id);
      /*if (!model) {
                model = modelStore.getState().models.find(m => m.default === true);
            }
            if (!model) {
                model = modelStore.getState().models[0];
            }*/
      if (!model) {
        return;
      }

      const updateData: any = {};
      if (model.type === "completion") {
        updateData.prompt_data = { prompt: "" };
      } else if (model.type === "chat") {
        updateData.prompt_data = { messages: [], context: "" };
      }

      //get current modelObject
      let { modelObject } = modelStore.getState();
      /*if(!modelObject) {
                modelObject = model
            }*/
      let currentType = modelObject.type;
      //get existing promptData.prompt_data
      let currentPromptData = promptStore.getState().promptObject.prompt_data;

      if (currentType === model.type) {
        updateData.prompt_data = currentPromptData;
        updateData.prompt_parameters = {};
      }

      set({ modelObject: model, selectedModel: model.id });

      promptStore.setState((state) => ({
        promptObject: {
          ...state.promptObject,
          ...updateData,
          model: (model as Model).id,
        },
        prompts: state.prompts.map((prompt) => {
          if (prompt.id === state.promptObject.id) {
            return { ...prompt, model: (model as Model).id };
          }
          return prompt;
        }),
      }));

      checkVariables();
    },

    saveModel: async (model: Model) => {
      await fetchFromPromptdesk(`/model/${model.id}`, "PUT", model);
      await fetchAllModels();
    },

    duplicateModel: async (model: Model) => {
      const exists = modelStore
        .getState()
        .models.some((m) => m.name === model.name);
      if (exists) {
        model.name += " (copy)";
        (model as any).id = undefined;
      }
      let newModel = await fetchFromPromptdesk(`/model`, "POST", model);
      await fetchAllModels();
      return newModel.id;
    },

    deleteModel: async (model: Model) => {
      await fetchFromPromptdesk(`/model/${model.id}`, "DELETE");
      await fetchAllModels();
    },

    importModel: async (model: Model) => {
      const exists = modelStore
        .getState()
        .models.some((m) => m.name === model.name);
      if (exists) {
        model.name += " (copy)";
        (model as any).id = undefined;
      }
      let newModel = await fetchFromPromptdesk(`/model`, "POST", model);
      await fetchAllModels();
      return newModel.id;
    },
  };
});

export { modelStore };
