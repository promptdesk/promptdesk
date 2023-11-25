import React, {useEffect} from "react";
import {useRouter} from 'next/router';
import SampleTable from "@/components/Table/SampleTable";
import {sampleStore} from "@/stores/SampleStore";

export default function SamplesListPage() {
    const {push, query} = useRouter();

    const prompt_id = query.id;

    var {samples, fetchSamples} = sampleStore();

    useEffect(() => {
        fetchSamples(0, prompt_id?.toString());
    }, [fetchSamples, prompt_id]);

    const handleRowClick = (sampleId: string) => {
        console.log(sampleId)
    };

    return (
        <div className="page-body full-width flush">
            <div className="pg-header">
                <div className="pg-header-title">
                    <h1 className="pg-page-title" style={{display: 'block'}}>Samples</h1>
                </div>
            </div>
            <div className="pg-body">
                <div className="mt-2 flow-root markdown-page markdown-content markdown-prompt-blockquote models">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <SampleTable
                                samples={samples}
                                handleRowClick={handleRowClick}
                                getPromptName={() => ""}
                                getModelName={() => ""}
                                expandedRows={{}}
                            />
                        </div>
                    </div>
                </div>
                {/*<Pagination*/}
                {/*    page={page}*/}
                {/*    logs={logs as any}*/}
                {/*    handlePrevious={handlePrevious}*/}
                {/*    handleNext={handleNext}*/}
                {/*/>*/}
            </div>
        </div>
    );

}
