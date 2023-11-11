import React, { useEffect, useState } from 'react';
import { Variable } from '@/interfaces/variable'; // Import your Variable interface
import { variableStore } from '@/stores/VariableStore';
import { organizationStore } from '@/stores/OrganizationStore';
import PlaygroundButton from '@/components/Form/PlaygroundButton';
import EnvVariableModal from '@/components/Modals/EnvVariableModal';
import { shouldShowEnvVariableModal } from '@/stores/GeneralStore';
import VariablesTable from '@/components/Table/VariablesTable';
import OrganizationTable from '@/components/Table/OrganizationTable';

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
      const updatedList = prevList.filter((_, i) => i !== index);
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
      <div className="pg-header">
        <div className="pg-header-section pg-header-title">
          <h1 className="pg-page-title">Settings</h1>
        </div>
      </div>
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
              { organization && (
                <OrganizationTable organization={organization} />
              )}
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
              <VariablesTable 
                variableList={variableList}
                editingIndex={editingIndex}
                editedName={editedName}
                editedValue={editedValue}
                setEditedName={setEditedName}
                setEditedValue={setEditedValue}
                handleEditClick={handleEditClick}
                handleSave={handleSave}
                handleDeleteClick={handleDeleteClick}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}