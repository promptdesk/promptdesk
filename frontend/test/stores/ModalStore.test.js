import {
  showPromptHistory,
  shouldShowSaveModal,
  shouldShowCodeModal,
  shouldShowSaveVariableModal,
  shouldShowEnvVariableModal,
} from "@/stores/ModalStore";

import { expect } from "chai";
import { act } from "react-dom/test-utils";

describe("My Test Suite", () => {
  it("My Test Case", () => {
    expect(true).to.be.true;
  });
});

describe("ModalStore", () => {
  describe("shouldShowSaveModal", () => {
    it("should toggle show_modal state", () => {
      act(() => {
        shouldShowSaveModal.getState().toggle_modal();
      });
      expect(shouldShowSaveModal.getState().show_modal).to.be.true;

      act(() => {
        shouldShowSaveModal.getState().toggle_modal();
      });
      expect(shouldShowSaveModal.getState().show_modal).to.be.false;
    });
  });

  describe("shouldShowCodeModal", () => {
    it("should toggle show_code_modal state", () => {
      act(() => {
        shouldShowCodeModal.getState().toggle_code_modal();
      });
      expect(shouldShowCodeModal.getState().show_code_modal).to.be.true;

      act(() => {
        shouldShowCodeModal.getState().toggle_code_modal();
      });
      expect(shouldShowCodeModal.getState().show_code_modal).to.be.false;
    });
  });

  describe("shouldShowSaveVariableModal", () => {
    it("should toggle show_variable_modal state", () => {
      act(() => {
        shouldShowSaveVariableModal.getState().toggle_variable_modal();
      });
      expect(shouldShowSaveVariableModal.getState().show_variable_modal).to.be
        .true;

      act(() => {
        shouldShowSaveVariableModal.getState().toggle_variable_modal();
      });
      expect(shouldShowSaveVariableModal.getState().show_variable_modal).to.be
        .false;
    });
  });

  describe("shouldShowEnvVariableModal", () => {
    it("should toggle show_env_variable_modal state", () => {
      act(() => {
        shouldShowEnvVariableModal.getState().toggle_env_variable_modal();
      });
      expect(shouldShowEnvVariableModal.getState().show_env_variable_modal).to
        .be.true;

      act(() => {
        shouldShowEnvVariableModal.getState().toggle_env_variable_modal();
      });
      expect(shouldShowEnvVariableModal.getState().show_env_variable_modal).to
        .be.false;
    });
  });
});
