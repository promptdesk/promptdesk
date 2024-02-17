import { useState } from "react";
import PlaygroundButton from "./Form/PlaygroundButton";

interface CopyWrapperProps {
  textToCopy: string;
  children: React.ReactNode;
}

const CopyWrapper: React.FC<CopyWrapperProps> = ({ textToCopy, children }) => {
  const [text, setText] = useState("Copy");
  const onClick = () => {
    navigator.clipboard.writeText(textToCopy);
    setText("Copied");
    setTimeout(() => setText("Copy"), 1000);
  };
  return (
    <div className="copy-wrapper">
      <div className="copy-icon" role="button" onClick={onClick}>
        <PlaygroundButton onClick={onClick} text={text} />
      </div>
      {children}
    </div>
  );
};

export default CopyWrapper;