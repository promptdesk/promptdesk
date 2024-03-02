import React, { useEffect, useRef, useState } from "react";
import { tabStore } from "@/stores/TabStore";
import { generateResultForPrompt, useKey, exportPrompt } from "@/services";
import CodeModal from "@/components/Modals/CodeModal";
import PlaygroundButton from "@/components/Form/PlaygroundButton";
import { promptStore } from "@/stores/prompts";
import { modelStore } from "@/stores/ModelStore";
import { shouldShowSaveModal, shouldShowCodeModal } from "@/stores/ModalStore";
import { useRouter } from "next/router";
import ModelError from "./ModelError";
import FooterSubmitButton from "./FooterSubmitButton";

function EditorFooter() {
  const { push, query } = useRouter();
  const { getDataById, activeTabId, tabs } = tabStore();
  const { promptObject } = promptStore();
  const { modelObject } = modelStore();
  const [data, setData] = useState(getDataById(activeTabId as string) || {});

  useEffect(() => {
    const data = getDataById(activeTabId as string) || {};
    setData(data);
  }, [activeTabId, getDataById, tabs]);

  const { toggle_modal } = shouldShowSaveModal();

  const { show_code_modal, toggle_code_modal } = shouldShowCodeModal();

  const goToSamplesPage = () => {
    push(`/workspace/${activeTabId}/samples`);
  };

  useKey("ctrls", () => {
    toggle_modal();
  });

  const handleClearResultClicked = () => {
    tabStore.getState().updateDataById(activeTabId as string, {
      loading: false,
      generatedText: null,
      error: undefined,
      logId: undefined,
    });
  };

  return (
    <div>
      <ModelError errorMessage={data.error} logId={data.logId}></ModelError>
      <div className="pg-content-footer">
        <div className="pg-footer-left">
          <FooterSubmitButton
            data={data}
            activeTabId={activeTabId}
            generateResultForPrompt={generateResultForPrompt}
          />
          <PlaygroundButton
            text="Save"
            id="save-prompt"
            onClick={toggle_modal}
            isFull={true}
          />
          <PlaygroundButton
            text="Code"
            onClick={toggle_code_modal}
            isFull={true}
          />
          {!promptObject.new && (
            <PlaygroundButton
              text="Samples"
              onClick={goToSamplesPage}
              id="samples-prompt"
              isFull={true}
            />
          )}
          <PlaygroundButton
            text="Export"
            onClick={() => exportPrompt(promptObject, modelObject)}
            isFull={true}
          />
          {data.generatedText || data.error ? (
            <PlaygroundButton
              text="Clear"
              id="clear-result"
              onClick={handleClearResultClicked}
              isFull={true}
            />
          ) : null}
        </div>
        {show_code_modal && <CodeModal />}
      </div>
    </div>
  );
}

export default EditorFooter;
