import {
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Typography,
  Button,
  Divider,
  Rating,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Menu,
  Breadcrumbs,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  useCourseById,
  useCourseModules,
} from "../../hooks/learn/useCourseApi";
import { useState } from "react";
import type { Module } from "src/types/Module.types";

import { EditIcon } from "lucide-react";
import PublishIcon from "@mui/icons-material/PublishOutlined";
import UnpublishIcon from "@mui/icons-material/UnpublishedOutlined";
import { useCourseQuizzes } from "../../hooks/learn/useQuizApi";
import UserCard from "src/components/learn/UserCard";
import QuizCard from "src/components/learn/QuizCard";

export const InstructorCourseDetails = () => {
  const { courseId = "" } = useParams();
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { data: modulesData, isLoading, error } = useCourseModules(courseId);
  const {
    data: quizzesData,
    isLoading: isQuizzesLoading,
    error: quizzesError,
  } = useCourseQuizzes(courseId);
  const {
    data: courseData,
    isLoading: isCourseLoading,
    error: courseError,
  } = useCourseById(courseId);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEnrollments = () => {
    navigate(`/learn/dashboard/course/${courseId}/enrollments`);
  };

  const handleAnnouncements = () => {
    navigate(`/learn/dashboard/course/${courseId}/announcements`);
  };

  if (!courseId) {
    return <div className="text-center text-gray-600">No course selected.</div>;
  }

  if (isLoading || isCourseLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (error || courseError) {
    return (
      <div className="text-center text-red-500">
        Failed to load course details.
      </div>
    );
  }

  const course = courseData?.data.course;
  const modules = modulesData?.data.modules ?? [];

  if (!course) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Breadcrumbs - Fixed height container */}
      <div className="h-8 flex items-center">
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" to="/learn/dashboard/instructor/courses">
            Courses
          </Link>
          <Typography sx={{ color: "text.primary" }}>{course.title}</Typography>
        </Breadcrumbs>
      </div>

      {/* Course Header Card - Fixed layout */}
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Thumbnail - Fixed aspect ratio */}
            <div className="aspect-video md:aspect-3/4 rounded-lg bg-gray-100 overflow-hidden">
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Course Info - Consistent vertical spacing */}
            <div className="md:col-span-3 flex flex-col gap-4">
              <div>
                <Typography variant="h4" fontWeight={600} className="mb-2">
                  {course.title}
                </Typography>
                <Typography className="text-gray-600">
                  {course.subtitle}
                </Typography>
              </div>

              <div className="flex flex-wrap gap-2">
                <Chip label={course.difficultyLevel} />
                <Chip label={course.category?.name} />
                {course.hasCertificate && (
                  <Chip label="Certificate" color="success" />
                )}
              </div>

              <div className="flex items-center gap-4">
                <Rating
                  value={course.ratingAverage ?? 0}
                  precision={0.5}
                  readOnly
                />
                <Typography className="text-sm text-gray-600">
                  ({course.ratingCount} ratings)
                </Typography>
              </div>

              <div className="flex flex-wrap gap-3 mt-auto">
                <Button variant="contained" onClick={handleEnrollments}>
                  Enrollments
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleAnnouncements}
                >
                  Announcements
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Overview Card - Consistent spacing */}
      <Card>
        <CardContent>
          <div className="space-y-6">
            <Typography variant="h6" fontWeight={600}>
              Course Overview
            </Typography>

            <Typography className="text-gray-700 leading-relaxed">
              {course.description}
            </Typography>

            <Divider />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <Typography fontWeight={500} className="text-gray-900">
                  Target Audience
                </Typography>
                <Typography className="text-gray-600">
                  {course.targetAudience}
                </Typography>
              </div>

              <div className="space-y-1">
                <Typography fontWeight={500} className="text-gray-900">
                  Prerequisites
                </Typography>
                <Typography className="text-gray-600">
                  {course.prerequisites}
                </Typography>
              </div>

              <div className="space-y-1">
                <Typography fontWeight={500} className="text-gray-900">
                  Language
                </Typography>
                <Typography className="text-gray-600">English</Typography>
              </div>
            </div>

            <Divider />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center space-y-1">
                <Typography variant="h5" fontWeight={600}>
                  {course.totalLessons}
                </Typography>
                <Typography className="text-sm text-gray-600">
                  Lessons
                </Typography>
              </div>

              <div className="text-center space-y-1">
                <Typography variant="h5" fontWeight={600}>
                  {course.estimatedDurationHours} hrs
                </Typography>
                <Typography className="text-sm text-gray-600">
                  Duration
                </Typography>
              </div>

              <div className="text-center space-y-1">
                <Typography variant="h5" fontWeight={600}>
                  {course.enrollmentCount}
                </Typography>
                <Typography className="text-sm text-gray-600">
                  Enrolled
                </Typography>
              </div>

              <div className="text-center space-y-1">
                <Typography variant="h5" fontWeight={600}>
                  {course.completionCount}
                </Typography>
                <Typography className="text-sm text-gray-600">
                  Completed
                </Typography>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Instructor Section */}
      <Card>
        <CardContent>
          <div className="space-y-4">
            <Typography variant="h6" fontWeight={600}>
              Course Instructor
            </Typography>

            {course.instructorId ? (
              <UserCard userId={course.instructorId} />
            ) : (
              <div className="py-8 text-center">
                <Typography className="text-gray-500">
                  No instructor assigned to this course yet.
                </Typography>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Course Modules Section - Consistent spacing */}
      <div className="space-y-4">
        <Typography variant="h5" fontWeight={600}>
          Course Modules
        </Typography>

        {modules.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No modules added yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {modules.map((module) => (
              <Card
                key={module.id}
                onClick={() => navigate(`module/${module.id}`)}
                className="cursor-pointer transition-shadow hover:shadow-lg"
              >
                <CardContent>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-2">
                      <Typography variant="h6" fontWeight={600}>
                        {module.sortOrder}. {module.title}
                      </Typography>

                      <Typography variant="body2" className="text-gray-600">
                        {module.description}
                      </Typography>

                      <Typography variant="body2" className="text-gray-500">
                        Duration: {module.estimatedDurationMinutes} minutes
                      </Typography>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <Chip
                        label={module.isPublished ? "Published" : "Draft"}
                        color={module.isPublished ? "success" : "default"}
                        size="small"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Course Quizzes Section - Consistent spacing */}
      <div className="space-y-4">
        <Typography variant="h5" fontWeight={600} className="mb-2">
          Course Assessments
        </Typography>

        {isQuizzesLoading && (
          <div className="flex justify-center items-center h-32">
            <CircularProgress />
          </div>
        )}

        {quizzesError && (
          <Card>
            <CardContent className="py-8 text-center text-red-500">
              Failed to load course quizzes.
            </CardContent>
          </Card>
        )}

        {!isQuizzesLoading && !quizzesError && (
          <>
            {quizzesData?.data.quizzes.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-gray-600 mt-2">
                  No quizzes available for this course.
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quizzesData?.data.quizzes.map((quiz) => (
                  <QuizCard
                    key={quiz.id}
                    quiz={quiz}
                    showMenu={false}
                    onClick={() => {
                      navigate(`quiz-attempts/${quiz.id}`);
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => {
          handleMenuClose();
          setSelectedModule(null);
        }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <MenuItem
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>

        <MenuItem
          sx={{ color: "error.main" }}
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <DeleteOutlineIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            if (!selectedModule) return;
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            {selectedModule?.isPublished ? (
              <UnpublishIcon fontSize="small" />
            ) : (
              <PublishIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>
            {selectedModule?.isPublished ? "Unpublish" : "Publish"}
          </ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default InstructorCourseDetails;
