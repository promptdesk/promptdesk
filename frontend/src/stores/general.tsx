import { create } from 'zustand'
import { promptStore } from './PromptStore';

export interface SnowPromptHistory {
  show : boolean;
  toogle: () => void;
}

export interface SnowShouldShowSaveModal {
  show_modal: boolean;
  toggle_modal: () => void; // Corrected property name
}

export interface shouldShowSaveVariableModal {
  show_variable_modal: boolean;
  toggle_variable_modal: (variable_name?: string) => void; // Corrected property name
}

export interface shouldShowEnvVariableModal {
  show_env_variable_modal: boolean;
  toggle_env_variable_modal: () => void; // Corrected property name
}

interface Tab {
  name: string;
  prompt_id: string;
  current: boolean;
}

export interface PromptWorkspaceTabs {
  tabs: Tab[];
  addTab: (name: string, id: string, current: boolean) => void;
  removeTab: (id: string) => void;
  setActiveTab: (name: string) => void;
  setActiveTabById: (id: string) => void;
  updateNameById: (id: string, newId: string, name: string) => void;
  saveTabsToLocalStorage: () => void;
  retrieveTabsFromLocalStorage: () => void;
  deactivateAllTabs: () => void;
}

const promptWorkspaceTabs = create<PromptWorkspaceTabs>((set) => ({
  tabs: [],
  saveTabsToLocalStorage() {
    localStorage.setItem("tabs", JSON.stringify(promptWorkspaceTabs.getState().tabs));
  },
  retrieveTabsFromLocalStorage() {
    const tabs = localStorage.getItem("tabs");
    if (tabs) set({ tabs: JSON.parse(tabs) });
  },
  deactivateAllTabs() {
    set(({ tabs }) => ({ tabs: tabs.map(tab => ({ ...tab, current: false })) }));
  },
  addTab(name, prompt_id, current) {
    promptWorkspaceTabs.getState().deactivateAllTabs();
    set(({ tabs }) => ({ tabs: [...tabs, { name, prompt_id, current }] }));
    promptWorkspaceTabs.getState().saveTabsToLocalStorage();
  },
  removeTab(id) {
    set(({ tabs }) => ({ tabs: tabs.filter(tab => tab.prompt_id !== id) }));
    promptWorkspaceTabs.getState().saveTabsToLocalStorage();
  },
  setActiveTabById(id) {
    if (!id) return;
    const tab = promptWorkspaceTabs.getState().tabs.find(tab => tab.prompt_id === id);
    if (!tab) {
      const name = promptStore.getState().prompts.find(p => p.id === id)?.name;
      if (name) promptWorkspaceTabs.getState().addTab(name, id, true);
    } else {
      promptWorkspaceTabs.getState().deactivateAllTabs();
      set(({ tabs }) => ({ tabs: tabs.map(tab => ({ ...tab, current: tab.prompt_id === id })) }));
      promptWorkspaceTabs.getState().saveTabsToLocalStorage();
    }
  },
  setActiveTab(name) {
    promptWorkspaceTabs.getState().deactivateAllTabs();
    set(({ tabs }) => ({ tabs: tabs.map(tab => ({ ...tab, current: tab.name === name })) }));
    promptWorkspaceTabs.getState().saveTabsToLocalStorage();
  },
  updateNameById(id, newId, name) {
    set(({ tabs }) => ({
      tabs: tabs.map(tab => (tab.prompt_id === id ? { ...tab, name, prompt_id: newId } : tab)),
    }));
    promptWorkspaceTabs.getState().saveTabsToLocalStorage();
  },
}));

const showPromptHistory = create<SnowPromptHistory>((set) => ({
  show: false,
  toogle: () => set((state: { show: boolean; }) => ({ show: !state.show })),
}))

const shouldShowSaveModal = create<SnowShouldShowSaveModal>((set) => ({
  show_modal: false,
  toggle_modal: () => {
    shouldShowSaveModal.setState((state: { show_modal: boolean; }) => ({
      show_modal: !state.show_modal
    }))
  },
}));

const shouldShowSaveVariableModal = create<shouldShowSaveVariableModal>((set) => ({
  show_variable_modal: false,
  toggle_variable_modal: (variableName: string | undefined) => {
    shouldShowSaveVariableModal.setState((state: { show_variable_modal: boolean; }) => ({
      show_variable_modal: !state.show_variable_modal
    }))
    if(variableName !== undefined) {
      promptStore.getState().setSelectedVariable(variableName)
    }
  },
}));

const shouldShowEnvVariableModal = create<shouldShowEnvVariableModal>((set) => ({
  show_env_variable_modal: false,
  toggle_env_variable_modal: () => {
    shouldShowEnvVariableModal.setState((state: { show_env_variable_modal: boolean; }) => ({
      show_env_variable_modal: !state.show_env_variable_modal
    }))
  },
}));

//export both stores
export { shouldShowSaveModal, showPromptHistory, promptWorkspaceTabs, shouldShowSaveVariableModal, shouldShowEnvVariableModal }