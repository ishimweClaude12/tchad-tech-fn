import {
  useReviews,
  useModerateReview,
  useDeleteReview,
} from "src/hooks/learn/useReviewsApi";
import {
  Star,
  CheckCircle,
  XCircle,
  Clock,
  ThumbsUp,
  Flag,
  Check,
  X,
  Trash2,
} from "lucide-react";
import { ReviewModerationStatus, type Review } from "src/types/Reviews";
import UserCard from "src/components/learn/UserCard";
import { useUser } from "@clerk/clerk-react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { useState } from "react";

const Reviews = () => {
  const { data: reviewsData, isLoading, isError } = useReviews();
  const { user } = useUser();
  const moderateReview = useModerateReview();
  const deleteReview = useDeleteReview();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  const handleModeration = (
    reviewId: string,
    action: ReviewModerationStatus,
  ) => {
    if (!user?.id) {
      return;
    }
    moderateReview.mutate({
      reviewId,
      userId: user.id,
      action,
    });
  };

  const handleOpenDeleteModal = (reviewId: string) => {
    setReviewToDelete(reviewId);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setReviewToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (reviewToDelete) {
      deleteReview.mutate(reviewToDelete, {
        onSuccess: () => {
          handleCloseDeleteModal();
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm sm:text-base">
            Loading reviews...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 text-center max-w-md w-full">
          <XCircle className="h-10 w-10 sm:h-12 sm:w-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-700 font-semibold text-sm sm:text-base">
            Error loading reviews
          </p>
          <p className="text-red-600 text-xs sm:text-sm">
            Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: ReviewModerationStatus) => {
    const statusConfig = {
      approved: {
        icon: CheckCircle,
        bgColor: "bg-green-100",
        textColor: "text-green-700",
        label: "Approved",
      },
      rejected: {
        icon: XCircle,
        bgColor: "bg-red-100",
        textColor: "text-red-700",
        label: "Rejected",
      },
      pending: {
        icon: Clock,
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-700",
        label: "Pending",
      },
    };

    const config = statusConfig[status];
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${config.bgColor} ${config.textColor}`}
      >
        <IconComponent className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="hidden xs:inline">{config.label}</span>
      </span>
    );
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 sm:h-5 sm:w-5 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900 mb-1 sm:mb-2">
            Course Reviews Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Monitor and manage all course reviews across the platform
          </p>
          <div className="mt-3 sm:mt-4 flex items-center gap-2 sm:gap-4">
            <div className="bg-blue-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg">
              <span className="text-xs sm:text-sm text-blue-600 font-medium">
                Total Reviews: {reviewsData?.data.reviews.length || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {reviewsData?.data.reviews.map((review: Review) => (
            <div
              key={review.id}
              className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-4 sm:p-6 border-l-4 border-blue-500"
            >
              {/* Review Header */}
              <div className="flex flex-col xs:flex-row justify-between items-start gap-3 mb-4">
                <div className="flex-1 w-full xs:w-auto">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 wrap-break-words">
                    {review.title}
                  </h3>
                  {renderStars(review.rating)}
                </div>
                <div className="flex items-center gap-2 w-full xs:w-auto justify-between xs:justify-start">
                  {getStatusBadge(review.moderationStatus)}
                  <Button
                    onClick={() => handleOpenDeleteModal(review.id)}
                    variant="outlined"
                    color="error"
                    size="small"
                    sx={{
                      minWidth: "auto",
                      p: { xs: 0.75, sm: 1 },
                      "& .MuiButton-startIcon": {
                        margin: 0,
                      },
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>

              {/* Course Info */}
              <div className="bg-blue-50 rounded-lg p-2.5 sm:p-3 mb-3 sm:mb-4">
                <p className="text-xs sm:text-sm text-blue-600 font-medium wrap-break-words">
                  Course:{" "}
                  <span className="text-blue-900">{review.course.title}</span>
                </p>
              </div>

              {/* Review Comment */}
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4 wrap-break-words">
                {review.comment}
              </p>

              {/* Badges Row */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                {review.isVerifiedPurchase && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    <CheckCircle className="h-3 w-3" />
                    <span className="hidden xs:inline">Verified Purchase</span>
                    <span className="xs:hidden">Verified</span>
                  </span>
                )}
                {review.isPublic && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    Public
                  </span>
                )}
              </div>

              {/* Stats & Meta */}
              <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 text-xs sm:text-sm border-t pt-3 sm:pt-4">
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex items-center gap-1 text-gray-600">
                    <ThumbsUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500" />
                    <span className="font-medium">{review.helpfulCount}</span>
                    <span className="text-xs hidden xs:inline">helpful</span>
                  </div>
                  {review.reportCount > 0 && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <Flag className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500" />
                      <span className="font-medium">{review.reportCount}</span>
                      <span className="text-xs hidden xs:inline">reports</span>
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>

              {/* Moderation Actions */}
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t flex flex-col xs:flex-row gap-2 sm:gap-3">
                {review.moderationStatus === ReviewModerationStatus.Pending && (
                  <>
                    <Button
                      onClick={() =>
                        handleModeration(
                          review.id,
                          ReviewModerationStatus.Approved,
                        )
                      }
                      disabled={moderateReview.isPending}
                      variant="contained"
                      startIcon={
                        <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      }
                      fullWidth
                      sx={{
                        bgcolor: "#059669",
                        "&:hover": { bgcolor: "#047857" },
                        "&:disabled": { bgcolor: "#6ee7b7" },
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: { xs: "0.813rem", sm: "0.875rem" },
                        py: { xs: 1, sm: 1.25 },
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() =>
                        handleModeration(
                          review.id,
                          ReviewModerationStatus.Rejected,
                        )
                      }
                      disabled={moderateReview.isPending}
                      variant="contained"
                      startIcon={<X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                      fullWidth
                      sx={{
                        bgcolor: "#e11d48",
                        "&:hover": { bgcolor: "#be123c" },
                        "&:disabled": { bgcolor: "#fda4af" },
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: { xs: "0.813rem", sm: "0.875rem" },
                        py: { xs: 1, sm: 1.25 },
                      }}
                    >
                      Reject
                    </Button>
                  </>
                )}
                {review.moderationStatus ===
                  ReviewModerationStatus.Approved && (
                  <Button
                    onClick={() =>
                      handleModeration(
                        review.id,
                        ReviewModerationStatus.Rejected,
                      )
                    }
                    disabled={moderateReview.isPending}
                    variant="contained"
                    startIcon={<X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                    fullWidth
                    sx={{
                      bgcolor: "#ea580c",
                      "&:hover": { bgcolor: "#c2410c" },
                      "&:disabled": { bgcolor: "#fdba74" },
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: { xs: "0.813rem", sm: "0.875rem" },
                      py: { xs: 1, sm: 1.25 },
                    }}
                  >
                    Reject
                  </Button>
                )}
                {review.moderationStatus ===
                  ReviewModerationStatus.Rejected && (
                  <Button
                    onClick={() =>
                      handleModeration(
                        review.id,
                        ReviewModerationStatus.Approved,
                      )
                    }
                    disabled={moderateReview.isPending}
                    variant="contained"
                    startIcon={<Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                    fullWidth
                    sx={{
                      bgcolor: "#0d9488",
                      "&:hover": { bgcolor: "#0f766e" },
                      "&:disabled": { bgcolor: "#5eead4" },
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: { xs: "0.813rem", sm: "0.875rem" },
                      py: { xs: 1, sm: 1.25 },
                    }}
                  >
                    Approve
                  </Button>
                )}
              </div>

              {/* Moderation Info */}
              {review.moderatedBy && (
                <div className="mt-3 pt-3 border-t text-xs text-gray-500 wrap-break-words">
                  <span className="block xs:inline">Moderated by </span>
                  <UserCard userId={review.moderatedBy} />
                  {" on "}
                  {new Date(review.moderatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {reviewsData?.data.reviews.length === 0 && (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-8 sm:p-12 text-center">
            <div className="max-w-md mx-auto">
              <Star className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                No Reviews Yet
              </h3>
              <p className="text-sm sm:text-base text-gray-500">
                Course reviews will appear here once students start submitting
                feedback.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              m: 2,
              maxHeight: "calc(100% - 32px)",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontSize: { xs: "1.125rem", sm: "1.25rem" },
            pb: 2,
          }}
        >
          <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
          Confirm Delete Review
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
            Are you sure you want to delete this review? This action cannot be
            undone. The review will be permanently removed from the system.
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{ p: 2, gap: 1, flexDirection: { xs: "column", sm: "row" } }}
        >
          <Button
            onClick={handleCloseDeleteModal}
            variant="outlined"
            disabled={deleteReview.isPending}
            fullWidth
            sx={{
              order: { xs: 2, sm: 1 },
              fontSize: { xs: "0.813rem", sm: "0.875rem" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={deleteReview.isPending}
            startIcon={<Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
            fullWidth
            sx={{
              order: { xs: 1, sm: 2 },
              fontSize: { xs: "0.813rem", sm: "0.875rem" },
            }}
          >
            {deleteReview.isPending ? "Deleting..." : "Delete Review"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Reviews;
