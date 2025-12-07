import React from "react";
import { useLanguage } from "../../../contexts/LanguageContext";
import Button from "@mui/material/Button";

interface DeleteConfirmModalProps {
  categoryName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  categoryName,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  const { language, isRTL } = useLanguage();

  const content = {
    en: {
      title: "Delete Category",
      message: "Are you sure you want to delete this category?",
      categoryLabel: "Category:",
      warning:
        "This action cannot be undone and may affect associated courses.",
      cancel: "Cancel",
      delete: "Delete Category",
      deleting: "Deleting...",
    },
    fr: {
      title: "Supprimer la catégorie",
      message: "Êtes-vous sûr de vouloir supprimer cette catégorie ?",
      categoryLabel: "Catégorie :",
      warning:
        "Cette action ne peut pas être annulée et peut affecter les cours associés.",
      cancel: "Annuler",
      delete: "Supprimer la catégorie",
      deleting: "Suppression en cours...",
    },
    ar: {
      title: "حذف الفئة",
      message: "هل أنت متأكد من رغبتك في حذف هذه الفئة؟",
      categoryLabel: "الفئة:",
      warning: "لا يمكن التراجع عن هذا الإجراء وقد يؤثر على الدورات المرتبطة.",
      cancel: "إلغاء",
      delete: "حذف الفئة",
      deleting: "جاري الحذف...",
    },
  };

  const text = content[language];

  return (
    <div className="p-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Icon */}
      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
        <svg
          className="w-8 h-8 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
        {text.title}
      </h3>

      {/* Message */}
      <p className="text-gray-600 text-center mb-4">{text.message}</p>

      {/* Category Name */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <p className="text-sm text-gray-600 mb-1">{text.categoryLabel}</p>
        <p className="font-semibold text-gray-900">{categoryName}</p>
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
        <div className="flex items-start gap-2">
          <svg
            className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <p className="text-sm text-yellow-800">{text.warning}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="outlined"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {text.cancel}
        </Button>
        <Button
          type="button"
          variant="contained"
          color="error"
          onClick={onConfirm}
          disabled={isLoading}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading && (
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          {isLoading ? text.deleting : text.delete}
        </Button>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
