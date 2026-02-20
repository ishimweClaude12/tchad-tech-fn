import {
  Button,
  Rating,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SchoolIcon from "@mui/icons-material/School";
import QuizIcon from "@mui/icons-material/Quiz";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PeopleIcon from "@mui/icons-material/People";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCourseBySlug,
  useCheckCourseWishListed,
  useAddCourseToWishList,
  useRemoveCourseFromWishList,
} from "../../hooks/learn/useCourseApi";
import { useAuth } from "@clerk/clerk-react";
import {
  useCheckEnrollment,
  useEnrolInCourse,
} from "src/hooks/learn/useEnrollmentApi";
import {
  EnrollmentStatus,
  type CourseEnrollment,
} from "src/types/Enrollment.types";
import { useScrollToTop } from "src/utils/hooks/ScrollTop";
import { useGetCourseReviews } from "src/hooks/learn/useReviewsApi";
import UserCard from "./UserCard";

const MoreCourseDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  useScrollToTop({ smooth: true });
  const { data, isLoading, error } = useCourseBySlug(slug || "");
  const { userId, isSignedIn } = useAuth();

  const { data: enrollmentData, isLoading: isEnrollmentLoading } =
    useCheckEnrollment(data?.data.course.id || "", userId || "");
  const enrollmentMutation = useEnrolInCourse();
  const { data: courseReviewsData } = useGetCourseReviews(
    data?.data.course.id || "",
  );
  const { data: wishlistData, isLoading: isWishlistLoading } =
    useCheckCourseWishListed(userId || "", data?.data.course.id || "");
  const addToWishlistMutation = useAddCourseToWishList();
  const removeFromWishlistMutation = useRemoveCourseFromWishList();

  const isWishlisted = wishlistData?.data?.isInWishlist;

  const handleToggleWishlist = () => {
    if (!userId || !data?.data.course.id) return;
    if (isWishlisted) {
      removeFromWishlistMutation.mutate({
        userId,
        courseId: data.data.course.id,
      });
    } else {
      addToWishlistMutation.mutate({ userId, courseId: data.data.course.id });
    }
  };

  const handleEnroll = () => {
    if (userId && data) {
      enrollmentMutation.mutate({ courseId: data.data.course.id, userId });
    }
  };

  const handleCompletePayment = () => {
    if (!enrollmentData?.data.enrollment.id || !data?.data.course) return;
    const courseEnrollment: CourseEnrollment = {
      ...enrollmentData.data.enrollment,
      id: enrollmentData.data.enrollment.id,
      courseId: data.data.course.id,
      userId: userId || "",
      course: {
        ...data.data.course,
        price: Number.parseFloat(data.data.course.price),
      },
    };
    navigate(
      `/learn/${enrollmentData.data.enrollment.id}/checkout?data=${encodeURIComponent(JSON.stringify(courseEnrollment))}`,
    );
  };

  const getEnrollmentStatusInfo = () => {
    if (!enrollmentData?.data.isEnrolled) return null;
    const status = enrollmentData.data.enrollment.status;
    switch (status) {
      case EnrollmentStatus.ACTIVE:
        return {
          label: "Enrolled – Active",
          color: "success" as const,
          icon: <CheckCircleIcon />,
          message: "You are currently enrolled in this course",
        };
      case EnrollmentStatus.PENDING_PAYMENT:
        return {
          label: "Pending Payment",
          color: "warning" as const,
          icon: <HourglassEmptyIcon />,
          message: "Complete payment to access course content",
        };
      case EnrollmentStatus.COMPLETED:
        return {
          label: "Completed",
          color: "info" as const,
          icon: <WorkspacePremiumIcon />,
          message: "Congratulations! You've completed this course",
        };
      case EnrollmentStatus.CANCELLED:
        return {
          label: "Cancelled",
          color: "error" as const,
          icon: null,
          message: "Your enrollment has been cancelled",
        };
      default:
        return null;
    }
  };

  const enrollmentStatusInfo = getEnrollmentStatusInfo();

  const renderEnrollmentButton = () => {
    if (!enrollmentData?.data.isEnrolled) {
      return (
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleEnroll}
          disabled={enrollmentMutation.isPending || !isSignedIn}
          startIcon={
            enrollmentMutation.isPending ? (
              <CircularProgress size={18} color="inherit" />
            ) : null
          }
          sx={{
            borderRadius: "10px",
            fontWeight: 600,
            py: 1.25,
            textTransform: "none",
            fontSize: "0.95rem",
          }}
        >
          {enrollmentMutation.isPending ? "Enrolling…" : "Enroll Now"}
        </Button>
      );
    }

    const status = enrollmentData.data.enrollment.status;

    if (
      status === EnrollmentStatus.ACTIVE ||
      status === EnrollmentStatus.COMPLETED
    ) {
      return (
        <Button
          variant="contained"
          size="large"
          fullWidth
          color="success"
          startIcon={<PlayCircleIcon />}
          href={`/learn/enrollment/${enrollmentData.data.enrollment.id}/course/${data?.data.course.id}`}
          sx={{
            borderRadius: "10px",
            fontWeight: 600,
            py: 1.25,
            textTransform: "none",
            fontSize: "0.95rem",
          }}
        >
          Continue Learning
        </Button>
      );
    }

    if (status === EnrollmentStatus.PENDING_PAYMENT) {
      return (
        <Button
          variant="contained"
          size="large"
          fullWidth
          color="warning"
          onClick={handleCompletePayment}
          sx={{
            borderRadius: "10px",
            fontWeight: 600,
            py: 1.25,
            textTransform: "none",
            fontSize: "0.95rem",
          }}
        >
          Complete Payment
        </Button>
      );
    }

    return null;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center text-red-500 py-12">
        Failed to load course details
      </div>
    );
  }

  const course = data.data.course;
  const reviewCount = courseReviewsData?.data?.reviews.length || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Back Button */}
      <Button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors group"
      >
        <ArrowBackIcon
          fontSize="small"
          className="transition-transform group-hover:-translate-x-0.5"
        />
        Back to Courses
      </Button>

      {/* ── Main Two-Column Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column — Course Info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Header Card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                {course.category?.name}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                {course.difficultyLevel}
              </span>
              {course.hasCertificate && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                  <WorkspacePremiumIcon sx={{ fontSize: 13 }} /> Certificate
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold text-gray-900 leading-snug">
              {course.title}
            </h1>

            {course.subtitle && (
              <p className="text-gray-500 text-sm leading-relaxed">
                {course.subtitle}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-1.5">
                <Rating
                  value={course.ratingAverage ?? 0}
                  precision={0.5}
                  readOnly
                  size="small"
                />
                <span className="text-sm font-semibold text-amber-600">
                  {course.ratingAverage}
                </span>
                <span className="text-xs text-gray-400">
                  ({course.ratingCount} ratings)
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <PeopleIcon sx={{ fontSize: 14 }} />
                {course.enrollmentCount} enrolled
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                icon: <AccessTimeIcon sx={{ fontSize: 18 }} />,
                value: `${course.estimatedDurationHours}h`,
                label: "Duration",
              },
              {
                icon: <SchoolIcon sx={{ fontSize: 18 }} />,
                value: course.totalLessons,
                label: "Lessons",
              },
              {
                icon: <QuizIcon sx={{ fontSize: 18 }} />,
                value: course.totalQuizzes,
                label: "Quizzes",
              },
              {
                icon: <PeopleIcon sx={{ fontSize: 18 }} />,
                value: course.targetAudience,
                label: "For",
              },
            ].map(({ icon, value, label }) => (
              <div
                key={label}
                className="bg-white border border-gray-100 rounded-xl p-3.5 shadow-sm flex items-center gap-2.5"
              >
                <span className="text-blue-500 shrink-0">{icon}</span>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">
                    {value}
                  </p>
                  <p className="text-xs text-gray-400">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-2">
            <h2 className="font-semibold text-gray-900">About this course</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Learning Objectives */}
          {course.learningObjectives.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
              <h2 className="font-semibold text-gray-900">What you'll learn</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {course.learningObjectives.map((obj, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <CheckCircleIcon
                      sx={{ fontSize: 16, mt: "2px" }}
                      className="text-green-500 shrink-0"
                    />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Instructor */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-3">Instructor</h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                J
              </div>
              <div>
                <p className="font-medium text-gray-800 text-sm">
                  Instructor Jeff
                </p>
                <p className="text-xs text-gray-400">
                  Experienced educator & practitioner
                </p>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Student Reviews</h2>
              <span className="text-xs text-gray-400">
                {reviewCount} review{reviewCount !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Rating Summary */}
            {reviewCount > 0 && (
              <div className="flex gap-5 pb-4 border-b border-gray-100">
                <div className="flex flex-col items-center justify-center min-w-20">
                  <span className="text-4xl font-bold text-gray-900">
                    {course.ratingAverage ?? "—"}
                  </span>
                  <Rating
                    value={course.ratingAverage ?? 0}
                    precision={0.5}
                    readOnly
                    size="small"
                  />
                  <span className="text-xs text-gray-400 mt-0.5">
                    Course Rating
                  </span>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count =
                      courseReviewsData?.data?.reviews.filter(
                        (r) => r.rating === star,
                      ).length || 0;
                    const pct =
                      reviewCount > 0 ? (count / reviewCount) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-10">
                          {star} ★
                        </span>
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 w-4 text-right">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Review List */}
            {reviewCount > 0 ? (
              <div className="space-y-4">
                {courseReviewsData!.data!.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="pb-4 border-b border-gray-50 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <UserCard userId={review.user.userId} />
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <div className="flex items-center gap-1.5">
                          <Rating value={review.rating} size="small" readOnly />
                          {review.isVerifiedPurchase && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-green-700 bg-green-50 border border-green-200 rounded-full px-1.5 py-0.5">
                              <CheckCircleIcon sx={{ fontSize: 10 }} /> Verified
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "short", day: "numeric" },
                          )}
                        </span>
                      </div>
                    </div>
                    {review.title && (
                      <p className="text-sm font-semibold text-gray-800 mb-0.5">
                        {review.title}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {review.comment}
                    </p>
                    {review.helpfulCount > 0 && (
                      <p className="text-xs text-gray-400 mt-1.5">
                        {review.helpfulCount} found this helpful
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-6">
                No reviews yet. Be the first!
              </p>
            )}
          </div>
        </div>

        {/* ── Right Column — Sticky Enroll Card ── */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            {/* Thumbnail */}
            <div className="relative">
              <img
                src={course.thumbnailUrl || "/images/placeholder.jpg"}
                alt={course.title}
                className="w-full h-40 object-cover"
              />
              {/* Wishlist */}
              {isSignedIn && !enrollmentData?.data.isEnrolled && (
                <div className="absolute top-2.5 right-2.5">
                  {isWishlisted ? (
                    <Tooltip title="Remove from wishlist">
                      <IconButton
                        onClick={handleToggleWishlist}
                        disabled={
                          isWishlistLoading ||
                          removeFromWishlistMutation.isPending
                        }
                        size="small"
                        sx={{
                          bgcolor: "rgba(255,255,255,0.9)",
                          "&:hover": {
                            bgcolor: "white",
                            transform: "scale(1.05)",
                          },
                          transition: "all .2s",
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        <FavoriteIcon sx={{ fontSize: 18, color: "#ef4444" }} />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Add to wishlist">
                      <IconButton
                        onClick={handleToggleWishlist}
                        disabled={
                          isWishlistLoading || addToWishlistMutation.isPending
                        }
                        size="small"
                        sx={{
                          bgcolor: "rgba(255,255,255,0.9)",
                          "&:hover": {
                            bgcolor: "white",
                            transform: "scale(1.05)",
                          },
                          transition: "all .2s",
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        <FavoriteBorderIcon
                          sx={{ fontSize: 18, color: "#6b7280" }}
                        />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 space-y-4">
              {/* Price */}
              <div className="flex items-baseline gap-2">
                {course.discountPrice ? (
                  <>
                    <span className="text-2xl font-bold text-gray-900">
                      {course.currency} {course.discountPrice}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      {course.currency} {course.price}
                    </span>
                    <span className="ml-auto text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      Save{" "}
                      {Math.round(
                        (1 -
                          Number(course.discountPrice) / Number(course.price)) *
                          100,
                      )}
                      %
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-gray-900">
                    {course.currency} {course.price}
                  </span>
                )}
              </div>

              {/* Enrollment Status */}
              {isEnrollmentLoading ? (
                <div className="flex justify-center py-1">
                  <CircularProgress size={20} />
                </div>
              ) : enrollmentStatusInfo ? (
                <Alert
                  severity={enrollmentStatusInfo.color}
                  icon={enrollmentStatusInfo.icon}
                  sx={{
                    borderRadius: "10px",
                    py: 0.5,
                    "& .MuiAlert-message": { py: 0.5 },
                  }}
                >
                  <p className="text-xs font-semibold leading-tight">
                    {enrollmentStatusInfo.label}
                  </p>
                  <p className="text-xs text-gray-600 leading-tight">
                    {enrollmentStatusInfo.message}
                  </p>
                </Alert>
              ) : null}

              {/* CTA */}
              {renderEnrollmentButton()}

              {!isSignedIn && (
                <p className="text-xs text-center text-gray-400">
                  Sign in to enroll
                </p>
              )}

              {/* Quick Info */}
              <div className="pt-2 border-t border-gray-50 space-y-2">
                {[
                  {
                    label: "Duration",
                    value: `${course.estimatedDurationHours} hours`,
                  },
                  { label: "Lessons", value: `${course.totalLessons} lessons` },
                  { label: "Quizzes", value: `${course.totalQuizzes} quizzes` },
                  { label: "Access", value: "Full lifetime access" },
                  ...(course.hasCertificate
                    ? [{ label: "Certificate", value: "Included" }]
                    : []),
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-xs">
                    <span className="text-gray-400">{label}</span>
                    <span className="text-gray-700 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoreCourseDetails;
