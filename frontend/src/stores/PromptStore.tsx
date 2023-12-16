/* Refactored on September 4th 2023 */
import { create } from 'zustand'
import { modelStore } from '@/stores/ModelStore';
import { promptWorkspaceTabs } from '@/stores/TabStore';
import Handlebars from 'handlebars';
import { fetchFromPromptdesk } from '@/services/PromptdeskService'

import { Prompt } from "@/interfaces/prompt"

interface PromptStore {
    promptObject: Prompt;
    prompts: Array<Prompt>;
    defaultPrompt: Prompt;
    selectedVariable: string;
    parsingError: string | null;
    fetchAllPrompts: () => Promise<Prompt[]>;
    setPromptInformation: (key: any, value: any) => void;
    createNewPrompt: () => Promise<string>;
    updateExistingPrompt: () => void;
    duplicateExistingPrompt: (name:string, description:string) => Promise<Prompt> | undefined;
    deletePrompt: () => void;
    addMessage: (string: string[]) => void;
    setPrompt: (id: string) => void;
    editMessageAtIndex: (index: number, message: string) => void;
    toggleRoleAtIndex: (index: number, roles: string[]) => void;
    removeAtIndex: (index: number) => void;
    addNewPrompt: (prompt?:any) => string | undefined;
    updatePromptObjectInPrompts: (promptObject: Prompt) => void;
    setPromptVariables: (variables: any) => void;
    setSelectedVariable: (variable: string) => void;
    processVariables: (inputValue: string) => void;
    isValidName: (name: string) => boolean;
    addToLocalPrompts: (prompt: Prompt) => void;
}

const defaultPrompt: Prompt = {
    id: "",
    name: "",
    description: "",
    model: "",
    project: undefined,
    prompt_parameters: {},
    prompt_data: {
        prompt: "",
        context: "",
        messages: []
    },
    prompt_variables: {},
    new: true,
    model_type: undefined,
    organization_id: ""
}

