import React, { useState } from "react";
import { variableStore } from "@/stores/VariableStore";
import { shouldShowEnvVariableModal } from "@/stores/ModalStore";

const Modal = () => {
  const { variables, updateVariables } = variableStore();
  const { show_env_variable_modal, toggle_env_variable_modal } =
    shouldShowEnvVariableModal();

  const [formValues, setFormValues] = useState({
    name: "",
    value: "",
  });

  function changeName(name: string) {
    setFormValues({ ...formValues, name: name });
  }

  function changeValue(value: string) {
    setFormValues({ ...formValues, value: value });
  }

  async function createNewVariable() {
    //check if name is unique
    var name = formValues.name;
    var nameExists = false;
    variables.forEach((variable) => {
      if (variable.name === name) {
        nameExists = true;
      }
    });
    if (nameExists) {
      alert("Variable name already exists");
      return 0;
    }
    var newVariable = {
      name: formValues.name,
      value: formValues.value,
    };
    var newVariables = variables;
    newVariables.push(newVariable);
    await updateVariables(newVariables);
    //reset form
    setFormValues({ name: "", value: "" });
    toggle_env_variable_modal();
  }

  const saveNewButtonData = [
    {
      label: "Cancel",
      className: "btn-neutral",
      action: () => {
        toggle_env_variable_modal();
      },
    },
    {
      label: "Save",
      className: "btn-primary",
      action: () => {
        createNewVariable();
      },
    },
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
      <div className="modal-backdrop" />
      <div className="modal-dialog-container" tabIndex={0}>
        <div className="modal-dialog modal-size-medium">
          <div>
            <div className="modal-header heading-medium">
              Create new secret key
            </div>
            <div className="modal-body body-small">
              <p>Enter the name and value of your new secret key.</p>
              <br />
              <div className="css-xeepoz">
                <div
                  className="body-small mb-2 flex items-center"
                  id="save-modal-name"
                >
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
                <div
                  className="body-small mb-2 flex items-center"
                  id="save-modal-name"
                >
                  <div className="bold mr-2">Value</div>
                </div>
                <input
                  className="text-input text-input-sm text-input-full"
                  type="text"
                  defaultValue={formValues.value}
                  onInput={(e) => changeValue(e.currentTarget.value)}
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
