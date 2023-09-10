import React, { useEffect, useState } from "react";
import { promptStore } from "@/stores/PromptStore";
import { modelStore } from "@/stores/ModelStore";
import { promptWorkspaceTabs } from "@/stores/general";
import PlaygroundButton from "@/components/Form/PlaygroundButton";
import Link from "next/link";
import { useRouter } from 'next/router';


export default function About() {
  const { push } = useRouter();
  // Prompt Store related state and functions
  const {
    promptListSelector,
    fetchAllPrompts,
    setPrompt,
    setPromptInformation,
    promptObject,
    selectedPromptIndex,
    prompts,
    defaultPrompt,
    addNewPrompt
  } = promptStore();

  const {
    setActiveTabById
  } = promptWorkspaceTabs();

  const [promptList, setPromptList] = useState([]);

  // Model Store related state and functions
  const {
    modelListSelector,
    fetchAllModels,
    selectedModeId,
    setModelById,
    modelObject,
    models
  } = modelStore();

    // Fetch models and set initial state on component mount
    useEffect(() => {
      //loop through all prompts and console.log them
      //fetchAllPrompts();
      //fetchAllModels();

      var prompt_list = []
      var model_list = []    
      
      for (let i = 0; i < prompts.length; i++) {
        prompt_list.push(prompts[i]);
      }

      for (let i = 0; i < models.length; i++) {
        model_list.push(models[i]);
      }

      //for each prompt in prompt_list, find the model that matches the model_id
      for (let i = 0; i < prompt_list.length; i++) {
        for (let j = 0; j < model_list.length; j++) {
          if (prompt_list[i].model === model_list[j].id) {
            prompt_list[i].model_name = model_list[j].name;
            prompt_list[i].model_type = model_list[j].type;
          }
        }
      }

      setPromptList(prompt_list);
      
    }, []);

    const newPrompt = async () => {

      const newId = await addNewPrompt();
      setActiveTabById(newId);
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
              <PlaygroundButton
                text="New prompt"
                onClick={() => {newPrompt()}}
              />
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
                      {/*<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Role
                      </th>*/}
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {promptList.filter((prompt: any) => !prompt.new).map((prompt:any) => (
                      <tr key={prompt.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                          {prompt.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{prompt.description}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{prompt.model_type}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{prompt.model_name}</td>
                        {/*<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.role}</td>*/}
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
      )
  }