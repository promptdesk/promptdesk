import React, {useCallback, useMemo} from 'react';
import {generateResultForPrompt} from "@/services/GenerateService";
import {CustomJSONView} from "@/components/Viewers/CustomJSONView";
import {promptStore} from "@/stores/PromptStore";
import _ from "lodash";
import {sampleStore} from "@/stores/SampleStore";
import ConfirmModal from "@/components/Modals/ConfirmModal";
import "./SampleRow.scss";


interface SampleRowActionButtonProps {
    onClick: () => void;
    title: string;
    showSpinner?: boolean;
}

const SampleRowActionButton: React.FC<SampleRowActionButtonProps> = ({onClick, title, showSpinner}) => {
    return (
        <button
            className={"btn btn-sm btn-filled btn-neutral btn-full"}
            type="button"
            data-testid="pg-save-btn"
            aria-haspopup="true"
            aria-expanded="false"
            onClick={onClick}
        >
            <span className="btn-label-wrap">
                <span className="btn-label-inner">{title}</span>
            </span>
            {
                showSpinner ? (
                    <div className="action-button-loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
                ) : null
            }
        </button>
    );
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
    const [localStatus, setLocalStatus] = React.useState<any>(sample.status || "fresh");
    const [localPromptInfo, setLocalPromptData] = React.useState<any>(sample.prompt);
    const [isShowingDeleteModal, setIsShowingDeleteModal] = React.useState(false);
    const [isShowingConfirmGenerateModal, setIsShowingConfirmGenerateModal] = React.useState(false);
    const [isRegenerating, setIsRegenerating] = React.useState(false);

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
        changeStatus('fresh');
        let newPromptData = data.raw.request.messages;
        if (data.raw.request.messages.length === 1) {
            newPromptData = newPromptData[0];
        }
        setLocalPromptData(newPromptData);
        saveChangedPromptData(newPromptData);

        saveChangedResultValue(data.message);
    }

    const handleRegenerateClicked = async () => {
        if (localStatus !== 'fresh') {
            setIsShowingConfirmGenerateModal(true);
        } else {
            await regenerateResultValue();
        }
    };

    const handleTextAreaChange = (event: any) => {
        setLocalResult(event.target.value);
        saveChangedResultValue(event.target.value);
    };

    function changeStatus(new_status: string) {
        setLocalStatus(new_status);
        sampleStore.getState().patchSample(sample_id, {status: new_status});
    }

    const handleStatusChange = (event: any) => {
        changeStatus(event.target.value);
    };

    const handleDeleteClicked = async () => {
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

    return (
        <>
            <tr
                className={"sample-row"}
                key={sample.id}
                //add id if index is 0
                id={index === 3 ? 'sample-log' : ''}
            >
                <td className={"variables-column"}>
                    <CustomJSONView
                        name={null}
                        src={sample.variables}
                        collapsed={1}
                    />
                </td>
                <td className={"prompt-column"}>
                    {
                        (localPromptInfo.prompt || localPromptInfo.content) ? (
                            // Just use a regular text widget here.
                            <span className={"prompt-content-area"}>{(localPromptInfo.prompt || localPromptInfo.content).toString().trim()}</span>
                        ) :
                            <CustomJSONView
                                name={null}
                                src={localPromptInfo}
                                collapsed={true}
                            />
                    }
                </td>
                <td className={"result-column"}>
                    <div className="text-input-wrapper">
                        <textarea
                            className="text-input-md text-input sample-row-input"
                            contentEditable={true}
                            placeholder={"Enter ground truth here."}
                            suppressContentEditableWarning={true}
                            value={localResult}
                            onChange={handleTextAreaChange}
                        />
                    </div>
                </td>
                <td className="px-3 py-4 text-sm font-medium action-column">
                    <div className={"action-buttons"}>
                        <select
                            className="select select-bordered select-sm w-full max-w-xs status-selector"
                            value={localStatus}
                            onChange={handleStatusChange}
                        >
                            <option value={'fresh'}>Fresh</option>
                            <option value={'in_review'}>In Review</option>
                            <option value={'verified'}>Verified</option>
                            <option value={'rejected'}>Rejected</option>
                        </select>
                        <SampleRowActionButton onClick={handleRegenerateClicked} title="Regenerate" showSpinner={isRegenerating}/>
                        <SampleRowActionButton onClick={handleDeleteClicked} title="Delete"/>
                    </div>
                </td>
            </tr>
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
                        bodyText="Are you sure you want to regenerate this sample? This will overwrite any changes you have made and reset sample status back to Fresh."
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