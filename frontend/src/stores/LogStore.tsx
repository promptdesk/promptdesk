/* Refactored on September 4th 2023 */
import { create } from 'zustand'
import { Log } from '@/interfaces/log';

interface LogStore {
  logs: Log[];
  fetchLogs: (page: number) => Promise<Log[]>;
  fetchLogById: (id: string) => Promise<Log>;
}

const logStore = create<LogStore>((set) => ({
  logs: [],
  fetchLogs: async (page) => {
    const logs = await fetch('http://localhost:4000/api/logs?page=' + page).then((res) => res.json());
    set({ logs });
    return logs;
  },
  fetchLogById: async (id: string) => {
    const log = await fetch(`/api/logs/${id}`).then((res) => res.json());
    return log;
  },
}));

export { logStore }