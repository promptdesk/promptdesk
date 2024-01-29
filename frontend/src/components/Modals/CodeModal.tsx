import React, { useEffect, useState } from "react";
import { shouldShowCodeModal } from "@/stores/GeneralStore";
import { promptStore } from "@/stores/PromptStore";
import Cookies from "js-cookie";

type VariableValue =
  | string
  | VariableValue[]
  | { [key: string]: VariableValue };

interface PromptVariables {
  [key: string]: {
    type: string;
    value: VariableValue;
  };
}

interface PromptObject {
  prompt_variables: PromptVariables;
  name: string;
}

const transformObject = (obj: {
  [key: string]: VariableValue;
}): { [key: string]: VariableValue } => {
  return Object.keys(obj).reduce(
    (acc: { [key: string]: VariableValue }, key) => {
      const value = obj[key];
      acc[key] = Array.isArray(value) ? [...value] : value;
      return acc;
    },
    {}
  );
};

const CodeModal = () => {
  const { promptObject } = promptStore() as { promptObject: PromptObject };
  const [apiKey, setApiKey] = useState("");
  const [serviceURL, setServiceURL] = useState("");


  useEffect(() => {

    let token = undefined;
    if (typeof window !== "undefined") {
      token = Cookies.get("token");
      if (token) setApiKey(token);
    }

    if (!token && process.env.ORGANIZATION_API_KEY) {
      token = process.env.ORGANIZATION_API_KEY;
      setApiKey(token);
    }

    if(process.env.PROMPT_SERVER_URL) {
      setServiceURL(process.env.PROMPT_SERVER_URL);
    }
  }, []);

  const finalObject = Object.keys(promptObject.prompt_variables).reduce(
    (acc, key) => {
      const value = promptObject.prompt_variables[key].value;
      if (typeof value === "object" && !Array.isArray(value)) {
        acc[key] = transformObject(value);
      } else {
        acc[key] = value;
      }
      return acc;
    },
    {} as { [key: string]: VariableValue }
  );

  const code = `from promptdesk import PromptDesk

pd = PromptDesk(
    api_key = "${apiKey}",
    service_url = "${serviceURL}"
)

result = pd.generate("${promptObject.name}", ${JSON.stringify(
    finalObject,
    null,
    2
  )})`;

  const { show_code_modal, toggle_code_modal } = shouldShowCodeModal();

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
