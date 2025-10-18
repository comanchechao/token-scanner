import React from "react";
import { useAuthenticationModal } from "../contexts/AuthenticationModalContext";
import AuthenticationModal from "./AuthenticationModal";

const AuthenticationModalWrapper: React.FC = () => {
  const { isOpen, closeModal, onSuccess } = useAuthenticationModal();

  return (
    <AuthenticationModal
      open={isOpen}
      onClose={closeModal}
      onSuccess={onSuccess}
    />
  );
};

export default AuthenticationModalWrapper;
