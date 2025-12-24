import {
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Typography,
  Button,
  Divider,
  Rating,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
  useCourseById,
  useCourseModules,
} from "../../hooks/learn/useCourseApi";

export const CourseDetails = () => {
  const { courseId = "" } = useParams();
  const navigate = useNavigate();

  const { data: modulesData, isLoading, error } = useCourseModules(courseId);
  const {
    data: courseData,
    isLoading: isCourseLoading,
    error: courseError,
  } = useCourseById(courseId);

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
    <div className="space-y-10">
      <div>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          variant="text"
        >
          Back
        </Button>
      </div>
      {/* Header */}
      <Card>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="h-56 rounded bg-gray-100 overflow-hidden">
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="md:col-span-3 space-y-4">
            <Typography variant="h4" fontWeight={600}>
              {course.title}
            </Typography>

            <Typography className="text-gray-600">{course.subtitle}</Typography>

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

            <div className="flex gap-3 pt-2">
              <Button variant="contained">Edit Course</Button>
              <Button variant="outlined">Add Module</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Details */}
      <Card>
        <CardContent className="space-y-6">
          <Typography variant="h6" fontWeight={600}>
            Course Overview
          </Typography>

          <Typography className="text-gray-700">
            {course.description}
          </Typography>

          <Divider />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Typography fontWeight={500}>Target Audience</Typography>
              <Typography className="text-gray-600">
                {course.targetAudience}
              </Typography>
            </div>

            <div>
              <Typography fontWeight={500}>Prerequisites</Typography>
              <Typography className="text-gray-600">
                {course.prerequisites}
              </Typography>
            </div>

            <div>
              <Typography fontWeight={500}>Language</Typography>
              <Typography className="text-gray-600">English</Typography>
            </div>
          </div>

          <Divider />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <Typography fontWeight={600}>{course.totalLessons}</Typography>
              <Typography className="text-sm text-gray-600">Lessons</Typography>
            </div>

            <div>
              <Typography fontWeight={600}>
                {course.estimatedDurationHours} hrs
              </Typography>
              <Typography className="text-sm text-gray-600">
                Duration
              </Typography>
            </div>

            <div>
              <Typography fontWeight={600}>{course.enrollmentCount}</Typography>
              <Typography className="text-sm text-gray-600">
                Enrolled
              </Typography>
            </div>

            <div>
              <Typography fontWeight={600}>{course.completionCount}</Typography>
              <Typography className="text-sm text-gray-600">
                Completed
              </Typography>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modules */}
      <div className="space-y-4">
        <Typography variant="h5" fontWeight={600}>
          Course Modules
        </Typography>

        {modules.length === 0 ? (
          <Card>
            <CardContent className="text-center text-gray-500">
              No modules added yet.
            </CardContent>
          </Card>
        ) : (
          modules.map((module) => (
            <Card
              key={module.id}
              onClick={() => navigate(`module/${module.id}`)}
              className="cursor-pointer transition hover:shadow-lg"
            >
              <CardContent className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <Typography fontWeight={600}>{module.title}</Typography>

                  <Typography variant="body2" className="text-gray-600">
                    {module.description}
                  </Typography>

                  <Typography variant="body2" className="text-gray-500">
                    Duration: {module.estimatedDurationMinutes} minutes
                  </Typography>
                </div>

                <Chip
                  label={module.isPublished ? "Published" : "Draft"}
                  color={module.isPublished ? "success" : "default"}
                />
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
