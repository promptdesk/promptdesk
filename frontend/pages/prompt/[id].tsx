import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import DropDown from "@/components/Form/DropDown";
import TagsInput from "@/components/Form/TagsInput";
import SliderComponent from "@/components/Form/SliderComponent";
import Editor from "@/components/Editors/Editor";
import ChatEditor from "@/components/Editors/ChatEditor";
import PlaygroundButton from "@/components/Form/PlaygroundButton";
import Modal from "@/components/Modal";
import VariableModal from "@/components/Editors/VariableModal";
import {
  showPromptHistory,
  shouldShowSaveModal,
  promptWorkspaceTabs,
  shouldShowSaveVariableModal
} from "@/stores/general";
import { modelStore } from "@/stores/ModelStore";
import { promptStore } from "@/stores/PromptStore";

export default function Home() {
  const { push } = useRouter();
  const router = useRouter();

  const {
    show_modal,
    toggle_modal
  } = shouldShowSaveModal();

  const {
    show_variable_modal,
    toggle_variable_modal
  } = shouldShowSaveVariableModal();

  const {
    tabs,
    addTab,
    removeTab,
    setActiveTab,
    setActiveTabById
  } = promptWorkspaceTabs();

  const {
    fetchAllPrompts,
    setPrompt,
    setPromptInformation,
    promptObject,
    prompts,
    addNewPrompt
  } = promptStore();

  const {
    modelListSelector,
    fetchAllModels,
    selectedModeId,
    setModelById,
    modelObject,
    models,
  } = modelStore();

  const { query } = router; // Using destructuring here

  useEffect(() => {
    console.log("useEffect called");
    const id = query.id as string; // Using id from the query object
    setPrompt(id);
    setActiveTabById(id);
    setModelById(promptObject.id as string);
    console.log("promptObject.id", promptObject.id)
  }, [query.id]);

  const classNames = (...classes: string[]) => classes.filter(Boolean).join(' ');

  const changeIdInUrl = (newId: string) => {
    const newUrl = `/prompt/${newId}`;
    router.push(newUrl);
  };

  const removePlaygroundTab = (e: any, id: string) => {
    e.stopPropagation();

    const tab_index = tabs.findIndex((t) => t.prompt_id === id);
    const current = tabs[tab_index].current;

    const redirect = tabs.length === 1;

    if (tab_index >= 0) {
      let nextTabIndex = tab_index + 1;

      if (nextTabIndex >= tabs.length) {
        nextTabIndex = tab_index - 1;
      }

      if (nextTabIndex >= 0) {
        if(current) {
          setActiveTabById(tabs[nextTabIndex].prompt_id);
        }
        setPrompt(tabs[nextTabIndex].prompt_id);
      }

      removeTab(id);

      if(redirect) {
        push('/prompts');
      }
    }
  };

  useEffect(() => {

    //check lentgh of tabs
    if(tabs.length === 0) {
      router.push('/prompts');
    }

  }, [tabs]);

  const newPrompt = async () => {
    const newId = await addNewPrompt();
    setActiveTabById(newId);
    router.push(`/prompt/${newId}`);
  };

  return (
    <>
    {(modelObject && promptObject) && (
      <div className="pg-root page-body full-width flush">
        <div className="pg-main">
          <div className="pg-tab-header">
            {/* TABS */}
            <div className="hidden sm:block">
              <nav aria-label="Tabs" style={{background: "#f2f2f2", paddingTop:"8px"}}>
                {tabs.map((tab) => (
                  <div
                    key={tab.prompt_id}
                    style={{width: "188px", display: "inline-block", borderRadius: "10px 10px 0px 0px", padding: "5px"}}
                    className={classNames(
                      tab.current ? 'bg-white text-indigo-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
                      'px-2 py-1 text-sm font-medium cursor-pointer'
                    )}
                    aria-current={tab.current ? 'page' : undefined}
                    onClick={() => {
                      setActiveTab(tab.name);
                      changeIdInUrl(tab.prompt_id);
                    }}
                  >
                    {tab.name}
                    <span onClick={(e) => removePlaygroundTab(e, tab.prompt_id)} className="ml-2 inline-flex items-center rounded-md bg-gray-50 hover:bg-gray-200 px-2 py-0 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
          x
        </span>
                  </div>
                ))}
                <div
                    key='-1'
                    className={classNames(
                      'text-gray-500 hover:text-gray-700 hover:bg-gray-200',
                      'rounded-md px-2 py-1 text-sm font-medium',
                    )}
                    style={{width: "188px", display: "inline-block"}}
                    onClick={() => {
                      newPrompt();
                    }}
                  >
                    <span className="font-bold">+</span>
                  </div>
              </nav>
            </div>
          </div>
          {promptObject.id && promptObject.id !== "" && (
          <div className="pg-body">
                {/*show && <History />*/}
                {show_modal && <Modal />}
                {show_variable_modal && <VariableModal />}
                <div className="pg-editor">
                  <div className="pg-content-body">
                    {modelObject.type === "chat" ? (
                      <ChatEditor />
                    ) : (
                      <Editor />
                    )}
                  </div>
                </div>
                <div className="pg-right">
                  <div className="pg-right-panel-mask" />
                  <div className="pg-right-content">
                    <button className="pg-right-panel-mobile-close">×</button>
                    <div className="parameter-panel">
                      <div>
                        <PlaygroundButton
                          text="Save"
                          onClick={toggle_modal}
                        />
                        <DropDown
                          label={"Model"}
                          options={modelListSelector}
                          selected={selectedModeId}
                          onChange={(id: any) => {
                            setModelById(id);
                            //console.log("MODEL USED", id)
                          }}
                        />
                        <br />
                        {modelObject.model_parameters &&
                          Object.keys(modelObject.model_parameters).map(
                            (key, index) =>
                              modelObject.model_parameters[key]["type"] === "slider" ? (
                                <SliderComponent
                                  key={index}
                                  sliderInfo={modelObject.model_parameters[key]}
                                  value={
                                    promptObject.prompt_parameters &&
                                    promptObject.prompt_parameters[key] !== undefined
                                      ? promptObject.prompt_parameters[key]
                                      : modelObject.model_parameters[key]
                                      ? modelObject.model_parameters[key]['default']
                                      : undefined
                                  }
                                  onChange={(value: any): void => {
                                    setPromptInformation(
                                      'prompt_parameters.' + key,
                                      value
                                    );
                                  }}
                                />
                              ) : null
                          )}
                      </div>
                    </div>
                  </div>
                </div>
          </div>
          )}
        </div>
    </div>
    )}
    </>
  );
  
}
