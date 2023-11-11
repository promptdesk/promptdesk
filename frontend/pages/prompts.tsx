import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { promptStore } from '@/stores/PromptStore';
import { modelStore } from '@/stores/ModelStore';
import { promptWorkspaceTabs } from '@/stores/TabStore';
import PlaygroundButton from '@/components/Form/PlaygroundButton';
import { Prompt } from '@/interfaces/prompt';
import PromptsTable from '@/components/Table/PromptsTable';

export default function About() {
  const { push } = useRouter();
  var { prompts, addNewPrompt } = promptStore();
  const { setActiveTabById } = promptWorkspaceTabs();
  const { models } = modelStore();
  const [promptList, setPromptList] = useState<Prompt[]>([]);

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

  const newPrompt = async () => {
    const newId = await addNewPrompt();
    setActiveTabById(newId as string);
    push(`/workspace/${newId}`);
  };

  return (
    <div className="page-body full-width flush">
      <div className="pg-header">
        <div className="pg-header-section pg-header-title flex justify-between">
          <h1 className="pg-page-title">Prompts</h1>
          <PlaygroundButton text="New prompt" onClick={newPrompt} />
        </div>
      </div>
        <div className="app-page">
          <p>
            A list of all prompts, including their model and description.
          </p>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <PromptsTable promptList={promptList} />
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}