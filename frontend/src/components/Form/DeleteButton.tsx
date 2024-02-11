import React from "react";
import Trash from "../Icons/Trash";

interface DeleteButtonProps {
  onClick: () => void;
}

function DeleteButton({ onClick }: DeleteButtonProps) {
  const handleClick = () => {
    if (typeof onClick === "function") {
      onClick();
    }
  };

  return (
    <button
      tabIndex={0}
      className="btn btn-sm btn-minimal btn-neutral"
      type="button"
      onClick={handleClick}
    >
      <span className="btn-label-wrap">
        <span className="btn-label-inner">
          <Trash />
        </span>
      </span>
    </button>
  );
}

export default DeleteButton;
