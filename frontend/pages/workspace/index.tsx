import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { tabStore } from "@/stores/TabStore";
import { promptStore } from "@/stores/prompts";

export default function WorkspaceHomeRedirector() {
  const { push, query } = useRouter();

  var { prompts, createLocalPrompt } = promptStore();

  const { findActiveTab, setActiveTabById, tabs } = tabStore();

  useEffect(() => {
    let activeTab = findActiveTab();
    if (!activeTab && tabs.length > 0) {
      activeTab = tabs[0];
    }
    if (activeTab) {
      changeIdInUrl(activeTab.prompt_id);
    } else if (!activeTab && tabs.length === 0) {
      newPrompt();
    }
  }, [findActiveTab]);

  const newPrompt = async () => {
    console.log("newPrompt");
    const newId = await createLocalPrompt();
    if (newId === undefined) {
      return;
    }
    setActiveTabById(newId as string);
    push(`/workspace/${newId}`);
  };

  const changeIdInUrl = (newId: string) => {
    console.log("changeIdInUrl");
    const newUrl = `/workspace/${newId}`;
    push(newUrl);
  };

  return null;
}
