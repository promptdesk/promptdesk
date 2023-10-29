import { create } from 'zustand'
import { promptStore } from './PromptStore';
import { Tab } from '@/interfaces/tab';

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

export interface shouldSnowCodeModal {
  show_code_modal: boolean;
  toggle_code_modal: () => void; // Corrected property name
}

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

const shouldSnowCodeModal = create<shouldSnowCodeModal>((set) => ({
  show_code_modal: false,
  toggle_code_modal: () => {
    shouldSnowCodeModal.setState((state: { show_code_modal: boolean; }) => ({
      show_code_modal: !state.show_code_modal
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
export { shouldShowSaveModal, shouldSnowCodeModal, showPromptHistory, shouldShowSaveVariableModal, shouldShowEnvVariableModal }