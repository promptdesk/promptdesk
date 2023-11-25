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
            {/*<tr*/}
            {/*    key={log.id}*/}
            {/*    onClick={() => handleRowClick(log.id)}*/}
            {/*    className="cursor-pointer"*/}
            {/*    //add id if index is 0*/}
            {/*    id={index === 3 ? 'sample-log' : ''}*/}
            {/*>*/}
            {/*    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">*/}
            {/*        {getPromptName(log.prompt_id)}*/}
            {/*    </td>*/}
            {/*    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{getModelName(log.model_id)}</td>*/}
            {/*    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{(log.createdAt.toString())}</td>*/}
            {/*    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{(log.duration || 0)}</td>*/}
            {/*    <td*/}
            {/*        className={`whitespace-nowrap px-3 py-4 text-sm ${*/}
            {/*            log.status && log.status !== 200 ? 'bg-yellow-300' : ''*/}
            {/*        } text-gray-500`}*/}
            {/*    >*/}
            {/*        {log.status}*/}
            {/*    </td>*/}
            {/*    <td onClick={() => {goToLogDetails(log.id)}} className="px-3 py-4 text-sm font-medium text-right whitespace-nowrap">*/}
            {/*        View*/}
            {/*    </td>*/}
            {/*</tr>*/}
            {/*{expandedRows[log.id] && (*/}
            {/*    <tr>*/}
            {/*        <td colSpan={6} className="bg-gray-100">*/}
            {/*            {*/}
            {/*                !log.error && log.data ? (*/}
            {/*                    <div className="flex">*/}
            {/*                        <div className="w-1/2 p-4" style={{ whiteSpace: 'pre-wrap' }}>*/}
            {/*                            {log.data.prompt !== undefined || log.data.context !== undefined ? (*/}
            {/*                                <div className="mb-4">*/}
            {/*                                    <fieldset className="border p-2">*/}
            {/*                                        <legend className="w-auto">*/}
            {/*                                            {log.data.context ? 'context' : 'prompt'}*/}
            {/*                                        </legend>*/}
            {/*                                        <p>{log.data.prompt || log.data.context}</p>*/}
            {/*                                    </fieldset>*/}
            {/*                                </div>*/}
            {/*                            ) : null}*/}
            {/*                            {log.data.messages ? (*/}
            {/*                                <div className="mb-4">*/}
            {/*                                    {log.data.messages.map((message: any, index: any) => (*/}
            {/*                                        <fieldset className="border p-2" key={index}>*/}
            {/*                                            <legend className="w-auto">{message.role}</legend>*/}
            {/*                                            <p>{message.content}</p>*/}
            {/*                                        </fieldset>*/}
            {/*                                    ))}*/}
            {/*                                </div>*/}
            {/*                            ) : null}*/}
            {/*                        </div>*/}

            {/*                        <div className="w-1/2 p-4" style={{ whiteSpace: 'pre-wrap' }}>*/}
            {/*                            {*/}
            {/*                                typeof log.message === 'string' ? (*/}
            {/*                                    <fieldset className="border p-2">*/}
            {/*                                        <legend className="w-auto">output</legend>*/}
            {/*                                        <p>{log.message}</p>*/}
            {/*                                    </fieldset>*/}
            {/*                                ) : (*/}
            {/*                                    <fieldset className="border p-2">*/}
            {/*                                        <legend className="w-auto">{log.message.role}</legend>*/}
            {/*                                        <p>{log.message.content}</p>*/}
            {/*                                    </fieldset>*/}
            {/*                                )*/}
            {/*                            }*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                ) : (*/}
            {/*                    <pre style={{ whiteSpace: 'pre-wrap' }}>*/}
            {/*                        {JSON.stringify(log, null, 2)}*/}
            {/*                    </pre>*/}
            {/*                )*/}
            {/*            }*/}
            {/*        </td>*/}
            {/*    </tr>*/}
            {/*)}*/}
        </>
    );
}

export default SampleRow;