import { create } from 'zustand';
import { Organization } from '@/interfaces/organization';
import { fetchFromPromptdesk } from '@/services/PromptdeskService';

interface VariableStore {
  organization: Organization|undefined;
  fetchOrganization: () => Promise<Organization>;}

const organizationStore = create<VariableStore>((set) => ({

  organization: undefined,
  
  fetchOrganization: async () => {
    const organization: Organization = await fetchFromPromptdesk('/organization')
    set({ organization });
    return organization;
  }

}));

export { organizationStore };