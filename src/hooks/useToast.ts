import { useState, useCallback } from "react";

export interface ToastState {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  visible: boolean;
  duration?: number;
  txSignature?: string;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = useCallback(
    (
      type: ToastState["type"],
      title: string,
      message: string,
      duration: number = 3000,
      txSignature?: string
    ) => {
      const id = Date.now().toString();

      const actualDuration = txSignature ? 10000 : duration;

      const newToast: ToastState = {
        id,
        type,
        title,
        message,
        visible: true,
        duration: actualDuration,
        txSignature,
      };

      setToasts((prev) => [...prev, newToast]);

      return id;
    },
    []
  );

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const hideAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const showSuccess = useCallback(
    (
      title: string,
      message: string,
      duration?: number,
      txSignature?: string
    ) => {
      return showToast(
        "success",
        title,
        message,
        duration || 5000,
        txSignature
      );
    },
    [showToast]
  );

  const showError = useCallback(
    (
      title: string,
      message: string,
      duration?: number,
      txSignature?: string
    ) => {
      return showToast("error", title, message, duration || 6000, txSignature);
    },
    [showToast]
  );

  const showWarning = useCallback(
    (
      title: string,
      message: string,
      duration?: number,
      txSignature?: string
    ) => {
      return showToast(
        "warning",
        title,
        message,
        duration || 4000,
        txSignature
      );
    },
    [showToast]
  );

  const showInfo = useCallback(
    (
      title: string,
      message: string,
      duration?: number,
      txSignature?: string
    ) => {
      return showToast("info", title, message, duration || 4000, txSignature);
    },
    [showToast]
  );

  return {
    toasts,
    showToast,
    hideToast,
    hideAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
