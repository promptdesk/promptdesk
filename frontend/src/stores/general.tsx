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
  toggle_variable_modal: (variable_name:string) => void; // Corrected property name
}

export interface PromptWorkspaceTabs {
  //tabs is an array of dics with name, id
  tabs: Array<{ name: string; prompt_id: string; current: boolean; }>;
  addTab: (tab: string, id:string, current:boolean) => void;
  removeTab: (tab: string) => void;
  setActiveTab: (tab: string) => void;
  setActiveTabById: (id: string) => void;
  updateNameById: (id: string, new_id:string, name: string) => void;
  saveTabsToLocalStorage: () => void;
  retreiveTabsFromLocalStorage: () => void;
}


const promptWorkspaceTabs = create<PromptWorkspaceTabs>((set) => ({
  tabs: [/*{
    name: "API testing V1",
    prompt_id: "0x1560b649218dbc9ed357275a2bf07110",
    current: true
  },{
    name: "Yoda Chat",
    prompt_id: "0xd160e31a7a0befa39bfb33a5fd64c850",
    current: false
  }, {
    name: "New Prompt 3",
    prompt_id: "0j0f9j0wjf0j",
    current: false
  }*/],
  saveTabsToLocalStorage: () => {
    localStorage.setItem("tabs", JSON.stringify(promptWorkspaceTabs.getState().tabs));
  },

  retreiveTabsFromLocalStorage: () => {
    var tabs = localStorage.getItem("tabs");
    if (tabs !== null) {
      var tabs_array = JSON.parse(tabs);
      set((state: { tabs: Array<{ name: string; prompt_id: string; current: boolean; }>; }) => ({
        tabs: tabs_array
      }))
    }
  },

  deactivateAllTabs: () => {
    set((state: { tabs: Array<{ name: string; prompt_id: string; current: boolean; }>; }) => ({
      tabs: state.tabs.map((t) => {
        return { ...t, current: false }
      })
    }))
  },

  addTab: (tab: string, prompt_id: string, current: boolean) => {

    set((state: { tabs: Array<{ name: string; prompt_id: string; current:boolean }>; }) => ({
      tabs: [...state.tabs, {
        name: tab,
        prompt_id: prompt_id,
        current: current
      }]
    }))

    promptWorkspaceTabs.getState().setActiveTabById(prompt_id);

    //save
    promptWorkspaceTabs.getState().saveTabsToLocalStorage();

  },
  removeTab: (id: string) => {
    //find index of id in tabs
    set((state: { tabs: Array<{ name: string; prompt_id: string; current: boolean }>; }) => ({
      tabs: state.tabs.filter((t) => t.prompt_id !== id)
    }))

    //save
    promptWorkspaceTabs.getState().saveTabsToLocalStorage();

  },
  setActiveTabById: (id: string) => {

    if(id === undefined || id === null || id === "") {
      return;
    }

    var tab_index = promptWorkspaceTabs.getState().tabs.findIndex((t) => t.prompt_id === id);
    //console.log("setActiveTabById", id, tab_index)

    if (tab_index === -1) {

      var name = promptStore.getState().prompts.find((p) => p.id === id)?.name;

      if(name === undefined) {
        return //console.log("name is undefined");
      }

      promptWorkspaceTabs.getState().addTab(name as string, id, true);
      tab_index = promptWorkspaceTabs.getState().tabs.length - 1;
    }

    set((state: { tabs: Array<{ name: string; prompt_id: string; current: boolean; }>; }) => ({
      tabs: state.tabs.map((t) => {
        if (t.prompt_id === id) {
          return { ...t, current: true }
        } else {
          return { ...t, current: false }
        }
      })
    }))

    //save
    promptWorkspaceTabs.getState().saveTabsToLocalStorage();

  },
  setActiveTab: (tab: string) => {
    set((state: { tabs: Array<{ name: string; prompt_id: string; current: boolean; }>; }) => ({
      tabs: state.tabs.map((t) => {
        if (t.name === tab) {
          return { ...t, current: true }
        } else {
          return { ...t, current: false }
        }
      })
    }))

    //save
    promptWorkspaceTabs.getState().saveTabsToLocalStorage();

  },
  updateNameById: (id: string, new_id: string, name: string) => {
    set((state: { tabs: Array<{ name: string; prompt_id: string; current: boolean; }>; }) => ({
      tabs: state.tabs.map((t) => {
        if (t.prompt_id === id) {
          return { ...t, name: name, prompt_id: new_id }
        } else {
          return { ...t }
        }
      })
    }))

    //save
    promptWorkspaceTabs.getState().saveTabsToLocalStorage();

  }
}))

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
  toggle_variable_modal: (variableName: string) => {
    shouldShowSaveVariableModal.setState((state: { show_variable_modal: boolean; }) => ({
      show_variable_modal: !state.show_variable_modal
    }))

    promptStore.getState().setSelectedVariable(variableName)
  },
}));

//export both stores
export { shouldShowSaveModal, showPromptHistory, promptWorkspaceTabs, shouldShowSaveVariableModal }