const promptStore = create<PromptStore>((set, get) => ({
    defaultPrompt,
    promptObject: JSON.parse(JSON.stringify(defaultPrompt)),
    prompts: [],
    isPromptLoading: false,
    generatedText: undefined,
    selectedVariable: "",
    parsingError: null,

    setSelectedVariable: (variable: string) => {
        set({ selectedVariable: variable });
    },

    processVariables: (inputValue: string) => {

        function extractVariablesFromAST(ast:any, parentContext = null, variableTypes = {} as any) {
            switch (ast.type) {
                case "Program":
                    ast.body.forEach((node: any) => {
                        extractVariablesFromAST(node, parentContext, variableTypes);
                    });
                    break;
                case "MustacheStatement":
                    if (ast.path.type === 'PathExpression') {
                        let varName = ast.path.original;
                        if (varName.includes('.')) {
                            let parts = varName.split('.');
                            let parentVar = parts.slice(0, -1).join('.');
                            variableTypes[parentVar] = {type: 'object', value: {}};
                        } else {
                            varName = parentContext ? `${parentContext}.${varName}` : varName;
                            variableTypes[varName] = {type: 'text', value: ""}; // Default to text
                        }
                    }
                    break;
                case "BlockStatement":
                    const blockVarName = ast.params[0].original;
                    const fullBlockVarName = parentContext ? `${parentContext}.${blockVarName}` : blockVarName;
        
                    if (ast.path.original === 'with' || ast.path.original === 'each') {
                        // Treat the variable as an object for 'with' and 'each' blocks
                        variableTypes[fullBlockVarName] = {type:'object', value:{}};
                        // Change context for inner variables
                        const newContext = ast.path.original === 'with' ? fullBlockVarName : blockVarName;
                        extractVariablesFromAST(ast.program, newContext, variableTypes);
                    } else {
                        // For other block statements, keep as text
                        variableTypes[fullBlockVarName] = {type:'text', value:""};
                        extractVariablesFromAST(ast.program, parentContext, variableTypes);
                    }
                    break;
            }

            //remove all dict items that contain a period
            Object.keys(variableTypes).forEach((key) => {
                if (key.includes(".")) {
                    delete variableTypes[key];
                }
            });
        
            return variableTypes;
        }

        if (!inputValue) {
            inputValue = ""
        }

        try {
            set((state) => {

                const ast = Handlebars.parse(inputValue);
                let variableTypes = extractVariablesFromAST(ast);
                let variables = Object.keys(variableTypes);

                const promptObject = { ...state.promptObject };

                const newPromptVariableData = variables.reduce((acc:any, variable:any) => {
                    acc[variable] = promptObject.prompt_variables[variable] || (variableTypes as any)[variable];
                    return acc;
                }, {});

                promptObject.prompt_variables = newPromptVariableData;
                return { parsingError: "", promptObject };
            })
        } catch (error: any) {
            // Record the error so it can be displayed to the user.
            set((state) => {
                return {parsingError: error};
            });
        }
    },

    setPromptInformation: (key: any, value: any) => {
        set((state) => {
            const promptObject = { ...state.promptObject };
            //create promptObject['prompt_parameters'] if it doesn't exist
            if (!promptObject.prompt_parameters) {
                promptObject.prompt_parameters = {};
            }
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

    addNewPrompt: (prompt:any = undefined) => {

        const defaultModel = modelStore.getState().models.find((model) => model.default);

        if (!defaultModel) {
            return;
        }

        let newPrompt: Prompt = {
            ...JSON.parse(JSON.stringify(defaultPrompt)),
            name: new Date().toLocaleString(),
            id: Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10),
            model: defaultModel.id
        };

        //check if prompt is passed as argument
        if (prompt) {
            newPrompt = prompt;
            newPrompt.name = new Date().toLocaleString();
            newPrompt.id = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
            if(defaultModel.type === prompt.model_type) {
                newPrompt.model = defaultModel.id
            } else {
                const model = modelStore.getState().models.find((model) => model.type === prompt.model_type);
                if(model) {
                    newPrompt.model = model.id;
                }
            }
        }

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
        //call checkVariables from modelStore
        modelStore.getState().checkVariables();
        const promptInfo = selectedPrompt ? selectedPrompt : defaultPrompt;
        set({ promptObject: promptInfo });
        if (!selectedPrompt) {
            modelStore.setState({ modelObject: selectedModeId });
        }
    },

    addToLocalPrompts: (prompt: Prompt) => {
        set((state) => {
            const prompts = [...state.prompts, prompt];
            return { prompts };
        });
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
            promptObject.prompt_data.messages[index].content = newValue;
            promptStore.setState({ promptObject });

            //set promptObject in prompts
            promptStore.setState((state: { prompts: Prompt[]; }) => ({
                prompts: state.prompts.map((prompt) => {
                    if (prompt.id === promptObject.id) {
                        return promptObject;
                    } else {
                        return prompt;
                    }
                })
            }));

            return { promptObject };
        });
    },

    addMessage: (roles: string[]) => {
        set((state) => {
            const promptObject = { ...state.promptObject };
            const messages = promptObject.prompt_data.messages || [];
            const lastRole = messages.length > 0 ? messages[messages.length - 1].role : roles[1];
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

    fetchAllPrompts: async () => {
        const prompts = await fetchFromPromptdesk('/api/prompts')
        set({ prompts });
        return prompts;
    },

    isValidName: (name: string) => {
        //alert if name is no A-Z, a-z, 0-9, _ or -
        const regex = /^[a-zA-Z0-9_-]*$/;
        return regex.test(name);
    },

    createNewPrompt: async () => {
        const prompt = get().promptObject;
        if(!get().isValidName(prompt.name)) {
            alert("The name of the prompt can only contain A-Z, a-z, 0-9, _ or -")
            return;
        }
        if(prompt.project && !get().isValidName(prompt.project)) {
            alert("The name of the prompt can only contain A-Z, a-z, 0-9, _ or -")
            return;
        }
        prompt.new = undefined;
        const data = await fetchFromPromptdesk('/api/prompt', 'POST', prompt);
        await get().fetchAllPrompts();
        promptWorkspaceTabs.getState().updateNameById(prompt.id, data.id, prompt.name);
        return data.id;
    },

    updateExistingPrompt: async () => {
        const existingPrompt = get().promptObject;
        if(!get().isValidName(existingPrompt.name)) {
            alert("The name of the prompt can only contain A-Z, a-z, 0-9, _ or -")
            return;
        }
        if(existingPrompt.project && !get().isValidName(existingPrompt.project)) {
            alert("The name of the prompt can only contain A-Z, a-z, 0-9, _ or -")
            return;
        }
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
        await fetchFromPromptdesk(`/api/prompt/${existingPrompt.id}`, 'PUT', existingPrompt);
        await get().fetchAllPrompts();
        promptWorkspaceTabs.getState().updateNameById(existingPrompt.id, existingPrompt.id, existingPrompt.name);
    },

    duplicateExistingPrompt: async (name: string, description: string) => {
        const { fetchAllPrompts, promptObject, isValidName } = await get();
        const dbPrompts = await fetchAllPrompts();
    
        // Create a shallow copy of the prompt object and override the name and description
        const promptToDuplicate = { ...promptObject, description, name };
    
        const nameIsValid = /^[A-Za-z0-9_-]+$/.test(promptToDuplicate.name);
        const nameExists = dbPrompts.some((prompt) => prompt.name === name);
    
        if (!nameIsValid) {
            alert("The name of the prompt can only contain A-Z, a-z, 0-9, _ or -");
            return undefined as any;
        }
    
        if (nameExists) {
            promptToDuplicate.name += "_copy";
        }
    
        const data = await fetchFromPromptdesk('/api/prompt', 'POST', promptToDuplicate);
        promptToDuplicate.id = data.id;
        return promptToDuplicate;
    },
    

    deletePrompt: async () => {
        const { promptObject } = get();
        await fetchFromPromptdesk(`/api/prompt/${promptObject.id}`, 'DELETE', promptObject);
        
        set((state) => ({
            prompts: state.prompts.filter((prompt) => prompt.id !== promptObject.id),
            promptObject: defaultPrompt
        }));
        
        const { models } = modelStore.getState();
        const defaultModel = models.find((model) => model.default);
        modelStore.setState({
            selectedModeId: defaultModel?.id,
            modelObject: defaultModel
        });
    }
    
}));

export { promptStore };