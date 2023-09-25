/* Refactored on September 4th 2023 */
import { create } from 'zustand'
import { modelStore } from '@/stores/ModelStore';
import { promptWorkspaceTabs } from '@/stores/general';
import { Model } from '@/interfaces/model';
import router from 'next/router';

interface PromptStore {
    promptObject: Prompt;
    prompts: Array<Prompt>;
    isPromptLoading: boolean;
    generatedText: string | undefined;
    defaultPrompt: Prompt;
    selectedVariable: string;
    fetchAllPrompts: () => Promise<Prompt[]>;
    onlyFetchPrompts: () => Promise<Prompt[]>;
    setPromptInformation: (key: any, value: any) => void;
    createNewPrompt: () => void;
    updateExistingPrompt: () => void;
    duplicateExistingPrompt: (name:string, description:string) => void;
    deletePrompt: () => void;
    addMessage: (string: string[]) => void;
    callMagic: () => void;
    setPrompt: (id: string) => void;
    editMessageAtIndex: (index: number, message: string) => void;
    toggleRoleAtIndex: (index: number, roles: string[]) => void;
    removeAtIndex: (index: number) => void;
    addNewPrompt: () => string | undefined;
    updatePromptObjectInPrompts: (promptObject: Prompt) => void;
    setPromptVariables: (variables: any) => void;
    setSelectedVariable: (variable: string) => void;
}

interface Prompt {
    id: string;
    name: string;
    description: string;
    model: string;
    prompt_variables: any;
    prompt_parameters: any;
    prompt_data: any;
    new: boolean | undefined;
    model_type: string | undefined;
}

const defaultPrompt: Prompt = {
    id: "",
    name: "",
    description: "",
    model: "",
    prompt_parameters: {},
    prompt_data: {
        context: "",
        messages: [{
            role: "user",
            content: ""
        }]
    },
    prompt_variables: {},
    new: true,
    model_type: undefined
}

