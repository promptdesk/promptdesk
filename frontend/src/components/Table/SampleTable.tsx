import React from 'react';
import LogRow from '@/components/Table/LogRow';
import SampleRow from "@/components/Table/SampleRow";
import "./SampleRow.scss";

interface SamplesTableProps {
  samples: any;
  handleRowClick: (logId: string) => void;
  expandedRows: Record<string, boolean>;
}

const SampleTable: React.FC<SamplesTableProps> = ({
  samples,
  handleRowClick,
  expandedRows,
}) => {
  return (
    <table className="min-w-full docs-models-toc samples-table">
      <thead>
        <tr>
          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0 variables-column">
            Variables
          </th>
          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 result-column">
            Result
          </th>
          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 status-column">
            Status
          </th>
          <th className={"action-column"}></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {samples && samples.data ?
          samples.data.map((sample: any, index:number) => (
            <SampleRow
              index={index}
              sample={sample}
              key={index}
              handleRowClick={handleRowClick}
              expandedRows={expandedRows}
            />
          ))
          : null}
      </tbody>
    </table>
  );
}

export default SampleTable;