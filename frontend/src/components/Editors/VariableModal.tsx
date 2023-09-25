import React, { use, useEffect, useState } from "react";
import {
  shouldShowSaveVariableModal
} from "@/stores/general";

import { promptStore } from "@/stores/PromptStore";
import router from "next/router";

const Modal = () => {

  const {
    show_variable_modal,
    toggle_variable_modal
  } = shouldShowSaveVariableModal();

  const { promptObject } = promptStore(); // Assuming this is the correct usage for the store

  var obj = promptObject.prompt_variables

  //console.log("obj", promptObject, obj, promptStore.getState().selectedVariable)

  var x = obj[promptStore.getState().selectedVariable].value

  //const [variableValue, setVariableValue] = useState(x); // State variable for textarea content

  function modifyValue(newValue:string) {
    //setVariableValue(newValue); // Update the state
    obj[promptStore.getState().selectedVariable].value = newValue
    promptStore.getState().setPromptVariables(obj)

  }

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
                  <div className="bold mr-2">Description</div>
                  <div style={{ color: "var(--gray-600)" }}>Optional</div>
                </div>
                <textarea
                  rows = {10}
                  className="text-input-mono text-input text-input-sm text-input-full"
                  value={obj[promptStore.getState().selectedVariable].value} // Bind the state variable to the textarea value
                  onChange={(e) => modifyValue(e.target.value)} // Update the state on input change
                />
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