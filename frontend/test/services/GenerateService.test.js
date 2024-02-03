import { act } from 'react-dom/test-utils';
import { generateResultForPrompt } from '@/services/GenerateService'; // Adjust the path as necessary
import { modelStore } from '@/stores/ModelStore'; // Adjust the path as necessary
import { promptStore, fetchAllPrompts } from '@/stores/prompts'; // Adjust the path as necessary
import { variableStore } from '@/stores/VariableStore'; // Adjust the path as necessary
import { tabStore } from '@/stores/TabStore'; // Adjust the path as necessary

describe('generateResultForPrompt integration tests', () => {
    beforeEach(async () => {
        await variableStore.getState().fetchVariables();
        await fetchAllPrompts();
        await modelStore.getState().fetchAllModels();
        modelStore.getState().setModelById("65558a1a0393ceadb2c9162e");
        promptStore.getState().activateLocalPrompt("656577645b9fbfdddf32b1ae")
        tabStore.setState({ 
            tabs: [{
                name: 'Test Tab',
                prompt_id: '656577645b9fbfdddf32b1ae',
                current: true,
                data: {},
                loading: true
            }],
            activeTabIndex: undefined,
            activeTabId: undefined
        });
        tabStore.getState().setActiveTabById("656577645b9fbfdddf32b1ae");
    });

    it('should handle generating results for a prompt correctly', async () => {
        // Setup necessary state in stores
        const promptId = '656577645b9fbfdddf32b1ae';

        let data;
        await act(async () => {
            data = await generateResultForPrompt(promptId);
        });


        expect(typeof data.message).toBe('string');
        expect(data.error).toBe(false);
    });

});
