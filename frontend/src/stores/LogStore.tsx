/* Refactored on September 4th 2023 */
import { create } from 'zustand'
import { Log } from '@/interfaces/log';

interface LogStore {
  logs: Log[];
  fetchLogs: (page: number) => Promise<Log[]>;
}

const logStore = create<LogStore>((set) => ({
  logs: [],
  fetchLogs: async (page) => {
    const logs = await fetch(`${process.env.PROMPT_SERVER_URL}/api/logs?page=` + page).then((res) => res.json());
    set({ logs });
    return logs;
  }
}));

export { logStore }