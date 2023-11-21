import { create } from 'zustand'
import { Log } from '@/interfaces/log';
import { fetchFromPromptdesk } from '@/services/PromptdeskService'

interface LogStore {
  logs: Log[];
  fetchLogs: (page: number, prompt_id?: string, model_id?:string, status?: number) => Promise<any>;
  fetchLogDeatils: () => Promise<any>;
}

const logStore = create<LogStore>((set) => ({
  logs: [],
  fetchLogs: async (page, prompt_id, model_id, status) => {
      let url = '/api/logs?page=' + page + '&limit=10';

      if(prompt_id !== undefined) {
        url += '&prompt_id=' + prompt_id;
      }

      if(model_id !== undefined) {
        url += '&model_id=' + model_id;
      }

      if(status !== undefined) {
        url += '&status=' + status;
      }

      const logs = await fetchFromPromptdesk(url);
      set({ logs });
      return logs;
  },
  fetchLogDeatils: async () => {
      const stats = await fetchFromPromptdesk('/api/logs/details');
      return stats;
  }
}));

export { logStore }