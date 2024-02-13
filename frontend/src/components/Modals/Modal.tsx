import React, { useState } from "react";
import { shouldShowSaveModal } from "@/stores/ModalStore";
import { tabStore } from "@/stores/TabStore";
import {
  promptStore,
  updateExistingPrompt,
  createNewPrompt,
  duplicateExistingPrompt,
  deletePrompt,
} from "@/stores/prompts";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import GlobalModal from "./GlobalModal";

const Modal = () => {
  const { show_modal, toggle_modal } = shouldShowSaveModal();

  const { push } = useRouter();

  const { updateLocalPromptValues, promptObject, addToLocalPrompts, prompts } =
    promptStore();

  const {
    tabs,
    addTab,
    removeTabFromTabs,
    findBestNextTab,
    setActiveTab,
    isActiveTab,
    setActiveTabById,
  } = tabStore();

  const [formValues, setFormValues] = useState({
    name: promptObject.name,
    description: promptObject.description,
    project: promptObject.project,
  });

  function changeName(name: string) {
    setFormValues({ ...formValues, name: name });
  }

  function changeDescription(description: string) {
    setFormValues({ ...formValues, description: description });
  }

  function changeProject(project: string) {
    setFormValues({ ...formValues, project: project });
  }

  function setAllPromptInformation() {
    if (prompts.find((prompt) => prompt.name === formValues.name)) {
      throw new Error(
        "Prompt with this name already exists, please choose other name",
      );
    }
    updateLocalPromptValues("name", formValues.name);
    updateLocalPromptValues("description", formValues.description);
    updateLocalPromptValues("project", formValues.project);
  }

  const changeIdInUrl = (newId: string) => {
    const newUrl = `/workspace/${newId}`;
    push(newUrl);
  };

  const saveExistingButtonData = [
    { label: "Cancel", className: "btn-neutral", action: toggle_modal },
    {
      label: "Save as new",
      className: "btn-neutral",
      action: async () => {
        var newPrompt = await duplicateExistingPrompt(
          formValues.name,
          formValues.description,
        );
        toggle_modal();
        if (newPrompt) {
          addToLocalPrompts(newPrompt);
          addTab(newPrompt.name, newPrompt.id, true);
          push("/workspace/" + newPrompt.id);
        }
      },
    },
    {
      label: "Update",
      className: "btn-primary",
      action: () => {
        try {
          setAllPromptInformation();
          updateExistingPrompt();
          toggle_modal();
        } catch (error) {
          if (error instanceof Error) {
            toast.error(error.message);
          }
        }
      },
    },
    {
      label: "Delete",
      className: "btn-negative",
      action: () => {
        var id = promptObject.id as string;

        deletePrompt();
        toggle_modal();

        //also found in the [id].tsx file
        if (isActiveTab(id) && tabs.length > 1) {
          const bestNextTab = findBestNextTab();
          bestNextTab?.prompt_id && changeIdInUrl(bestNextTab.prompt_id);
        }

        var x = removeTabFromTabs(id)?.length;

        if (x === 0) {
          push("/prompts");
        }
      },
    },
  ];

  const saveNewButtonData = [
    { label: "Cancel", className: "btn-neutral", action: toggle_modal },
    {
      label: "Save",
      className: "btn-primary",
      action: async () => {
        try {
          setAllPromptInformation();
          var id = await createNewPrompt();
          if (id) {
            toggle_modal();
            push(`/workspace/${id}`);
          }
        } catch (err) {
          if (err instanceof Error) {
            toast.error(err.message);
          }
        }
      },
    },
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
    <>
      <GlobalModal isModalOpen={show_modal} toggleModal={toggle_modal} heading={'Save preset'} size="medium">
        <p>
          This will save the current Playground state as a preset which
          you can access later or share with others.
        </p>
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
            id="save-modal-description"
          >
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
        <br />
        <div className="css-xeepoz">
          <div
            className="body-small mb-2 flex items-center"
            id="save-modal-name"
          >
            <div className="bold mr-2">Project</div>
          </div>
          <input
            className="text-input text-input-sm text-input-full"
            type="text"
            defaultValue={formValues.project}
            onInput={(e) => changeProject(e.currentTarget.value)}
          />
        </div>
        <div className="modal-footer">{renderButtons()}</div>
      </GlobalModal >
      <Toaster />
    </>
  );
};

export default Modal;
