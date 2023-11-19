import { Editor as MonacoEditor } from "@monaco-editor/react";
interface TabItemProps {
  isValidJSON: boolean;
  selectedModel: string;
  handleChange: (e: string | undefined) => void;
}

const Editor: React.FC<TabItemProps> = ({
  isValidJSON,
  selectedModel,
  handleChange,
}) => {
  return (
    <>
      <MonacoEditor
        onChange={handleChange}
        height="80vh"
        theme="vs-dark"
        defaultLanguage="json"
        value={selectedModel}
        options={{
          wordWrap: "on",
          lineNumbers: "off",
          minimap: { enabled: false },
          fontSize: 14,
        }}
      />
    </>
  );
};

export default Editor;
