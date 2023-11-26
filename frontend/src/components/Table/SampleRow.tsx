import React from 'react';
import {useRouter} from 'next/router';
import { generateResultForPrompt } from "@/services/GenerateService";
import {CustomJSONView} from "@/components/Viewers/CustomJSONView";
import {promptStore} from "@/stores/PromptStore";

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

    const [generatedResult, setGeneratedResult] = React.useState<any>(null);

    const sample_id = sample.id;
    const prompt_id = sample.prompt_id;

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
        setGeneratedResult(data.message);
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
                <td>
                    <CustomJSONView
                        name={"variables"}
                        src={sample.variables}
                    />
                </td>
                <td>
                    {generatedResult || sample.result}
                </td>
                <td onClick={handleGenerateClicked} className="px-3 py-4 text-sm font-medium text-right whitespace-nowrap">
                    Generate
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