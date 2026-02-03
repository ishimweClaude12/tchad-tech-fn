import React from "react";
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
} from "@mui/icons-material";
import { useCourseQuizzes, useQuizAttempts } from "src/hooks/learn/useQuizApi";
import { useAuth } from "@clerk/clerk-react";
import type { Quiz } from "src/types/Quiz.types";
import QuizAttemptCard from "src/components/learn/QuizAttemptCard";

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

  const { data: courseData, isLoading, error } = useCourseById(courseId);
  const { data: courseQuizzes, isLoading: isQuizLoading } =
    useCourseQuizzes(courseId);
  const { userId } = useAuth();
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

  return (
    <Box className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Back Navigation */}
      <Box className="bg-white shadow-sm border-b border-gray-200">
        <Container maxWidth="xl" className="py-4">
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate("/learn")}
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            Back to Courses
          </Button>
        </Container>
      </Box>

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
                      {course.ratingAverage.toFixed(1)}
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
