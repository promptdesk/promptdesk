import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { promptStore } from '@/stores/PromptStore';
import { modelStore } from '@/stores/ModelStore';
import { promptWorkspaceTabs } from '@/stores/TabStore';
import PlaygroundButton from '@/components/Form/PlaygroundButton';
import { Prompt } from '@/interfaces/prompt';
import PromptsTable from '@/components/Table/PromptsTable';
import Head from "next/head";

export default function PromptsPage() {
  const { push } = useRouter();
  var { prompts, addNewPrompt } = promptStore();
  const { setActiveTabById } = promptWorkspaceTabs();
  const { models } = modelStore();
  const [promptList, setPromptList] = useState<Prompt[]>([]);
  const [query, setQuery] = useState<string>('');
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

  const search = (query:string) => {
    //combine name, description, model_type, and model into one string and filter based on query
    const filteredList = promptList.filter((prompt) => {
      const promptString = `${prompt.name} ${prompt.description} ${prompt.model_type} ${prompt.model}`;
      return promptString.toLowerCase().includes(query.toLowerCase());
    });

    setFilteredList(filteredList);
  }

  const newPrompt = async () => {
    const newId = await addNewPrompt();
    setActiveTabById(newId as string);
    push(`/workspace/${newId}`);
  };

  return (
    <div className="page-body full-width flush">
      <Head>
        <title>Prompts - PromptDesk</title>
      </Head>
      <div className="pg-header">
        <div className="pg-header-section pg-header-title flex justify-between">
          <h1 className="pg-page-title">Prompts</h1>
          <div>
            <input type="text" className="pg-input" placeholder="Search prompts" onChange={(e) => {setQuery(e.target.value); search(e.target.value)}} />
            <PlaygroundButton text="New prompt" onClick={newPrompt} />
          </div>
        </div>
      </div>
        <div className="app-page">
          <p>
            A list of all prompts, including their model and description.
          </p>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <PromptsTable promptList={query.length > 0 ? filteredList : promptList} />
                {(query.length > 0 && filteredList.length === 0) ? <p>No prompt was found for your search.</p> : null}
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}