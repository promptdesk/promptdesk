import React, { useEffect, useState } from 'react';
import { promptStore } from '@/stores/PromptStore';
import EditorFooter from './Components/EditorFooter';
import GeneratedOutput from './Components/GeneratedOutput';
import VariableModal from '@/components/Editors/VariableModal';
import Variables from '@/components/Editors/Variables';
import Handlebars from 'handlebars';
import { shouldShowSaveVariableModal } from "@/stores/general";

function Editor() {
    const { promptObject, setPromptInformation, setPromptVariables } = promptStore();
    const [promptVariableData, setPromptVariableData] = useState(promptObject.prompt_variables || {});

    useEffect(() => {
        setPromptVariableData(promptObject.prompt_variables || {});
    }, [promptObject.prompt_variables]);

    useEffect(() => {
        processVariables(promptObject.prompt_data.prompt);
    }, []);

    function processVariables(inputValue:string) {
        try {
            const ast = Handlebars.parse(inputValue) as any;
            const variables = [...new Set(ast.body.filter((node: { path: any; }) => node.path).map((node: { path: { original: any; }; }) => node.path.original))];

            const newPromptVariableData = variables.reduce((acc:any, variable:any) => {
                acc[variable] = promptVariableData[variable as number] || { type: 'text', value: '' };
                return acc;
            }, {});

            setPromptVariableData(newPromptVariableData);
            setPromptVariables(newPromptVariableData);
        } catch (e) {
            // Handle the error appropriately
        }
    }

    const handleInputChange = (e:any) => {
        const inputValue = e.currentTarget.value;
        setPromptInformation('prompt_data.prompt', inputValue);
        processVariables(inputValue);
    };

    return (
        <div className="flex flex-col">
            <Variables />
            <div className="completions flex-1">
                <div className="editor-container" style={{ cursor: "text", fontSize: 16, height: "100%", boxSizing: "border-box" }}>
                    <div className="editor-wrapper" data-testid="editor-wrapper">
                        <div className="DraftEditor-root">
                            <div className="DraftEditor-editorContainer">
                                <textarea
                                    aria-describedby="placeholder-9ba8j"
                                    className="notranslate public-DraftEditor-content"
                                    role="textbox"
                                    spellCheck="false"
                                    placeholder='Write a tagline for an ice cream shop.'
                                    onInput={handleInputChange}
                                    style={{
                                        outline: "none",
                                        userSelect: "text",
                                        whiteSpace: "pre-wrap",
                                        overflowWrap: "break-word",
                                        width: "100%"
                                    }}
                                    value={promptObject.prompt_data.prompt}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <GeneratedOutput />
            <EditorFooter />
        </div>
    );
}

export default Editor;
