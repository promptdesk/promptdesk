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
} from "@/stores/GeneralStore";
import {promptWorkspaceTabs} from "@/stores/TabStore";
import { modelStore } from "@/stores/ModelStore";
import { promptStore } from "@/stores/PromptStore";

export default function Home() {
  const { push, query } = useRouter();

  const {
    findActiveTab,
    tabs
  } = promptWorkspaceTabs();

  useEffect(() => {
    let activeTab = findActiveTab();
    if (!activeTab && tabs.length > 0) {
      activeTab = tabs[0]
    }
    if (activeTab) {
      changeIdInUrl(activeTab.prompt_id)
    } else {
      push('/prompts')
    }
  }, [findActiveTab])


  const changeIdInUrl = (newId: string) => {
    const newUrl = `/workspace/${newId}`;
    push(newUrl);
  };

  return (
    <>
    </>
  );
  
}
