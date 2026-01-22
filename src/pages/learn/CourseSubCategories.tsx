import React, { useState } from "react";

import { PlusIcon } from "lucide-react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import DeleteConfirmModal from "../../components/learn/forms/DeleteConfirmModal";
import SubCategoryForm from "../../components/learn/forms/SubCategoryForm";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  useSubCategories,
  useCreateSubCategory,
  useUpdateSubCategory,
  useDeleteSubCategory,
  useCategories,
} from "../../hooks/useApi";
import type { CourseCategory } from "../../types/CourseCategories.types";
import { EmptyState } from "../../components/shared/EmptyState";

type ModalMode = "create" | "edit" | null;

const CourseSubCategoriesAdmin: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const { data: subCategories, isLoading, error, refetch } = useSubCategories();
  const createSubCategoryMutation = useCreateSubCategory();
  const updateSubCategoryMutation = useUpdateSubCategory();
  const deleteSubCategoryMutation = useDeleteSubCategory();

  // Categories

  const { data: categories } = useCategories();

  // Modal States
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<CourseCategory | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] =
    useState<CourseCategory | null>(null);

  // Toast State
  const [, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

  const content = {
    en: {
      title: "Course Sub-Categories Management",
      description: "Create, edit, and manage your course sub-categories",
      createNew: "Create New Sub-Category",
      search: "Search sub-categories...",
      showAll: "All",
      showActive: "Active Only",
      showInactive: "Inactive Only",
      category: "Sub-Category",
      courses: "Courses",
      status: "Status",
      actions: "Actions",
      active: "Active",
      inactive: "Inactive",
      edit: "Edit",
      delete: "Delete",
      loading: "Loading sub-categories...",
      error: "Failed to load sub-categories",
      retry: "Try Again",
      noCategories: "No sub-categories found",
      noCategoriesDesc: "Create your first sub-category to get started",
      createSuccess: "Sub-category created successfully!",
      updateSuccess: "Sub-category updated successfully!",
      deleteSuccess: "Sub-category deleted successfully!",
      operationError: "Operation failed. Please try again.",
      descriptionColumn: "Description",
    },
    fr: {
      title: "Gestion des catégories de cours",
      description: "Créez, modifiez et gérez vos catégories de cours",
      createNew: "Créer une nouvelle catégorie",
      search: "Rechercher des catégories...",
      showAll: "Tout",
      showActive: "Actifs uniquement",
      showInactive: "Inactifs uniquement",
      category: "Catégorie",

      courses: "Cours",
      status: "Statut",
      actions: "Actions",
      active: "Actif",
      inactive: "Inactif",
      edit: "Modifier",
      delete: "Supprimer",
      loading: "Chargement des catégories...",
      error: "Échec du chargement des catégories",
      retry: "Réessayer",
      noCategories: "Aucune catégorie trouvée",
      noCategoriesDesc: "Créez votre première catégorie pour commencer",
      createSuccess: "Catégorie créée avec succès!",
      updateSuccess: "Catégorie mise à jour avec succès!",
      deleteSuccess: "Catégorie supprimée avec succès!",
      operationError: "L'opération a échoué. Veuillez réessayer.",
      descriptionColumn: "Description",
    },
    ar: {
      title: "إدارة فئات الدورات",
      description: "أنشئ وعدل وأدر فئات الدورات الخاصة بك",
      createNew: "إنشاء فئة جديدة",
      search: "البحث عن فئات...",
      showAll: "الكل",
      showActive: "النشط فقط",
      showInactive: "غير النشط فقط",
      category: "الفئة",
      courses: "الدورات",
      status: "الحالة",
      actions: "الإجراءات",
      active: "نشط",
      inactive: "غير نشط",
      edit: "تعديل",
      delete: "حذف",
      loading: "جاري تحميل الفئات...",
      error: "فشل تحميل الفئات",
      retry: "حاول مرة أخرى",
      noCategories: "لم يتم العثور على فئات",
      noCategoriesDesc: "أنشئ فئتك الأولى للبدء",
      createSuccess: "تم إنشاء الفئة بنجاح!",
      updateSuccess: "تم تحديث الفئة بنجاح!",
      deleteSuccess: "تم حذف الفئة بنجاح!",
      operationError: "فشلت العملية. يرجى المحاولة مرة أخرى.",
      descriptionColumn: "الوصف",
    },
  };

  const text = content[language];

  // Handlers
  const handleCreate = () => {
    setSelectedCategory(null);
    setModalMode("create");
  };

  const handleEdit = (category: CourseCategory) => {
    setSelectedCategory(category);
    setModalMode("edit");
  };

  const handleDeleteClick = (category: CourseCategory) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteSubCategoryMutation.mutateAsync(categoryToDelete.id);
      showToast(text.deleteSuccess, "success");
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Delete category failed:", error);
      showToast(text.operationError, "error");
    }
  };

  const handleModalSuccess = (mode: "create" | "edit") => {
    const message = mode === "create" ? text.createSuccess : text.updateSuccess;
    showToast(message, "success");
    setModalMode(null);
    refetch();
  };

  const handleCategorySubmit = async (formData: {
    name: string;
    description: string;
  }) => {
    try {
      if (modalMode === "create") {
        await createSubCategoryMutation.mutateAsync(formData);
        handleModalSuccess("create");
      } else if (modalMode === "edit" && selectedCategory) {
        await updateSubCategoryMutation.mutateAsync({
          id: selectedCategory.id,
          category: formData,
        });
        handleModalSuccess("edit");
      }
    } catch (error) {
      console.error("Category operation failed:", error);
      showToast(text.operationError, "error");
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000
    );
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8" dir={isRTL ? "rtl" : "ltr"}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="h-10 bg-gray-200 rounded-lg w-96 mb-4 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded-lg w-64 animate-pulse" />
          </div>
          <div className="card p-6 animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-4" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8" dir={isRTL ? "rtl" : "ltr"}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card text-center py-20">
            <svg
              className="w-24 h-24 mx-auto mb-6 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="font-heading text-2xl font-semibold text-gray-700 mb-4">
              {text.error}
            </h2>
            <Button onClick={() => refetch()} className="btn-primary">
              {text.retry}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 " dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl font-bold text-gray-800 mb-2">
                {text.title}
              </h1>
              <p className="font-body text-gray-600">{text.description}</p>
            </div>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PlusIcon className="w-5 h-5" />}
              onClick={handleCreate}
            >
              {text.createNew}
            </Button>
          </div>
        </div>

        {/* Categories Table/Cards */}
        {subCategories && subCategories.length === 0 ? (
          <EmptyState message="No sub-categories found. Click 'Create New Sub-Category' to get started." />
        ) : (
          <div className="card overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full bg-white">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {text.category}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {text.descriptionColumn}
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {text.status}
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {text.actions}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {subCategories &&
                    subCategories.map((subCategory) => (
                      <tr
                        key={subCategory.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="font-semibold text-gray-800">
                                {subCategory.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {subCategory.slug}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {subCategory.description}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                              subCategory.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {subCategory.isActive ? text.active : text.inactive}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              onClick={() => handleEdit(subCategory)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              aria-label={`${text.edit} ${subCategory.name}`}
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </Button>
                            <Button
                              onClick={() => handleDeleteClick(subCategory)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              aria-label={`${text.delete} ${subCategory.name}`}
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-200">
              {subCategories &&
                subCategories.map((subCategory) => (
                  <div key={subCategory.id} className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <p className="font-semibold text-gray-800">
                            {subCategory.name}
                          </p>
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                              subCategory.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {subCategory.isActive ? text.active : text.inactive}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {subCategory.description}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEdit(subCategory)}
                            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            {text.edit}
                          </Button>
                          <Button
                            onClick={() => handleDeleteClick(subCategory)}
                            className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                          >
                            {text.delete}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Category Modal */}
      <Modal
        open={modalMode !== null}
        onClose={() => {
          if (
            !createSubCategoryMutation.isPending &&
            !updateSubCategoryMutation.isPending
          ) {
            setModalMode(null);
          }
        }}
        aria-labelledby="subcategory-modal-title"
        aria-describedby="subcategory-modal-description"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-lg shadow-xl">
          {modalMode && (
            <SubCategoryForm
              mode={modalMode}
              initialData={
                selectedCategory
                  ? {
                      name: selectedCategory.name,
                      description: selectedCategory.description,
                      categoryId: selectedCategory.id,
                    }
                  : undefined
              }
              onSubmit={handleCategorySubmit}
              onCancel={() => setModalMode(null)}
              isLoading={
                createSubCategoryMutation.isPending ||
                updateSubCategoryMutation.isPending
              }
              categories={categories || []}
            />
          )}
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        onClose={() => {
          if (!deleteSubCategoryMutation.isPending) {
            setDeleteModalOpen(false);
            setCategoryToDelete(null);
          }
        }}
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-lg shadow-xl">
          {categoryToDelete && (
            <DeleteConfirmModal
              categoryName={categoryToDelete.name}
              onConfirm={handleDeleteConfirm}
              onCancel={() => {
                setDeleteModalOpen(false);
                setCategoryToDelete(null);
              }}
              isLoading={deleteSubCategoryMutation.isPending}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default CourseSubCategoriesAdmin;
