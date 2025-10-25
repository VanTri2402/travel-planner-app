import React, { Fragment } from "react";
import { TrashIcon } from "./icons";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return (
    // Lớp phủ (Overlay)
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in-up"
      style={{ animationDuration: "0.2s" }}
      onClick={onClose}
    >
      {/* Nội dung Modal */}
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md m-4"
        onClick={(e) => e.stopPropagation()} // Ngăn click bên trong modal đóng nó
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-red-100">
              <TrashIcon className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3
                className="text-xl font-bold text-gray-900 font-lexend"
                id="modal-title"
              >
                {title}
              </h3>
              <p className="text-sm text-gray-600 mt-2">{message}</p>
            </div>
          </div>
        </div>

        {/* Nút Hành động */}
        <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-auto inline-flex justify-center rounded-lg border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
