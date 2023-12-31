import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { promptStore } from '@/stores/PromptStore';
import { modelStore } from '@/stores/ModelStore';
import { promptWorkspaceTabs } from '@/stores/TabStore';
import PlaygroundButton from '@/components/Form/PlaygroundButton';
import { Prompt } from '@/interfaces/prompt';
import PromptsTable from '@/components/Table/PromptsTable';
import Head from "next/head";
import InputField from '@/components/Form/InputField';
import Link from 'next/link';

export default function PromptsPage() {
  const { push, query } = useRouter();
  var { prompts, addNewPrompt } = promptStore();
  const { setActiveTabById } = promptWorkspaceTabs();
  const { models } = modelStore();
  const [promptList, setPromptList] = useState<Prompt[]>([]);
  const [searchQuery, setQuery] = useState<string>('');
  const [filteredList, setFilteredList] = useState<Prompt[]>([]);

  useEffect(() => {
    const fetchPrompts = async () => {
      const promptList = await Promise.all(
        JSON.parse(JSON.stringify(prompts)).map(async (prompt:Prompt) => {
          const model = models.find((model) => model.id === prompt.model);
          if (model) {
            prompt.model = model.name;
            prompt.model_type = model.type;
          }
          return prompt;
        })
      );
      setPromptList(promptList);
    };

    fetchPrompts();
  }, [prompts, models]);

  console.log(promptList);

  const search = (searchQuery:string) => {
    //combine name, description, model_type, and model into one string and filter based on searchQuery
    const filteredList = promptList.filter((prompt) => {
      const promptString = `${prompt.name} ${prompt.description} ${prompt.model_type} ${prompt.model}`;
      return promptString.toLowerCase().includes(searchQuery.toLowerCase());
    });

    setFilteredList(filteredList);
  }

  const newPrompt = async () => {
    const newId = await addNewPrompt();
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
            const newId = await addNewPrompt(prompt);
            setActiveTabById(newId as string);
            push(`/workspace/${newId}`);
          }
        };
        reader.readAsText(file);
      }
    };
    element.click();
  }

  return (
    <div className="page-body full-width flush">
      <Head>
        <title>Prompts - PromptDesk</title>
      </Head>
      <div className="pg-header">
        <div className="pg-header-section pg-header-title flex justify-between">
          <h1 className="pg-page-title">Prompts</h1>
          <div className="flex">
            <InputField
              placeholder="Search prompts"
              onInputChange={(value) => {setQuery(value); search(value)}}
            />
            <PlaygroundButton text="New prompt" onClick={newPrompt} />
            <PlaygroundButton text="Import" onClick={importJsonPrompt} />
          </div>
        </div>
      </div>
        <div className="app-page">
          <p className="text-lg">
            <Link href="/prompts/all"><span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">All Prompts</span></Link>
            {query.path !== "all" && query.path !== "undefined" && query.path !== undefined &&
              <>
              &nbsp;&nbsp;&gt; &nbsp;&nbsp;
              <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">{query.path}</span>
              </>
            }
          </p>
          <div className="mt-2 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <PromptsTable promptList={searchQuery.length > 0 ? filteredList : promptList} />
                {(searchQuery.length > 0 && filteredList.length === 0) ? <p>No prompt was found for your search.</p> : null}
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}