import React, { useState } from "react";
import { TagsInput as ReactTagsInput } from "react-tag-input-component";

interface TagsInputProps {
  tagsInfo: {
    default: string[];
    name: string;
  };
}

const TagsInput: React.FC<TagsInputProps> = ({ tagsInfo }) => {
  const [selected, setSelected] = useState(tagsInfo.default);

  return (
    <div>
      <div className="body-small control-label">Stop sequences</div>
      <ReactTagsInput
        value={selected}
        onChange={setSelected}
        name={tagsInfo.name}
        placeHolder="Enter sequence and press Tab"
      />
      <em>Enter sequence and press Tab</em>
    </div>
  );
};

export default TagsInput;
