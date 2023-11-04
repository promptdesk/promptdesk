import React from 'react';
import Edit from '../Icons/Edit';

interface EditButtonProps {
  onClick: () => void;
}

function EditButton({ onClick }: EditButtonProps) {
  const handleClick = () => {
    // Call the onClick prop if it is a function
    if (typeof onClick === 'function') {
      onClick();
    }
  };

  return (
    <button
      tabIndex={0}
      className="btn btn-sm btn-minimal btn-neutral"
      type="button"
      onClick={handleClick} // Attach handleClick to button's onClick
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