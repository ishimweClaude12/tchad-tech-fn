import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCourseById } from "src/hooks/learn/useCourseApi";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Avatar,
  Rating,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Alert,
  LinearProgress,
  Paper,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
} from "@mui/material";
import {
  PlayCircleOutline,
  CheckCircle,
  Schedule,
  Person,
  Language,
  TrendingUp,
  MenuBook,
  Quiz as QuizIcon,
  Assignment,
  Star,
  Group,
  Verified,
  ArrowBack,
  Close,
  Campaign,
  CalendarToday,
  NavigateNext,
  NavigateBefore,
  Edit,
  Send,
} from "@mui/icons-material";
import { useCourseQuizzes, useQuizAttempts } from "src/hooks/learn/useQuizApi";
import { useAuth } from "@clerk/clerk-react";
import type { Quiz } from "src/types/Quiz.types";
import QuizAttemptCard from "src/components/learn/QuizAttemptCard";
import { useCourseAnnouncements } from "src/hooks/learn/useAnnouncementsApi";
import {
  useCheckUserReview,
  useAddReview,
  useGetCourseReviews,
  useUpdateReview,
} from "src/hooks/learn/useReviewsApi";

// Component to handle individual quiz card with attempts check
const QuizCardWithAttempts: React.FC<{
  quiz: Quiz;
  userId: string;
  enrollmentId: string;
  courseId: string;
}> = ({ quiz, userId, enrollmentId, courseId }) => {
  const navigate = useNavigate();
  const { data: quizAttemptsData } = useQuizAttempts(quiz.id, userId);
  const attempts = quizAttemptsData?.data?.attempts || [];
  const hasAttempts = attempts.length > 0;
  const latestAttempt = hasAttempts ? attempts.at(-1) : undefined;

  const handleQuizClick = () => {
    // Navigate to quiz page
    navigate(
      `/learn/enrollment/${enrollmentId}/course/${courseId}/quiz/${quiz.id}`,
    );
  };

  return (
    <QuizAttemptCard
      quiz={quiz}
      attempt={latestAttempt}
      onClick={handleQuizClick}
    />
  );
};

