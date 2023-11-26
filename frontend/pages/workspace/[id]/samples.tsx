import React, {useEffect, useState} from "react";
import {useRouter} from 'next/router';
import SampleTable from "@/components/Table/SampleTable";
import {sampleStore} from "@/stores/SampleStore";
import {promptStore} from "@/stores/PromptStore";
import Pagination from '@/components/Table/Pagination';
import "./sample.scss";
import PlaygroundButton from "@/components/Form/PlaygroundButton";

/**
 * This page allows you to view all of the unique samples that have accumulated for a particular prompt.
 */
export default function SamplesListPage() {
    const {push, back, query} = useRouter();
    const {samples, fetchSamples} = sampleStore();
    const {prompts, setPrompt} = promptStore();

    const initial_page = parseInt(location.search.replace('?page=', ''));

    const [page, setPage] = useState(initial_page || 1);
    const [expandedRows, setExpandedRows] = useState({});

    const prompt_id = String(query.id);

    useEffect(() => {
        setPrompt(prompt_id);
    }, [prompt_id]);

    useEffect(() => {
        fetchSamples(0, prompt_id?.toString());
    }, [fetchSamples, prompt_id]);

    const handleRowClick = (sampleId: string) => {
        // Do nothing.
    };

    function getPromptName(id:string) {
        return prompts.find((prompt:any) => prompt.id === id)?.name || "N/a";
    }

    const handlePrevious = () => {
        if (page > 1) push({query: {page: page - 1, id: prompt_id}} );
        setPage(page - 1);
    };

    const handleNext = () => {
        if (page) push({query: {page: page + 1, id: prompt_id}} );
        setPage(page + 1);
    };

    const goBackToPromptPage = () => {
        push(`/workspace/${prompt_id}`);
    }

    return (
        <div className="page-body full-width flush samples-list-page">
            <div className="pg-header">
                <div className="pg-header-title">
                    <h1 className="pg-page-title" style={{display: 'block'}}>Samples for <span className={"prompt-name"}>{getPromptName(prompt_id)}</span></h1>
                </div>
            </div>
            <div className="app-page">
                <PlaygroundButton
                    text="Back"
                    onClick={goBackToPromptPage}
                    isFull={false}
                />
                <div className="mt-2 flow-root markdown-page markdown-content markdown-prompt-blockquote models">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <SampleTable
                                samples={samples}
                                handleRowClick={handleRowClick}
                                expandedRows={{}}
                            />
                            {samples?.data && Object.keys(samples.data).length === 0 ? <p>No samples yet. Try executing this prompt either through the UI or from your client code.</p> : null}
                        </div>
                    </div>
                </div>
                <Pagination
                    page={page}
                    logs={samples as any}
                    handlePrevious={handlePrevious}
                    handleNext={handleNext}
                />
            </div>
        </div>
    );
}

