import React, { createContext, useContext, ReactNode } from "react";
import { useToast, ToastState } from "../hooks/useToast";
import ToastContainer from "../components/ToastContainer";

interface ToastContextType {
  toasts: ToastState[];
  showToast: (
    type: ToastState["type"],
    title: string,
    message: string,
    duration?: number,
    txSignature?: string
  ) => string;
  hideToast: (id: string) => void;
  hideAllToasts: () => void;
  showSuccess: (
    title: string,
    message: string,
    duration?: number,
    txSignature?: string
  ) => string;
  showError: (
    title: string,
    message: string,
    duration?: number,
    txSignature?: string
  ) => string;
  showWarning: (
    title: string,
    message: string,
    duration?: number,
    txSignature?: string
  ) => string;
  showInfo: (
    title: string,
    message: string,
    duration?: number,
    txSignature?: string
  ) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const toast = useToast();

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toast.toasts} onHideToast={toast.hideToast} />
    </ToastContext.Provider>
  );
};

export const useToastContext = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
};
