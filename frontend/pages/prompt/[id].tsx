import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import Editor from "@/components/Editors/Editor";
import ChatEditor from "@/components/Editors/ChatEditor";
import Modal from "@/components/Modal";
import VariableModal from "@/components/Editors/VariableModal";
import TabNavigation from "@/components/TabNavigation";
import RightPanel from "@/components/RightPanel";
import ErrorPage from 'next/error';
import {
  shouldShowSaveModal,
  shouldShowSaveVariableModal,
  promptWorkspaceTabs,
} from "@/stores/general";
import { modelStore } from "@/stores/ModelStore";
import { promptStore } from "@/stores/PromptStore";

export default function Home() {
  const { push, query } = useRouter();

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
    addNewPrompt,
    updatePromptObjectInPrompts
  } = promptStore() ?? {};

  const {
    modelListSelector,
    fetchAllModels,
    selectedModeId,
    setModelById,
    modelObject,
    models,
  } = modelStore();

  useEffect(() => {
    const id = query.id as string;
    setPrompt(id);
    setModelById(promptObject.id as string);
    setActiveTabById(id);
  }, [query.id, promptObject.id, setActiveTabById, setModelById, setPrompt]);

  const changeIdInUrl = (newId: string) => {
    const newUrl = `/prompt/${newId}`;
    push(newUrl);
  };

  useEffect(() => {
    // Console log can be commented out or removed in production
    // console.log("Tabs have changed: ", tabs);
  }, [tabs]);

  const removePlaygroundTab = (e: any, id: string) => {
    e.stopPropagation();

    const tab_index = tabs.findIndex((t) => t.prompt_id === id);
    const current = tabs[tab_index].current;

    console.log(id, tab_index, current)

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
        changeIdInUrl(tabs[nextTabIndex].prompt_id);
      }

      console.log("Tabs before removal: ", tabs);
      removeTab(id);
      console.log("Tabs after removal: ", tabs);

      if(redirect) {
        push('/prompts');
      }
    }
  };

  const newPrompt = async () => {
    const newId = await addNewPrompt();
    setActiveTabById(newId as string);
    push(`/prompt/${newId}`);
  };

  return (
    <>
    {(modelObject && promptObject) && (
      <div className="pg-root page-body full-width flush">
        <div className="pg-main">
          <div className="pg-tab-header">
            {/* TABS */}
            <div className="hidden sm:block">
              <TabNavigation 
                tabs={tabs}
                updatePromptObjectInPrompts={updatePromptObjectInPrompts}
                newPrompt={newPrompt}
                removePlaygroundTab={removePlaygroundTab}
              />
            </div>
          </div>
          {(!promptObject.id) && (
            <ErrorPage statusCode={404} />
          )}
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
                <RightPanel
                  toggle_modal={toggle_modal}
                  modelListSelector={modelListSelector}
                  selectedModeId={selectedModeId}
                  setModelById={setModelById}
                  modelObject={modelObject}
                  promptObject={promptObject}
                  setPromptInformation={setPromptInformation}
                />
          </div>
          )}
        </div>
    </div>
    )}
    </>
  );
  
}
