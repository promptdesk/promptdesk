import { create } from 'zustand'
import { Log } from '@/interfaces/log';
import { fetchFromPromptdesk } from '@/services/PromptdeskService'

interface LogStore {
  logs: Log[];
  fetchLogs: (page: number) => Promise<Log[]>;
}

const logStore = create<LogStore>((set) => ({
  logs: [],
  fetchLogs: async (page) => {
      const logs = await fetchFromPromptdesk('/api/logs?page=' + page);
      set({ logs });
      return logs;
  }
}));

export { logStore }