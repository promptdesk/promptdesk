/* Refactored on September 4th 2023 */
import { create } from 'zustand';
import { Variable } from '@/interfaces/variable';

interface VariableStore {
  variables: Variable[];
  fetchVariables: () => Promise<Variable[]>;
  updateVariables: (variables: Variable[]) => Promise<void>;
}

const variableStore = create<VariableStore>((set) => ({
  variables: [],
  fetchVariables: async () => {
    try {
      const response = await fetch('http://localhost:4000/api/variables');
      const variables: Variable[] = await response.json();
      set({ variables });
      return variables;
    } catch (error) {
      console.error('Error fetching variables:', error);
      throw error;
    }
  },
  updateVariables: async (variables: Variable[]) => {
    try {
      console.log("UPDATE!", variables)
      var x = fetch(`http://localhost:4000/api/variables`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(variables),
      })
      console.log(x)
      set({ variables });
    } catch (error) {
      console.error('Error updating variables:', error);
      throw error;
    }
  },
}));

export { variableStore };