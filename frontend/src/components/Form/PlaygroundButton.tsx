import React from "react";

interface PlaygroundButtonProps {
  id?: string;
  text: string;
  isFull?: boolean;
  color?: string;
  onClick?: () => void;
  newTab?: boolean;
  href?: string;
}

function PlaygroundButton({
  id,
  text,
  onClick,
  isFull = false,
  color,
  newTab,
  href
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

  if (newTab) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        <span className="btn-label-wrap">
          <span className="btn-label-inner">{text}</span>
        </span>
      </a>
    );
  }

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
