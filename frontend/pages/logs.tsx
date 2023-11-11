import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { logStore } from '@/stores/LogStore';
import { promptStore } from '@/stores/PromptStore';
import { modelStore } from '@/stores/ModelStore';
import LogTable from '@/components/Table/LogTable';
import Pagination from '@/components/Table/Pagination';
import Stats from '@/components/Table/Stats';

export default function About() {
  const { push } = useRouter();

  var { logs, fetchLogs } = logStore();
  var { models } = modelStore();
  var { prompts } = promptStore();

  const initial_page = parseInt(location.search.replace('?page=', ''));

  const [page, setPage] = useState(initial_page || 1);
  const [expandedRows, setExpandedRows] = useState({});
  const [stats, setStats] = useState([
  ]);

  useEffect(() => {
    fetchLogs(page);
  }, [fetchLogs, page]);

  useEffect(() => {
    if(logs && (logs as any).stats) {
      setStats((logs as any).stats)
    }
  }, [logs]);

  const handleRowClick = (logId:string) => {
    setExpandedRows((prevExpandedRows) => ({
      ...prevExpandedRows,
      [logId]: !(prevExpandedRows as any)[logId],
    }));
  };

  const handlePrevious = () => {
    if (page > 1) push(`?page=${page - 1}`);
    setPage(page - 1);
  };

  const handleNext = () => {
    if (page) push(`?page=${page + 1}`);
    setPage(page + 1);
  };

  function getModelName(id:string) {
    return models.find((model:any) => model.id === id)?.name || "N/a";
  }

  function getPromptName(id:string) {
    return prompts.find((prompt:any) => prompt.id === id)?.name || "N/a";
  }

  return (
    <div className="page-body full-width flush">
      <div className="pg-header">
        <div className="pg-header-section pg-header-title">
          <h1 className="pg-page-title">Logs</h1>
        </div>
      </div>
      <div className="app-page">
        <Stats
          stats={stats}
        />
        <div className="mt-2 flow-root markdown-page markdown-content markdown-prompt-blockquote models">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <LogTable 
                logs={logs} 
                handleRowClick={handleRowClick} 
                getPromptName={getPromptName} 
                getModelName={getModelName} 
                expandedRows={expandedRows} 
              />
            </div>
          </div>
        </div>
        <Pagination
          page={page}
          logs={logs as any}
          handlePrevious={handlePrevious}
          handleNext={handleNext}
        />
      </div>
    </div>
  );
}
