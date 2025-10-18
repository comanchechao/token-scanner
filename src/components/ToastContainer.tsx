import React from "react";
import Toast from "./Toast";
import { ToastState } from "../hooks/useToast";

interface ToastContainerProps {
  toasts: ToastState[];
  onHideToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onHideToast,
}) => {
  return (
    <div className="fixed top-4 left-4 right-4 lg:top-6 lg:right-6 lg:left-auto lg:max-w-md z-[200] space-y-1 lg:space-y-2">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            transform: `translateY(${
              index * (window.innerWidth >= 1024 ? 60 : 50)
            }px)`,
            transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <Toast
            type={toast.type}
            title={toast.title}
            message={toast.message}
            visible={toast.visible}
            onClose={() => onHideToast(toast.id)}
            duration={toast.duration} // Use the actual duration from toast state
            txSignature={toast.txSignature} // Pass the transaction signature
          />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
