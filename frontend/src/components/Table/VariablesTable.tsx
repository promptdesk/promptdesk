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
          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0" style={{width:'300px'}}>
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
                  onChange={(e) => setEditedValue(e.target.value)}
                />
              ) : variable.value.length <= 4 ? (
                variable.value
              ) : (
                ".".repeat(variable.value.length - 4) + variable.value.substring(variable.value.length - 4)
              )}
            </td>
            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 flex">
              {editingIndex !== null ? (
                <div>
                  <PlaygroundButton text="Save" onClick={handleSave} />
                </div>
              ) : (
                <div className="flex">
                  <div aria-haspopup="true" aria-expanded="false">
                    <EditButton onClick={() => handleEditClick(index, variable)} />
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