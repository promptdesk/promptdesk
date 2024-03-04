import { User } from '@/interfaces/user'
import React, { use } from 'react'
import PlaygroundButton from '../Form/PlaygroundButton'
import DeleteButton from '../Form/DeleteButton'
import { showingDeleteUserModalFor, showingResetModalForUser } from '@/stores/ModalStore'
import ConfirmModal from '../Modals/ConfirmModal'
import { userStore } from '@/stores/UserStore'
import PasswordResetModal from '../Modals/PasswordResetModal'

interface UserRowPropTypes {
    user: User
}

const UserRow: React.FC<UserRowPropTypes> = ({ user }) => {
    const {
        deleteUser
    } = userStore();
    const { hide_delete_modal, show_delete_user_modal_for, user_email: delete_user_email } = showingDeleteUserModalFor()
    const { hide_reset_modal, show_reset_modal_for_email, user_email } = showingResetModalForUser()
    return (
        <>
            {delete_user_email === user.email &&
                <ConfirmModal
                    acceptText='Yes'
                    bodyText='Are you sure you want to delete this user?'
                    cancelText='Cancel'
                    onAccept={() => {
                        deleteUser(user.email);
                        hide_delete_modal()
                    }}
                    onCancel={() => hide_delete_modal()}
                    title='Delete user'
                />}
            {
                user_email === user.email &&
                <PasswordResetModal
                    onCancel={() => {
                        show_reset_modal_for_email(user.email)
                        hide_reset_modal()
                    }}
                    title={"Password reset"}
                    user={user}
                />}
            <tr>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                    {user.email}
                </td>
                <td className="relative whitespace-nowrap py-4 pl-2 pr-4 text-right text-sm font-medium sm:pr-0 flex items-stretch" >
                    <div aria-haspopup="true" aria-expanded="false">
                        <PlaygroundButton
                            text="Reset Password"
                            onClick={() => {
                                show_reset_modal_for_email(user.email)
                            }}
                        />
                    </div>
                    <div aria-haspopup="true" aria-expanded="false" className='ml-2'>
                        <DeleteButton onClick={() => show_delete_user_modal_for(user.email)} />
                    </div>
                </td>
            </tr>
        </>
    )
}

export default UserRow