import React from "react";
import GlobalModal from "./GlobalModal";
import { sign } from "crypto";

interface ConfirmModalProps {
  title: string;
  bodyText: string;
  cancelText: string;
  acceptText: string;
  onCancel: () => void;
  onAccept: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  bodyText,
  cancelText,
  acceptText,
  onCancel,
  onAccept,
}) => {
  return (
    <GlobalModal
      heading={title}
      size="medium"
      isModalOpen={true}
      toggleModal={onCancel}
    >
      <p>{bodyText}</p>
      <div className="modal-footer">
        <button
          tabIndex={0}
          className="btn btn-sm btn-filled btn-neutral modal-button"
          type="button"
          onClick={onCancel}
        >
          <span className="btn-label-wrap">
            <span className="btn-label-inner">{cancelText}</span>
          </span>
        </button>
        <button
          tabIndex={0}
          className="btn btn-sm btn-filled btn-primary modal-button"
          type="button"
          onClick={onAccept}
        >
          <span className="btn-label-wrap">
            <span className="btn-label-inner">{acceptText}</span>
          </span>
        </button>
      </div>
    </GlobalModal>
  );
};

export default ConfirmModal;
