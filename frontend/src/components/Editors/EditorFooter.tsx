"use client";
import React, {useEffect, useState} from 'react';
import {promptWorkspaceTabs} from "@/stores/TabStore";
import {generateResultForPrompt} from "@/services/GenerateService";
import CodeModal from "@/components/Modals/CodeModal";
import PlaygroundButton from "@/components/Form/PlaygroundButton";
import {
    shouldShowSaveModal,
    shouldShowCodeModal
} from "@/stores/GeneralStore";
import Link from "next/link";
import {useRouter} from "next/router";

function EditorFooter() {
    const {push, query} = useRouter();
    const {getDataById, activeTabId, tabs} = promptWorkspaceTabs();
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

    const handleClearResultClicked = () => {
        promptWorkspaceTabs.getState().updateDataById(activeTabId as string, {loading: false, generatedText: null})
    };

    return (
        <div className="pg-content-footer">
            <hr></hr>
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
            <span className="btn-label-inner" onClick={() => {
                generateResultForPrompt(activeTabId as string);
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
                {
                    data.generatedText ?
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
    )

}

export default EditorFooter;