import React from 'react';
import Link from 'next/link';
import { Prompt } from '@/interfaces/prompt';

interface PromptsTableProps {
  promptList: Prompt[];
}

const PromptsTable: React.FC<PromptsTableProps> = ({ promptList }) => {
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
                <Link href={`/workspace/${prompt.id}`} className="text-indigo-600 hover:text-indigo-900">
                  Edit Prompt
                </Link>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default PromptsTable;