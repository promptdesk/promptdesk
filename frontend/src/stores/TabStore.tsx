import { create } from 'zustand'
import { promptStore } from '@/stores/prompts';
import { Tab } from '@/interfaces/tab';
import { organizationStore } from './OrganizationStore';

export interface tabStore {
  tabs: Tab[];
  activeTabIndex: number | undefined;
  activeTabId: string | undefined;
  isActiveTab: (id: string) => boolean | undefined;
  addTab: (name: string, id: string, current: boolean) => void;
  setActiveTab: (name: string) => void;
  setActiveTabById: (id: string) => void;
  updateNameById: (id: string, newId: string, name: string) => void;
  retrieveTabsFromLocalStorage: () => void;
  removeTabFromTabs: (id: string) => Tab[] | undefined;
  findBestNextTab: () => Tab | undefined;
  updateDataById: (id: string, data: any) => void;
  getDataById: (id: string) => any;
  getDataByIndex: (index: number) => any;
  clearLocalTabs: () => void;
  findActiveTab: () => Tab | undefined;
  //local
  saveTabsToLocalStorage: () => void;
  deactivateAllTabs: () => void;

}

const tabStore = create<tabStore>((set, get) => ({

  tabs: [],
  activeTabIndex: undefined,
  activeTabId: undefined,
  saveTabsToLocalStorage() {
    const id = organizationStore.getState().organization?.id
    localStorage.setItem("tabs:" + id, JSON.stringify(get().tabs));
  },
  retrieveTabsFromLocalStorage() {
    const id = organizationStore.getState().organization?.id
    const tabs = localStorage.getItem("tabs:" + id);
    if (tabs) set({ tabs: JSON.parse(tabs) });
  },
  clearLocalTabs() {
    //get a list of all ids in promptStore.getState().prompts
    const promptIds = promptStore.getState().prompts.map(p => p.id);
    //filter out all tabs where prompt_id are not in the promptIds
    const tabs = get().tabs.filter(tab => promptIds.includes(tab.prompt_id));
    //set the tabs
    set({ tabs });
    //save the tabs
    get().saveTabsToLocalStorage();
  },
  deactivateAllTabs() {
    set(({ tabs }) => ({ tabs: tabs.map(tab => ({ ...tab, current: false })) }));
    //set active tab to undefined
    tabStore.setState(() => ({
      activeTabIndex: undefined,
      activeTabId: undefined
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
    tabStore.setState((state: { tabs: Tab[]; }) => ({
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
      tabStore.setState(() => ({
        activeTabIndex: get().tabs.findIndex(tab => tab.prompt_id === id),
        activeTabId: id
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
    tabStore.setState(() => ({
      activeTabIndex: get().tabs.findIndex(tab => tab.name === name),
      activeTabId: get().tabs.find(tab => tab.name === name)?.prompt_id
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
  },
  findActiveTab() {
    return get().tabs.find(tab => tab.current);
  }
}));


//export both stores
export { tabStore }