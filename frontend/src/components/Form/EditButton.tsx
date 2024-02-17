import React from "react";
import Edit from "../Icons/Edit";

interface EditButtonProps {
  onClick: () => void;
}

function EditButton({ onClick }: EditButtonProps) {
  return (
    <button
      tabIndex={0}
      className="btn btn-sm btn-minimal btn-neutral"
      type="button"
      onClick={onClick} // Directly attach onClick prop to button's onClick
    >
      <span className="btn-label-wrap">
        <span className="btn-label-inner">
          <Edit />
        </span>
      </span>
    </button>
  );
}

export default EditButton;
