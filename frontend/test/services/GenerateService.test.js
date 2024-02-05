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
        modelStore.getState().setModelById("65c033962dbbaf11d088e6b7");
        promptStore.getState().activateLocalPrompt("65558a1a0393ceadb2c9162c")
        tabStore.setState({ 
            tabs: [{
                name: 'Test Tab',
                prompt_id: '65558a1a0393ceadb2c9162c',
                current: true,
                data: {},
                loading: true
            }],
            activeTabIndex: undefined,
            activeTabId: undefined
        });
        tabStore.getState().setActiveTabById("65558a1a0393ceadb2c9162c");
    });

    it('should handle generating results for a prompt correctly', async () => {
        // Setup necessary state in stores
        const promptId = '65558a1a0393ceadb2c9162c';

        let data;
        await act(async () => {
            data = await generateResultForPrompt(promptId);
        });

        expect(typeof data.message.content).toBe('string');
        expect(data.error).toBe(false);
    });

});
