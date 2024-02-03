import React from "react";
import {
  shouldShowSaveVariableModal
} from "@/stores/ModalStore";

import { promptStore, setPromptVariables } from "@/stores/prompts";
import CodeEditor from "@/components/Editors/CodeEditor";

const Modal = () => {

  const {
    toggle_variable_modal
  } = shouldShowSaveVariableModal();

  const { promptObject } = promptStore(); // Assuming this is the correct usage for the store

  var obj = promptObject.prompt_variables

  function modifyValue(newValue:string) {
    obj[promptStore.getState().selectedVariable].value = newValue
    setPromptVariables(obj)
  }

  const type = obj[promptStore.getState().selectedVariable].type

  const saveNewButtonData = [
    { label: "Okay", className: "btn-neutral", action: () => {
      toggle_variable_modal()
    } }
  ];

  const renderButtons = () => {
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
  };

  return (
    <div className="modal-root modal-is-open modal-closeable">
      <div className="modal-backdrop" onClick={
        () => {
          toggle_variable_modal()
        }
      }/>
      <div className="modal-dialog-container" tabIndex={0}>
        <div className="modal-dialog modal-size-large">
          <div>
            <div className="modal-header heading-medium">Variable</div>
            <div className="modal-body body-small">
              <div className="css-xeepoz">
                <div className="body-small mb-2 flex items-center" id="save-modal-description">
                  <div className="bold mr-2">Value ({type})</div>
                </div>
                {type === 'text' ? 
                <textarea
                  rows = {10}
                  className="text-input-mono text-input text-input-sm text-input-full"
                  value={obj[promptStore.getState().selectedVariable].value} // Bind the state variable to the textarea value
                  onChange={(e) => modifyValue(e.target.value)} // Update the state on input change
                /> :
                <CodeEditor
                  code={JSON.stringify(obj[promptStore.getState().selectedVariable].value, null, 2)}
                  handleChange={(e) => {
                    try {
                      let generated_object = JSON.parse(e as string)
                      modifyValue(generated_object)
                    } catch (e) {
                    }
                  }}
                  language={'json'}
                  height={"20em"}
                />}
              </div>
            </div>
            <div className="modal-footer">{renderButtons()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;