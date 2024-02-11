import { create } from "zustand";
import { Sample } from "@/interfaces/sample";
import { fetchFromPromptdesk } from "@/services/PromptdeskService";

interface SampleStore {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  samples: Sample[];
  fetchSamples: (
    page: number,
    prompt_id?: string,
    model_id?: string,
    status?: number,
  ) => Promise<any>;
  fetchSampleDeatils: () => Promise<any>;
  fetchSample: (id: string) => Promise<any>;
  patchSample: (id: string, changes: any) => Promise<any>;
  deleteSample: (id: string) => Promise<any>;
}

const sampleStore = create<SampleStore>((set) => ({
  page: 1,
  per_page: 10,
  total: 0,
  total_pages: 0,
  samples: [],
  fetchSamples: async (page, prompt_id, model_id, status) => {
    let url = "/samples?page=" + page + "&limit=10";

    if (prompt_id !== undefined) {
      url += "&prompt_id=" + prompt_id;
    }

    if (model_id !== undefined) {
      url += "&model_id=" + model_id;
    }

    if (status !== undefined) {
      url += "&status=" + status;
    }

    const result = await fetchFromPromptdesk(url);
    const samples = result.data;
    const { page: page2, per_page, total, total_pages } = result;
    set({ samples, page: page2, per_page, total, total_pages });
    return samples;
  },
  fetchSampleDeatils: async () => {
    const stats = await fetchFromPromptdesk("/samples/details");
    return stats;
  },
  fetchSample: async (id: string) => {
    const sample = await fetchFromPromptdesk("/samples/" + id);
    return sample;
  },
  patchSample: async (id: string, changes: any) => {
    await fetchFromPromptdesk("/samples/" + id, "PATCH", changes);
  },
  deleteSample: async (id: string) => {
    // Make an API call to delete the sample
    await fetchFromPromptdesk("/samples/" + id, "DELETE");

    // Also delete the sample locally
    const samples = sampleStore.getState().samples;

    const newSamples = samples.filter((sample) => sample.id !== id);
    set({
      samples: newSamples,
      total: sampleStore.getState().total - 1,
    });
  },
}));

export { sampleStore };
