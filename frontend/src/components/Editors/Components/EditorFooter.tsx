"use client";
import React, { useEffect, useState } from 'react';
import { promptStore } from "@/stores/PromptStore";
import { promptWorkspaceTabs } from "@/stores/TabStore";
import { makeMagic } from "@/services/MagicService";
import Modal from "@/components/Modal";
import CodeModal from "@/components/Editors/CodeModal";
import PlaygroundButton from "@/components/Form/PlaygroundButton";
import {
    shouldShowSaveModal,
    shouldSnowCodeModal
  } from "@/stores/GeneralStore";
function EditorFooter() {

  const { getDataById, activeTabeId, tabs } = promptWorkspaceTabs();
  const [ data, setData ] = useState(getDataById(activeTabeId as string) || {});

  useEffect(() => {
    const data = getDataById(activeTabeId as string) || {};
    setData(data);
  }, [activeTabeId, getDataById, tabs]);

  const {
      show_modal,
      toggle_modal
    } = shouldShowSaveModal();

    const {
      show_code_modal,
      toggle_code_modal
    } = shouldSnowCodeModal();

  return (
    <div className="pg-content-footer">
      <hr></hr>
      <div className="pg-footer-left">
        <button
          tabIndex={0}
          className={`btn btn-sm btn-filled ${
            data.loading ? 'btn-neutral' : 'btn-primary'
          } pg-submit-btn`}
          type="button"
          aria-haspopup="true"
          aria-expanded="false"
        >
        <span className="btn-label-wrap">
            <span className="btn-label-inner" onClick={() => {
              makeMagic(activeTabeId as string);
            }}>
            {data.loading ? "Processing..." : "Submit"}
            </span>
        </span>
        </button>
        <PlaygroundButton
              text="Save"
              onClick={toggle_modal}
              isFull={true}
            />
        <PlaygroundButton
            text="Code"
            onClick={toggle_code_modal}
            isFull={true}
        />
    </div>
    {show_code_modal && <CodeModal />}
    </div>
  )

}

export default EditorFooter;