const CourseLandingPage = () => {
  const { courseId = "", enrollmentId = "" } = useParams<{
    courseId: string;
    enrollmentId: string;
  }>();
  const navigate = useNavigate();
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState<number | null>(0);

  const { data: courseData, isLoading, error } = useCourseById(courseId);
  const { data: courseQuizzes, isLoading: isQuizLoading } =
    useCourseQuizzes(courseId);
  const { userId } = useAuth();
  const { data: announcementsData } = useCourseAnnouncements(courseId);
  const { data: userReviewData } = useCheckUserReview(courseId, userId || "");
  const { data: courseReviewsData } = useGetCourseReviews(courseId);
  const addReviewMutation = useAddReview();
  const updateReviewMutation = useUpdateReview();
  // Loading state with skeletons
  if (isLoading) {
    return (
      <Box className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Container maxWidth="xl" className="py-8">
          <Skeleton variant="text" width={200} height={40} className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8">
              <Skeleton
                variant="rectangular"
                height={400}
                className="rounded-xl mb-4"
              />
              <Skeleton variant="text" width="80%" height={60} />
              <Skeleton variant="text" width="60%" height={40} />
            </div>
            <div className="md:col-span-4">
              <Skeleton
                variant="rectangular"
                height={300}
                className="rounded-xl"
              />
            </div>
          </div>
        </Container>
      </Box>
    );
  }

  // Error state
  if (error || !courseData?.data?.course) {
    return (
      <Container maxWidth="lg" className="py-12">
        <Alert severity="error" className="rounded-lg">
          <Typography variant="h6" className="mb-2">
            Error Loading Course
          </Typography>
          <Typography>
            We couldn't load this course. Please try again later or contact
            support.
          </Typography>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate("/learn")}
            className="mt-4"
          >
            Back to Courses
          </Button>
        </Alert>
      </Container>
    );
  }

  const course = courseData.data.course;

  // Format currency
  const formatPrice = (price: string, currency: string) => {
    const amount = Number.parseFloat(price);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  };

  // Calculate discount percentage
  const discountPercentage = course.discountPrice
    ? Math.round(
        ((Number.parseFloat(course.price) -
          Number.parseFloat(course.discountPrice)) /
          Number.parseFloat(course.price)) *
          100,
      )
    : 0;

  // Format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Announcement handlers
  const publishedAnnouncements =
    announcementsData?.data?.announcements?.filter((a) => a.isPublished) || [];
  const currentAnnouncement = publishedAnnouncements[currentAnnouncementIndex];

  const handleAnnouncementOpen = () => {
    setAnnouncementModalOpen(true);
    setCurrentAnnouncementIndex(0); // Reset to first announcement when opening
  };

  const handleAnnouncementClose = () => {
    setAnnouncementModalOpen(false);
  };

  const handleNextAnnouncement = () => {
    if (currentAnnouncementIndex < publishedAnnouncements.length - 1) {
      setCurrentAnnouncementIndex(currentAnnouncementIndex + 1);
    }
  };

  const handlePreviousAnnouncement = () => {
    if (currentAnnouncementIndex > 0) {
      setCurrentAnnouncementIndex(currentAnnouncementIndex - 1);
    }
  };

  const formatAnnouncementDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const handleSubmitReview = () => {
    if (
      !userId ||
      !reviewTitle.trim() ||
      !reviewComment.trim() ||
      !reviewRating
    ) {
      return;
    }

    const existingReview = userReviewData?.data?.review;

    if (existingReview) {
      // Update existing review
      updateReviewMutation.mutate(
        {
          reviewId: existingReview.id,
          payload: {
            userId,
            title: reviewTitle.trim(),
            comment: reviewComment.trim(),
            rating: reviewRating,
          },
          courseId, // For query invalidation only
        },
        {
          onSuccess: () => {
            setReviewFormOpen(false);
            setReviewTitle("");
            setReviewComment("");
            setReviewRating(0);
          },
        },
      );
    } else {
      // Add new review
      addReviewMutation.mutate(
        {
          courseId,
          userId,
          title: reviewTitle.trim(),
          comment: reviewComment.trim(),
          rating: reviewRating,
        },
        {
          onSuccess: () => {
            setReviewFormOpen(false);
            setReviewTitle("");
            setReviewComment("");
            setReviewRating(0);
          },
        },
      );
    }
  };

  const handleEditReview = () => {
    const existingReview = userReviewData?.data?.review;
    if (existingReview) {
      setReviewTitle(existingReview.title);
      setReviewComment(existingReview.comment);
      setReviewRating(existingReview.rating);
      setReviewFormOpen(true);
    }
  };

  const userHasReviewed = userReviewData?.data?.hasReviewed;
  const userReview = userReviewData?.data?.review;
  const courseReviews = courseReviewsData?.data?.reviews || [];
  const approvedReviews = courseReviews.filter(
    (r) => r.moderationStatus === "approved",
  );

  return (
    <Box className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Back Navigation */}
      <Box className="bg-white shadow-sm border-b border-gray-200">
        <Container maxWidth="xl" className="py-4">
          <Box className="flex items-center justify-between">
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate("/learn")}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Back to Courses
            </Button>

            {/* Announcements Button */}
            {publishedAnnouncements.length > 0 && (
              <Button
                startIcon={<Campaign />}
                onClick={handleAnnouncementOpen}
                variant="outlined"
                color="primary"
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                <Badge
                  variant={publishedAnnouncements.length ? "dot" : "standard"}
                  color="error"
                  sx={{ mr: 1 }}
                >
                  <span>Announcements</span>
                </Badge>
              </Button>
            )}
          </Box>
        </Container>
      </Box>

      {/* Announcement Modal */}
      <Dialog
        open={announcementModalOpen}
        onClose={handleAnnouncementClose}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
            },
          },
        }}
      >
        {currentAnnouncement && (
          <>
            <DialogTitle
              sx={{
                background: "linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                pb: 2,
              }}
            >
              <Box className="flex items-center gap-2">
                <Campaign />
                <Typography variant="h6" component="span" fontWeight={600}>
                  Announcement
                </Typography>
                {currentAnnouncement.isGlobal && (
                  <Chip
                    label="Global"
                    size="small"
                    sx={{
                      background: "rgba(255, 255, 255, 0.2)",
                      color: "white",
                      fontWeight: 600,
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                    }}
                  />
                )}
              </Box>
              <IconButton
                onClick={handleAnnouncementClose}
                size="small"
                sx={{
                  color: "white",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <Close />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 3, pb: 2 }}>
              <Box className="mb-4">
                <Typography
                  variant="h5"
                  fontWeight={600}
                  color="text.primary"
                  gutterBottom
                >
                  {currentAnnouncement.title}
                </Typography>

                {currentAnnouncement.publishedAt && (
                  <Box className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                    <CalendarToday sx={{ fontSize: 16 }} />
                    <Typography variant="body2">
                      {formatAnnouncementDate(currentAnnouncement.publishedAt)}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.7,
                  mb: 2,
                }}
              >
                {currentAnnouncement.content}
              </Typography>

              {publishedAnnouncements.length > 1 && (
                <Box className="mt-4 pt-3 border-t border-gray-200">
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    className="block text-center mb-2"
                  >
                    Announcement {currentAnnouncementIndex + 1} of{" "}
                    {publishedAnnouncements.length}
                  </Typography>
                </Box>
              )}
            </DialogContent>

            <DialogActions
              sx={{
                px: 3,
                pb: 2,
                justifyContent:
                  publishedAnnouncements.length > 1
                    ? "space-between"
                    : "flex-end",
              }}
            >
              {publishedAnnouncements.length > 1 && (
                <Box className="flex gap-2">
                  <Button
                    onClick={handlePreviousAnnouncement}
                    disabled={currentAnnouncementIndex === 0}
                    startIcon={<NavigateBefore />}
                    size="small"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={handleNextAnnouncement}
                    disabled={
                      currentAnnouncementIndex ===
                      publishedAnnouncements.length - 1
                    }
                    endIcon={<NavigateNext />}
                    size="small"
                  >
                    Next
                  </Button>
                </Box>
              )}
              <Button onClick={handleAnnouncementClose} variant="contained">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Container maxWidth="xl" className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Main Content - Left Column */}
          <div className="md:col-span-8">
            {/* Course Header */}
            <Box className="mb-6">
              <Box className="flex items-center gap-2 mb-3">
                <Chip
                  label={course.category.name}
                  size="small"
                  className="bg-blue-100 text-blue-700 font-medium"
                />
                {course.subcategory && (
                  <Chip
                    label={course.subcategory.name}
                    size="small"
                    variant="outlined"
                    className="border-blue-300 text-blue-700"
                  />
                )}
              </Box>

              <Typography
                variant="h3"
                component="h1"
                className="font-bold text-gray-900 mb-3 leading-tight"
              >
                {course.title}
              </Typography>

              <Typography
                variant="h6"
                className="text-gray-600 mb-4 font-light"
              >
                {course.subtitle}
              </Typography>

              {/* Rating and Stats */}
              <Box className="flex flex-wrap items-center gap-4 mb-4">
                {course.ratingAverage && (
                  <Box className="flex items-center gap-2">
                    <Rating
                      value={course.ratingAverage}
                      precision={0.1}
                      readOnly
                      size="small"
                    />
                    <Typography variant="body2" className="font-semibold">
                      {course.ratingAverage ?? "0.0"}
                    </Typography>
                    <Typography variant="body2" className="text-gray-500">
                      ({course.ratingCount} ratings)
                    </Typography>
                  </Box>
                )}

                <Box className="flex items-center gap-1 text-gray-600">
                  <Group fontSize="small" />
                  <Typography variant="body2">
                    {course.enrollmentCount.toLocaleString()} students
                  </Typography>
                </Box>

                <Box className="flex items-center gap-1 text-gray-600">
                  <Schedule fontSize="small" />
                  <Typography variant="body2">
                    Last updated:{" "}
                    {new Date(
                      course.lastUpdatedDate || course.createdAt,
                    ).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>

              {/* Instructor */}
              <Box className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm">
                <Avatar className="w-12 h-12 bg-linear-to-br from-blue-500 to-indigo-600">
                  <Person />
                </Avatar>
                <Box>
                  <Typography variant="body2" className="text-gray-500">
                    Created by
                  </Typography>
                  <Typography
                    variant="body1"
                    className="font-semibold text-gray-900"
                  >
                    Instructor ID: {course.instructor.id}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Video Preview */}
            {course.muxVideo && (
              <Card className="mb-6 rounded-xl shadow-lg overflow-hidden">
                <Box className="relative bg-linear-to-br from-gray-900 to-gray-800 aspect-video flex items-center justify-center">
                  <Box className="text-center">
                    <PlayCircleOutline className="text-white w-20 h-20 mb-4 opacity-80" />
                    <Typography variant="h6" className="text-white">
                      Course Preview
                    </Typography>
                    <Typography variant="body2" className="text-gray-300 mt-2">
                      {course.muxVideo.duration
                        ? `${Math.floor(course.muxVideo.duration / 60)} minutes`
                        : "Preview available"}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            )}

            {/* Course Description */}
            <Card className="mb-6 rounded-xl shadow-md">
              <CardContent className="p-6">
                <Typography
                  variant="h5"
                  className="font-bold mb-4 text-gray-900"
                >
                  About This Course
                </Typography>
                <Typography
                  variant="body1"
                  className="text-gray-700 leading-relaxed mb-4"
                >
                  {course.description}
                </Typography>
                {course.shortDescription && (
                  <Paper className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <Typography variant="body2" className="text-blue-900">
                      <strong>Quick Summary:</strong> {course.shortDescription}
                    </Typography>
                  </Paper>
                )}
              </CardContent>
            </Card>

            {/* Learning Objectives */}
            {course.learningObjectives &&
              course.learningObjectives.length > 0 && (
                <Card className="mb-6 rounded-xl shadow-md">
                  <CardContent className="p-6">
                    <Typography
                      variant="h5"
                      className="font-bold mb-4 text-gray-900"
                    >
                      What You'll Learn
                    </Typography>
                    <List>
                      {course.learningObjectives.map((objective, index) => (
                        <ListItem
                          key={index + objective.length}
                          className="py-2"
                        >
                          <ListItemIcon>
                            <CheckCircle className="text-green-600" />
                          </ListItemIcon>
                          <ListItemText primary={objective} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              )}

            {/* Course Content Overview */}
            <Card className="mb-6 rounded-xl shadow-md">
              <CardContent className="p-6">
                <Typography
                  variant="h5"
                  className="font-bold mb-4 text-gray-900"
                >
                  Course Content
                </Typography>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <Box className="text-center p-4 bg-linear-to-br from-blue-50 to-indigo-50 rounded-lg">
                      <MenuBook
                        className="text-blue-600 mb-2"
                        fontSize="large"
                      />
                      <Typography
                        variant="h6"
                        className="font-bold text-gray-900"
                      >
                        {course.totalLessons}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        Lessons
                      </Typography>
                    </Box>
                  </div>
                  <div>
                    <Box className="text-center p-4 bg-linear-to-br from-purple-50 to-pink-50 rounded-lg">
                      <QuizIcon
                        className="text-purple-600 mb-2"
                        fontSize="large"
                      />
                      <Typography
                        variant="h6"
                        className="font-bold text-gray-900"
                      >
                        {course.totalQuizzes}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        Quizzes
                      </Typography>
                    </Box>
                  </div>
                  <div>
                    <Box className="text-center p-4 bg-linear-to-br from-orange-50 to-red-50 rounded-lg">
                      <Assignment
                        className="text-orange-600 mb-2"
                        fontSize="large"
                      />
                      <Typography
                        variant="h6"
                        className="font-bold text-gray-900"
                      >
                        {course.totalAssignments}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        Assignments
                      </Typography>
                    </Box>
                  </div>
                  <div>
                    <Box className="text-center p-4 bg-linear-to-br from-green-50 to-teal-50 rounded-lg">
                      <Schedule
                        className="text-green-600 mb-2"
                        fontSize="large"
                      />
                      <Typography
                        variant="h6"
                        className="font-bold text-gray-900"
                      >
                        {formatDuration(course.totalDurationMinutes)}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        Duration
                      </Typography>
                    </Box>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prerequisites */}
            {course.prerequisites && (
              <Card className="mb-6 rounded-xl shadow-md">
                <CardContent className="p-6">
                  <Typography
                    variant="h5"
                    className="font-bold mb-4 text-gray-900"
                  >
                    Prerequisites
                  </Typography>
                  <Typography variant="body1" className="text-gray-700">
                    {course.prerequisites}
                  </Typography>
                </CardContent>
              </Card>
            )}

            {/* Target Audience */}
            {course.targetAudience && (
              <Card className="mb-6 rounded-xl shadow-md">
                <CardContent className="p-6">
                  <Typography
                    variant="h5"
                    className="font-bold mb-4 text-gray-900"
                  >
                    Who This Course Is For
                  </Typography>
                  <Typography variant="body1" className="text-gray-700">
                    {course.targetAudience}
                  </Typography>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {course.tags && course.tags.length > 0 && (
              <Card className="rounded-xl shadow-md mb-6">
                <CardContent className="p-6">
                  <Typography
                    variant="h6"
                    className="font-bold mb-3 text-gray-900"
                  >
                    Course Tags
                  </Typography>
                  <Box className="flex flex-wrap gap-2">
                    {course.tags.map((tag, index) => (
                      <Chip
                        key={index + tag}
                        label={tag}
                        variant="outlined"
                        size="small"
                        className="border-gray-300 hover:bg-gray-100 transition-colors"
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Reviews Section */}
            <Card className="rounded-xl shadow-md mb-6">
              <CardContent className="p-6">
                <Typography
                  variant="h5"
                  className="font-bold mb-4 text-gray-900 flex items-center gap-2"
                >
                  <Star className="text-yellow-500" />
                  Course Reviews
                  {approvedReviews.length > 0 && (
                    <Chip
                      label={`${approvedReviews.length} reviews`}
                      size="small"
                      color="primary"
                      sx={{ ml: 1 }}
                    />
                  )}
                </Typography>

                {/* User's Review or Add Review Form */}
                {userId && (
                  <Box className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    {userHasReviewed && userReview && !reviewFormOpen ? (
                      <>
                        <Box className="flex items-start justify-between mb-3">
                          <Typography
                            variant="subtitle1"
                            className="font-semibold text-gray-900"
                          >
                            Your Review
                          </Typography>
                          <Button
                            size="small"
                            startIcon={<Edit />}
                            onClick={handleEditReview}
                            sx={{ textTransform: "none" }}
                          >
                            Edit
                          </Button>
                        </Box>
                        <Box className="mb-2">
                          <Rating
                            value={userReview.rating}
                            readOnly
                            size="small"
                          />
                        </Box>
                        <Typography
                          variant="subtitle2"
                          className="font-semibold mb-1"
                        >
                          {userReview.title}
                        </Typography>
                        <Typography variant="body2" className="text-gray-700">
                          {userReview.comment}
                        </Typography>
                        <Typography
                          variant="caption"
                          className="text-gray-500 mt-2 block"
                        >
                          {userReview.moderationStatus === "pending" && (
                            <Chip
                              label="Pending Review"
                              size="small"
                              color="warning"
                              sx={{ mt: 1 }}
                            />
                          )}
                          {userReview.moderationStatus === "approved" && (
                            <Chip
                              label="Published"
                              size="small"
                              color="success"
                              sx={{ mt: 1 }}
                            />
                          )}
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Typography
                          variant="subtitle1"
                          className="font-semibold mb-3 text-gray-900"
                        >
                          {userHasReviewed
                            ? "Edit Your Review"
                            : "Write a Review"}
                        </Typography>
                        <Box className="space-y-3">
                          <Box>
                            <Typography
                              variant="body2"
                              className="mb-1 text-gray-700"
                            >
                              Rating
                            </Typography>
                            <Rating
                              value={reviewRating}
                              onChange={(_, newValue) =>
                                setReviewRating(newValue)
                              }
                              size="large"
                            />
                          </Box>
                          <TextField
                            fullWidth
                            label="Review Title"
                            value={reviewTitle}
                            onChange={(e) => setReviewTitle(e.target.value)}
                            placeholder="Summarize your experience"
                            variant="outlined"
                            size="small"
                          />
                          <TextField
                            fullWidth
                            label="Your Review"
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="Share your thoughts about this course"
                            variant="outlined"
                            multiline
                            rows={4}
                          />
                          <Box className="flex gap-2">
                            <Button
                              variant="contained"
                              startIcon={<Send />}
                              onClick={handleSubmitReview}
                              disabled={
                                !reviewTitle.trim() ||
                                !reviewComment.trim() ||
                                !reviewRating ||
                                addReviewMutation.isPending ||
                                updateReviewMutation.isPending
                              }
                            >
                              {(() => {
                                if (
                                  addReviewMutation.isPending ||
                                  updateReviewMutation.isPending
                                ) {
                                  return "Submitting...";
                                }
                                return userHasReviewed
                                  ? "Update Review"
                                  : "Submit Review";
                              })()}
                            </Button>
                            {userHasReviewed && (
                              <Button
                                variant="outlined"
                                onClick={() => {
                                  setReviewFormOpen(false);
                                  setReviewTitle("");
                                  setReviewComment("");
                                  setReviewRating(0);
                                }}
                              >
                                Cancel
                              </Button>
                            )}
                          </Box>
                        </Box>
                      </>
                    )}
                  </Box>
                )}

                {/* All Approved Reviews */}
                {approvedReviews.length > 0 ? (
                  <Box className="space-y-4">
                    {approvedReviews.map((review) => (
                      <Paper
                        key={review.id}
                        elevation={0}
                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <Box className="flex items-start justify-between mb-2">
                          <Box>
                            <Rating
                              value={review.rating}
                              readOnly
                              size="small"
                            />
                            <Typography
                              variant="subtitle2"
                              className="font-semibold mt-1"
                            >
                              {review.title}
                            </Typography>
                          </Box>
                          {review.isVerifiedPurchase && (
                            <Chip
                              label="Verified"
                              size="small"
                              icon={<Verified />}
                              color="success"
                              variant="outlined"
                            />
                          )}
                        </Box>
                        <Typography
                          variant="body2"
                          className="text-gray-700 mb-2"
                        >
                          {review.comment}
                        </Typography>
                        <Box className="flex items-center gap-2 text-sm text-gray-500">
                          <Typography variant="caption">
                            {new Date(review.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </Typography>
                          {review.helpfulCount > 0 && (
                            <>
                              <span>•</span>
                              <Typography variant="caption">
                                {review.helpfulCount} found helpful
                              </Typography>
                            </>
                          )}
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                ) : (
                  <Box className="text-center py-8">
                    <Star
                      className="text-gray-300 mb-2"
                      style={{ fontSize: 48 }}
                    />
                    <Typography variant="body2" className="text-gray-500">
                      No reviews yet. Be the first to review this course!
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Course Quizzes Section */}
            {!isQuizLoading &&
              courseQuizzes &&
              courseQuizzes?.data.quizzes.length > 0 &&
              userId && (
                <Card className="rounded-xl shadow-md">
                  <CardContent className="p-6">
                    <Typography
                      variant="h5"
                      className="font-bold mb-4 text-gray-900"
                    >
                      Course Quizzes
                    </Typography>
                    <Divider className="mb-4" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {courseQuizzes.data.quizzes.map((quiz) => (
                        <QuizCardWithAttempts
                          key={quiz.id}
                          quiz={quiz}
                          userId={userId}
                          enrollmentId={enrollmentId}
                          courseId={courseId}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
          </div>

          {/* Sidebar - Right Column */}
          <div className="md:col-span-4">
            <Box className="sticky top-8">
              {/* Enrollment Card */}
              <Card className="rounded-xl shadow-xl mb-6 overflow-hidden">
                {course.thumbnailUrl && (
                  <Box
                    className="h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url(${course.thumbnailUrl})` }}
                  />
                )}

                <CardContent className="p-6">
                  {/* Pricing */}
                  <Box className="mb-4">
                    {course.discountPrice ? (
                      <Box>
                        <Box className="flex items-baseline gap-2 mb-2">
                          <Typography
                            variant="h4"
                            className="font-bold text-gray-900"
                          >
                            {formatPrice(course.discountPrice, course.currency)}
                          </Typography>
                          <Typography
                            variant="h6"
                            className="line-through text-gray-400"
                          >
                            {formatPrice(course.price, course.currency)}
                          </Typography>
                        </Box>
                        <Chip
                          label={`${discountPercentage}% OFF`}
                          size="small"
                          className="bg-red-500 text-white font-bold"
                        />
                      </Box>
                    ) : (
                      <Typography
                        variant="h4"
                        className="font-bold text-gray-900"
                      >
                        {Number.parseFloat(course.price) === 0
                          ? "Free"
                          : formatPrice(course.price, course.currency)}
                      </Typography>
                    )}
                  </Box>

                  <Divider className="my-4" />

                  {/* Course Details */}
                  <List dense className="mb-4">
                    <ListItem className="px-0">
                      <ListItemIcon className="min-w-10">
                        <TrendingUp className="text-gray-600" />
                      </ListItemIcon>
                      <Box className="flex-1">
                        <Typography
                          variant="body2"
                          className="text-gray-600 mb-1"
                        >
                          Difficulty Level
                        </Typography>
                        <Chip
                          label={course.difficultyLevel}
                          size="small"
                          className="mt-1"
                        />
                      </Box>
                    </ListItem>

                    <ListItem className="px-0">
                      <ListItemIcon className="min-w-10">
                        <Schedule className="text-gray-600" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Estimated Duration"
                        secondary={`${course.estimatedDurationHours} hours`}
                      />
                    </ListItem>

                    {course.hasCertificate && (
                      <ListItem className="px-0">
                        <ListItemIcon className="min-w-10">
                          <Verified className="text-blue-600" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Certificate"
                          secondary="Certificate of completion"
                        />
                      </ListItem>
                    )}
                  </List>

                  {/* Enrollment Stats */}
                  {course.completionCount > 0 && (
                    <Box className="mb-4 p-3 bg-green-50 rounded-lg">
                      <Typography
                        variant="body2"
                        className="text-gray-700 mb-2"
                      >
                        Course completion rate
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={
                          (course.completionCount / course.enrollmentCount) *
                          100
                        }
                        className="h-2 rounded-full bg-green-200"
                        sx={{
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: "#10b981",
                          },
                        }}
                      />
                      <Typography
                        variant="caption"
                        className="text-gray-600 mt-1 block"
                      >
                        {course.completionCount} of {course.enrollmentCount}{" "}
                        students completed
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>

              {/* Additional Info Card */}
              <Card className="rounded-xl shadow-md">
                <CardContent className="p-6">
                  <Typography
                    variant="h6"
                    className="font-bold mb-3 text-gray-900"
                  >
                    This Course Includes
                  </Typography>
                  <List dense>
                    <ListItem className="px-0 py-2">
                      <ListItemIcon className="min-w-10">
                        <PlayCircleOutline className="text-blue-600" />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${formatDuration(course.totalDurationMinutes)} on-demand video`}
                      />
                    </ListItem>
                    <ListItem className="px-0 py-2">
                      <ListItemIcon className="min-w-10">
                        <Assignment className="text-purple-600" />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${course.totalAssignments} assignments`}
                      />
                    </ListItem>
                    <ListItem className="px-0 py-2">
                      <ListItemIcon className="min-w-10">
                        <Language className="text-green-600" />
                      </ListItemIcon>
                      <ListItemText primary="Lifetime access" />
                    </ListItem>
                    <ListItem className="px-0 py-2">
                      <ListItemIcon className="min-w-10">
                        <Star className="text-yellow-600" />
                      </ListItemIcon>
                      <ListItemText primary="Access on mobile and desktop" />
                    </ListItem>
                    {course.hasCertificate && (
                      <ListItem className="px-0 py-2">
                        <ListItemIcon className="min-w-10">
                          <Verified className="text-blue-600" />
                        </ListItemIcon>
                        <ListItemText primary="Certificate of completion" />
                      </ListItem>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Box>
          </div>
        </div>
      </Container>
    </Box>
  );
};

export default CourseLandingPage;
