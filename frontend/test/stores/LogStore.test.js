import { logStore } from '@/stores/LogStore'; // Adjust the path as necessary
import { act } from 'react-dom/test-utils';

describe('logStore tests', () => {

    // Function to generate results for a given prompt name
    async function generateResultsForNamedPrompt(promptName) {
        const prompts = await fetchAllPrompts();
        const targetPrompt = prompts.find(prompt => prompt.name === promptName);
        return targetPrompt
    }

    it('should fetch logs with default parameters', async () => {
        let logs;
        await act(async () => {
            logs = await logStore.getState().fetchLogs(1);
        });
        expect(logs).toBeDefined();
        expect(logs.page).toBeDefined();
        expect(logs.data).toBeDefined();
        expect(logs.stats).toBeDefined();
    });

    it('should fetch a single log', async () => {
        let logs;
        await act(async () => {
            logs = await logStore.getState().fetchLogs(1);
        });

        let log;
        await act(async () => {
            log = await logStore.getState().fetchLog(logs['data'][0].id);
        });
        expect(log).toBeDefined();
        expect(log.id).toBeDefined();
    });

});