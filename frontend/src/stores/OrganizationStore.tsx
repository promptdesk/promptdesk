import { create } from "zustand";
import { Organization } from "@/interfaces/organization";
import { fetchFromPromptdesk } from "@/services/PromptdeskService";

interface OrganizationStore {
  organization: Organization | undefined;
  isSSO: boolean;
  fetchOrganization: () => Promise<void>;
  fetchIsSSO: () => Promise<void>;
  saveSSO: (data:any) => Promise<void>;
}

const organizationStore = create<OrganizationStore>((set) => ({
  organization: undefined,
  isSSO: false,
  fetchOrganization: async () => {
    const organization: Organization = await fetchFromPromptdesk("/organization");
    set({ organization });
  },
  fetchIsSSO: async () => {
    const { isSSO }: { isSSO: boolean } = await fetchFromPromptdesk("/organization/issso");
    set({ isSSO });
  },
  saveSSO: async (data:any) => {
    await fetchFromPromptdesk("/organization/sso", "PUT", data);
  },
  
}));

export { organizationStore };