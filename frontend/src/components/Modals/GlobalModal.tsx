import React, { useEffect, useRef } from "react";

interface IGlobalModalProps {
  children: React.ReactNode;
  isModalOpen: boolean;
  toggleModal: () => void;
  heading?: string;
  size?: "small" | "medium" | "large" | "full" | "auto";
}

const GlobalModal: React.FC<IGlobalModalProps> = ({
  children,
  isModalOpen,
  toggleModal,
  heading = "",
  size = "auto",
}) => {
  const modeRef = useRef<HTMLElement | null>();

  useEffect(() => {
    if (!document && !modeRef) return;

    document.addEventListener("click", (e) => {
      if (isModalOpen && modeRef.current?.contains(e.target as Node))
        if (isModalOpen) {
          toggleModal();
        }
    });

    document.addEventListener("keydown", (e) => {
      if (isModalOpen && e.key === "Escape") {
        if (isModalOpen) {
          toggleModal();
        }
      }
    });
    return () => {
      document.removeEventListener("click", () => { });
      document.removeEventListener("keydown", () => { });
    };
  }, []);

  return (
    <div>
      <div className="modal-root modal-is-open modal-closeable">
        <div className="modal-backdrop" ref={(r) => (modeRef.current = r)} />
        <div className="modal-dialog-container" tabIndex={0}>
          <div className={`modal-dialog modal-size-${size}`}>
            <div>
              <div className="modal-header">
                <div className="heading-medium">{heading}</div>
                <div role="button" onClick={toggleModal}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
              <div className="modal-body body-small">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalModal;
