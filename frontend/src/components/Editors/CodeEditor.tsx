import { Editor as MonacoEditor } from "@monaco-editor/react";
interface CodeEditorProps {
  code: string;
  handleChange?: (e: string | undefined) => void;
  language: string;
  readOnly?: boolean;
  height? : string;
  style?: string;
}

const Editor: React.FC<CodeEditorProps> = ({
  code,
  handleChange,
  language,
  readOnly,
  height,
  style
}) => {
  return (
    <div className={style || "w-full"}>
      <MonacoEditor
        onChange={handleChange}
        height={height || "500px"}
        theme="vs-dark"
        defaultLanguage={language}
        value={code}
        options={{
          wordWrap: "on",
          minimap: { enabled: false },
          fontSize: 14,
          readOnly,
          scrollbar: {
            alwaysConsumeMouseWheel: false
          }
        }}
      />
    </div>
  );
};

export default Editor;
