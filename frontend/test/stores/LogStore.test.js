import { logStore } from '@/stores/LogStore'; // Adjust the path as necessary
import { act } from 'react-dom/test-utils';

describe('logStore tests', () => {

    describe('fetchLogs', () => {

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
            let log;
            await act(async () => {
                log = await logStore.getState().fetchLog('65b71b07c5699fbe2e2366d4');
            });
            expect(log).toBeDefined();
            expect(log.id).toBeDefined();
        });

    });

});