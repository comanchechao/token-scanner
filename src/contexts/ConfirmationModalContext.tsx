import React, { createContext, useContext, useState, useCallback } from "react";
import ConfirmationModal, {
  ConfirmationActionType,
} from "../components/ConfirmationModal";

interface ConfirmationModalState {
  open: boolean;
  title: string;
  message: string;
  actionType: ConfirmationActionType;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
  loadingText?: string;
}

interface ConfirmationModalContextType {
  showConfirmation: (config: Omit<ConfirmationModalState, "open">) => void;
  hideConfirmation: () => void;
  setLoading: (loading: boolean, loadingText?: string) => void;
}

const ConfirmationModalContext = createContext<
  ConfirmationModalContextType | undefined
>(undefined);

export const useConfirmationModal = () => {
  const context = useContext(ConfirmationModalContext);
  if (!context) {
    throw new Error(
      "useConfirmationModal must be used within a ConfirmationModalProvider"
    );
  }
  return context;
};

interface ConfirmationModalProviderProps {
  children: React.ReactNode;
}

export const ConfirmationModalProvider: React.FC<
  ConfirmationModalProviderProps
> = ({ children }) => {
  const [modalState, setModalState] = useState<ConfirmationModalState>({
    open: false,
    title: "",
    message: "",
    actionType: "custom",
    onConfirm: () => {},
  });

  const showConfirmation = useCallback(
    (config: Omit<ConfirmationModalState, "open">) => {
      setModalState({
        ...config,
        open: true,
      });
    },
    []
  );

  const hideConfirmation = useCallback(() => {
    setModalState((prev) => ({
      ...prev,
      open: false,
    }));
  }, []);

  const setLoading = useCallback((loading: boolean, loadingText?: string) => {
    setModalState((prev) => ({
      ...prev,
      isLoading: loading,
      loadingText: loadingText || "Processing...",
    }));
  }, []);

  const handleConfirm = useCallback(() => {
    modalState.onConfirm();
  }, [modalState.onConfirm]);

  const handleClose = useCallback(() => {
    if (modalState.onCancel) {
      modalState.onCancel();
    }
    hideConfirmation();
  }, [modalState.onCancel, hideConfirmation]);

  const value: ConfirmationModalContextType = {
    showConfirmation,
    hideConfirmation,
    setLoading,
  };

  return (
    <ConfirmationModalContext.Provider value={value}>
      {children}
      <ConfirmationModal
        open={modalState.open}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title={modalState.title}
        message={modalState.message}
        actionType={modalState.actionType}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        isLoading={modalState.isLoading}
        loadingText={modalState.loadingText}
      />
    </ConfirmationModalContext.Provider>
  );
};
