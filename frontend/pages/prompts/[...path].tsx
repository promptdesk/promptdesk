import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { promptStore } from "@/stores/prompts";
import { modelStore } from "@/stores/ModelStore";
import { tabStore } from "@/stores/TabStore";
import PlaygroundButton from "@/components/Form/PlaygroundButton";
import { Prompt } from "@/interfaces/prompt";
import Head from "next/head";
import InputField from "@/components/Form/InputField";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import PromptsTableTempporaryRefactor from "@/components/Table/PromptsTableTemporaryRefactor";

const getPath = (query: { path?: string[] | string }): string => {
  const { path } = query;
  if (!path || !Array.isArray(path)) return "";
  if (!path.length || path[0] === "all") return "";
  return path.join("/");
};

export default function PromptsPage() {
  const { push, query, isReady } = useRouter();
  var { prompts, createLocalPrompt } = promptStore();
  const { setActiveTabById } = tabStore();
  const { models } = modelStore();
  const [promptList, setPromptList] = useState<Prompt[]>([]);
  const [searchQuery, setQuery] = useState<string>("");
  const [filteredList, setFilteredList] = useState<Prompt[]>([]);

  useEffect(() => {
    const fetchPrompts = async () => {
      let promptList = await Promise.all(
        JSON.parse(JSON.stringify(prompts)).map(async (prompt: Prompt) => {
          const model = models.find((model) => model.id === prompt.model);
          if (model) {
            prompt.model = model.name;
            prompt.model_type = model.type;
            prompt.provider = model.provider;
          }
          return prompt;
        }),
      );
      //only include prompts where prompt.new is undefined or false
      promptList = promptList.filter((prompt) => !prompt.new);
      setPromptList(promptList);
    };

    fetchPrompts();
  }, [prompts, models]);

  if (!isReady) return null;

  const targetPath = query.pa;

  const search = (searchQuery: string) => {
    //combine name, description, model_type, and model into one string and filter based on searchQuery
    let filteredList = promptList.filter((prompt) => {
      const promptString = `${prompt.name} ${prompt.description} ${prompt.model_type} ${prompt.model}`;
      return promptString.toLowerCase().includes(searchQuery.toLowerCase());
    });
    filteredList = filteredList.filter((prompt) => !prompt.new);

    setFilteredList(filteredList);
  };

  const newPrompt = async () => {
    const newId = await createLocalPrompt(getPath({ path: query.path }));
    setActiveTabById(newId as string);
    push(`/workspace/${newId}`);
  };

  const importJsonPrompt = () => {
    const element = document.createElement("input");
    element.type = "file";
    element.accept = ".json";
    element.onchange = async () => {
      const file = element.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const text = e.target?.result;
          if (text) {
            const prompt = JSON.parse(text as string) as any;
            prompt.new = true;
            if (prompt.notes) {
              alert(prompt.notes);
            }
            const newId = await createLocalPrompt(
              getPath({ path: query.path }),
              prompt,
            );
            setActiveTabById(newId as string);
            push(`/workspace/${newId}`);
          }
        };
        reader.readAsText(file);
      }
    };
    element.click();
  };

  return (
    <div className="page-body full-width flush">
      <Head>
        <title>Prompts - PromptDesk</title>
      </Head>
      <div className="pg-header">
        <div className="pg-header-section pg-header-title flex justify-between">
          <h1 className="pg-page-title">Prompts</h1>
          <div className="flex space-x-2">
            <InputField
              placeholder="Search prompts"
              onInputChange={(value) => {
                setQuery(value);
                search(value);
              }}
            />
            <PlaygroundButton text="New prompt" onClick={newPrompt} />
            <PlaygroundButton text="Import" onClick={importJsonPrompt} />
          </div>
        </div>
      </div>
      <div className="app-page">
        <Breadcrumbs path={(query.path as string[])?.join("/") || ""} />
        <div className="mt-2 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <PromptsTableTempporaryRefactor
                promptList={searchQuery.length > 0 ? filteredList : promptList}
              />
              {searchQuery.length > 0 && filteredList.length === 0 ? (
                <p>No prompt was found for your search.</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
