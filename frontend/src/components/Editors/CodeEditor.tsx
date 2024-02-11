import { Editor as MonacoEditor } from "@monaco-editor/react";
interface CodeEditorProps {
  code: string;
  handleChange?: (e: string | undefined) => void;
  language: string;
  readOnly?: boolean;
  height?: string;
  style?: string;
}

const Editor: React.FC<CodeEditorProps> = ({
  code,
  handleChange,
  language,
  readOnly,
  height = "500px",
  style = "w-full",
}) => {
  return (
    <div className={style}>
      <MonacoEditor
        onChange={handleChange}
        height={height}
        theme="vs-dark"
        defaultLanguage={language}
        value={code}
        options={{
          wordWrap: "on",
          minimap: { enabled: false },
          fontSize: 14,
          readOnly,
          scrollbar: {
            alwaysConsumeMouseWheel: false,
          },
        }}
      />
    </div>
  );
};

export default Editor;
