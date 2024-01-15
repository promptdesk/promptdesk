import React, { useEffect } from "react";
import { useRouter } from 'next/router';
import {promptWorkspaceTabs} from "@/stores/TabStore";
import { promptStore } from '@/stores/PromptStore';

export default function WorkspaceHomeRedirector() {
  const { push, query } = useRouter();

  var { prompts, addNewPrompt } = promptStore();

  const {
    findActiveTab,
    setActiveTabById,
    tabs
  } = promptWorkspaceTabs();

  useEffect(() => {
    let activeTab = findActiveTab();
    if (!activeTab && tabs.length > 0) {
      activeTab = tabs[0]
    }
    if (activeTab) {
      changeIdInUrl(activeTab.prompt_id)
    } else if (!activeTab && tabs.length === 0) {
      newPrompt()
    }
  }, [findActiveTab])

  const newPrompt = async () => {
    const newId = await addNewPrompt();
    setActiveTabById(newId as string);
    push(`/workspace/${newId}`);
  };


  const changeIdInUrl = (newId: string) => {
    const newUrl = `/workspace/${newId}`;
    push(newUrl);
  };

  return null;
  
}