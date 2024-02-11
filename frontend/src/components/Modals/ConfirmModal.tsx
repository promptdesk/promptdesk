import React from "react";

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
    <div className="modal-root modal-is-open modal-closeable">
      <div className="modal-backdrop" />
      <div className="modal-dialog-container" tabIndex={0}>
        <div className="modal-dialog modal-size-medium">
          <div>
            <div className="modal-header heading-medium">{title}</div>
            <div className="modal-body body-small">
              <p>{bodyText}</p>
            </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
