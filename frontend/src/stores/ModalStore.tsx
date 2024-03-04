import { create } from "zustand";
import { promptStore, setSelectedVariable } from "@/stores/prompts";

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

export interface ShouldShowPasswordResetModal {
  show_password_reset_modal: boolean;
  toggle_password_reset_modal: () => void;
}

export interface ShouldShowCreatUserModal {
  show_create_user_modal: boolean;
  toggle_create_user_modal: () => void;
}

export interface ShouldShowDeleteUserModal {
  show_delete_user_modal: boolean;
  toggle_delete_user_modal: () => void;
}

export interface ShowingResetModalFor {
  user_email: string;
  hide_reset_modal: () => void;
  show_reset_modal_for_email: (email: string) => void
}

export interface ShowingDeleteUserModalFor {
  user_email: string;
  hide_delete_modal: () => void;
  show_delete_user_modal_for: (email: string) => void;
}
// Store for managing save modal visibility
export const shouldShowSaveModal = create<SnowShouldShowSaveModal>((set) => ({
  show_modal: false,
  toggle_modal: () => set((state) => ({ show_modal: !state.show_modal })),
}));

// Store for managing code modal visibility
export const shouldShowCodeModal = create<ShouldShowCodeModal>((set) => ({
  show_code_modal: false,
  toggle_code_modal: () =>
    set((state) => ({ show_code_modal: !state.show_code_modal })),
}));

// Store for managing save variable modal visibility
export const shouldShowSaveVariableModal = create<ShouldShowSaveVariableModal>(
  (set) => ({
    show_variable_modal: false,
    toggle_variable_modal: (variableName?: string) => {
      set((state) => ({ show_variable_modal: !state.show_variable_modal }));
      if (variableName) {
        setSelectedVariable(variableName);
      }
    },
  }),
);

// Store for managing environment variable modal visibility
export const shouldShowEnvVariableModal = create<ShouldShowEnvVariableModal>(
  (set) => ({
    show_env_variable_modal: false,
    toggle_env_variable_modal: () =>
      set((state) => ({
        show_env_variable_modal: !state.show_env_variable_modal,
      })),
  }),
);

export const shouldShowResetPasswordUserModal =
  create<ShouldShowPasswordResetModal>((set) => ({
    show_password_reset_modal: false,
    toggle_password_reset_modal: () => {
      set((state) => ({
        show_password_reset_modal: !state.show_password_reset_modal,
      }));
    },
  }));

export const shouldShowCreateUserModal = create<ShouldShowCreatUserModal>(
  (set) => ({
    show_create_user_modal: false,
    toggle_create_user_modal: () => {
      set((state) => ({
        show_create_user_modal: !state.show_create_user_modal,
      }));
    },
  }),
);

export const shouldShowDeleteUserModal = create<ShouldShowDeleteUserModal>((set) => ({
  show_delete_user_modal: false,
  toggle_delete_user_modal: () => {
    set(state => ({ show_delete_user_modal: !state.show_delete_user_modal }))
  }
}))

export const showingResetModalForUser = create<ShowingResetModalFor>((set) => ({
  user_email: '',
  show_reset_modal_for_email: (email) => {
    set({ user_email: email })
  },
  hide_reset_modal: () => {
    set({ user_email: '' })
  }
}))

export const showingDeleteUserModalFor = create<ShowingDeleteUserModalFor>(set => ({
  user_email: '',
  show_delete_user_modal_for: (email: string) => {
    set({ user_email: email })
  },
  hide_delete_modal: () => {
    set({ user_email: '' })
  }
}))