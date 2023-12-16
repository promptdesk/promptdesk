import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Prompt } from '@/interfaces/prompt';
import Folder from '../Icons/Folder';
import { useRouter } from 'next/router';
import { set } from 'lodash';

interface PromptsTableProps {
  promptList: Prompt[];
}

const PromptsTable: React.FC<PromptsTableProps> = ({ promptList }) => {

  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [project, setProject] = useState<string>("undefined");

  const { push, query } = useRouter();

  useEffect(() => {
    const path = query.path as string;
    console.log(path, project)
    if (path === "all") {
      setPrompts(promptList);
      setProject("undefined");
    } else {
      setProject(path);
    }

    let keyless = {};
  
    const promptLista = promptList.reduce((r, a) => {
      // Ensure the key is not undefined, or use a default value (like an empty string)
      const key = a.project || "undefined";
  
      // Now we are sure that key is not undefined
      (r as any)[key] = [...((r as any)[key] || []), a];
      return r;

    }, keyless);

    console.log(promptLista)
  
    setPrompts(promptLista as any);
  }, [promptList, query]);
    
  return (
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
        {Object.keys(prompts).map((project_key) => (
          <>
            {((project_key !== "undefined" && project == "undefined") || ((project == "undefined") && project_key !== "undefined")) &&
              <tr onClick={() => {push(`/prompts/${project_key}`)}} className="cursor-pointer">
                <td className="whitespace-nowrap w-full py-4 px-4 text-sm text-gray-500 bg-gray-100" colSpan={5}>
                  <div className="flex"><Folder/> <span className="ml-2">{project_key}</span></div>
                </td>
              </tr>
            }
            {(prompts as any)[project_key].map((prompt:any) => (
              project_key !== project ? null : (
                <tr key={prompt.id}>
                  <td className="whitespace-nowrap py-4 px-4 text-sm font-medium text-gray-900">
                    {prompt.name}
                  </td>
                  <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-500">{prompt.description}</td>
                  <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-500">{prompt.model_type}</td>
                  <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-500">{prompt.model}</td>
                  <td className="relative whitespace-nowrap py-2 px-2 text-right text-sm font-medium">
                    <Link href={`/workspace/${prompt.id}`} className="text-indigo-600 hover:text-indigo-900 mr-2">
                      Edit Prompt
                    </Link>
                    <Link href={`/workspace/${prompt.id}/samples`} className="text-indigo-600 hover:text-indigo-900">
                      Samples
                    </Link>
                  </td>
                </tr>
              )
            ))}
          </>
        ))}
      </tbody>
    </table>
  );
};

export default PromptsTable;