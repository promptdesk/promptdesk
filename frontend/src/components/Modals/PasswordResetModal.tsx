import React, { useEffect, useState } from "react";
import GlobalModal from "./GlobalModal";
import { userStore } from "@/stores/UserStore";
import { User } from "@/interfaces/user";
import PlaygroundButton from "../Form/PlaygroundButton";

interface PasswordResetModalPropTypes {
  title: string;
  onCancel: () => void;
  user: User;
}
const PasswordResetModal: React.FC<PasswordResetModalPropTypes> = ({
  title,
  onCancel,
  user,
}) => {
  const { resetPassword } = userStore();
  const [newPass, setNewPass] = useState("");

  const getNewPassword = () => {
    resetPassword(user.email).then((res) => {
      setNewPass(res.password);
    });
  };
  return (
    <GlobalModal
      heading={title}
      size="medium"
      isModalOpen={true}
      toggleModal={onCancel}
    >
      <div className="flex-col justify-center">
        <PlaygroundButton
          onClick={getNewPassword}
          text="Reset"
          color="primary"
        />
        <h1>{newPass}</h1>
      </div>
      <div className="modal-footer" style={{ marginTop: "-10px" }}>
        <button
          tabIndex={0}
          className="btn btn-sm btn-filled btn-neutral modal-button"
          type="button"
          onClick={onCancel}
        >
          <span className="btn-label-wrap">
            <span className="btn-label-inner">{"Close"}</span>
          </span>
        </button>
      </div>
    </GlobalModal>
  );
};

export default PasswordResetModal;
