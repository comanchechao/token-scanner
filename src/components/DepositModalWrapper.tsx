import React from "react";
import DepositModal from "./DepositModal";
import { useDepositModal } from "../contexts/DepositModalContext";

const DepositModalWrapper: React.FC = () => {
  const { isOpen, closeModal } = useDepositModal();

  return <DepositModal isOpen={isOpen} onClose={closeModal} />;
};

export default DepositModalWrapper;