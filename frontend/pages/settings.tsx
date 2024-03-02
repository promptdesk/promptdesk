import React, { useEffect, useState } from "react";
import { Variable } from "@/interfaces/variable"; // Import your Variable interface
import { variableStore } from "@/stores/VariableStore";
import { organizationStore } from "@/stores/OrganizationStore";
import PlaygroundButton from "@/components/Form/PlaygroundButton";
import EnvVariableModal from "@/components/Modals/EnvVariableModal";
import { shouldShowCreateUserModal, shouldShowEnvVariableModal } from "@/stores/ModalStore";
import VariablesTable from "@/components/Table/VariablesTable";
import CreateUserModal from "@/components/Modals/CreateUserModal"
import OrganizationTable from "@/components/Table/OrganizationTable";
import Head from "next/head";
import UsersTable from "@/components/Table/UsersTable";
import { userStore } from "@/stores/UserStore";

export default function VariablesPage() {
  const { show_env_variable_modal, toggle_env_variable_modal } =
    shouldShowEnvVariableModal();
  const { show_create_user_modal, toggle_create_user_modal } = shouldShowCreateUserModal()
  const { variables, fetchVariables, updateVariables } = variableStore();
  const { organization, fetchOrganization } = organizationStore();
  const [variableList, setVariableList] = useState<Variable[]>([]);

  const [serviceURL, setServiceURL] = useState(
    process.env.PROMPT_SERVER_URL || window.location.origin,
  );

  useEffect(() => {
    fetchVariables();
    fetchOrganization();
  }, [fetchVariables, fetchOrganization]);

  useEffect(() => {
    // This will be called whenever `variables` changes
    setVariableList(variables);
  }, [variables]);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedName, setEditedName] = useState<string>("");
  const [editedValue, setEditedValue] = useState<string>("");

  const handleEditClick = (index: number, variable: Variable) => {
    setEditingIndex(index);
    setEditedName(variable.name);
    setEditedValue(variable.value);
  };

  const handleSave = async () => {
    if (editingIndex !== null) {
      setVariableList((prevList) => {
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
      setEditedName("");
      setEditedValue("");
    }
  };

  const handleDeleteClick = (index: number) => {
    setVariableList((prevList) => {
      const updatedList = prevList.filter((_, i) => i !== index);
      updateVariables(updatedList);
      return updatedList;
    });
  };

  return (
    <div className="page-body full-width flush">
      <Head>
        <title>Settings - PromptDesk</title>
      </Head>
      {/* only show EnvVariableModal if show_env_variable_modal is true */}
      {show_env_variable_modal && <EnvVariableModal />}
      {show_create_user_modal && <CreateUserModal />}
      <div className="pg-header">
        <div className="pg-header-section pg-header-title">
          <h1 className="pg-page-title">Settings</h1>
        </div>
      </div>
      <div className="app-page-content">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Organization Information and Credentials
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Use these credentials to access the PromptDesk API.
              <br />
              <br />
              Your service URL is:{" "}
              <InputField value={serviceURL} disabled={true} />
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none"></div>
        </div>

        <div className="mt-2 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              {organization && (
                <OrganizationTable organization={organization} />
              )}
            </div>
          </div>
        </div>

        <div className="sm:flex sm:items-center mt-8">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Environment Variables
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Your secret API keys are listed below. Do not share your API key
              with others, or expose it in the browser or other client-side
              code.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <PlaygroundButton
              text="Create new secret key"
              onClick={() => {
                toggle_env_variable_modal();
              }}
            />
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
        <div className="sm:flex sm:items-center mt-8">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Users
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage users within your organization
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <PlaygroundButton
              text="Add user"
              onClick={() => {
                toggle_create_user_modal();
              }}
            />
          </div>
        </div>
        <div className="mt-2 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <UsersTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
