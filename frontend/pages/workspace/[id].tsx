import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import Editor from "@/components/Editors/Editor";
import ChatEditor from "@/components/Editors/ChatEditor";
import Modal from "@/components/Modals/Modal";
import VariableModal from "@/components/Modals/VariableModal";
import TabNavigation from "@/components/TabNavigation";
import RightPanel from "@/components/RightPanel";
import ErrorPage from 'next/error';
import {
  shouldShowSaveModal,
  shouldShowSaveVariableModal,
} from "@/stores/GeneralStore";
import {promptWorkspaceTabs} from "@/stores/TabStore";
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
    removeTabFromTabs,
    findBestNextTab,
    setActiveTab,
    isActiveTab,
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
    const newUrl = `/workspace/${newId}`;
    push(newUrl);
  };

  const removePlaygroundTab = (e: any, id: string) => {
    e.stopPropagation();

    if(isActiveTab(id) && tabs.length > 1) {
      const bestNextTab = findBestNextTab();
      bestNextTab?.prompt_id && changeIdInUrl(bestNextTab.prompt_id);
    }

    var x = removeTabFromTabs(id)?.length
    
    if (x === 0) {
      push("/prompts");
    }

  };

  const newPrompt = async () => {
    const newId = await addNewPrompt();
    setActiveTabById(newId as string);
    setPrompt(newId as string);
    setModelById(newId as string);
    push(`/workspace/${newId}`);
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
                promptObject={promptObject}
              />
            </div>
          </div>
          {(promptObject.id === "") && (
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
