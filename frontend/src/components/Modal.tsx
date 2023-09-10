import React, { useState } from "react";
import { shouldShowSaveModal, promptWorkspaceTabs } from "@/stores/general";
import { promptStore } from "@/stores/PromptStore";
import router from "next/router";

const Modal = () => {
  const { show_modal, toggle_modal } = shouldShowSaveModal();


  const {
    setPromptInformation,
    promptObject,
    createNewPrompt,
    updateExistingPrompt,
    duplicateExistingPrompt,
    deletePrompt,
  } = promptStore();

  const {
    setActiveTabById,
    addTab,
    updateNameById
  } = promptWorkspaceTabs();

  const [ formValues, setFormValues ] = useState({
    name: promptObject.name,
    description: promptObject.description,
  });

  function changeName(name: string) {
    setFormValues({ ...formValues, name: name });
  }

  function changeDescription(description: string) {
    setFormValues({ ...formValues, description: description });
  }

  function setAllPromptInformation() {
    setPromptInformation("name", formValues.name);
    setPromptInformation("description", formValues.description);
  }

  const saveExistingButtonData = [
    { label: "Cancel", className: "btn-neutral", action: toggle_modal },
    { label: "Save as new", className: "btn-neutral", action: () => { duplicateExistingPrompt(formValues.name, formValues.description); toggle_modal(); }},
    { label: "Update", className: "btn-primary", action: () => { setAllPromptInformation(); updateExistingPrompt(); toggle_modal(); } },
    { label: "Delete", className: "btn-negative", action: () => { deletePrompt(); toggle_modal(); } },
  ];

  const saveNewButtonData = [
    { label: "Cancel", className: "btn-neutral", action: toggle_modal },
    { label: "Save", className: "btn-primary", action: () => { setAllPromptInformation(); createNewPrompt(); toggle_modal(); } },
  ];

  const renderButtons = () => {
    if (!promptObject.new) {
      return (
        <>
          {saveExistingButtonData.map((button, index) => (
            <button
              key={index}
              tabIndex={0}
              className={`btn btn-sm btn-filled ${button.className} modal-button`}
              type="button"
              onClick={button.action}
            >
              <span className="btn-label-wrap">
                <span className="btn-label-inner">{button.label}</span>
              </span>
            </button>
          ))}
        </>
      );
    } else {
      return (
        <>
          {saveNewButtonData.map((button, index) => (
            <button
              key={index}
              tabIndex={0}
              className={`btn btn-sm btn-filled ${button.className} modal-button`}
              type="button"
              onClick={button.action}
            >
              <span className="btn-label-wrap">
                <span className="btn-label-inner">{button.label}</span>
              </span>
            </button>
          ))}
        </>
      );
    }
  };

  return (
    <div className="modal-root modal-is-open modal-closeable">
      <div className="modal-backdrop" />
      <div className="modal-dialog-container" tabIndex={0}>
        <div
          className="modal-dialog modal-size-medium"
        >
          <div>
            <div className="modal-header heading-medium">Save preset</div>
            <div className="modal-body body-small">
              <p>
                This will save the current Playground state as a preset which you
                can access later or share with others.
              </p>
              <br />
              <div className="css-xeepoz">
                <div className="body-small mb-2 flex items-center" id="save-modal-name">
                  <div className="bold mr-2">Name</div>
                </div>
                <input
                  className="text-input text-input-sm text-input-full"
                  type="text"
                  defaultValue={formValues.name}
                  onInput={(e) => changeName(e.currentTarget.value)}
                />
              </div>
              <br />
              <div className="css-xeepoz">
                <div className="body-small mb-2 flex items-center" id="save-modal-description">
                  <div className="bold mr-2">Description</div>
                  <div style={{ color: "var(--gray-600)" }}>Optional</div>
                </div>
                <input
                  className="text-input text-input-sm text-input-full"
                  type="text"
                  defaultValue={formValues.description}
                  onInput={(e) => changeDescription(e.currentTarget.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              {renderButtons()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;