import { create } from 'zustand'
import { promptStore } from './PromptStore';
import { Tab } from '@/interfaces/tab';

export interface PromptWorkspaceTabs {
  tabs: Tab[];
  activeTabIndex: number | undefined;
  activeTabeId: string | undefined;
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
  updateDataById: (id: string, data: any) => void;
  getDataById: (id: string) => any;
  getDataByIndex: (index: number) => any;
}

const promptWorkspaceTabs = create<PromptWorkspaceTabs>((set, get) => ({

  tabs: [],
  activeTabIndex: undefined,
  activeTabeId: undefined,
  saveTabsToLocalStorage() {
    localStorage.setItem("tabs", JSON.stringify(get().tabs));
  },
  retrieveTabsFromLocalStorage() {
    const tabs = localStorage.getItem("tabs");
    if (tabs) set({ tabs: JSON.parse(tabs) });
  },
  deactivateAllTabs() {
    set(({ tabs }) => ({ tabs: tabs.map(tab => ({ ...tab, current: false })) }));
    //set active tab to undefined
    promptWorkspaceTabs.setState(() => ({
      activeTabIndex: undefined,
      activeTabeId: undefined
    }))
  },
  addTab(name, prompt_id, current) {
    get().deactivateAllTabs();
    set(({ tabs }) => ({ tabs: [...tabs, { name, prompt_id, current, data:{} }] }));
    get().saveTabsToLocalStorage();
  },
  removeTabFromTabs(id) {
    set(({ tabs }) => ({ tabs: tabs.filter(tab => tab.prompt_id !== id) }));
    get().saveTabsToLocalStorage();
    //set tabs
    promptWorkspaceTabs.setState((state: { tabs: Tab[]; }) => ({
      tabs: state.tabs.filter(tab => tab.prompt_id !== id)
    }))
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
      //set activeTabIndex
      promptWorkspaceTabs.setState(() => ({
        activeTabIndex: get().tabs.findIndex(tab => tab.prompt_id === id),
        activeTabeId: id
      }))
      get().saveTabsToLocalStorage();
    }
  },
  isActiveTab(id: string) {
    return get().tabs.find(tab => tab.prompt_id === id)?.current;
  },
  setActiveTab(name) {
    get().deactivateAllTabs();
    set(({ tabs }) => ({ tabs: tabs.map(tab => ({ ...tab, current: tab.name === name })) }));
    //set activeTabIndex
    promptWorkspaceTabs.setState(() => ({
      activeTabIndex: get().tabs.findIndex(tab => tab.name === name),
      activeTabeId: get().tabs.find(tab => tab.name === name)?.prompt_id
    }))
    get().saveTabsToLocalStorage();
  },
  updateNameById(id, newId, name) {
    set(({ tabs }) => ({
      tabs: tabs.map(tab => (tab.prompt_id === id ? { ...tab, name, prompt_id: newId } : tab)),
    }));
    get().saveTabsToLocalStorage();
  },
  updateDataById(id:string, data:any) {
    set(({ tabs }) => ({
      tabs: tabs.map(tab => (tab.prompt_id === id ? { ...tab, data } : tab)),
    }));
    get().saveTabsToLocalStorage();
  },
  getDataById(id:string) {
    return get().tabs.find(tab => tab.prompt_id === id)?.data;
  },
  getDataByIndex(index:number) {
    if(get().tabs[index] === undefined) {
      return {};
    }
    return get().tabs[index].data;
  }
}));


//export both stores
export { promptWorkspaceTabs }