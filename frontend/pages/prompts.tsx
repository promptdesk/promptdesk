import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { promptStore } from '@/stores/PromptStore';
import { modelStore } from '@/stores/ModelStore';
import { promptWorkspaceTabs } from '@/stores/general';
import PlaygroundButton from '@/components/Form/PlaygroundButton';
import Link from 'next/link';
import { Prompt } from '@/interfaces/prompt';

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
    push(`/prompt/${newId}`);
  };

  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">Prompts</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all prompts, including their model and description.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <PlaygroundButton text="New prompt" onClick={newPrompt} />
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Description
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Type
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Model
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {promptList
                    .filter((prompt) => !prompt.new)
                    .map((prompt) => (
                      <tr key={prompt.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                          {prompt.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{prompt.description}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{prompt.model_type}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{prompt.model}</td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                          <Link href={`/prompt/${prompt.id}`} className="text-indigo-600 hover:text-indigo-900">
                            Edit Prompt
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
