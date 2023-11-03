import { promptWorkspaceTabs } from '@/stores/TabStore';
import { modelStore } from '@/stores/ModelStore';
import { promptStore } from '@/stores/PromptStore';
import { fetchFromPromptdesk } from '@/services/PromptdeskService';
import { Tab } from '@/interfaces/tab';

const makeMagic = async (promptId: string) => {
    const currentTabData = promptWorkspaceTabs.getState().getDataById(promptId);

    if (currentTabData.loading) {
        return;
    }

    const model = modelStore.getState().modelObject;
    const prompt = promptStore.getState().promptObject;
    const prompts = promptStore.getState().prompts;
    const previousId = prompt.id;

    promptStore.getState().updatePromptObjectInPrompts(prompt);

    try {

        //updateWorkspaceTabs(promptId, { loading: true });
        promptWorkspaceTabs.getState().updateDataById(promptId, { loading: true })
        const data = await fetchFromPromptdesk('/api/magic/', 'POST', prompt);
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
            promptWorkspaceTabs.getState().updateDataById(promptId, { loading: false, generatedText: data.message })
        }

    } catch (error) {

        console.error('API Call Error:', error);
        promptWorkspaceTabs.getState().updateDataById(promptId, { loading: false })
        throw error;

    }
};

export { makeMagic };