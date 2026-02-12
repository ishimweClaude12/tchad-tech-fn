import { useAuth } from "@clerk/clerk-react";
import { useInstructorCourses } from "src/hooks/learn/useCourseApi";
import {
  Card,
  CardContent,
  CardMedia,
  Chip,
  Skeleton,
  Alert,
  AlertTitle,
  Button,
} from "@mui/material";
import {
  Edit as EditIcon,
  People as PeopleIcon,
  Star as StarIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { CourseStatus, type Course } from "src/types/Course.types";
import { useNavigate } from "react-router-dom";

const InstructorCourses = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const {
    data: coursesData,
    isLoading,
    error,
  } = useInstructorCourses(userId || "");

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <Skeleton variant="text" width={300} height={40} />
          <Skeleton variant="text" width={200} height={24} className="mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="shadow-md">
              <Skeleton variant="rectangular" height={200} />
              <CardContent>
                <Skeleton variant="text" width="80%" height={32} />
                <Skeleton
                  variant="text"
                  width="60%"
                  height={24}
                  className="mt-2"
                />
                <div className="flex gap-2 mt-4">
                  <Skeleton variant="rectangular" width={60} height={24} />
                  <Skeleton variant="rectangular" width={60} height={24} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Alert severity="error" className="max-w-2xl mx-auto">
          <AlertTitle>Error</AlertTitle>
          Failed to load your courses. Please try again later.
        </Alert>
      </div>
    );
  }

  const courses = coursesData?.data?.courses || [];

  // Helper function to get status color
  const getStatusColor = (status: CourseStatus) => {
    switch (status) {
      case CourseStatus.PUBLISHED:
        return "success";
      case CourseStatus.DRAFT:
        return "default";
      default:
        return "warning";
    }
  };

  // Helper function to format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
        <p className="text-gray-600">
          Manage and track your {courses.length} course
          {courses.length === 1 ? "" : "s"}
        </p>
      </div>

      {/* Empty state */}
      {courses.length === 0 ? (
        <Card className="max-w-2xl mx-auto shadow-md">
          <CardContent className="p-12 text-center">
            <div className="mb-4">
              <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <EditIcon className="text-gray-400" style={{ fontSize: 48 }} />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No courses yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start creating your first course to share your knowledge with
              students.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Create Your First Course
            </button>
          </CardContent>
        </Card>
      ) : (
        /* Courses grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course: Course) => (
            <Card
              key={course.id}
              className="shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              {/* Thumbnail */}
              <div className="relative">
                <CardMedia
                  component="img"
                  height="200"
                  image={course.thumbnailUrl || "/placeholder-course.jpg"}
                  alt={course.title}
                  className="h-48 object-cover"
                />
              </div>

              {/* Content */}
              <CardContent className="flex-1 flex flex-col">
                {/* Status chip */}
                <div className="mb-3">
                  <Chip
                    label={
                      course.status.charAt(0).toUpperCase() +
                      course.status.slice(1)
                    }
                    color={getStatusColor(course.status)}
                    size="small"
                  />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {course.title}
                </h3>

                {/* Short description */}
                {course.shortDescription && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {course.shortDescription}
                  </p>
                )}

                {/* Stats */}
                <div className="mt-auto space-y-2">
                  <div className="flex items-center justify-between text-sm text-gray-700">
                    <div className="flex items-center gap-1">
                      <PeopleIcon fontSize="small" className="text-gray-500" />
                      <span>{course.enrollmentCount} students</span>
                    </div>
                    {course.ratingAverage && (
                      <div className="flex items-center gap-1">
                        <StarIcon
                          fontSize="small"
                          className="text-yellow-500"
                        />
                        <span>
                          {course.ratingAverage} ({course.ratingCount})
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-700">
                    <div className="flex items-center gap-1">
                      <ScheduleIcon
                        fontSize="small"
                        className="text-gray-500"
                      />
                      <span>{formatDuration(course.totalDurationMinutes)}</span>
                    </div>
                    <span className="text-gray-600">
                      {course.totalLessons} lessons
                    </span>
                  </div>

                  {/* Price */}
                  {course.price && (
                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">
                          {course.currency}{" "}
                          {course.discountPrice || course.price}
                        </span>
                        {course.discountPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            {course.currency} {course.price}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button
                    variant="contained"
                    onClick={() =>
                      navigate(
                        `/learn/dashboard/instructor/course/${course.id}`,
                      )
                    }
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorCourses;
