import {
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Rating,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SchoolIcon from "@mui/icons-material/School";
import QuizIcon from "@mui/icons-material/Quiz";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { useNavigate, useParams } from "react-router-dom";
import { useCourseBySlug } from "../../hooks/learn/useCourseApi";
import { useAuth } from "@clerk/clerk-react";
import {
  useCheckEnrollment,
  useEnrolInCourse,
} from "src/hooks/learn/useEnrollmentApi";
import {
  EnrollmentStatus,
  type CourseEnrollment,
} from "src/types/Enrollment.types";

const MoreCourseDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useCourseBySlug(slug || "");

  const { userId, isSignedIn } = useAuth();

  const { data: enrollmentData, isLoading: isEnrollmentLoading } =
    useCheckEnrollment(data?.data.course.id || "", userId || "");

  const enrollmentMutation = useEnrolInCourse();

  const handleEnroll = () => {
    if (userId && data) {
      enrollmentMutation.mutate({ courseId: data.data.course.id, userId });
    }
  };

  const hanldeCompletePayment = () => {
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
      `/learn/${
        enrollmentData.data.enrollment.id
      }/checkout?data=${encodeURIComponent(JSON.stringify(courseEnrollment))}`
    );
  };

  // Get enrollment status details
  const getEnrollmentStatusInfo = () => {
    if (!enrollmentData?.data.isEnrolled) return null;

    const status = enrollmentData.data.enrollment.status;

    switch (status) {
      case EnrollmentStatus.ACTIVE:
        return {
          label: "Enrolled - Active",
          color: "success" as const,
          icon: <CheckCircleIcon />,
          message: "You are currently enrolled in this course",
        };
      case EnrollmentStatus.PENDING_PAYMENT:
        return {
          label: "Enrollment Pending",
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
          label: "Enrollment Cancelled",
          color: "error" as const,
          icon: null,
          message: "Your enrollment has been cancelled",
        };
      default:
        return null;
    }
  };

  const enrollmentStatusInfo = getEnrollmentStatusInfo();

  // Render enrollment button based on status
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
              <CircularProgress size={20} color="inherit" />
            ) : null
          }
        >
          {enrollmentMutation.isPending ? "Enrolling..." : "Enroll Now"}
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
          href={`/learn/course/${course.slug}/learn`}
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
          onClick={() => hanldeCompletePayment()}
        >
          Complete Payment
        </Button>
      );
    }

    return null;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 mx-auto min-w-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center text-red-500 min-w-screen">
        Failed to load course details
      </div>
    );
  }

  const course = data.data.course;

  return (
    <div className=" mx-auto p-4 sm:p-8 min-w-screen space-y-8 max-w-7xl">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        {/* Left */}
        <div className="lg:col-span-2 space-y-4">
          <Typography variant="h4" fontWeight={700}>
            {course.title}
          </Typography>

          <Typography className="text-gray-600">{course.subtitle}</Typography>

          <div className="flex flex-wrap items-center gap-3">
            <Chip label={course.difficultyLevel} />
            <Chip label={course.category?.name} />
            {course.hasCertificate && (
              <Chip
                icon={<WorkspacePremiumIcon />}
                label="Certificate"
                color="success"
              />
            )}
          </div>

          <div className="flex items-center gap-3">
            <Rating
              value={course.ratingAverage ?? 0}
              precision={0.5}
              readOnly
            />
            <Typography className="text-sm text-gray-600">
              {course.ratingCount} ratings
            </Typography>
            <Typography className="text-sm text-gray-500">
              {course.enrollmentCount} enrolled
            </Typography>
          </div>
        </div>

        {/* Right Enroll Card */}
        <Card className="sticky top-24 h-fit w-full -mx-4 sm:mx-0 rounded-none sm:rounded-lg">
          <CardContent className="space-y-4 w-full px-4 sm:px-4">
            <img
              src={course.thumbnailUrl || "/images/placeholder.jpg"}
              alt={course.title}
              className="rounded-md w-full h-44 object-cover"
            />

            <div className="flex items-center gap-2">
              {course.discountPrice ? (
                <>
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    className="text-green-600"
                  >
                    {course.currency} {course.discountPrice}
                  </Typography>
                  <Typography className="line-through text-gray-400">
                    {course.currency} {course.price}
                  </Typography>
                </>
              ) : (
                <Typography variant="h5" fontWeight={700}>
                  {course.currency} {course.price}
                </Typography>
              )}
            </div>

            {/* Enrollment Status Display */}
            {isEnrollmentLoading && (
              <Box className="flex justify-center py-2">
                <CircularProgress size={24} />
              </Box>
            )}
            {!isEnrollmentLoading && enrollmentStatusInfo && (
              <Alert
                severity={enrollmentStatusInfo.color}
                icon={enrollmentStatusInfo.icon}
                className="mb-2"
              >
                <Typography variant="body2" fontWeight={600}>
                  {enrollmentStatusInfo.label}
                </Typography>
                <Typography variant="caption">
                  {enrollmentStatusInfo.message}
                </Typography>
              </Alert>
            )}

            {/* Enroll Button */}
            {renderEnrollmentButton()}

            {!isSignedIn && (
              <Typography
                variant="caption"
                className="text-center block text-gray-500"
              >
                Please sign in to enroll
              </Typography>
            )}

            <Typography className="text-sm text-center text-gray-500">
              Full lifetime access
            </Typography>
          </CardContent>
        </Card>
      </div>

      {/* Course Description */}
      <Card>
        <CardContent className="space-y-4">
          <Typography variant="h6" fontWeight={600}>
            Course Overview
          </Typography>

          <Typography className="text-gray-700">
            {course.description}
          </Typography>
        </CardContent>
      </Card>

      {/* Learning Objectives */}
      {course.learningObjectives.length > 0 && (
        <Card>
          <CardContent className="space-y-4">
            <Typography variant="h6" fontWeight={600}>
              What you will learn
            </Typography>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {course.learningObjectives.map((objective, index) => (
                <li
                  key={objective + index}
                  className="flex items-start gap-2 text-gray-700"
                >
                  <span className="text-green-600">✔</span>
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Course Meta */}
      <Card>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-2">
            <AccessTimeIcon />
            <div>
              <Typography fontWeight={600}>
                {course.estimatedDurationHours} hrs
              </Typography>
              <Typography className="text-sm text-gray-600">
                Duration
              </Typography>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <SchoolIcon />
            <div>
              <Typography fontWeight={600}>{course.totalLessons}</Typography>
              <Typography className="text-sm text-gray-600">Lessons</Typography>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <QuizIcon />
            <div>
              <Typography fontWeight={600}>{course.totalQuizzes}</Typography>
              <Typography className="text-sm text-gray-600">Quizzes</Typography>
            </div>
          </div>

          <div>
            <Typography fontWeight={600}>{course.targetAudience}</Typography>
            <Typography className="text-sm text-gray-600">
              Target audience
            </Typography>
          </div>
        </CardContent>
      </Card>

      {/* Instructor */}
      <Card>
        <CardContent className="space-y-3">
          <Typography variant="h6" fontWeight={600}>
            Instructor
          </Typography>

          <Typography fontWeight={500}> Instructor Jeff</Typography>

          <Typography className="text-gray-600">
            Instructor Jeff is an experienced educator with a passion for
            teaching.
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default MoreCourseDetails;
