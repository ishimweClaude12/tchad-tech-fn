import {
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Typography,
  Button,
  Modal,
  Box,
  Breadcrumbs,
} from "@mui/material";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useModuleById } from "../../hooks/learn/useModulesApi";
import { useLessonsByModuleId } from "../../hooks/learn/useLessonApi";
import { useState } from "react";

import type { Lesson } from "src/types/CourseLessons.types";
import {
  useModuleQuizzes,
  useLessonQuizzes,
} from "../../hooks/learn/useQuizApi";
import QuizCard from "../../components/learn/QuizCard";

// Decode HTML entities while preserving HTML structure
const decodeHTMLEntities = (text: string): string => {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
};

export const InstructorModuleDetails = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();

  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const handleViewLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

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

  const {
    data: quizzesData,
    isLoading: isQuizzesLoading,
    error: quizzesError,
  } = useModuleQuizzes(moduleId || "");

  const { data: lessonQuizes, isLoading: lessonQuizesLoading } =
    useLessonQuizzes(selectedLesson?.id || "");

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
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      <div>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" to="/learn/dashboard/instructor/courses">
            Courses
          </Link>
          <Link
            color="inherit"
            to={`/learn/dashboard/instructor/course/${module.courseId}`}
          >
            {module.course.title}
          </Link>
          <Typography sx={{ color: "text.primary" }}>{module.title}</Typography>
        </Breadcrumbs>
      </div>
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
        </CardContent>
      </Card>

      {/* Lessons Section */}
      <div className="space-y-4">
        <Typography variant="h6" fontWeight={600}>
          Module Lessons
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
            onClick={() => handleViewLesson(lesson)}
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

              <div className="flex items-center gap-2">
                <Chip
                  label={lesson.isPublished ? "Published" : "Draft"}
                  color={lesson.isPublished ? "success" : "default"}
                  size="small"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quizes */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Typography variant="h5" fontWeight={600}>
          Module Quizzes
        </Typography>

        {quizzesError && (
          <div className="text-center text-red-500 mt-2">
            Failed to load module quizzes.
          </div>
        )}

        {isQuizzesLoading && (
          <div className="flex justify-center items-center h-64 mt-4">
            <CircularProgress />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {quizzesData?.data.quizzes.length === 0 && (
            <div className="text-gray-600">
              No quizzes available for this course.
            </div>
          )}

          {quizzesData?.data.quizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              showMenu={false}
              onClick={() => {
                navigate(
                  `/learn/dashboard/instructor/course/${module.courseId}/module/${moduleId}/quiz/${quiz.id}`,
                );
              }}
            />
          ))}
        </div>
      </div>

      {selectedLesson && (
        <Modal
          open={Boolean(selectedLesson)}
          onClose={() => setSelectedLesson(null)}
          sx={{ zIndex: 1500 }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "95%", md: 900 },
              maxHeight: "90vh",
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: 2,
              overflowY: "auto",
              zIndex: 1500,
            }}
          >
            <Card elevation={0}>
              <CardContent className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <Typography variant="h5" fontWeight={600}>
                      {selectedLesson.title}
                    </Typography>

                    <Typography className="text-gray-600">
                      {selectedLesson.description}
                    </Typography>
                  </div>

                  <div className="flex flex-col gap-2 items-end">
                    <Chip
                      label={selectedLesson.isPublished ? "Published" : "Draft"}
                      color={selectedLesson.isPublished ? "success" : "default"}
                    />
                    <Chip
                      label={selectedLesson.contentType}
                      variant="outlined"
                      size="small"
                    />
                  </div>
                </div>

                {/* Lesson Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Typography variant="caption" className="text-gray-500">
                      Duration
                    </Typography>
                    <Typography fontWeight={500}>
                      {selectedLesson.durationMinutes} minutes
                    </Typography>
                  </div>

                  <div>
                    <Typography variant="caption" className="text-gray-500">
                      Sort Order
                    </Typography>
                    <Typography fontWeight={500}>
                      {selectedLesson.sortOrder}
                    </Typography>
                  </div>

                  <div>
                    <Typography variant="caption" className="text-gray-500">
                      Last Updated
                    </Typography>
                    <Typography fontWeight={500}>
                      {new Date(selectedLesson.updatedAt).toLocaleDateString()}
                    </Typography>
                  </div>
                </div>

                {/* Content Section */}
                {selectedLesson.contentType === "TEXT" && (
                  <div className="space-y-2">
                    <Typography variant="h6" fontWeight={600}>
                      Lesson Content
                    </Typography>

                    <Card variant="outlined">
                      <CardContent className="prose max-w-none">
                        <div
                          className="prose prose-lg max-w-none 
                prose-headings:font-bold prose-headings:text-gray-900
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-ul:list-disc prose-ul:my-4 prose-ol:list-decimal prose-ol:my-4
                prose-li:text-gray-700 prose-li:my-1
                prose-code:text-pink-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:my-4
                prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-4
                prose-img:rounded-lg prose-img:shadow-md prose-img:my-4
                [&_p:empty]:h-6"
                          dangerouslySetInnerHTML={{
                            __html: decodeHTMLEntities(
                              selectedLesson.textContent || "",
                            ),
                          }}
                        />
                      </CardContent>
                    </Card>
                  </div>
                )}

                {selectedLesson.contentType === "VIDEO" && (
                  <div className="space-y-3">
                    <Typography variant="h6" fontWeight={600}>
                      Video Lesson
                    </Typography>

                    <video
                      controls
                      className="w-full rounded-lg border"
                      src={selectedLesson.contentUrl}
                    >
                      <track
                        kind="captions"
                        src={selectedLesson.contentUrl}
                        label="English"
                      />
                    </video>
                  </div>
                )}

                {/* Quizzes Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Typography variant="h6" fontWeight={600}>
                      Associated Quizzes
                    </Typography>
                  </div>
                  {lessonQuizesLoading && (
                    <div className="flex justify-center items-center h-32">
                      <CircularProgress />
                    </div>
                  )}
                  {!lessonQuizesLoading &&
                    lessonQuizes?.data.quizzes.length === 0 && (
                      <Typography className="text-gray-600">
                        No quizzes associated with this lesson.
                      </Typography>
                    )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {lessonQuizes?.data.quizzes.map((quiz) => (
                      <QuizCard
                        key={quiz.id}
                        quiz={quiz}
                        showMenu={false}
                        onClick={() => {
                          navigate(
                            `/learn/dashboard/instructor/course/${module.courseId}/module/${moduleId}/quiz/${quiz.id}`,
                          );
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outlined"
                    onClick={() => setSelectedLesson(null)}
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Box>
        </Modal>
      )}
    </div>
  );
};
