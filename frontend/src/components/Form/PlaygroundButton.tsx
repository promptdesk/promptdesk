import React from "react";

interface PlaygroundButtonProps {
  id?: string;
  text: string;
  isFull?: boolean;
  color?: string;
  onClick: () => void;
}

function PlaygroundButton({
  id,
  text,
  onClick,
  isFull = false,
  color,
}: PlaygroundButtonProps) {
  const handleClick = () => {
    if (typeof onClick === "function") {
      onClick();
    }
  };

  let baseClass = "btn btn-sm btn-filled btn-neutral";
  if (color) {
    baseClass = `btn btn-sm btn-filled btn-${color}`;
  }
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
        <span className="btn-label-inner">{text}</span>
      </span>
    </button>
  );
}

export default PlaygroundButton;
