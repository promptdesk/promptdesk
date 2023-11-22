import { Editor as MonacoEditor } from "@monaco-editor/react";
import { useState } from "react";
import PlaygroundButton from "../Form/PlaygroundButton";
interface CodeEditorProps {
  code: string;
  onSave: (e: string) => void;
  language: string;
  readOnly?: boolean;
  height?: string;
}

const Editor: React.FC<CodeEditorProps> = ({
  code,
  onSave,
  language,
  readOnly,
  height
}) => {
  const [codeText, setCodeText] = useState(() => code);

  return (
    <>
      <div className="my-2">
      <PlaygroundButton text={`Save ${code === codeText ? '' : '*'}`} onClick={() => onSave(codeText)} />
      </div>
      <MonacoEditor
        onChange={(c) => {
          setCodeText(c ? c : '')
        }}
        height={height || "30vh"}
        theme="vs-dark"
        defaultLanguage={language}
        value={codeText}
        options={{
          wordWrap: "on",
          minimap: { enabled: false },
          fontSize: 14,
          readOnly,
        }}
      />
    </>
  );
};

export default Editor;
