import { useMemo, useState } from "react";
import {
  Users,
  CheckCircle,
  Clock,
  GraduationCap,
  Award,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import {
  useEnrolledUsers,
  useUpdateEnrollment,
  useDeleteEnrollment,
} from "src/hooks/learn/useEnrollmentApi";
import {
  EnrollmentStatus,
  EnrollmentType,
  type Enrollment,
} from "src/types/Enrollment.types";
import UserCard from "src/components/learn/UserCard";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Modal,
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem as SelectMenuItem,
  Breadcrumbs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Enrollments = () => {
  // Simulating API hook - replace with your actual hook
  const { courseId = "" } = useParams<{ courseId: string }>();
  const { data, isLoading, error } = useEnrolledUsers(courseId);

  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedEnrollment, setSelectedEnrollment] =
    useState<Enrollment | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [updateFormData, setUpdateFormData] = useState<{
    type: EnrollmentType;
    status: EnrollmentStatus;
  }>({
    type: EnrollmentType.FREE,
    status: EnrollmentStatus.ACTIVE,
  });

  const updateEnrollmentMutation = useUpdateEnrollment();
  const deleteEnrollmentMutation = useDeleteEnrollment();

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    enrollment: Enrollment
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedEnrollment(enrollment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUpdate = () => {
    if (selectedEnrollment) {
      setUpdateFormData({
        type: selectedEnrollment.enrollmentType,
        status: selectedEnrollment.status,
      });
      setUpdateModalOpen(true);
    }
    handleMenuClose();
  };

  const handleUpdateModalClose = () => {
    if (!updateEnrollmentMutation.isPending) {
      setUpdateModalOpen(false);
      setSelectedEnrollment(null);
    }
  };

  const handleUpdateSubmit = async () => {
    console.log("Update enrollment:", selectedEnrollment);
    if (!selectedEnrollment) return;

    try {
      await updateEnrollmentMutation.mutateAsync({
        enrollmentId: selectedEnrollment.id,
        type: updateFormData.type,
        status: updateFormData.status,
      });
      setUpdateModalOpen(false);
      setSelectedEnrollment(null);
      // Refetch enrollments
      window.location.reload();
    } catch (error) {
      console.error("Failed to update enrollment:", error);
    }
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteDialogClose = () => {
    if (!deleteEnrollmentMutation.isPending) {
      setDeleteDialogOpen(false);
      setSelectedEnrollment(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEnrollment) return;

    try {
      await deleteEnrollmentMutation.mutateAsync(selectedEnrollment.id);
      setDeleteDialogOpen(false);
      setSelectedEnrollment(null);
      // Data will be refetched automatically due to query invalidation
    } catch (error) {
      console.error("Failed to delete enrollment:", error);
    }
  };

  // Statistics calculation
  const stats = useMemo(() => {
    if (!data?.data?.enrollments)
      return {
        total: 0,
        active: 0,
        completed: 0,
        paid: 0,
        pendingPayment: 0,
        free: 0,
      };

    const enrollments = data.data.enrollments;
    return {
      total: enrollments.length,
      active: enrollments.filter((e) => e.status === EnrollmentStatus.ACTIVE)
        .length,
      completed: enrollments.filter(
        (e) => e.status === EnrollmentStatus.COMPLETED
      ).length,
      paid: enrollments.filter(
        (e) =>
          e.enrollmentType === EnrollmentType.PAID &&
          e.status !== EnrollmentStatus.PENDING_PAYMENT
      ).length,
      pendingPayment: enrollments.filter(
        (e) => e.status === EnrollmentStatus.PENDING_PAYMENT
      ).length,
      free: enrollments.filter((e) => e.enrollmentType === EnrollmentType.FREE)
        .length,
    };
  }, [data]);

  // Get enrollments
  const enrollments = useMemo(() => {
    return data?.data?.enrollments || [];
  }, [data]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };


  const getEnrollmentTypeBadge = (type: EnrollmentType) => {
    switch (type) {
      case EnrollmentType.PAID:
        return {
          label: "Paid",
          color: "bg-purple-100 text-purple-800 border-purple-200",
        };
      case EnrollmentType.FREE:
        return {
          label: "Free",
          color: "bg-emerald-100 text-emerald-800 border-emerald-200",
        };
      case EnrollmentType.SCHOLARSHIP:
        return {
          label: "Scholarship",
          color: "bg-amber-100 text-amber-800 border-amber-200",
        };
      default:
        return {
          label: type,
          color: "bg-gray-100 text-gray-800 border-gray-200",
        };
    }
  };

  const getEnrollmentStatusBadge = (status: EnrollmentStatus) => {
    switch (status) {
      case EnrollmentStatus.ACTIVE:
        return {
          label: "Active",
          color: "bg-green-100 text-green-800 border-green-200",
        };
      case EnrollmentStatus.COMPLETED:
        return {
          label: "Completed",
          color: "bg-blue-100 text-blue-800 border-blue-200",
        };
      case EnrollmentStatus.PENDING_PAYMENT:
        return {
          label: "Pending Payment",
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        };
      case EnrollmentStatus.CANCELLED:
        return {
          label: "Cancelled",
          color: "bg-red-100 text-red-800 border-red-200",
        };
      default:
        return {
          label: status,
          color: "bg-gray-100 text-gray-800 border-gray-200",
        };
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-24 bg-gray-200 rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <div className="flex-0">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-xl">⚠</span>
            </div>
          </div>
          <div>
            <h3 className="text-red-800 font-semibold">
              Error Loading Enrollments
            </h3>
            <p className="text-red-600 text-sm">
              Unable to fetch enrollment data. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
      <div>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" to="/learn/dashboard/courses">
            Courses
          </Link>
          <Link color="inherit" to={`/learn/dashboard/courses/${courseId}`}>
            Course Title
          </Link>
          <Typography sx={{ color: "text.primary" }}>Enrollments</Typography>
        </Breadcrumbs>
      </div>
      <div className=" mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Course Enrollments
          </h1>
          <p className="text-gray-600">
            Manage and monitor student enrollments
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform  transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">
                  Total Enrolled
                </p>
                <p className="text-4xl font-bold">{stats.total}</p>
              </div>
              <Users className="w-16 h-16 opacity-30" />
            </div>
          </div>

          <div className="bg-linear-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">
                  Active Students
                </p>
                <p className="text-4xl font-bold">{stats.active}</p>
              </div>
              <Clock className="w-16 h-16 opacity-30" />
            </div>
          </div>

          <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium mb-1">
                  Completed
                </p>
                <p className="text-4xl font-bold">{stats.completed}</p>
              </div>
              <CheckCircle className="w-16 h-16 opacity-30" />
            </div>
          </div>

          <div className="bg-linear-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white transform transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium mb-1">
                  Pending Payments
                </p>
                <p className="text-4xl font-bold">{stats.pendingPayment}</p>
              </div>
              <AlertCircle className="w-16 h-16 opacity-30" />
            </div>
          </div>
        </div>

        {/* Enrollments List */}
        {enrollments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <GraduationCap className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No enrollments found
            </h3>
            <p className="text-gray-500">
              No students have enrolled in this course yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {enrollments.map((enrollment) => (
              <div
                key={enrollment.id}
                className="bg-white rounded-xl shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="p-6">
                  {/* User Header with Actions Menu */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <UserCard userId={enrollment.user.userId}></UserCard>
                    </div>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, enrollment)}
                      aria-label="enrollment actions"
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </div>

                  {/* Enrollment Type and Status Badges */}
                  <div className="mb-4 mt-4 flex flex-wrap gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                        getEnrollmentTypeBadge(enrollment.enrollmentType).color
                      }`}
                    >
                      {getEnrollmentTypeBadge(enrollment.enrollmentType).label}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                        getEnrollmentStatusBadge(enrollment.status).color
                      }`}
                    >
                      {getEnrollmentStatusBadge(enrollment.status).label}
                    </span>
                  </div>


                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs font-medium">Enrolled</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDate(enrollment.enrolledAt)}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        {enrollment.completedAt ? (
                          <Award className="w-4 h-4" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                        <span className="text-xs font-medium">
                          {enrollment.completedAt ? "Completed" : "Last Active"}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDate(
                          enrollment.completedAt ?? enrollment.updatedAt
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}{" "}
          </div>
        )}

        {/* Update Enrollment Modal */}
        <Modal
          open={updateModalOpen}
          onClose={handleUpdateModalClose}
          aria-labelledby="update-enrollment-modal"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 500,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              Update Enrollment
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Update enrollment type and status for this student
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Enrollment Type */}
              <FormControl fullWidth>
                <InputLabel id="enrollment-type-label">
                  Enrollment Type
                </InputLabel>
                <Select
                  labelId="enrollment-type-label"
                  value={updateFormData.type}
                  label="Enrollment Type"
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updateFormData,
                      type: e.target.value as EnrollmentType,
                    })
                  }
                  disabled={updateEnrollmentMutation.isPending}
                >
                  <SelectMenuItem value={EnrollmentType.FREE}>
                    Free
                  </SelectMenuItem>
                  <SelectMenuItem value={EnrollmentType.PAID}>
                    Paid
                  </SelectMenuItem>
                  <SelectMenuItem value={EnrollmentType.SCHOLARSHIP}>
                    Scholarship
                  </SelectMenuItem>
                </Select>
              </FormControl>

              {/* Enrollment Status */}
              <FormControl fullWidth>
                <InputLabel id="enrollment-status-label">Status</InputLabel>
                <Select
                  labelId="enrollment-status-label"
                  value={updateFormData.status}
                  label="Status"
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updateFormData,
                      status: e.target.value as EnrollmentStatus,
                    })
                  }
                  disabled={updateEnrollmentMutation.isPending}
                >
                  <SelectMenuItem value={EnrollmentStatus.ACTIVE}>
                    Active
                  </SelectMenuItem>
                  <SelectMenuItem value={EnrollmentStatus.COMPLETED}>
                    Completed
                  </SelectMenuItem>
                  <SelectMenuItem value={EnrollmentStatus.PENDING_PAYMENT}>
                    Pending Payment
                  </SelectMenuItem>
                  <SelectMenuItem value={EnrollmentStatus.CANCELLED}>
                    Cancelled
                  </SelectMenuItem>
                </Select>
              </FormControl>

              {/* Action Buttons */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                  mt: 2,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={handleUpdateModalClose}
                  disabled={updateEnrollmentMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleUpdateSubmit}
                  disabled={updateEnrollmentMutation.isPending}
                  startIcon={
                    updateEnrollmentMutation.isPending ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : null
                  }
                >
                  {updateEnrollmentMutation.isPending
                    ? "Updating..."
                    : "Update"}
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteDialogClose}
          aria-labelledby="delete-dialog-title"
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this enrollment? This action
              cannot be undone.
            </Typography>
            {selectedEnrollment && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: "error.lighter",
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "error.light",
                }}
              >
                <Typography variant="body2" color="error.dark">
                  <strong>Enrollment ID:</strong> {selectedEnrollment.id}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={handleDeleteDialogClose}
              disabled={deleteEnrollmentMutation.isPending}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
              disabled={deleteEnrollmentMutation.isPending}
              startIcon={
                deleteEnrollmentMutation.isPending ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              {deleteEnrollmentMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Actions Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem onClick={handleUpdate}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Update</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default Enrollments;
