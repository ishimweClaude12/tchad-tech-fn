import {
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Typography,
  Button,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useModuleById } from "../../hooks/learn/useModulesApi";
import { useLessonsByModuleId } from "../../hooks/learn/useLessonApi";

export const ModuleDetails = () => {
  const { moduleId } = useParams<{ moduleId: string }>();

  const {
    data: moduleData,
    isLoading,
    isError,
  } = useModuleById(moduleId || "");

  const {
    data: lessonsData,
    isLoading: lessonsLoading,
    isError: lessonsError,
  } = useLessonsByModuleId(moduleId || "");

  if (isLoading || lessonsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (isError || !moduleData) {
    return (
      <div className="text-center text-red-500">
        Failed to load module details.
      </div>
    );
  }

  const module = moduleData;
  const lessons = lessonsData?.data.lessons ?? [];

  return (
    <div className="space-y-8">
      {/* Module Header */}
      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <Typography variant="h5" fontWeight={600}>
                {module.title}
              </Typography>

              <Typography className="text-gray-600">
                {module.description}
              </Typography>
            </div>

            <Chip
              label={module.isPublished ? "Published" : "Draft"}
              color={module.isPublished ? "success" : "default"}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {module.isPreview && (
              <Chip label="Preview Module" variant="outlined" />
            )}

            <Chip
              label={`${module.estimatedDurationMinutes} minutes`}
              variant="outlined"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="contained">Edit Module</Button>
            <Button variant="outlined">Add Lesson</Button>
          </div>
        </CardContent>
      </Card>

      {/* Lessons Section */}
      <div className="space-y-4">
        <Typography variant="h6" fontWeight={600}>
          Lessons
        </Typography>

        {lessonsError && (
          <Card>
            <CardContent className="text-center text-red-500">
              Failed to load lessons.
            </CardContent>
          </Card>
        )}

        {lessons.length === 0 && !lessonsError && (
          <Card>
            <CardContent className="text-center text-gray-500">
              No lessons added to this module yet.
            </CardContent>
          </Card>
        )}

        {lessons.map((lesson) => (
          <Card
            key={lesson.id}
            className="cursor-pointer hover:shadow-md transition"
          >
            <CardContent className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <Typography fontWeight={500}>{lesson.title}</Typography>

                <Typography
                  variant="body2"
                  className="text-gray-600 line-clamp-2"
                >
                  {lesson.description}
                </Typography>

                <Typography variant="body2" className="text-gray-500">
                  Duration: {lesson.durationMinutes} minutes
                </Typography>
              </div>

              <Chip
                label={lesson.isPublished ? "Published" : "Draft"}
                color={lesson.isPublished ? "success" : "default"}
                size="small"
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
