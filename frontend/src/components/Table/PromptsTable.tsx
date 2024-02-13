import React, { use, useEffect, useState } from "react";
import { Prompt } from "@/interfaces/prompt";
import Folder from "../Icons/Folder";
import { useRouter } from "next/router";

interface PromptsTableProps {
  promptList: Prompt[];
}

const PromptsTable: React.FC<PromptsTableProps> = ({ promptList }) => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [project, setProject] = useState<string>("undefined");

  const { push, query } = useRouter();

  useEffect(() => {
    const path = query.path as string;
    if (path === "all") {
      setPrompts(promptList);
      setProject("undefined");
    } else {
      setProject(path);
    }

    let keyless = {};

    let promptLista: any = promptList.reduce((r, a) => {
      // Ensure the key is not undefined, or use a default value (like an empty string)
      const key = a.project || "undefined";

      // Now we are sure that key is not undefined
      (r as any)[key] = [...((r as any)[key] || []), a];
      return r;
    }, keyless);

    // Sort prompts with undefined project at bottom
    promptLista = Object.keys(promptLista)
      .sort()
      .reverse()
      .reduce((obj: any, key) => {
        obj[key] = promptLista[key];
        return obj;
      }, {});

    setPrompts(promptLista as any);
  }, [promptList, query]);

  return (
    <table className="min-w-full divide-y divide-gray-300">
      <thead>
        <tr>
          <th
            scope="col"
            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
          >
            Name
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
          >
            Description
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
          >
            Type
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
          >
            Model
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
          >
            Provider
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {Object.keys(prompts).map((project_key) => (
          <>
            {((project_key !== "undefined" && project == "undefined") ||
              (project == "undefined" && project_key !== "undefined")) && (
              <tr
                onClick={() => {
                  push(`/prompts/${project_key}`);
                }}
                className="cursor-pointer"
              >
                <td
                  className="whitespace-nowrap w-full py-4 px-4 text-sm text-gray-500 bg-gray-100 hover:bg-gray-200"
                  colSpan={5}
                >
                  <div className="flex">
                    <Folder /> <span className="ml-2">{project_key}</span>
                  </div>
                </td>
              </tr>
            )}
            {(prompts as any)[project_key].map((prompt: any) =>
              project_key !== project || prompt.new === true ? null : (
                <tr
                  key={prompt.id}
                  onClick={() => {
                    push(`/workspace/${prompt.id}`);
                  }}
                  className="cursor-pointer hover:bg-gray-50"
                  id={prompt.name}
                >
                  <td className="whitespace-nowrap py-4 px-4 text-sm font-medium text-gray-900">
                    {prompt.name}
                  </td>
                  <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-500">
                    {prompt.description}
                  </td>
                  <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-500">
                    {prompt.model_type}
                  </td>
                  <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-500">
                    {prompt.model}
                  </td>
                  <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-500">
                    {prompt.provider}
                  </td>
                </tr>
              ),
            )}
          </>
        ))}
      </tbody>
    </table>
  );
};

export default PromptsTable;
