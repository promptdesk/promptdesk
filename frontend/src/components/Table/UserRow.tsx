import { User } from "@/interfaces/user";
import React from "react";
import PlaygroundButton from "../Form/PlaygroundButton";
import DeleteButton from "../Form/DeleteButton";
import {
  shouldShowDeleteUserModal,
  shouldShowResetPasswordUserModal,
} from "@/stores/ModalStore";
import ConfirmModal from "../Modals/ConfirmModal";
import { userStore } from "@/stores/UserStore";
import PasswordResetModal from "../Modals/PasswordResetModal";

interface UserRowPropTypes {
  user: User;
}

const UserRow: React.FC<UserRowPropTypes> = ({ user }) => {
  const { deleteUser } = userStore();
  const { show_delete_user_modal, toggle_delete_user_modal } =
    shouldShowDeleteUserModal();
  const { show_password_reset_modal, toggle_password_reset_modal } =
    shouldShowResetPasswordUserModal();
  return (
    <>
      {show_delete_user_modal && (
        <ConfirmModal
          acceptText="Yes"
          bodyText="Are you sure you want to delete this user?"
          cancelText="Cancel"
          onAccept={() => {
            deleteUser(user.email);
            toggle_delete_user_modal();
          }}
          onCancel={() => toggle_delete_user_modal()}
          title="Delete user"
        />
      )}
      {show_password_reset_modal && (
        <PasswordResetModal
          onCancel={() => {
            toggle_password_reset_modal();
          }}
          title={"Password reset successful"}
          user={user}
        />
      )}
      <tr>
        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
          {user.email}
        </td>
        <td className="relative whitespace-nowrap py-4 pl-2 pr-4 text-right text-sm font-medium sm:pr-0 flex items-stretch">
          <div aria-haspopup="true" aria-expanded="false">
            <PlaygroundButton
              text="Reset Password"
              onClick={() => {
                toggle_password_reset_modal();
              }}
            />
          </div>
          <div aria-haspopup="true" aria-expanded="false" className="ml-2">
            <DeleteButton onClick={() => toggle_delete_user_modal()} />
          </div>
        </td>
      </tr>
    </>
  );
};

export default UserRow;
