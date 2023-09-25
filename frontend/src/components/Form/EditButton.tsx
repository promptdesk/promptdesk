import React from 'react';

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
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth={0}
            viewBox="0 0 20 20"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </span>
      </span>
    </button>
  );
}

export default EditButton;