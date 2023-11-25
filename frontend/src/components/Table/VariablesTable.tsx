import React from 'react';
import { Variable } from '@/interfaces/variable';
import PlaygroundButton from '@/components/Form/PlaygroundButton';
import EditButton from '@/components/Form/EditButton';
import DeleteButton from '@/components/Form/DeleteButton';

interface VariablesTableProps {
  variableList: Variable[];
  editingIndex: number | null;
  editedName: string;
  editedValue: string;
  setEditedName: React.Dispatch<React.SetStateAction<string>>;
  setEditedValue: React.Dispatch<React.SetStateAction<string>>;
  handleEditClick: (index: number, variable: Variable) => void;
  handleSave: () => void;
  handleDeleteClick: (index: number) => void;
}

const VariablesTable: React.FC<VariablesTableProps> = ({
  variableList,
  editingIndex,
  editedName,
  editedValue,
  setEditedName,
  setEditedValue,
  handleEditClick,
  handleSave,
  handleDeleteClick,
}) => {
  return (
    <table className="min-w-full divide-y divide-gray-300">
      <thead>
        <tr>
          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0" style={{width:'200px'}}>
            Name
          </th>
          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
            Value
          </th>
          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0 text-left" style={{width:'100px'}}>
            Action
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {variableList.map((variable, index) => (
          <tr key={index}>
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
              {editingIndex === index ? (
                <input
                  type="text"
                  value={editedName}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => setEditedName(e.target.value)}
                />
              ) : (
                variable.name
              )}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {editingIndex === index ? (
                <input
                  type="text"
                  value={editedValue}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => setEditedValue(e.target.value)}
                />
              ) : variable.value.length <= 4 ? (
                variable.value
              ) : (
                ".".repeat(Math.max(0, 20 - Math.min(4, variable.value.length))) + variable.value.slice(-4)
              )}
            </td>
            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 flex">
              {editingIndex === index ? (
                <div>
                  <PlaygroundButton text="Save" onClick={handleSave} />
                </div>
              ) : (
                <div className="flex">
                  <div aria-haspopup="true" aria-expanded="false">
                    <EditButton onClick={() => {
                      handleEditClick(index, variable)
                    }} />
                  </div>
                  <div aria-haspopup="true" aria-expanded="false">
                    <DeleteButton onClick={() => handleDeleteClick(index)} />
                  </div>
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default VariablesTable;