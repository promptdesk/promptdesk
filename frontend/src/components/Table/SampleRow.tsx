import React, {useCallback, useMemo, useRef} from 'react';
import {generateResultForPrompt} from "@/services/GenerateService";
import {promptStore} from "@/stores/prompts";
import _ from "lodash";
import {sampleStore} from "@/stores/SampleStore";
import ConfirmModal from "@/components/Modals/ConfirmModal";
import "./SampleRow.scss";
import DropDown from "@/components/Form/DropDown";
import SampleRowHeader from './SampleRowHeader';
import SampleRowPrompt from './SampleRowPrompt';
import SampleRowVariables from './SampleRowVariables';
import SampleRowGroundTruth from './SampleRowGroundTruth';

const SampleRow: React.FC<any> = ({
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

    return (
        <>
            <div key={sample.id} className="sample-row mb-4">
                <div>
                    <div>
                            <SampleRowHeader
                                localStatus={localStatus}
                                handleStatusChange={handleStatusChange}
                                handleRegenerateClicked={handleRegenerateClicked}
                                handleDeleteClicked={handleDeleteClicked}
                                setView={setView}
                                isRegenerating={isRegenerating}
                            />
                    </div>
                    <div className="">
                        <div className="inline-block w-1/2 align-top" style={{maxHeight:"500px", overflowY:"auto"}}>
                            <SampleRowVariables variables={sample.variables}/>
                        </div>
                        <div className="inline-block w-1/2 align-top">
                            {
                                view === "prompt" ?
                                    <SampleRowPrompt localPromptInfo={localPromptInfo} promptText={promptText}/> :
                                    <SampleRowGroundTruth localResult={localResult} handleTextAreaChange={handleTextAreaChange} resultTextAreaRef={resultTextAreaRef}/>
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