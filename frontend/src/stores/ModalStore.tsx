import { create } from 'zustand'
import { promptStore, setSelectedVariable } from '@/stores/prompts';

export interface SnowShouldShowSaveModal {
  show_modal: boolean;
  toggle_modal: () => void;
}

export interface ShouldShowCodeModal {
  show_code_modal: boolean;
  toggle_code_modal: () => void;
}

export interface ShouldShowSaveVariableModal {
  show_variable_modal: boolean;
  toggle_variable_modal: (variable_name?: string) => void;
}

export interface ShouldShowEnvVariableModal {
  show_env_variable_modal: boolean;
  toggle_env_variable_modal: () => void;
}

// Store for managing save modal visibility
export const shouldShowSaveModal = create<SnowShouldShowSaveModal>(set => ({
  show_modal: false,
  toggle_modal: () => set(state => ({ show_modal: !state.show_modal }))
}));

// Store for managing code modal visibility
export const shouldShowCodeModal = create<ShouldShowCodeModal>(set => ({
  show_code_modal: false,
  toggle_code_modal: () => set(state => ({ show_code_modal: !state.show_code_modal }))
}));

// Store for managing save variable modal visibility
export const shouldShowSaveVariableModal = create<ShouldShowSaveVariableModal>(set => ({
  show_variable_modal: false,
  toggle_variable_modal: (variableName?: string) => {
    set(state => ({ show_variable_modal: !state.show_variable_modal }));
    if (variableName) {
      setSelectedVariable(variableName);
    }
  },
}));

// Store for managing environment variable modal visibility
export const shouldShowEnvVariableModal = create<ShouldShowEnvVariableModal>(set => ({
  show_env_variable_modal: false,
  toggle_env_variable_modal: () => set(state => ({ show_env_variable_modal: !state.show_env_variable_modal }))
}));