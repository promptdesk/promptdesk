import React from 'react';

interface PlaygroundButtonProps {
  text: string;
  onClick: () => void;
}

function PlaygroundButton({ text, onClick }: PlaygroundButtonProps) {
  const handleClick = () => {
    if (typeof onClick === 'function') {
      onClick();
    }
  };

  return (
    <button
      tabIndex={0}
      className="btn btn-sm btn-filled btn-neutral"
      type="button"
      data-testid="pg-save-btn"
      aria-haspopup="true"
      aria-expanded="false"
      onClick={handleClick}
    >
      <span className="btn-label-wrap">
        <span className="btn-label-inner">{text}</span>
      </span>
    </button>
  );
}

export default PlaygroundButton;