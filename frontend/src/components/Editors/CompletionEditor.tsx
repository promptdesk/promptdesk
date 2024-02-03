import React, { useEffect, useState } from 'react';
import { promptStore, setPromptVariables, processVariables } from '@/stores/prompts';
import EditorFooter from '@/components/Editors/EditorFooter';
import GeneratedOutput from '@/components/Editors/Completion/GeneratedOutput';
import Variables from '@/components/Editors/Variables';
import {ParsingError} from "@/components/Editors/ParsingError";
import EnvironmentVariableWarning from './EnvironmentVariableWarning';

function Editor() {
    const { promptObject, updateLocalPromptValues, parsingError } = promptStore();
    const [promptVariableData, setPromptVariableData] = useState(promptObject.prompt_variables || {});

    useEffect(() => {
        setPromptVariableData(promptObject.prompt_variables || {});
    }, [promptObject.prompt_variables]);

    useEffect(() => {
        processVariables(promptObject.prompt_data.prompt);
    }, [processVariables, promptObject.prompt_data.prompt]);

    const handleInputChange = (e:any) => {
        const inputValue = e.currentTarget.value;
        updateLocalPromptValues('prompt_data.prompt', inputValue);
        //processVariables(promptObject.prompt_data.prompt);
    };

    return (
        <div className="flex flex-col">
            <EnvironmentVariableWarning />
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
                                    onChange={handleInputChange}
                                    onKeyDown={handleInputChange}
                                    onKeyUp={handleInputChange}
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
            <ParsingError error={parsingError} />
            <EditorFooter />
        </div>
    );
}

export default Editor;
