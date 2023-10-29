import React, { useEffect, useState } from 'react';
import { Variable } from '@/interfaces/variable'; // Import your Variable interface
import { variableStore } from '@/stores/VariableStore';
import { organizationStore } from '@/stores/OrganizationStore';
import PlaygroundButton from '@/components/Form/PlaygroundButton';
import EditButton from '@/components/Form/EditButton';
import DeleteButton from '@/components/Form/DeleteButton';
import EnvVariableModal from '@/components/Editors/EnvVariableModal';
import { shouldShowEnvVariableModal } from '@/stores/GeneralStore';

export default function VariablesPage() {

  const { show_env_variable_modal, toggle_env_variable_modal } = shouldShowEnvVariableModal();
  const { variables, fetchVariables, updateVariables } = variableStore();
  const { organization, fetchOrganization } = organizationStore();
  
  const [variableList, setVariableList] = useState<Variable[]>([]);

  useEffect(() => {
    fetchVariables();
    fetchOrganization();
  }, [fetchVariables, fetchOrganization]);
  
  useEffect(() => {
    // This will be called whenever `variables` changes
    setVariableList(variables);
  }, [variables]);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedName, setEditedName] = useState<string>('');
  const [editedValue, setEditedValue] = useState<string>('');

  const handleEditClick = (index: number, variable: Variable) => {
    setEditingIndex(index);
    setEditedName(variable.name);
    setEditedValue(variable.value);
  };

  const handleSave = async () => {
    if (editingIndex !== null) {
      setVariableList(prevList => {
        const updatedList = [...prevList];
        updatedList[editingIndex] = {
          ...updatedList[editingIndex],
          name: editedName,
          value: editedValue,
        };
        updateVariables(updatedList);
        return updatedList;
      });
      
      setEditingIndex(null);
      setEditedName('');
      setEditedValue('');
    }
  };

  const handleDeleteClick = (index: number) => {
    setVariableList(prevList => {
      // Create a copy of the previous variableList excluding the element at the specified index
      const updatedList = prevList.filter((_, i) => i !== index);
  
      // Call updateVariables with the updated list
      updateVariables(updatedList);
  
      return updatedList;
    });
  };
  

  return (
    <div>
      {/* only show EnvVariableModal if show_env_variable_modal is true */}
      {show_env_variable_modal &&
        <EnvVariableModal/>
      }
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">PromptDesk API Information</h1>
            <p className="mt-2 text-sm text-gray-700">
            Use these credentials to access the PromptDesk API.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          </div>
        </div>

        <div className="mt-2 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0" style={{width:'300px'}}>
                      Organization
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Description
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0 text-left" style={{width:'100px'}}>
                      API key
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {organization?.keys.map((variable, index) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {organization.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {variable.description}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 flex">
                        {variable.key}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>



        <div className="sm:flex sm:items-center mt-8">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">Environment Variables</h1>
            <p className="mt-2 text-sm text-gray-700">
            Your secret API keys are listed below. Do not share your API key with others, or expose it in the browser or other client-side code. 
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <PlaygroundButton text="Create new secret key" onClick={() => {toggle_env_variable_modal()}} />
          </div>
        </div>
        <div className="mt-2 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
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
                            <PlaygroundButton text="Save" onClick={() => handleSave()} />
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}