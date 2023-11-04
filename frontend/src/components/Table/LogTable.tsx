import React from 'react';
import LogRow from '@/components/LogRow';

interface LogsTableProps {
  logs: any;
  handleRowClick: (logId: string) => void;
  getPromptName: (id: string) => string;
  getModelName: (id: string) => string;
  expandedRows: Record<string, boolean>;
}

const LogTable: React.FC<LogsTableProps> = ({
  logs,
  handleRowClick,
  getPromptName,
  getModelName,
  expandedRows,
}) => {
  return (
    <table className="min-w-full docs-models-toc">
      <thead>
        <tr>
          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
            Prompt
          </th>
          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
            Model
          </th>
          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
            Date
          </th>
          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
            Duration
          </th>
          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
            Status
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {logs && logs.data ? 
          logs.data.map((log: any, index:number) => (
            <LogRow 
              log={log} 
              key={index}
              handleRowClick={handleRowClick} 
              getPromptName={getPromptName} 
              getModelName={getModelName} 
              expandedRows={expandedRows} 
            />
          )) 
          : null}
      </tbody>
    </table>
  );
}

export default LogTable;