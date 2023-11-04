import React, { useEffect } from "react";
import { useRouter } from 'next/router';
import {promptWorkspaceTabs} from "@/stores/TabStore";

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
