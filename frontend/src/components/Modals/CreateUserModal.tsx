import React, { useState } from "react";
import { shouldShowCreateUserModal } from "@/stores/ModalStore";
import GlobalModal from "./GlobalModal";
import { userStore } from "@/stores/UserStore";

const Modal = () => {
    const { createUser, users, fetchUsers } = userStore();
    const { show_create_user_modal, toggle_create_user_modal } =
        shouldShowCreateUserModal();

    const [formValues, setFormValues] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value })
    }

    const createNewUser = () => {
        const userExists = users.find((user) => user.email === formValues.email)
        if (userExists) {
            return
        }
        createUser(formValues.email, formValues.password)
        setFormValues({ email: '', password: '' })
    }

    const saveNewButtonData = [
        {
            label: "Cancel",
            className: "btn-neutral",
            action: () => {
                toggle_create_user_modal();
            },
        },
        {
            label: "Save",
            className: "btn-primary",
            action: () => {
                createNewUser();
            },
        },
    ];

    const renderButtons = () => {
        return (
            <>
                {saveNewButtonData.map((button, index) => (
                    <button
                        key={index}
                        tabIndex={0}
                        className={`btn btn-sm btn-filled ${button.className} modal-button`}
                        type="button"
                        onClick={button.action}
                    >
                        <span className="btn-label-wrap">
                            <span className="btn-label-inner">{button.label}</span>
                        </span>
                    </button>
                ))}
            </>
        );
    };

    return (
        <GlobalModal
            heading="Add new User"
            size="medium"
            toggleModal={toggle_create_user_modal}
            isModalOpen={show_create_user_modal}
        >
            <div className="css-xeepoz">
                <div className="body-small mb-2 flex items-center" id="save-modal-name">
                    <div className="bold mr-2">Email</div>
                </div>
                <input
                    className="text-input text-input-sm text-input-full"
                    type="email"
                    name="email"
                    onChange={handleChange}
                    value={formValues['email']}
                    required
                    autoFocus
                />
            </div>
            <br />
            <div className="css-xeepoz">
                <div className="body-small mb-2 flex items-center" id="save-modal-name">
                    <div className="bold mr-2">Password</div>
                </div>
                <input
                    className="text-input text-input-sm text-input-full"
                    type="password"
                    name="password"
                    onChange={handleChange}
                    value={formValues['password']}
                />
            </div>
            <div className="modal-footer">{renderButtons()}</div>
        </GlobalModal>
    );
};

export default Modal;
