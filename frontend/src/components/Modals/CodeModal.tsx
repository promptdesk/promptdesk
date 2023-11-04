import React from "react";
import { shouldSnowCodeModal } from "@/stores/GeneralStore";
import { promptStore } from "@/stores/PromptStore";

const CodeModal = () => {
  const { promptObject } = promptStore();
  
  // Generate variable_code and code
  const variableEntries = Object.entries(promptObject.prompt_variables || {}).map(([key, value]) => {
    let textValue = (value as any)['value'].length > 40 ? (value as any)['value'].substring(0, 40) + "..." : (value as any)['value'];
    return `    "${key}":"${textValue}",`;
  });

  if(variableEntries.length > 0) {
    variableEntries[variableEntries.length - 1] = variableEntries[variableEntries.length - 1].slice(0, -1);
  }

  const variableCode = variableEntries.length > 0 ? `, {\n${variableEntries.join("\n")}\n})` : ')';
  const code = `import promptdesk as pd

pd.API_KEY = "YOUR_API_KEY"

result = pd.generate("${promptObject.name}"${variableCode}`;

  const { show_code_modal, toggle_code_modal } = shouldSnowCodeModal();

  const renderButtons = () => (
    <button
      tabIndex={0}
      className="btn btn-sm btn-filled btn-neutral modal-button"
      type="button"
      onClick={toggle_code_modal}
    >
      <span className="btn-label-wrap">
        <span className="btn-label-inner">Close</span>
      </span>
    </button>
  );

  return (
    <div className="modal-root modal-is-open modal-closeable">
      <div className="modal-backdrop" onClick={toggle_code_modal} />
      <div className="modal-dialog-container" tabIndex={0}>
        <div className="modal-dialog modal-size-large">
          <div>
            <div className="modal-header heading-medium">Source Code</div>
            <div className="modal-body body-small">
              <pre
                style={{ whiteSpace: "pre-wrap" }}
                suppressContentEditableWarning={true}
                className="hljs syntax-highlighter dark code-sample-pre p-8 rounded-md"
              >
                {code}
              </pre>
            </div>
            <div className="modal-footer">{renderButtons()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeModal;