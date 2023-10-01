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
  isActiveTab: (id: string) => boolean | undefined;
  addTab: (name: string, id: string, current: boolean) => void;
  setActiveTab: (name: string) => void;
  setActiveTabById: (id: string) => void;
  updateNameById: (id: string, newId: string, name: string) => void;
  saveTabsToLocalStorage: () => void;
  retrieveTabsFromLocalStorage: () => void;
  deactivateAllTabs: () => void;
  removeTabFromTabs: (id: string) => Tab[] | undefined;
  findBestNextTab: () => Tab | undefined;
}

const promptWorkspaceTabs = create<PromptWorkspaceTabs>((set, get) => ({
  tabs: [],
  saveTabsToLocalStorage() {
    localStorage.setItem("tabs", JSON.stringify(get().tabs));
  },
  retrieveTabsFromLocalStorage() {
    const tabs = localStorage.getItem("tabs");
    if (tabs) set({ tabs: JSON.parse(tabs) });
  },
  deactivateAllTabs() {
    set(({ tabs }) => ({ tabs: tabs.map(tab => ({ ...tab, current: false })) }));
  },
  addTab(name, prompt_id, current) {
    get().deactivateAllTabs();
    set(({ tabs }) => ({ tabs: [...tabs, { name, prompt_id, current }] }));
    get().saveTabsToLocalStorage();
  },
  removeTabFromTabs(id) {
    set(({ tabs }) => ({ tabs: tabs.filter(tab => tab.prompt_id !== id) }));
    console.log("1removeTabFromTabs", id, get().tabs);
    get().saveTabsToLocalStorage();
    //set tabs
    promptWorkspaceTabs.setState((state: { tabs: Tab[]; }) => ({
      tabs: state.tabs.filter(tab => tab.prompt_id !== id)
    }))
    console.log("2removeTabFromTabs", id, get().tabs);
    return get().tabs;
  },
  findBestNextTab() {
    const tabs: Tab[] = get().tabs;
    const currentTab = tabs.find(tab => tab.current);
    if (!currentTab) return;
    const currentTabIndex = tabs.indexOf(currentTab);
    const nextTab = tabs[currentTabIndex + 1];
    if (nextTab) return nextTab;
    const previousTab = tabs[currentTabIndex - 1];
    if (previousTab) return previousTab;
    return;
  },
  setActiveTabById(id) {
    if (!id) return;
    const tab = get().tabs.find(tab => tab.prompt_id === id);
    if (!tab) {
      const name = promptStore.getState().prompts.find(p => p.id === id)?.name;
      if (name) get().addTab(name, id, true);
    } else {
      get().deactivateAllTabs();
      set(({ tabs }) => ({ tabs: tabs.map(tab => ({ ...tab, current: tab.prompt_id === id })) }));
      get().saveTabsToLocalStorage();
    }
  },
  isActiveTab(id: string) {
    return get().tabs.find(tab => tab.prompt_id === id)?.current;
  },
  setActiveTab(name) {
    get().deactivateAllTabs();
    set(({ tabs }) => ({ tabs: tabs.map(tab => ({ ...tab, current: tab.name === name })) }));
    get().saveTabsToLocalStorage();
  },
  updateNameById(id, newId, name) {
    set(({ tabs }) => ({
      tabs: tabs.map(tab => (tab.prompt_id === id ? { ...tab, name, prompt_id: newId } : tab)),
    }));
    get().saveTabsToLocalStorage();
  }  
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