import React from 'react';
import SampleRow from "@/components/Table/SampleRow";
import "./SampleTable.scss";

interface SamplesTableProps {
  samples: any;
}

const SampleTable: React.FC<SamplesTableProps> = ({
  samples,
}) => {
  return (
    <table className="min-w-full docs-models-toc samples-table">
      <thead>
        <tr>
          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0 variables-column">
            Variables
          </th>
          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0 prompt-column">
            Prompt
          </th>
          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 result-column">
            Result
          </th>
          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 status-column">
            Status
          </th>
          <th className={"action-column"}>
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {samples && samples ?
          samples.map((sample: any, index:number) => (
            <SampleRow
                key={sample.id}
                sample={sample}
                index={index}
            />
          ))
          : null}
      </tbody>
    </table>
  );
}

export default SampleTable;