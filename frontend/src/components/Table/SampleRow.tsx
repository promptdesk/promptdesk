import React, {useCallback, useMemo} from 'react';
import {useRouter} from 'next/router';
import { generateResultForPrompt } from "@/services/GenerateService";
import {CustomJSONView} from "@/components/Viewers/CustomJSONView";
import {promptStore} from "@/stores/PromptStore";
import _ from "lodash";
import {sampleStore} from "@/stores/SampleStore";

interface SampleRowProps {
    index: number;
    sample: any;
    handleRowClick: (logId: string) => void;
    expandedRows: Record<string, boolean>;
}

const SampleRow: React.FC<SampleRowProps> = ({
                                                 index,
                                                 sample,
                                                 handleRowClick,
                                                 expandedRows,
                                             }) => {

    const [localResult, setLocalResult] = React.useState<any>(sample.result || "");
    const [localStatus, setLocalStatus] = React.useState<any>(sample.status || "fresh");
    const sample_id = sample.id;
    const prompt_id = sample.prompt_id;

    const saveChangedResultValue = useMemo(() => _.debounce((newResultValue) => {
        sampleStore.getState().patchSample(sample_id, {result: newResultValue});
    }, 500), [sample_id]);

    const handleGenerateClicked = async () => {
        // TODO: NOT SURE THIS IS RIGHT, I THINK WE NEED TO USE SOME STORE FUNCTION
        // TODO: TO MODIFY THE PROMPT OBJECT. OR IDEALLY, WE SHOULD JUST REGEN THE SAMPLE
        // TODO: WITHOUT MODIFYING THE PROMPT OBJECT AT ALL.
        const prompt = promptStore.getState().promptObject;
        Object.keys(prompt.prompt_variables).map((variable_name: string) => {
            if (sample.variables[variable_name] !== undefined) {
                prompt.prompt_variables[variable_name].value = sample.variables[variable_name];
            }
        });

        const data = await generateResultForPrompt(prompt_id);
        setLocalResult(data.message);
        saveChangedResultValue(data.message);
    };

    const handleTextAreaChange = (event) => {
        setLocalResult(event.target.value);
        saveChangedResultValue(event.target.value);
    };

    const handleStatusChange = (event) => {
        setLocalStatus(event.target.value);
        sampleStore.getState().patchSample(sample_id, {status: event.target.value});
    };

    return (
        <>
            <tr
                key={sample.id}
                onClick={() => handleRowClick(sample.id)}
                className="cursor-pointer"
                //add id if index is 0
                id={index === 3 ? 'sample-log' : ''}
            >
                <td className={"variables-column"}>
                    <CustomJSONView
                        name={"variables"}
                        src={sample.variables}
                        collapsed={true}
                    />
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
                <td className={"status-column"}>
                    <div className={"status-wrapper"}>
                        <select
                            className="select select-bordered select-sm w-full max-w-xs"
                            value={localStatus}
                            onChange={handleStatusChange}
                        >
                            <option value={'fresh'}>Fresh</option>
                            <option value={'in_review'}>In Review</option>
                            <option value={'verified'}>Verified</option>
                            <option value={'rejected'}>Rejected</option>
                        </select>
                    </div>
                </td>
                <td className="px-3 py-4 text-sm font-medium action-column">
                    <div className={"action-buttons"}>
                        <button
                            className={"btn btn-sm btn-filled btn-neutral"}
                            type="button"
                            data-testid="pg-save-btn"
                            aria-haspopup="true"
                            aria-expanded="false"
                            onClick={handleGenerateClicked}
                        >
                          <span className="btn-label-wrap">
                            <span className="btn-label-inner">Generate</span>
                          </span>
                        </button>
                    </div>
                </td>
            </tr>

            {/*{expandedRows[sample.id] ? (*/}
            {/*    <tr>*/}
            {/*    </tr>*/}
            {/*) : null}*/}
        </>
    );
}

export default SampleRow;