import React, {useCallback, useMemo, useRef} from 'react';
import {generateResultForPrompt} from "@/services/GenerateService";
import {CustomJSONView} from "@/components/Viewers/CustomJSONView";
import {promptStore} from "@/stores/PromptStore";
import _ from "lodash";
import {sampleStore} from "@/stores/SampleStore";
import ConfirmModal from "@/components/Modals/ConfirmModal";
import "./SampleRow.scss";
import PlaygroundButton from "@/components/Form/PlaygroundButton";
import DropDown from "@/components/Form/DropDown";


interface SampleRowActionButtonProps {
    onClick: (evt: any) => void;
    title: string;
    showSpinner?: boolean;
}

interface SampleRowProps {
    index: number;
    sample: any;
}

const SampleRow: React.FC<SampleRowProps> = ({
                                                 index,
                                                 sample,
                                             }) => {

    const [localResult, setLocalResult] = React.useState<any>(sample.result || "");
    const [localStatus, setLocalStatus] = React.useState<any>(sample.status || "new");
    const [localPromptInfo, setLocalPromptData] = React.useState<any>(sample.prompt || {});
    const [isShowingDeleteModal, setIsShowingDeleteModal] = React.useState(false);
    const [isShowingConfirmGenerateModal, setIsShowingConfirmGenerateModal] = React.useState(false);
    const [isRegenerating, setIsRegenerating] = React.useState(false);
    const resultTextAreaRef = useRef<HTMLDivElement | null>(null);
    const [view, setView] = React.useState<any>("ground_truth");

    const sample_id = sample.id;
    const prompt_id = sample.prompt_id;

    const saveChangedResultValue = useMemo(() => _.debounce((newResultValue) => {
        sampleStore.getState().patchSample(sample_id, {
            result: newResultValue,
        });
    }, 500), [sample_id]);

    const saveChangedPromptData = useCallback((newPromptData: any) => {
        sampleStore.getState().patchSample(sample_id, {
            prompt: newPromptData,
        });
    }, [sample_id]);

    async function regenerateResultValue() {
        // TODO: NOT SURE THIS IS RIGHT, I THINK WE NEED TO USE SOME STORE FUNCTION
        // TODO: TO MODIFY THE PROMPT OBJECT. OR IDEALLY, WE SHOULD JUST REGEN THE SAMPLE
        // TODO: WITHOUT MODIFYING THE PROMPT OBJECT AT ALL.
        const prompt = promptStore.getState().promptObject;
        Object.keys(prompt.prompt_variables).map((variable_name: string) => {
            if (sample.variables[variable_name] !== undefined) {
                prompt.prompt_variables[variable_name].value = sample.variables[variable_name];
            }
        });

        setIsRegenerating(true);
        const data = await generateResultForPrompt(prompt_id);
        setIsRegenerating(false);

        setLocalResult(data.message);
        changeStatus('new');
        let newPromptData = data.raw.request.messages;
        if (data.raw.request.messages.length === 1) {
            newPromptData = newPromptData[0];
        }
        setLocalPromptData(newPromptData);
        saveChangedPromptData(newPromptData);

        saveChangedResultValue(data.message);
    }

    const handleRegenerateClicked = (evt: any) => {
        if (localStatus !== 'new') {
            setIsShowingConfirmGenerateModal(true);
        } else {
            regenerateResultValue();
        }
    };

    const handleTextAreaChange = (event: any) => {
        let newText = resultTextAreaRef.current?.innerText || "";

        newText = newText.trim();

        // Don't update the local result because it can screw up the text input.
        // setLocalResult(newText);
        saveChangedResultValue(newText);
    };

    function changeStatus(new_status: string) {
        setLocalStatus(new_status);
        sampleStore.getState().patchSample(sample_id, {status: new_status});
    }

    const handleStatusChange = (value: any) => {
        changeStatus(value);
    };

    const handleDeleteClicked = (evt: any) => {
        setIsShowingDeleteModal(true);
    };

    const handleDeleteAccepted = async () => {
        await sampleStore.getState().deleteSample(sample_id);
        setIsShowingDeleteModal(false);
    };

    const handleGenerateConfirmed = async () => {
        setIsShowingConfirmGenerateModal(false);
        await regenerateResultValue();
    }

    const promptText = (localPromptInfo.prompt || localPromptInfo.content || "").toString().trim()

    //return a div
    const actions = function() {
        return (
            <div className="flex justify-between bg-gray-200 p-2">
                <div className="flex">
                    <DropDown
                        options={[{value: 'new', name: 'New'}, {value: 'in_review', name: 'In Review'}, {value: 'approved', name: 'Approved'}, {value: 'rejected', name: 'Rejected'}]}
                        selected={localStatus}
                        onChange={handleStatusChange}
                    />
                    &nbsp;&nbsp;
                    <PlaygroundButton
                        onClick={handleRegenerateClicked as any}
                        text={isRegenerating ? "Processing..." : "Regenerate"}
                        color="primary"
                    />
                    <PlaygroundButton
                        onClick={handleDeleteClicked as any}
                        text={"Delete"}
                        color="primary"
                    />
                </div>
                <div>
                    <span className="isolate inline-flex rounded-md shadow-sm">
                        <button onClick={() => {setView('prompt')}} type="button" className="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10">Prompt</button>
                        <button onClick={() => {setView('ground_truth')}} type="button" className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10">Generated</button>
                    </span>
                </div>
            </div>
        );
    }

    const groundTruth = function() {
        return (
            <div className="text-input-wrapper h-full">
                <div
                    className="sample-row-textarea"
                    onClick={(evt) => evt.stopPropagation()}
                    contentEditable={true}
                    placeholder={"Enter ground truth here."}
                    suppressContentEditableWarning={true}
                    onInput={handleTextAreaChange}
                    ref={resultTextAreaRef}
                >{localResult}</div>
            </div>
        );
    }

    const prompt = function() {
        return (
            <>
            {
                    (localPromptInfo.prompt || localPromptInfo.content) ? (
                        // Use a text area, not because we want it to be editable, but rather so
                        // it is consistent with the UI in the result column.
                        <div
                            className="text-input-wrapper"
                        >
                            <div
                                className={"text-input-md text-input prompt-value-display"}
                                onClick={(evt) => evt.stopPropagation()}
                            >
                                {promptText}
                            </div>
                        </div>
                    ) :
                        <>
                            <div onClick={(evt) => evt.stopPropagation()}>
                                <CustomJSONView
                                    name={null}
                                    src={localPromptInfo}
                                    collapsed={false}
                                />
                            </div>
                        </>
            }
            </>
        );
    }

    const variables = function() {
        return (
            <div style={{maxWidth: "100%"}} onClick={(evt) => evt.stopPropagation()}>
                <CustomJSONView
                    name={null}
                    src={sample.variables}
                    collapsed={1}
                />
            </div>
        );
    }

    return (
        <>
            <div key={sample.id} className="sample-row mb-4">
                <div>
                    <div>{actions()}</div>
                    <div className="">
                        <div className="inline-block w-1/2 align-top" style={{maxHeight:"500px", overflowY:"auto"}}>
                            {variables()}
                        </div>
                        <div className="inline-block w-1/2 align-top">
                            {
                                view === "prompt" ? prompt() : groundTruth()
                            }
                        </div>
                    </div>
                </div>
            </div>
            {
                isShowingDeleteModal ? (
                    <ConfirmModal
                        title="Delete Sample"
                        bodyText="Are you sure you want to delete this sample?"
                        cancelText="Cancel"
                        acceptText="Delete"
                        onCancel={() => setIsShowingDeleteModal(false)}
                        onAccept={handleDeleteAccepted}
                    />
                ) : null
            }
            {
                isShowingConfirmGenerateModal ? (
                    <ConfirmModal
                        title="Regeenerate Sample"
                        bodyText="Are you sure you want to regenerate this sample? This will overwrite any changes you have made and reset sample status back to new."
                        cancelText="Cancel"
                        acceptText="Generate"
                        onCancel={() => setIsShowingConfirmGenerateModal(false)}
                        onAccept={handleGenerateConfirmed}
                    />
                ) : null
            }
        </>
    );
}

export default SampleRow;