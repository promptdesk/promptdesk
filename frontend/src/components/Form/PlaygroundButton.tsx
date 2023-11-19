import React from 'react';

interface PlaygroundButtonProps {
  id?: string;
  text: string;
  isFull?: boolean;
  onClick: () => void;
}

function PlaygroundButton({ id, text, onClick, isFull }: PlaygroundButtonProps) {
  const handleClick = () => {
    if (typeof onClick === 'function') {
      onClick();
    }
  };

  const baseClass = "btn btn-sm btn-filled btn-neutral";
  const className = isFull ? `${baseClass} w-full` : baseClass;

  return (
    <button
      tabIndex={0}
      className={className}
      id={id}
      type="button"
      data-testid="pg-save-btn"
      aria-haspopup="true"
      aria-expanded="false"
      onClick={handleClick}
    >
      <span className="btn-label-wrap">
        <span className="btn-label-inner">{text} {isFull}</span>
      </span>
    </button>
  );
}

export default PlaygroundButton;