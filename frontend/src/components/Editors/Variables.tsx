import React, { useEffect, useState } from 'react';
import { promptStore } from '@/stores/PromptStore';
import EditorFooter from './Components/EditorFooter';
import GeneratedOutput from './Components/GeneratedOutput';
import VariableModal from '@/components/Editors/VariableModal';
import Handlebars from 'handlebars';
import { shouldShowSaveVariableModal } from "@/stores/general";

const Variables = () => {

    const { promptObject, setPromptInformation, setPromptVariables } = promptStore();

    const { show_variable_modal, toggle_variable_modal } = shouldShowSaveVariableModal();

    const [promptVariableData, setPromptVariableData] = useState(promptObject.prompt_variables || {});

    useEffect(() => {
        setPromptVariableData(promptObject.prompt_variables || {});
    }, [promptObject.prompt_variables]);


  return (
    <>
        {show_variable_modal && <VariableModal />}
        <div>
            {Object.keys(promptVariableData).map((variable, index) => (
                <span
                    key={index}
                    onClick={() => toggle_variable_modal(variable)}
                    className="cursor-pointer inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200 mr-1 mb-2"
                >
                    <svg className={`h-1.5 w-1.5 ${promptVariableData[variable].value === "" ? 'fill-red-500' : 'fill-green-500'}`} viewBox="0 0 6 6" aria-hidden="true">
                        <circle cx={3} cy={3} r={3} />
                    </svg>
                    {variable}
                </span>
            ))}
        </div>
    </>
  );
};

export default Variables;