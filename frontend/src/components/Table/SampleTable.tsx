import React from "react";
import SampleRow from "@/components/Table/SampleRow";
import "./SampleTable.scss";

interface SamplesTableProps {
  samples: any[];
}

const SampleTable: React.FC<SamplesTableProps> = ({ samples }) => (
  <div>
    {samples?.map((sample, index) => (
      <SampleRow key={sample.id} sample={sample} index={index} />
    ))}
  </div>
);

export default SampleTable;
