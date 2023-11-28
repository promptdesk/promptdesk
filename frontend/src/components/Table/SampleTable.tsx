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
    <div>
      {samples && samples ?
          samples.map((sample: any, index:number) => (
            <SampleRow
                key={sample.id}
                sample={sample}
                index={index}
            />
          ))
          : null}
    </div>
  );
}

export default SampleTable;