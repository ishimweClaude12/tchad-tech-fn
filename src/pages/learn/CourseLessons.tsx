import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { useLessons } from "../../hooks/learn/useLessonApi";

export default function CourseLessons() {
  const { data, isLoading, error } = useLessons();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">Failed to load lessons.</div>
    );
  }

  const lessons = data?.data.lessons ?? [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <Typography variant="h5" fontWeight={600}>
          Course Lessons
        </Typography>

        <Button variant="contained" startIcon={<AddIcon />}>
          New Lesson
        </Button>
      </div>

      {/* Lessons List */}
      {lessons.length === 0 ? (
        <Card>
          <CardContent className="text-center text-gray-500">
            No lessons available for this course.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson) => (
            <Card key={lesson.id} className="hover:shadow-md transition">
              <CardContent className="flex items-center justify-between">
                {/* Lesson Info */}
                <div>
                  <Typography fontWeight={500}>{lesson.title}</Typography>

                  <Typography variant="body2" className="text-gray-500">
                    {lesson.contentType} • {lesson.durationMinutes} min
                  </Typography>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <IconButton aria-label="edit lesson">
                    <EditIcon fontSize="small" />
                  </IconButton>

                  <IconButton aria-label="delete lesson" color="error">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
