import { Editor as MonacoEditor } from "@monaco-editor/react";
interface CodeEditorProps {
  code: string;
  handleChange: (e: string | undefined) => void;
  language: string;
  readOnly?: boolean;
}

const Editor: React.FC<CodeEditorProps> = ({
  code,
  handleChange,
  language,
  readOnly,
}) => {
  return (
    <>
      <MonacoEditor
        onChange={handleChange}
        height="80vh"
        theme="vs-dark"
        defaultLanguage={language}
        value={code}
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
