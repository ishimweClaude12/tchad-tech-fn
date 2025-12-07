import React, { useState } from "react";
import { useLanguage } from "../../../contexts/LanguageContext";
import Button from "@mui/material/Button";

interface CategoryFormData {
  name: string;
  description: string;
}

interface CategoryFormProps {
  initialData?: CategoryFormData;
  onSubmit: (data: CategoryFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode: "create" | "edit";
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  mode,
}) => {
  const { language, isRTL } = useLanguage();

  const [formData, setFormData] = useState<CategoryFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
  });

  const [errors, setErrors] = useState<Partial<CategoryFormData>>({});

  const content = {
    en: {
      createTitle: "Create New Category",
      editTitle: "Edit Category",
      name: "Category Name",
      namePlaceholder: "Enter category name",
      description: "Description",
      descriptionPlaceholder: "Enter category description",
      cancel: "Cancel",
      create: "Create Category",
      update: "Update Category",
      creating: "Creating...",
      updating: "Updating...",
      nameRequired: "Category name is required",
      descriptionRequired: "Description is required",
    },
    fr: {
      createTitle: "Créer une nouvelle catégorie",
      editTitle: "Modifier la catégorie",
      name: "Nom de la catégorie",
      namePlaceholder: "Entrez le nom de la catégorie",
      description: "Description",
      descriptionPlaceholder: "Entrez la description de la catégorie",
      cancel: "Annuler",
      create: "Créer la catégorie",
      update: "Mettre à jour la catégorie",
      creating: "Création en cours...",
      updating: "Mise à jour en cours...",
      nameRequired: "Le nom de la catégorie est requis",
      descriptionRequired: "La description est requise",
    },
    ar: {
      createTitle: "إنشاء فئة جديدة",
      editTitle: "تعديل الفئة",
      name: "اسم الفئة",
      namePlaceholder: "أدخل اسم الفئة",
      description: "الوصف",
      descriptionPlaceholder: "أدخل وصف الفئة",
      cancel: "إلغاء",
      create: "إنشاء فئة",
      update: "تحديث الفئة",
      creating: "جاري الإنشاء...",
      updating: "جاري التحديث...",
      nameRequired: "اسم الفئة مطلوب",
      descriptionRequired: "الوصف مطلوب",
    },
  };

  const text = content[language];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof CategoryFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CategoryFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = text.nameRequired;
    }

    if (!formData.description.trim()) {
      newErrors.description = text.descriptionRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({
        name: formData.name.trim(),
        description: formData.description.trim(),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Form Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {mode === "create" ? text.createTitle : text.editTitle}
        </h3>
      </div>

      {/* Category Name Field */}
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {text.name} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder={text.namePlaceholder}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
            errors.name
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300"
          }`}
          disabled={isLoading}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      {/* Description Field */}
      <div className="mb-6">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {text.description} <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder={text.descriptionPlaceholder}
          rows={4}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
            errors.description
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300"
          }`}
          disabled={isLoading}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
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
          type="submit"
          variant="contained"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
          {isLoading
            ? mode === "create"
              ? text.creating
              : text.updating
            : mode === "create"
            ? text.create
            : text.update}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
