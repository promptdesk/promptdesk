import React, { useEffect, useState } from "react";
import { shouldShowSaveModal } from "@/stores/ModalStore";
import { tabStore } from "@/stores/TabStore";
import { Switch } from '@headlessui/react'
import { v4 as uuidv4 } from 'uuid';

import {
  promptStore,
  updateExistingPrompt,
  createNewPrompt,
  duplicateExistingPrompt,
  deletePrompt
} from "@/stores/prompts";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import GlobalModal from "./GlobalModal";
import { set } from "lodash";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const Modal = () => {

  const { show_modal, toggle_modal } = shouldShowSaveModal();
  const { push } = useRouter();
  const { updateLocalPromptValues, promptObject, addToLocalPrompts, prompts, projects } =
    promptStore();
  const [appId, setAppId] = useState(promptObject.app)
  const [isAppEnabled, setIsAppEnabled] = useState(promptObject.app !== null && promptObject.app !== undefined)


  useEffect(() => {
    if (isAppEnabled && !appId) {
      setAppId(uuidv4() as any)
    }
    if(!isAppEnabled){
      setAppId(null)
    }
    setProjectsList(projects());
  }, [isAppEnabled])

  
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
    app: promptObject.app,
  });

  const [projectsList, setProjectsList] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>(formValues.project || "-- CUSTOM --");

  function changeName(name: string) {
    setFormValues({ ...formValues, name: name });
  }

  function changeDescription(description: string) {
    setFormValues({ ...formValues, description: description });
  }

  function changeProject(project: string) {
    setFormValues({ ...formValues, project: project });
  }

  useEffect(() => {
    if(selectedProject !== "-- CUSTOM --"){
      changeProject(selectedProject)
    } else {
      changeProject("")
    }
  }, [selectedProject])

  function setAllPromptInformation(validate = false) {
    if (validate && prompts.find((prompt) => prompt.name === formValues.name)) {
      throw new Error(
        "Prompt with this name already exists, please choose other name",
      );
    }
    updateLocalPromptValues("name", formValues.name);
    updateLocalPromptValues("description", formValues.description);
    updateLocalPromptValues("project", formValues.project);
    updateLocalPromptValues("app", appId);
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
        try {
          var newPrompt = await duplicateExistingPrompt(
            formValues.name,
            formValues.description,
            formValues.project
          );
          toggle_modal();
          if (newPrompt) {
            addToLocalPrompts(newPrompt);
            addTab(newPrompt.name, newPrompt.id, true);
            push("/workspace/" + newPrompt.id);
          }
        } catch (error) {
          if (error instanceof Error) {
            toast.error(error.message);
          }
        }
      },
    },
    {
      label: "Update",
      className: "btn-primary",
      action: async () => {
        try {
          setAllPromptInformation(false);
          await updateExistingPrompt();
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
      <GlobalModal
        isModalOpen={show_modal}
        toggleModal={toggle_modal}
        heading={"Save preset"}
        size="medium"
      >
        <p>
          This will save the current Playground state as a preset which you can
          access later or share with others.
          {promptObject.app}
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
          <div className="body-small mb-2 flex items-center" id="save-modal-name">
            <div className="bold mr-2">Project</div>
          </div>
          <select
            className="text-input text-input-sm text-input-full"
            value={selectedProject as string}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            {projectsList.map((project, index) => (
              <option key={index} value={project}>
                {project}
              </option>
            ))}
            <option value="-- CUSTOM --">-- CUSTOM --</option>
          </select>
          <input
              className="text-input text-input-sm text-input-full mt-2"
              type="text"
              placeholder="Enter a project name"
              value={formValues.project}
              onInput={(e) => changeProject(e.currentTarget.value)}
            />
        </div>
        <hr className="mt-4" />
        <div className="mt-4">

        <Switch.Group as="div" className="flex items-center">
          <Switch
            checked={isAppEnabled}
            onChange={setIsAppEnabled}
            className={classNames(
              isAppEnabled ? 'bg-indigo-600' : 'bg-gray-200',
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
            )}
          >
            <span
              aria-hidden="true"
              className={classNames(
                isAppEnabled ? 'translate-x-5' : 'translate-x-0',
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
              )}
            />
          </Switch>
          <label className="ml-3 text-sm">
            <span className="font-medium text-gray-900">Enable App</span>{' '}
            <span className="text-gray-500">(Get a unique URL to share with others.)
            </span>
          </label>
        </Switch.Group>

        </div>

        <div className="modal-footer">{renderButtons()}</div>
      </GlobalModal>
      <Toaster />
    </>
  );
};

export default Modal;
