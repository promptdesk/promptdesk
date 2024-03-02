/* Refactored on September 4th 2023 */
import { create } from "zustand";
import { modelStore } from "@/stores/ModelStore";
import { Prompt } from "@/interfaces/prompt";

interface PromptStore {
  promptObject: Prompt;
  prompts: Array<Prompt>;
  defaultPrompt: Prompt;
  selectedVariable: string;
  parsingError: string | null;
  updateLocalPromptValues: (key: any, value: any) => void;
  activateLocalPrompt: (id: string) => void;
  createLocalPrompt: (projectName?: string, prompt?: any) => string | undefined;
  updateLocalPrompt: (promptObject: Prompt) => void;
  addToLocalPrompts: (prompt: Prompt) => void;
}

const defaultPrompt: Prompt = {
  id: "",
  name: "",
  description: "",
  model: "",
  project: undefined,
  model_parameters: {},
  prompt_data: {
    prompt: "",
    context: "",
    messages: [],
  },
  prompt_variables: {},
  new: true,
  model_type: undefined,
  organization_id: "",
  provider: undefined,
};

const promptStore = create<PromptStore>((set, get) => ({
  defaultPrompt,
  promptObject: JSON.parse(JSON.stringify(defaultPrompt)),
  prompts: [],
  isPromptLoading: false,
  generatedText: undefined,
  selectedVariable: "",
  parsingError: null,

  updateLocalPromptValues: (key: any, value: any) => {
    set((state) => {
      const promptObject = { ...state.promptObject };
      //create promptObject['model_parameters'] if it doesn't exist
      if (!promptObject.model_parameters) {
        promptObject.model_parameters = {};
      }
      if (key.startsWith("model_parameters.")) {
        const parameterKey = key.split(".")[1];
        promptObject.model_parameters[parameterKey] = value;
      } else if (key.startsWith("prompt_data.")) {
        const promptDataKey = key.split(".")[1];
        promptObject.prompt_data[promptDataKey] = value;
      } else {
        (promptObject as any)[key] = value;
      }
      return { promptObject };
    });
    get().updateLocalPrompt(get().promptObject);
  },

  updateLocalPrompt: (promptObject: Prompt) => {
    set((state) => {
      const prompts = state.prompts.map((prompt) => {
        if (prompt.id === promptObject.id) {
          return promptObject;
        } else {
          return prompt;
        }
      });
      return { prompts };
    });
  },

  createLocalPrompt: (projectName: string = "", prompt?: Prompt) => {
    let promptModelType = prompt?.model_type;

    let defaultModel = modelStore
      .getState()
      .models.find((model) => model.default);

    console.log("defaultModel - 1");

    if (
      !defaultModel ||
      (promptModelType !== defaultModel.type && promptModelType)
    ) {
      //if models is empty then return
      if (modelStore.getState().models.length === 0) {
        alert("You must create a model first before creating a prompt.");
        return;
      }

      //return first model with type promptModelType
      defaultModel = modelStore
        .getState()
        .models.find((model) => model.type === promptModelType);

      if (!defaultModel) {
        alert(
          `You must create a model of type ${promptModelType} before creating a prompt.`,
        );
        return;
      }
    }

    let newPrompt: Prompt = {
      ...JSON.parse(JSON.stringify(defaultPrompt)),
      name: new Date().toLocaleString(),
      id:
        Math.random().toString(36).substring(2, 10) +
        Math.random().toString(36).substring(2, 10),
      model: defaultModel.id,
      project: projectName,
    };

    //check if prompt is passed as argument
    if (prompt) {
      newPrompt = prompt;
      newPrompt.name = new Date().toLocaleString();
      newPrompt.id =
        Math.random().toString(36).substring(2, 10) +
        Math.random().toString(36).substring(2, 10);
      if (defaultModel.type === prompt.model_type) {
        newPrompt.model = defaultModel.id;
      } else {
        const model = modelStore
          .getState()
          .models.find((model) => model.type === prompt.model_type);
        if (model) {
          newPrompt.model = model.id;
        }
      }
    }

    console.log("defaultModel - 4", newPrompt, "asdf");

    set((state) => {
      const prompts = [...state.prompts, newPrompt];
      return { prompts };
    });

    return newPrompt.id;
  },

  activateLocalPrompt: (id: string) => {
    const prompts = get().prompts;
    const selectedPrompt = prompts.find((prompt) => prompt.id === id);
    const index = prompts.findIndex((prompt) => prompt.id === id);
    const modelStoreState = modelStore.getState();
    const selectedModel =
      selectedPrompt && selectedPrompt.model
        ? modelStoreState.models.find(
            (model) => model.id === selectedPrompt.model,
          )
        : modelStoreState.models.find((model) => model.default === true);
    if (selectedModel) {
      modelStore.setState({ selectedModel: selectedModel.id });
    }
    modelStore.setState({ modelObject: selectedModel });
    //call checkVariables from modelStore
    modelStore.getState().checkVariables();
    const promptInfo = selectedPrompt ? selectedPrompt : defaultPrompt;
    set({ promptObject: promptInfo });
    if (!selectedPrompt) {
      modelStore.setState({ modelObject: selectedModel });
    }
  },

  addToLocalPrompts: (prompt: Prompt) => {
    set((state) => {
      const prompts = [...state.prompts, prompt];
      return { prompts };
    });
  },
}));

export { promptStore };
