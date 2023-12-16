"use client";
import React, {useEffect, useRef, useState} from 'react';
import {promptWorkspaceTabs} from "@/stores/TabStore";
import {generateResultForPrompt} from "@/services/GenerateService";
import CodeModal from "@/components/Modals/CodeModal";
import PlaygroundButton from "@/components/Form/PlaygroundButton";
import { promptStore } from '@/stores/PromptStore';
import { modelStore } from '@/stores/ModelStore';
import {
    shouldShowSaveModal,
    shouldShowCodeModal
} from "@/stores/GeneralStore";
import Link from "next/link";
import {useRouter} from "next/router";
import ModelError from './ModelError';

function EditorFooter() {
    const {push, query} = useRouter();
    const {getDataById, activeTabId, tabs} = promptWorkspaceTabs();
    const {promptObject} = promptStore();
    const {modelObject} = modelStore();
    const [data, setData] = useState(getDataById(activeTabId as string) || {});

    useEffect(() => {
        const data = getDataById(activeTabId as string) || {};
        setData(data);
    }, [activeTabId, getDataById, tabs]);

    const {
        toggle_modal
    } = shouldShowSaveModal();

    const {
        show_code_modal,
        toggle_code_modal
    } = shouldShowCodeModal();

    const goToSamplesPage = () => {
        push(`/workspace/${activeTabId}/samples`);
    }

    function useKey(key:any, cb:any) {
        const callback = useRef(cb);
    
        useEffect(() => {
            callback.current = cb;
        });
    
        useEffect(() => {
            function handle(event:any) {
                if (event.code === key) {
                    callback.current(event);
                } else if (key === 'ctrls' && event.key === 's' && (event.ctrlKey || event.metaKey)) {
                    // This will now work for both Ctrl+S and Command+S
                    event.preventDefault();
                    callback.current(event);
                }
            }
    
            document.addEventListener('keydown', handle);
            return () => document.removeEventListener('keydown', handle);
        }, [key]);
    }    

    useKey('ctrls', () => {
        toggle_modal();
    })

    const exportPrompt = () => {
        //downloadf promptObject as json with name promptObject.name
        const element = document.createElement("a");
        let obj = JSON.parse(JSON.stringify(promptObject, null, 4));
        //remove organization_id, createdAt, updatedAt,  __v, project, id, model
        delete obj.organization_id;
        delete obj.createdAt;
        delete obj.updatedAt;
        delete obj.__v;
        delete obj.project;
        delete obj.id;
        delete obj.model;
        delete obj.prompt_parameters
        obj.model_type = modelObject.type;
        const file = new Blob([JSON.stringify(obj, null, 4)], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `${promptObject.name}.json`;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
        //remove element
        document.body.removeChild(element);
    }

    const handleClearResultClicked = () => {
        promptWorkspaceTabs.getState().updateDataById(activeTabId as string, {loading: false, generatedText: null, error: undefined, logId: undefined})
    };

    return (
        <div>
            <ModelError
                errorMessage={data.error}
                logId={data.logId}
            ></ModelError>
            <div className="pg-content-footer">
                <div className="pg-footer-left">
                    <button
                        id="submit-prompt"
                        tabIndex={0}
                        className={`btn btn-sm btn-filled ${
                            data.loading ? 'btn-neutral' : 'btn-primary'
                        } pg-submit-btn`}
                        type="button"
                        aria-haspopup="true"
                        aria-expanded="false"
                    >
            <span className="btn-label-wrap">
                <span className="btn-label-inner" onClick={async () => {
                    try {
                        var output = await generateResultForPrompt(activeTabId as string);
                        console.log(output)
                    } catch (e) {
                        //print axios error
                    }
                }}>
                {data.loading ? "Processing..." : "Submit"}
                </span>
            </span>
                    </button>
                    <PlaygroundButton
                        text="Save"
                        id="save-prompt"
                        onClick={toggle_modal}
                        isFull={true}
                    />
                    <PlaygroundButton
                        text="Code"
                        onClick={toggle_code_modal}
                        isFull={true}
                    />
                    <PlaygroundButton
                        text="Samples"
                        onClick={goToSamplesPage}
                        isFull={true}
                    />
                    <PlaygroundButton
                        text="Export"
                        onClick={exportPrompt}
                        isFull={true}
                    />
                    {
                        data.generatedText || data.error ?
                            <PlaygroundButton
                                text="Clear"
                                id="clear-result"
                                onClick={handleClearResultClicked}
                                isFull={true}
                            />
                            : null
                    }
                </div>
                {show_code_modal && <CodeModal/>}
            </div>
        </div>
    )

}

export default EditorFooter;