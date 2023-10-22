import React from 'react';

interface DeleteButtonProps {
  onClick: () => void;
}

function DeleteButton({ onClick }: DeleteButtonProps) {
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
    onClick={handleClick}
  >
    <span className="btn-label-wrap">
      <span className="btn-label-inner">
        <svg
          stroke="currentColor"
          fill="none"
          strokeWidth={0}
          viewBox="0 0 24 24"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        ‍
      </span>
    </span>
  </button>
  );
}

export default DeleteButton;