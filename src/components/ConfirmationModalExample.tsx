import React from "react";
import { useConfirmationModal } from "../contexts/ConfirmationModalContext";

const ConfirmationModalExample: React.FC = () => {
  const { showConfirmation } = useConfirmationModal();

  const handleCloseAction = () => {
    showConfirmation({
      title: "Close Item",
      message:
        "Are you sure you want to close this item? This action cannot be undone.",
      actionType: "close",
      confirmText: "Close",
      onConfirm: () => {
        console.log("Item closed!");
        // Your close logic here
      },
    });
  };

  const handlePauseAction = () => {
    showConfirmation({
      title: "Pause Process",
      message:
        "Are you sure you want to pause this process? You can resume it later.",
      actionType: "pause",
      confirmText: "Pause",
      onConfirm: () => {
        console.log("Process paused!");
        // Your pause logic here
      },
    });
  };

  const handleResumeAction = () => {
    showConfirmation({
      title: "Resume Process",
      message: "Are you sure you want to resume this process?",
      actionType: "resume",
      confirmText: "Resume",
      onConfirm: () => {
        console.log("Process resumed!");
        // Your resume logic here
      },
    });
  };

  const handleDeleteAction = () => {
    showConfirmation({
      title: "Delete Item",
      message:
        "Are you sure you want to delete this item? This action cannot be undone.",
      actionType: "delete",
      confirmText: "Delete",
      onConfirm: () => {
        console.log("Item deleted!");
        // Your delete logic here
      },
    });
  };

  const handleCustomAction = () => {
    showConfirmation({
      title: "Custom Action",
      message: "Are you sure you want to perform this custom action?",
      actionType: "custom",
      confirmText: "Proceed",
      cancelText: "No, thanks",
      onConfirm: () => {
        console.log("Custom action performed!");
        // Your custom logic here
      },
    });
  };

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-xl font-bold text-main-text">
        Confirmation Modal Examples
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          onClick={handleCloseAction}
          className="p-4 bg-red-400/10 border border-red-400/20 rounded-lg hover:bg-red-400/20 transition-colors"
        >
          <h3 className="font-semibold text-red-400 mb-2">Close Action</h3>
          <p className="text-sm text-main-light-text">
            Shows a close confirmation modal
          </p>
        </button>

        <button
          onClick={handlePauseAction}
          className="p-4 bg-yellow-400/10 border border-yellow-400/20 rounded-lg hover:bg-yellow-400/20 transition-colors"
        >
          <h3 className="font-semibold text-yellow-400 mb-2">Pause Action</h3>
          <p className="text-sm text-main-light-text">
            Shows a pause confirmation modal
          </p>
        </button>

        <button
          onClick={handleResumeAction}
          className="p-4 bg-green-400/10 border border-green-400/20 rounded-lg hover:bg-green-400/20 transition-colors"
        >
          <h3 className="font-semibold text-green-400 mb-2">Resume Action</h3>
          <p className="text-sm text-main-light-text">
            Shows a resume confirmation modal
          </p>
        </button>

        <button
          onClick={handleDeleteAction}
          className="p-4 bg-red-400/10 border border-red-400/20 rounded-lg hover:bg-red-400/20 transition-colors"
        >
          <h3 className="font-semibold text-red-400 mb-2">Delete Action</h3>
          <p className="text-sm text-main-light-text">
            Shows a delete confirmation modal
          </p>
        </button>

        <button
          onClick={handleCustomAction}
          className="p-4 bg-main-accent/10 border border-main-accent/20 rounded-lg hover:bg-main-accent/20 transition-colors"
        >
          <h3 className="font-semibold text-main-accent mb-2">Custom Action</h3>
          <p className="text-sm text-main-light-text">
            Shows a custom confirmation modal
          </p>
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModalExample;
