import { create } from "zustand";
import { Variable } from "@/interfaces/variable";
import { fetchFromPromptdesk } from "@/services/PromptdeskService";

interface VariableStore {
  variables: Variable[];
  fetchVariables: () => Promise<Variable[]>;
  updateVariables: (variables: Variable[]) => Promise<void>;
}

const variableStore = create<VariableStore>((set) => ({
  variables: [],

  fetchVariables: async () => {
    const variables: Variable[] = await fetchFromPromptdesk("/variables");
    set({ variables });
    return variables;
  },

  updateVariables: async (variables: Variable[]) => {
    await fetchFromPromptdesk("/variables", "PUT", variables);
    set({ variables });
  },
}));

export { variableStore };
