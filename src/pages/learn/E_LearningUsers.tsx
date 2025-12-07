import React, { useState, useRef, useEffect } from "react";

import {
  MoreVertical,
  UserCheck,
  UserX,
  Calendar,
  Mail,
  Shield,
  Check,
  Loader2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useLanguage } from "../../contexts/LanguageContext";
import { useUpdateUser, useUsers } from "../../hooks/useApi";
import { UserRole, type User } from "../../types/Users.types";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const E_LearningUsersAdmin: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const [currentPage] = useState(1);

  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    data: users,
    isLoading,
    isError,
  } = useUsers(currentPage.toString(), "10");

  const handleOpen = (userId: string) => {
    setSelectedUserId(userId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUserId(null);
  };

  // Format date helper
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(
      language === "ar" ? "ar-EG" : language === "fr" ? "fr-FR" : "en-US",
      { year: "numeric", month: "short", day: "numeric" }
    );
  };

  // Format relative time
  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0)
      return language === "ar"
        ? "اليوم"
        : language === "fr"
        ? "Aujourd'hui"
        : "Today";
    if (days === 1)
      return language === "ar"
        ? "أمس"
        : language === "fr"
        ? "Hier"
        : "Yesterday";
    if (days < 7)
      return `${days} ${
        language === "ar" ? "أيام" : language === "fr" ? "jours" : "days ago"
      }`;
    if (days < 30) {
      const weeks = Math.floor(days / 7);
      return `${weeks} ${
        language === "ar"
          ? "أسابيع"
          : language === "fr"
          ? "semaines"
          : "weeks ago"
      }`;
    }
    return formatDate(timestamp);
  };

  // Get role badge color
  const getRoleBadgeColor = (role: UserRole) => {
    const colors = {
      SUPPER_ADMIN: "bg-purple-100 text-purple-800 border-purple-200",
      ADMIN: "bg-red-100 text-red-800 border-red-200",
      INSTRUCTOR: "bg-blue-100 text-blue-800 border-blue-200",
      STUDENT: "bg-green-100 text-green-800 border-green-200",
      INNOVATOR: "bg-orange-100 text-orange-800 border-orange-200",
      INVESTOR: "bg-yellow-100 text-yellow-800 border-yellow-200",
      CLIENT: "bg-teal-100 text-teal-800 border-teal-200",
      BUSINESS_AGENT: "bg-indigo-100 text-indigo-800 border-indigo-200",
    };
    return colors[role] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  // Get role display name
  const getRoleDisplayName = (role: UserRole) => {
    if (language === "ar") {
      const arabicRoles = {
        SUPPER_ADMIN: "مدير عام",
        ADMIN: "مدير",
        INSTRUCTOR: "مدرس",
        STUDENT: "طالب",
        INNOVATOR: "مبتكر",
        INVESTOR: "مستثمر",
        CLIENT: "عميل",
        BUSINESS_AGENT: "وكيل أعمال",
      };
      return arabicRoles[role] || role;
    } else if (language === "fr") {
      const frenchRoles = {
        SUPPER_ADMIN: "Super Admin",
        ADMIN: "Administrateur",
        INSTRUCTOR: "Instructeur",
        STUDENT: "Étudiant",
        INNOVATOR: "Innovateur",
        INVESTOR: "Investisseur",
        CLIENT: "Client",
        BUSINESS_AGENT: "Agent Commercial",
      };
      return frenchRoles[role] || role;
    }
    return role.replace(/_/g, " ");
  };

  // Initialize the update user mutation
  const updateUserMutation = useUpdateUser();

  // Handle role update
  const handleRoleUpdate = async (userId: string, newRole: UserRole) => {
    console.log("Initiating role update...", { userId, newRole });

    setUpdatingUserId(userId);
    setOpenDropdownId(null);

    console.log("Updating user role...", { userId, newRole });

    try {
      await updateUserMutation.mutateAsync({
        id: userId,
        role: newRole,
      });

      // Show success toast message
      const successMessage =
        language === "ar"
          ? `تم تحديث دور المستخدم بنجاح إلى ${getRoleDisplayName(newRole)}`
          : language === "fr"
          ? `Rôle utilisateur mis à jour avec succès vers ${getRoleDisplayName(
              newRole
            )}`
          : `User role updated successfully to ${getRoleDisplayName(newRole)}`;

      toast.success(successMessage, {
        duration: 4000,
        position: isRTL ? "top-left" : "top-right",
        style: {
          background: "#10B981",
          color: "#ffffff",
        },
        icon: "✅",
      });
    } catch (error) {
      console.error("Failed to update user role:", error);

      // Show error toast message
      const errorMessage =
        language === "ar"
          ? "فشل في تحديث دور المستخدم. يرجى المحاولة مرة أخرى."
          : language === "fr"
          ? "Échec de la mise à jour du rôle utilisateur. Veuillez réessayer."
          : "Failed to update user role. Please try again.";

      toast.error(errorMessage, {
        duration: 5000,
        position: isRTL ? "top-left" : "top-right",
        style: {
          background: "#EF4444",
          color: "#ffffff",
        },
        icon: "❌",
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Get available roles for dropdown
  const availableRoles = Object.values(UserRole);

  // Handle clicking outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get translation for action menu items
  const getTranslation = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      viewDetails: {
        en: "View Details",
        fr: "Voir les détails",
        ar: "عرض التفاصيل",
      },
      editUser: {
        en: "Edit User",
        fr: "Modifier l'utilisateur",
        ar: "تعديل المستخدم",
      },
      deleteUser: {
        en: "Delete User",
        fr: "Supprimer l'utilisateur",
        ar: "حذف المستخدم",
      },
      changeRole: {
        en: "Change User Role",
        fr: "Changer le rôle",
        ar: "تغيير دور المستخدم",
      },
      lockAccount: {
        en: "Lock Account",
        fr: "Verrouiller le compte",
        ar: "قفل الحساب",
      },
      unlockAccount: {
        en: "Unlock Account",
        fr: "Déverrouiller le compte",
        ar: "فتح الحساب",
      },
      banUser: {
        en: "Ban User",
        fr: "Bannir l'utilisateur",
        ar: "حظر المستخدم",
      },
      unbanUser: {
        en: "Unban User",
        fr: "Débannir l'utilisateur",
        ar: "إلغاء الحظر",
      },
    };

    return translations[key]?.[language] || translations[key]?.en || key;
  };

  // Get the selected user for the modal
  const selectedUser = users?.find((u: User) => u.userId === selectedUserId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">
            {language === "ar"
              ? "جاري التحميل..."
              : language === "fr"
              ? "Chargement..."
              : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserX className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {language === "ar"
              ? "خطأ في تحميل المستخدمين"
              : language === "fr"
              ? "Erreur de chargement"
              : "Error Loading Users"}
          </h3>
          <p className="text-gray-600">
            {language === "ar"
              ? "يرجى المحاولة مرة أخرى"
              : language === "fr"
              ? "Veuillez réessayer"
              : "Please try again"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 ">
      {/* Header */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
          isRTL ? "sm:flex-row-reverse" : ""
        }`}
      >
        <div>
          <h1
            className={`text-2xl font-bold text-gray-900 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {language === "ar"
              ? "إدارة المستخدمين"
              : language === "fr"
              ? "Gestion des Utilisateurs"
              : "User Management"}
          </h1>
          <p
            className={`text-gray-600 mt-1 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {language === "ar"
              ? "إدارة أدوار المستخدمين وصلاحياتهم"
              : language === "fr"
              ? "Gérer les rôles et permissions des utilisateurs"
              : "Manage user roles and permissions"}
          </p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 justify-center">
          <UserCheck className="w-4 h-4" />
          {language === "ar"
            ? "إضافة مستخدم"
            : language === "fr"
            ? "Ajouter Utilisateur"
            : "Add User"}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white relative h-full rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {language === "ar"
                    ? "المستخدم"
                    : language === "fr"
                    ? "Utilisateur"
                    : "User"}
                </th>
                <th
                  className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {language === "ar"
                    ? "الدور"
                    : language === "fr"
                    ? "Rôle"
                    : "Role"}
                </th>
                <th
                  className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {language === "ar"
                    ? "الحالة"
                    : language === "fr"
                    ? "Statut"
                    : "Status"}
                </th>
                <th
                  className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {language === "ar"
                    ? "آخر تسجيل دخول"
                    : language === "fr"
                    ? "Dernière connexion"
                    : "Last Sign In"}
                </th>
                <th
                  className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {language === "ar"
                    ? "تاريخ الانضمام"
                    : language === "fr"
                    ? "Date d'inscription"
                    : "Joined Date"}
                </th>
                <th
                  className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {language === "ar"
                    ? "الإجراءات"
                    : language === "fr"
                    ? "Actions"
                    : "Actions"}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users && users.length > 0 ? (
                users.map((user: User) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* User Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`flex items-center gap-3 ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <div className="shrink-0">
                          {user.clerkProfile.hasImage ? (
                            <img
                              src={user.clerkProfile.imageUrl}
                              alt={`${user.clerkProfile.firstName} ${user.clerkProfile.lastName}`}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold">
                              {user.clerkProfile.firstName?.[0]}
                              {user.clerkProfile.lastName?.[0]}
                            </div>
                          )}
                        </div>
                        <div className={isRTL ? "text-right" : "text-left"}>
                          <div className="font-medium text-gray-900">
                            {user.clerkProfile.firstName}{" "}
                            {user.clerkProfile.lastName}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.clerkProfile.emailAddresses[0]?.emailAddress}
                          </div>
                          {user.clerkProfile.username && (
                            <div className="text-xs text-gray-400">
                              @{user.clerkProfile.username}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {updatingUserId === user.id && (
                          <Loader2 className="w-4 h-4 animate-spin text-primary-600" />
                        )}
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                            user.role
                          )}`}
                        >
                          <Shield className="w-3 h-3" />
                          {getRoleDisplayName(user.role)}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        {user.clerkProfile.banned ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200 w-fit">
                            <UserX className="w-3 h-3" />
                            {language === "ar"
                              ? "محظور"
                              : language === "fr"
                              ? "Banni"
                              : "Banned"}
                          </span>
                        ) : user.clerkProfile.locked ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200 w-fit">
                            <UserX className="w-3 h-3" />
                            {language === "ar"
                              ? "مقفل"
                              : language === "fr"
                              ? "Verrouillé"
                              : "Locked"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 w-fit">
                            <UserCheck className="w-3 h-3" />
                            {language === "ar"
                              ? "نشط"
                              : language === "fr"
                              ? "Actif"
                              : "Active"}
                          </span>
                        )}
                        {user.clerkProfile.emailAddresses[0]?.verification
                          .status === "verified" && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 w-fit">
                            <Mail className="w-3 h-3" />
                            {language === "ar"
                              ? "موثق"
                              : language === "fr"
                              ? "Vérifié"
                              : "Verified"}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Last Sign In */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm text-gray-900 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {formatRelativeTime(user.clerkProfile.lastSignInAt)}
                      </div>
                      <div
                        className={`text-xs text-gray-500 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {formatDate(user.clerkProfile.lastSignInAt)}
                      </div>
                    </td>

                    {/* Joined Date */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`flex items-center gap-1 text-sm text-gray-900 ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatDate(user.clerkProfile.createdAt)}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        onClick={() => handleOpen(user.userId)}
                        disabled={updatingUserId === user.id}
                        className={`p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors ${
                          updatingUserId === user.id
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <UserX className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {language === "ar"
                            ? "لم يتم العثور على مستخدمين"
                            : language === "fr"
                            ? "Aucun utilisateur trouvé"
                            : "No Users Found"}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {language === "ar"
                            ? "جرب تعديل معايير البحث أو الفلترة"
                            : language === "fr"
                            ? "Essayez de modifier vos critères de recherche"
                            : "Try adjusting your search or filter criteria"}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Change Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="change-role-modal"
        aria-describedby="change-user-role-modal"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "90%",
            maxWidth: "480px",
            maxHeight: "90vh",
            bgcolor: "background.paper",
            borderRadius: "16px",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            outline: "none",
            overflow: "hidden",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div
            className={`px-6 py-5 border-b border-gray-200 bg-linear-to-r from-primary-50 to-primary-100 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`flex items-center justify-between ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary-600" />
                  {getTranslation("changeRole")}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {language === "ar"
                    ? "اختر دورًا جديدًا للمستخدم"
                    : language === "fr"
                    ? "Sélectionnez un nouveau rôle pour l'utilisateur"
                    : "Select a new role for the user"}
                </p>
              </div>
              <Button onClick={handleClose} variant="outlined" color="error">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Current User Info */}
            {selectedUser && (
              <div
                className={`mt-4 p-3 bg-white rounded-lg border border-gray-200 flex items-center gap-3 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div className="shrink-0">
                  {selectedUser.clerkProfile.hasImage ? (
                    <img
                      src={selectedUser.clerkProfile.imageUrl}
                      alt={`${selectedUser.clerkProfile.firstName} ${selectedUser.clerkProfile.lastName}`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-sm">
                      {selectedUser.clerkProfile.firstName?.[0]}
                      {selectedUser.clerkProfile.lastName?.[0]}
                    </div>
                  )}
                </div>
                <div className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
                  <div className="font-semibold text-gray-900 text-sm">
                    {selectedUser.clerkProfile.firstName}{" "}
                    {selectedUser.clerkProfile.lastName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {selectedUser.clerkProfile.emailAddresses[0]?.emailAddress}
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                    selectedUser.role
                  )}`}
                >
                  {getRoleDisplayName(selectedUser.role)}
                </span>
              </div>
            )}
          </div>

          {/* Modal Body - Scrollable Role List */}
          <div className="max-h-[calc(90vh-280px)] overflow-y-auto px-6 py-4">
            <div className="space-y-2">
              {availableRoles.map((role) => {
                const isCurrentRole = selectedUser?.role === role;
                return (
                  <Button
                    key={role}
                    onClick={() => {
                      if (selectedUserId && !isCurrentRole) {
                        handleRoleUpdate(selectedUserId, role);
                        handleClose();
                      }
                    }}
                    disabled={isCurrentRole}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm transition-all ${
                      isCurrentRole
                        ? "bg-primary-50 ring-2 ring-primary-500 ring-inset cursor-default shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 hover:shadow-md border border-gray-200"
                    } ${isRTL ? "flex-row-reverse text-right" : "text-left"}`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        isCurrentRole
                          ? "border-primary-600 bg-primary-600 shadow-sm"
                          : "border-gray-300 group-hover:border-gray-400"
                      }`}
                    >
                      {isCurrentRole && (
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block ${getRoleBadgeColor(
                            role
                          )} px-3 py-1.5 rounded-lg text-xs font-semibold border shadow-sm`}
                        >
                          {getRoleDisplayName(role)}
                        </span>
                        {isCurrentRole && (
                          <span className="text-xs text-primary-700 font-bold bg-primary-100 px-2 py-0.5 rounded-full">
                            {language === "ar"
                              ? "الدور الحالي"
                              : language === "fr"
                              ? "Actuel"
                              : "Current"}
                          </span>
                        )}
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Modal Footer */}
          <div
            className={`px-6 py-4 border-t border-gray-200 bg-gray-50 flex gap-3 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <Button
              variant="contained"
              onClick={handleClose}
              color="error"
              fullWidth
            >
              {" "}
              {language === "ar"
                ? "إلغاء"
                : language === "fr"
                ? "Annuler"
                : "Cancel"}
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default E_LearningUsersAdmin;
