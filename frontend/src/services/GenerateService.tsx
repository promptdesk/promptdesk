import { promptWorkspaceTabs } from '@/stores/TabStore';
import { modelStore } from '@/stores/ModelStore';
import { promptStore } from '@/stores/PromptStore';
import { variableStore } from '@/stores/VariableStore';
import { fetchFromPromptdesk } from '@/services/PromptdeskService';
import { Tab } from '@/interfaces/tab';

const generateResultForPrompt = async (promptId: string) => {
    const currentTabData = promptWorkspaceTabs.getState().getDataById(promptId);

    if (currentTabData.loading) {
        return;
    }

    const model = modelStore.getState().modelObject;
    const prompt = promptStore.getState().promptObject;
    const prompts = promptStore.getState().prompts;
    const variables = variableStore.getState().variables;
    const previousId = prompt.id;

    let api_call = JSON.stringify(model.api_call);
    console.log(variables);
    const regex = /{{(.*?)}}/g;
    const matches = api_call.match(regex);
    const variableList = matches ? matches.map(m => m.slice(2, -2)) : [];
    console.log(variableList);

    var error = false;
    var missing_variable = undefined;
    variableList.forEach(variableName => {
        const variable = variables.find(v => v.name === variableName);
        // Check if the variable exists and has a non-empty value
        if (variable && variable.value && variable.value !== '') {
            //console.log(`${variableName} exists and is not empty.`);
        } else {
            error = true;
            missing_variable = variableName;
        }
    });

    if (error) {
        return;
    }

    promptStore.getState().updatePromptObjectInPrompts(prompt);

    try {

        //updateWorkspaceTabs(promptId, { loading: true });
        promptWorkspaceTabs.getState().updateDataById(promptId, { loading: true })
        const data = await fetchFromPromptdesk('/api/generate/', 'POST', prompt);
        promptWorkspaceTabs.getState().updateDataById(promptId, { loading: false })
        const currentPrompt = promptStore.getState().promptObject;
    
        if (model.type === 'chat' && data.message) {
            if (prompt.id === currentPrompt.id) {
                promptStore.setState((state) => {
                    const messages = [...state.promptObject.prompt_data.messages, data.message];
                    const context = state.promptObject.prompt_data.context;
                    return { promptObject: { ...state.promptObject, prompt_data: { messages, context } } };
                });
            } else {
                promptStore.setState((state) => {
                    const prompts = state.prompts.map(p => {
                        if (p.id === previousId) {
                            const messages = [...p.prompt_data.messages, data.message];
                            const context = p.prompt_data.context;
                            return { ...p, prompt_data: { messages, context } };
                        }
                        return p;
                    });
                    return { prompts };
                });
            }
        }

        if (model.type === 'completion') {
            promptWorkspaceTabs.getState().updateDataById(promptId, { loading: false, generatedText: data.message, error: undefined })
        }

        return data;
    } catch (error:any) {

        //console.error('API Call Error:', "error.message", error.message);
        console.log(error.response.data.log_id)
        promptWorkspaceTabs.getState().updateDataById(promptId, { loading: false, error: error.message, logId: error.response.data.log_id })
        //throw error;

    }
};

export { generateResultForPrompt };