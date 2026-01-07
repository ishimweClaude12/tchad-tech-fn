import {
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Rating,
  CircularProgress,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SchoolIcon from "@mui/icons-material/School";
import QuizIcon from "@mui/icons-material/Quiz";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { useParams } from "react-router-dom";
import { useCourseBySlug } from "../../hooks/learn/useCourseApi";
import { useAuth } from "@clerk/clerk-react";

const MoreCourseDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = useCourseBySlug(slug || "");
  const { userId, isLoaded, isSignedIn } = useAuth();
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center text-red-500">
        Failed to load course details
      </div>
    );
  }

  const course = data.data.course;

  return (
    <div className=" mx-auto p-8 ">
      <div>{isSignedIn ? `Logged in user ID: ${userId}` : "Not signed in"}</div>
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
        <Card className="sticky top-24 h-fit">
          <CardContent className="space-y-4">
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

            <Button variant="contained" size="large" fullWidth>
              Enroll Now
            </Button>

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