const promptStore = create<PromptStore>((set, get) => ({
    defaultPrompt,
    promptObject: defaultPrompt,
    prompts: [],
    isPromptLoading: false,
    generatedText: undefined,
    selectedVariable: "",

    fetchAllPrompts: async () => {
        try {
            const response = await fetch('http://localhost:4000/api/prompts');
            if (!response.ok) {
                throw new Error('Failed to fetch prompts');
            }
            const prompts = await response.json();
            set({ prompts });
            return prompts;
        } catch (error) {
            console.error('Error fetching prompts:', error);
            throw error;
        }
    },

    setSelectedVariable: (variable: string) => {
        set({ selectedVariable: variable });
    },

    setPromptInformation: (key: any, value: any) => {
        set((state) => {
            const promptObject = { ...state.promptObject };
            if (key.startsWith("prompt_parameters.")) {
                const parameterKey = key.split(".")[1];
                promptObject.prompt_parameters[parameterKey] = value;
            } else if (key.startsWith("prompt_data.")) {
                const promptDataKey = key.split(".")[1];
                promptObject.prompt_data[promptDataKey] = value;
            } else {
                (promptObject as any)[key] = value;
            }
            return { promptObject };
        });
        get().updatePromptObjectInPrompts(get().promptObject);
    },

    updatePromptObjectInPrompts: (promptObject: Prompt) => {
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

    setPromptVariables: (variables: any) => {
        set((state) => {
            const promptObject = { ...state.promptObject };
            promptObject.prompt_variables = variables;
            return { promptObject };
        });
    },

    addNewPrompt: () => {
        const defaultModel = modelStore.getState().models.find((model) => model.default);
        if (!defaultModel) {
            return;
        }
        const newPrompt: Prompt = {
            ...defaultPrompt,
            name: new Date().toLocaleString(),
            id: Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10),
            model: defaultModel.id
        };
        set((state) => {
            const prompts = [...state.prompts, newPrompt];
            return { prompts };
        });
        return newPrompt.id;
    },

    setPrompt: (id: string) => {
        const prompts = get().prompts;
        const selectedPrompt = prompts.find((prompt) => prompt.id === id);
        const index = prompts.findIndex((prompt) => prompt.id === id);
        const modelStoreState = modelStore.getState();
        const selectedModeId = selectedPrompt && selectedPrompt.model
            ? modelStoreState.models.find((model) => model.id === selectedPrompt.model)
            : modelStoreState.models.find((model) => model.default === true);
        if (selectedModeId) {
            modelStore.setState({ selectedModeId: selectedModeId.id });
        }
        modelStore.setState({ modelObject: selectedModeId });
        const promptInfo = selectedPrompt ? selectedPrompt : defaultPrompt;
        set({ promptObject: promptInfo });
        if (!selectedPrompt) {
            modelStore.setState({ modelObject: selectedModeId });
        }
    },

    removeAtIndex: (index: number) => {
        set((state) => {
            const promptObject = { ...state.promptObject };
            promptObject.prompt_data.messages.splice(index, 1);
            return { promptObject };
        });
    },

    editMessageAtIndex: (index: number, newValue: string) => {
        set((state) => {
            const promptObject = { ...state.promptObject };
            console.log("promptObject", promptObject.id)
            promptObject.prompt_data.messages[index].content = newValue;
            return { promptObject };
        });
    },

    addMessage: (roles: string[]) => {
        set((state) => {
            const promptObject = { ...state.promptObject };
            const messages = promptObject.prompt_data.messages || [];
            const lastRole = messages.length > 0 ? messages[messages.length - 1].role : roles[0];
            const roleIndex = (roles.indexOf(lastRole) + 1) % roles.length;
            const newMessage = { role: roles[roleIndex], content: "" };
            messages.push(newMessage);
            promptObject.prompt_data.messages = messages;
            return { promptObject };
        });
    },

    toggleRoleAtIndex: (index: number, roles: string[]) => {
        set((state) => {
            const promptObject = { ...state.promptObject };
            const messages = promptObject.prompt_data.messages || [];
            const role = messages[index].role;
            const newRole = roles[(roles.indexOf(role) + 1) % roles.length];
            messages[index].role = newRole;
            promptObject.prompt_data.messages = messages;
            return { promptObject };
        });
    },

    onlyFetchPrompts: async () => {
      try {
          const response = await fetch('http://localhost:4000/api/prompts');
          if (!response.ok) {
              throw new Error('Failed to fetch prompts');
          }
          const prompts = await response.json();
          return prompts;
      } catch (error) {
          console.error('Error fetching prompts:', error);
          throw error;
      }
  },

    callMagic: async () => {
        if (get().isPromptLoading) {
            set({ isPromptLoading: false });
            set({ generatedText: undefined });
            return;
        }
        set({ generatedText: "Loading..." });
        set({ isPromptLoading: true });
        const model = modelStore.getState().modelObject;
        const prompt = get().promptObject;
        const response = await fetch('http://localhost:4000/api/magic/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(prompt)
        });
        const data = await response.json();
        if (!get().isPromptLoading) {
            return;
        }
        set({ isPromptLoading: false });
        if (model.type === 'chat' && data.data) {
            set((state) => {
                const promptObject = { ...state.promptObject };
                const messages = promptObject.prompt_data.messages || [];
                messages.push(data.data.message);
                promptObject.prompt_data.messages = messages;
                return { promptObject };
            });
        }
        if (model.type === 'completion') {
            set({ generatedText: data.data.trimmed_text });
        }
    },

    createNewPrompt: async () => {
        const prompt = get().promptObject;
        const response = await fetch('http://localhost:4000/api/prompt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(prompt)
        });
        const data = await response.json();
        await get().fetchAllPrompts();
        promptWorkspaceTabs.getState().updateNameById(prompt.id, data.id, prompt.name);
    },

    updateExistingPrompt: async () => {
        const existingPrompt = get().promptObject;
        if (modelStore.getState().modelObject.type === 'chat') {
            existingPrompt.prompt_data = {
                context: existingPrompt.prompt_data.context,
                messages: existingPrompt.prompt_data.messages
            };
        }
        if (modelStore.getState().modelObject.type === 'completion') {
            existingPrompt.prompt_data = {
                prompt: existingPrompt.prompt_data.prompt
            };
        }
        const response = await fetch('http://localhost:4000/api/prompt/' + existingPrompt.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(existingPrompt)
        });
        await response.json();
        await get().fetchAllPrompts();
        promptWorkspaceTabs.getState().updateNameById(existingPrompt.id, existingPrompt.id, existingPrompt.name);
    },

    duplicateExistingPrompt: async (name: string, description: string) => {
        const dbPrompts = await get().onlyFetchPrompts();
        const promptToDuplicate = { ...get().promptObject, description, name };
        const originPrompt = dbPrompts.find((prompt) => prompt.id === promptToDuplicate.id);
        const exists = dbPrompts.some((prompt) => prompt.name === name);
        if (exists) {
            promptToDuplicate.name = name + " (copy)";
        }
        const response = await fetch('http://localhost:4000/api/prompt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(promptToDuplicate)
        });
        const data = await response.json();
        const newPrompt = dbPrompts.find((prompt) => prompt.id === data.id);
        set((state:any) => {
            const prompts = [...state.prompts, newPrompt];
            return { prompts };
        });
        set({ promptObject: originPrompt });
        if(newPrompt) {
            
        }
        router.push(`/prompt/${data.id}`);
    },

    deletePrompt: async () => {
        const existingPrompt = get().promptObject;
        const response = await fetch('http://localhost:4000/api/prompt/' + existingPrompt.id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(existingPrompt)
        });
        await response.json();
        await get().fetchAllPrompts();
        set({ promptObject: defaultPrompt });
        const models: Model[] = modelStore.getState().models;
        const defaultModel = models.find((model) => model.default === true);
        if (defaultModel) {
            modelStore.setState({ selectedModeId: defaultModel.id });
        }
        modelStore.setState({ modelObject: defaultModel });
        promptWorkspaceTabs.getState().removeTab(existingPrompt.id);
    },
}));

export { promptStore };