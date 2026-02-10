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
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import { useUpdateUser, useUsers } from "../../hooks/useApi";
import { UserRole, type User } from "../../types/Users.types";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";

const ELearningUsersAdmin: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [, setOpenDropdownId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    data: usersData,
    isLoading,
    isError,
    error,
  } = useUsers(currentPage.toString(), itemsPerPage.toString());

  const users = usersData?.users || [];
  const meta = usersData?.meta;

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
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format relative time
  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) {
      const weeks = Math.floor(days / 7);
      return `${weeks} weeks ago`;
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
    return role.replace(/_/g, " ");
  };

  // Initialize the update user mutation
  const updateUserMutation = useUpdateUser();

  // Handle role update
  const handleRoleUpdate = async (userId: string, newRole: UserRole) => {
    console.log("Initiating role update...", { userId, newRole });

    setUpdatingUserId(userId);
    setOpenDropdownId(null);

    try {
      await updateUserMutation.mutateAsync({
        id: userId,
        role: newRole,
      });

      toast.success(
        `User role updated successfully to ${getRoleDisplayName(newRole)}`,
      );
    } catch (error) {
      console.error("Failed to update user role:", error);

      toast.error("Failed to update user role. Please try again.");
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

  // Get the selected user for the modal
  const selectedUser = users?.find((u: User) => u.userId === selectedUserId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    // Extract error message from API response
    let errorMessage = "Unable to load users. Please try again later.";
    let statusCode = "";

    if (error && typeof error === "object") {
      const apiError = error as {
        response?: {
          data?: { message?: string; code?: number | string };
          status?: number;
        };
        message?: string;
      };
      if (apiError?.response?.data?.message) {
        errorMessage = apiError.response.data.message;
      } else if (apiError?.message) {
        errorMessage = apiError.message;
      }

      if (apiError?.response?.data?.code) {
        statusCode = String(apiError.response.data.code);
      } else if (apiError?.response?.status) {
        statusCode = String(apiError.response.status);
      }
    }

    return (
      <div className="flex items-center justify-center min-h-[400px] p-4 sm:p-6">
        <div className="text-center max-w-lg mx-auto w-full">
          {/* Status Code Display */}
          {statusCode && (
            <div className="mb-4 sm:mb-6">
              <div className="text-6xl sm:text-7xl md:text-9xl font-black text-red-500 mb-2 leading-none">
                {statusCode}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-red-600 uppercase tracking-wider">
                Error Code
              </div>
            </div>
          )}

          {/* Error Icon */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
            <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
          </div>

          {/* Error Title */}
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 px-4">
            Failed to Load Users
          </h3>

          {/* Error Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 sm:px-6 py-3 sm:py-4 mb-4 sm:mb-6">
            <p className="text-gray-800 text-sm sm:text-base leading-relaxed">
              {errorMessage}
            </p>
          </div>

          {/* Retry Button */}
          <Button
            onClick={() => globalThis.location.reload()}
            variant="contained"
            color="error"
            size="large"
            startIcon={<RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />}
            sx={{
              paddingX: { xs: 3, sm: 4 },
              paddingY: { xs: 1.25, sm: 1.5 },
              fontSize: { xs: "0.875rem", sm: "1rem" },
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "12px",
              boxShadow: "0 4px 6px -1px rgba(239, 68, 68, 0.3)",
              "&:hover": {
                boxShadow: "0 10px 15px -3px rgba(239, 68, 68, 0.4)",
              },
            }}
          >
            Retry Loading
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="text-left">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            User Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage user roles and permissions
          </p>
        </div>
      </div>

      {/* Desktop Table View - Hidden on mobile/tablet */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">
                  User
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">
                  Role
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">
                  Last Sign In
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">
                  Joined Date
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map((user: User) => (
                  <tr
                    key={user.userId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* User Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="shrink-0">
                          <img
                            src={user.clerkProfile.imageUrl}
                            alt={`${user.clerkProfile.firstName} ${user.clerkProfile.lastName}`}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        </div>
                        <div className="text-left">
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
                        {updatingUserId === user.userId && (
                          <Loader2 className="w-4 h-4 animate-spin text-primary-600" />
                        )}
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                            user.role,
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
                            Banned
                          </span>
                        ) : user.clerkProfile.locked ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200 w-fit">
                            <UserX className="w-3 h-3" />
                            Locked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 w-fit">
                            <UserCheck className="w-3 h-3" />
                            Active
                          </span>
                        )}
                        {user.clerkProfile.emailAddresses[0]?.verification
                          .status === "verified" && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 w-fit">
                            <Mail className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Last Sign In */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 text-left">
                        {formatRelativeTime(user.clerkProfile.lastSignInAt)}
                      </div>
                      <div className="text-xs text-gray-500 text-left">
                        {formatDate(user.clerkProfile.lastSignInAt)}
                      </div>
                    </td>

                    {/* Joined Date */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatDate(user.clerkProfile.createdAt)}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        onClick={() => handleOpen(user.userId)}
                        disabled={updatingUserId === user.userId}
                        className={`p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors ${
                          updatingUserId === user.userId
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
                          No Users Found
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Try adjusting your search or filter criteria
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination for Desktop */}
        {meta && meta.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(meta.currentPage - 1) * meta.itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(
                  meta.currentPage * meta.itemsPerPage,
                  meta.totalItems,
                )}
              </span>{" "}
              of <span className="font-medium">{meta.totalItems}</span> users
            </div>
            <Pagination
              count={meta.totalPages}
              page={meta.currentPage}
              onChange={(_, page) => setCurrentPage(page)}
              color="primary"
              shape="rounded"
              showFirstButton
              showLastButton
            />
          </div>
        )}
      </div>

      {/* Mobile/Tablet Card View - Hidden on desktop */}
      <div className="lg:hidden space-y-3 sm:space-y-4">
        {users.length > 0 ? (
          users.map((user: User) => (
            <div
              key={user.userId}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5 hover:shadow-md transition-shadow"
            >
              {/* User Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="shrink-0">
                    <img
                      src={user.clerkProfile.imageUrl}
                      alt={`${user.clerkProfile.firstName} ${user.clerkProfile.lastName}`}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover ring-2 ring-gray-100"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                      {user.clerkProfile.firstName} {user.clerkProfile.lastName}
                    </h3>
                    <div className="text-xs sm:text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 shrink-0" />
                      <span className="truncate">
                        {user.clerkProfile.emailAddresses[0]?.emailAddress}
                      </span>
                    </div>
                    {user.clerkProfile.username && (
                      <div className="text-xs text-gray-400 mt-0.5">
                        @{user.clerkProfile.username}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => handleOpen(user.userId)}
                  disabled={updatingUserId === user.userId}
                  className={`p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors shrink-0 ${
                    updatingUserId === user.userId
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {updatingUserId === user.userId ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <MoreVertical className="w-5 h-5" />
                  )}
                </Button>
              </div>

              {/* User Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Role */}
                <div>
                  <div className="text-xs text-gray-500 mb-1.5 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Role
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                      user.role,
                    )}`}
                  >
                    <Shield className="w-3 h-3" />
                    {getRoleDisplayName(user.role)}
                  </span>
                </div>

                {/* Status */}
                <div>
                  <div className="text-xs text-gray-500 mb-1.5 flex items-center gap-1">
                    {/* <User className="w-3 h-3" /> */}
                    Status
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {user.clerkProfile.banned ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                        <UserX className="w-3 h-3" />
                        Banned
                      </span>
                    ) : user.clerkProfile.locked ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                        <UserX className="w-3 h-3" />
                        Locked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        <UserCheck className="w-3 h-3" />
                        Active
                      </span>
                    )}
                    {user.clerkProfile.emailAddresses[0]?.verification
                      .status === "verified" && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        <Mail className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* Last Sign In */}
                <div>
                  <div className="text-xs text-gray-500 mb-1.5">
                    Last Sign In
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatRelativeTime(user.clerkProfile.lastSignInAt)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(user.clerkProfile.lastSignInAt)}
                    </div>
                  </div>
                </div>

                {/* Joined Date */}
                <div>
                  <div className="text-xs text-gray-500 mb-1.5">Joined</div>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {formatDate(user.clerkProfile.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <UserX className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  No Users Found
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Pagination for Mobile/Tablet */}
        {meta && meta.totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col gap-3">
              <div className="text-xs sm:text-sm text-gray-700 text-center">
                Showing{" "}
                <span className="font-medium">
                  {(meta.currentPage - 1) * meta.itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(
                    meta.currentPage * meta.itemsPerPage,
                    meta.totalItems,
                  )}
                </span>{" "}
                of <span className="font-medium">{meta.totalItems}</span> users
              </div>
              <div className="flex justify-center">
                <Pagination
                  count={meta.totalPages}
                  page={meta.currentPage}
                  onChange={(_, page) => setCurrentPage(page)}
                  color="primary"
                  shape="rounded"
                  size="small"
                  siblingCount={0}
                  boundaryCount={1}
                />
              </div>
            </div>
          </div>
        )}
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
          padding: { xs: 2, sm: 3 },
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: { xs: "100%", sm: "480px" },
            maxHeight: { xs: "95vh", sm: "90vh" },
            bgcolor: "background.paper",
            borderRadius: { xs: "12px", sm: "16px" },
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            outline: "none",
            overflow: "hidden",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 bg-linear-to-r from-primary-50 to-primary-100 text-left">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 shrink-0" />
                  <span className="truncate">Change User Role</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Select a new role for the user
                </p>
              </div>
              <Button
                onClick={handleClose}
                className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded-lg transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Current User Info */}
            {selectedUser && (
              <div className="mt-3 sm:mt-4 p-3 bg-white rounded-lg border border-gray-200 flex items-center gap-3">
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
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                    {selectedUser.clerkProfile.firstName}{" "}
                    {selectedUser.clerkProfile.lastName}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {selectedUser.clerkProfile.emailAddresses[0]?.emailAddress}
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-xs font-medium border shrink-0 ${getRoleBadgeColor(
                    selectedUser.role,
                  )}`}
                >
                  {getRoleDisplayName(selectedUser.role)}
                </span>
              </div>
            )}
          </div>

          {/* Modal Body - Scrollable Role List */}
          <div className="max-h-[calc(95vh-240px)] sm:max-h-[calc(90vh-280px)] overflow-y-auto px-4 sm:px-6 py-3 sm:py-4">
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
                    className={`w-full flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl text-sm transition-all text-left ${
                      isCurrentRole
                        ? "bg-primary-50 ring-2 ring-primary-500 ring-inset cursor-default shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 hover:shadow-md border border-gray-200 active:scale-[0.98]"
                    }`}
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
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`inline-block ${getRoleBadgeColor(
                            role,
                          )} px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold border shadow-sm`}
                        >
                          {getRoleDisplayName(role)}
                        </span>
                        {isCurrentRole && (
                          <span className="text-xs text-primary-700 font-bold bg-primary-100 px-2 py-0.5 rounded-full">
                            Current
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
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50">
            <Button
              variant="contained"
              onClick={handleClose}
              color="error"
              fullWidth
              sx={{
                paddingY: { xs: 1.25, sm: 1.5 },
                fontSize: { xs: "0.875rem", sm: "1rem" },
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default ELearningUsersAdmin;
