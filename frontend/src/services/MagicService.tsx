import { promptWorkspaceTabs } from '@/stores/TabStore';
import { modelStore } from '@/stores/ModelStore';
import { promptStore } from '@/stores/PromptStore';
import { fetchFromPromptdesk } from '@/services/PromptdeskService';
import { Tab } from '@/interfaces/tab';

const updateWorkspaceTabs = (promptId: string, data: any) => {
    promptWorkspaceTabs.setState((state: { tabs: Tab[]; }) => ({
        tabs: state.tabs.map(tab => {
            if (tab.prompt_id === promptId) {
                return { ...tab, data: { ...tab.data, ...data } };
            }
            return tab;
        })
    }));
};

const makeMagic = async (promptId: string) => {
    const currentTabData = promptWorkspaceTabs.getState().getDataById(promptId);
    if (currentTabData.loading) {
        return;
    }

    updateWorkspaceTabs(promptId, { loading: true, generatedText: "Loading..." });

    const model = modelStore.getState().modelObject;
    const prompt = promptStore.getState().promptObject;
    const prompts = promptStore.getState().prompts;
    const previousId = prompt.id;

    promptStore.getState().updatePromptObjectInPrompts(prompt);
    const data = await fetchFromPromptdesk('/api/magic/', 'POST', prompt);
    const currentPrompt = promptStore.getState().promptObject;

    if (model.type === 'chat' && data.message) {
        if (prompt.id === currentPrompt.id) {
            promptStore.setState((state) => {
                const messages = [...state.promptObject.prompt_data.messages, data.message];
                return { promptObject: { ...state.promptObject, prompt_data: { messages } } };
            });
        } else {
            promptStore.setState((state) => {
                const prompts = state.prompts.map(p => {
                    if (p.id === previousId) {
                        const messages = [...p.prompt_data.messages, data.message];
                        return { ...p, prompt_data: { messages } };
                    }
                    return p;
                });
                return { prompts };
            });
        }
        updateWorkspaceTabs(promptId, { loading: false });
    }

    if (model.type === 'completion') {
        updateWorkspaceTabs(promptId, { loading: false, generatedText: data.message });
    }
};

export { makeMagic };