import React, { use, useEffect, useState } from "react";
import { Prompt } from "@/interfaces/prompt";
import Folder from "../Icons/Folder";
import { useRouter } from "next/router";
import _ from "lodash";

interface PromptsTableProps {
  promptList: Prompt[];
}

interface IFolder {
  displayName: string;
  link: string;
}

const HOME_PATH = "undefined";

const PromptsTableTempporaryRefactor: React.FC<PromptsTableProps> = ({
  promptList,
}) => {
  const { push, query, isReady } = useRouter();

  if (!isReady && !query.path) return null;

  let completePath = (query.path as string[]).join("/");
  completePath = completePath === "all" ? "undefined" : completePath;
  const level = query.path?.length || 0;
  const paths = query.path || [];

  const prompts = promptList.filter((prompt) => {
    if (completePath === HOME_PATH) {
      return !prompt.project;
    } else {
      const currSubProject = paths.slice(-1)[0];
      const propmpProj = prompt.project?.split("/").pop();
      return propmpProj === currSubProject;
    }
  });

  const folders: IFolder[] = _.uniqBy(
    promptList
      .filter((prompt) => {
        if (!prompt.project) return false;
        const projSplit = prompt.project.split("/");
        if (completePath === HOME_PATH) {
          return projSplit.length === level;
        }
        return (
          projSplit.length === level + 1 &&
          projSplit[level - 1] === paths[level - 1]
        );
      })
      .map((prompt) => ({
        displayName: prompt.project?.split("/").pop() || "",
        link: prompt.project || "",
      })),
    (folder) => folder.displayName,
  );

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
        {prompts.map((prompt: any) => (
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
        ))}
        {folders.map((folder) => (
          <tr
            key={folder.displayName}
            onClick={() => {
              push(`/prompts/${folder.link}`);
            }}
            className="cursor-pointer"
          >
            <td
              className="whitespace-nowrap w-full py-4 px-4 text-sm text-gray-500 bg-gray-100 hover:bg-gray-200"
              colSpan={5}
            >
              <div className="flex">
                <Folder /> <span className="ml-2">{folder.displayName}</span>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PromptsTableTempporaryRefactor;
