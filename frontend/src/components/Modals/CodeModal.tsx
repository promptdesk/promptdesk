import React, { useEffect, useState } from "react";
import { shouldShowCodeModal } from "@/stores/ModalStore";
import { promptStore } from "@/stores/prompts";
import Cookies from "js-cookie";
import CopyWrapper from "../CopyWrapper";
import GlobalModal from "./GlobalModal";

const transformObject = (obj: {
  [key: string]: any;
}): { [key: string]: any } => {
  return Object.keys(obj).reduce((acc: { [key: string]: any }, key) => {
    const value = obj[key];
    acc[key] = Array.isArray(value) ? [...value] : value;
    return acc;
  }, {});
};

const CodeModal = () => {
  const { promptObject } = promptStore() as { promptObject: any };
  const [apiKey, setApiKey] = useState("");
  const [serviceURL, setServiceURL] = useState(window.location.origin);

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

    if (process.env.PROMPT_SERVER_URL) {
      setServiceURL(process.env.PROMPT_SERVER_URL);
    }
  }, []);

  const finalObject = Object.keys(promptObject.prompt_variables).reduce(
    (acc: any, key) => {
      const variable = promptObject.prompt_variables[key];
      const { value } = variable; // Destructuring for clarity

      // Direct assignment if value is not an object, or it's an array
      acc[key] =
        typeof value === "object" && !Array.isArray(value)
          ? transformObject(value)
          : value;

      return acc;
    },
    {},
  );

  const codeTemplate = `from promptdesk import PromptDesk

pd = PromptDesk(
    api_key="${apiKey.replace(/"/g, '\\"')}",
    service_url="${serviceURL.replace(/"/g, '\\"')}"
)

result = pd.generate("${promptObject.name.replace(/"/g, '\\"')}", ${JSON.stringify(finalObject, null, 2)})`;

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
    <GlobalModal
      isModalOpen={show_code_modal}
      toggleModal={toggle_code_modal}
      heading="Source Code"
      size="large"
    >
      <CopyWrapper textToCopy={codeTemplate}>
        <pre
          style={{ whiteSpace: "pre-wrap" }}
          suppressContentEditableWarning={true}
          className="hljs syntax-highlighter dark code-sample-pre p-8 rounded-md"
        >
          {codeTemplate}
        </pre>
      </CopyWrapper>
      <div className="modal-footer">{renderButtons()}</div>
    </GlobalModal>
  );
};

export default CodeModal;
