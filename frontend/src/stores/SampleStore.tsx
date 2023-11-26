import { create } from 'zustand'
import { Sample } from '@/interfaces/sample';
import { fetchFromPromptdesk } from '@/services/PromptdeskService'

interface SampleStore {
    samples: Sample[];
    fetchSamples: (page: number, prompt_id?: string, model_id?:string, status?: number) => Promise<any>;
    fetchSampleDeatils: () => Promise<any>;
    fetchSample: (id:string) => Promise<any>;
    patchSample: (id:string, changes:any) => Promise<any>;
}

const sampleStore = create<SampleStore>((set) => ({
    samples: [],
    fetchSamples: async (page, prompt_id, model_id, status) => {
        let url = '/api/samples?page=' + page + '&limit=10';

        if(prompt_id !== undefined) {
            url += '&prompt_id=' + prompt_id;
        }

        if(model_id !== undefined) {
            url += '&model_id=' + model_id;
        }

        if(status !== undefined) {
            url += '&status=' + status;
        }

        const samples = await fetchFromPromptdesk(url);
        set({ samples });
        return samples;
    },
    fetchSampleDeatils: async () => {
        const stats = await fetchFromPromptdesk('/api/samples/details');
        return stats;
    },
    fetchSample: async (id:string) => {
        const sample = await fetchFromPromptdesk('/api/samples/' + id);
        return sample;
    },
    patchSample: async (id: string, changes: any) => {
        await fetchFromPromptdesk('/api/samples/' + id, "PATCH", changes);
    }
}));

export { sampleStore }
