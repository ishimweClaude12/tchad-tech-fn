import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useModuleById } from "src/hooks/learn/useModulesApi";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import {
  useLessonProgress,
  useStartLessonProgress,
} from "src/hooks/learn/useEnrollmentApi";
import { ModuleProgressStatus } from "src/types/Enrollment.types";
import { useModuleQuizzes, useQuizAttempts } from "src/hooks/learn/useQuizApi";
import { useAuth } from "@clerk/clerk-react";
import type { Quiz } from "src/types/Quiz.types";
import QuizAttemptCard from "src/components/learn/QuizAttemptCard";

// Component to handle individual quiz card with attempts check
const QuizCardWithAttempts: React.FC<{
  quiz: Quiz;
  userId: string;
  enrollmentId: string;
  courseId: string;
  moduleId: string;
}> = ({ quiz, userId, enrollmentId, courseId, moduleId }) => {
  const navigate = useNavigate();
  const { data: quizAttemptsData } = useQuizAttempts(quiz.id, userId);
  const attempts = quizAttemptsData?.data?.attempts || [];
  const hasAttempts = attempts.length > 0;
  const latestAttempt = hasAttempts ? attempts[attempts.length - 1] : undefined;

  const handleQuizClick = () => {
    // Navigate to quiz page
    navigate(
      `/learn/enrollment/${enrollmentId}/course/${courseId}/module/${moduleId}/quiz/${quiz.id}`,
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

const Module = () => {
  const navigate = useNavigate();
  const {
    moduleId = "",
    courseId = "",
    enrollmentId = "",
  } = useParams<{
    moduleId: string;
    courseId: string;
    enrollmentId: string;
  }>();

  const { data: moduleData, isLoading, error } = useModuleById(moduleId);
  const { userId } = useAuth();
  const { data: lessonProgressData } = useLessonProgress(enrollmentId);
  const { mutate: startLessonProgress } = useStartLessonProgress();
  const { data: moduleQuizzes, isLoading: isQuizLoading } =
    useModuleQuizzes(moduleId);
  // Helper function to get lesson progress status
  const getLessonProgressStatus = (lessonId: string) => {
    if (!lessonProgressData) return null;
    const progress = lessonProgressData.data.progress.find(
      (p) => p.lessonId === lessonId,
    );
    return progress?.status || null;
  };

  const handleLessonNavigate = (lessonId: string) => {
    const progressStatus = getLessonProgressStatus(lessonId);

    // Start lesson progress tracking only if not completed or in progress
    if (
      enrollmentId &&
      lessonId &&
      progressStatus !== ModuleProgressStatus.COMPLETED &&
      progressStatus !== ModuleProgressStatus.IN_PROGRESS
    ) {
      startLessonProgress({
        enrollmentId,
        lessonId,
      });
    }

    // Navigate to lesson
    navigate(
      `/learn/enrollment/${enrollmentId}/course/${courseId}/module/${moduleId}/lesson/${lessonId}`,
    );
  };

  if (isLoading) {
    return <div className="p-6">Loading module...</div>;
  }

  if (error || !moduleData) {
    return <div className="p-6 text-red-500">Error loading module.</div>;
  }

  const { title, description, estimatedDurationMinutes, lessons, isPreview } =
    moduleData;

  const getLessonIcon = (type: string) => {
    if (type === "VIDEO") return <PlayCircleOutlineIcon fontSize="small" />;
    return <DescriptionOutlinedIcon fontSize="small" />;
  };

  return (
    <div className=" mx-auto px-4 py-6 space-y-6">
      {/* Module Header */}
      <Card className="shadow-sm">
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Typography variant="h5" fontWeight={600}>
              {title}
            </Typography>
            {isPreview && <Chip label="Preview" size="small" color="info" />}
          </div>

          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <AccessTimeIcon fontSize="small" />
            <span>{estimatedDurationMinutes} minutes</span>
          </div>
        </CardContent>
      </Card>

      {/* Lessons Section */}
      <Card className="shadow-sm">
        <CardContent>
          <Typography variant="h6" fontWeight={600} className="mb-4">
            Lessons
          </Typography>

          <Divider className="mb-2" />

          {lessons.length ? (
            <List disablePadding>
              {lessons.map((lesson) => {
                const progressStatus = getLessonProgressStatus(lesson.id);

                // derive label and color without nested ternary
                let progressLabel = "Not Started";
                let progressColor: "default" | "primary" | "success" =
                  "default";

                if (progressStatus === ModuleProgressStatus.COMPLETED) {
                  progressLabel = "Completed";
                  progressColor = "success";
                } else if (
                  progressStatus === ModuleProgressStatus.IN_PROGRESS
                ) {
                  progressLabel = "In Progress";
                  progressColor = "primary";
                }

                return (
                  <ListItemButton
                    key={lesson.id}
                    className="rounded-lg mb-1"
                    onClick={() => handleLessonNavigate(lesson.id)}
                  >
                    <div className="flex items-start gap-3 w-full">
                      {getLessonIcon(lesson.contentType)}
                      <ListItemText
                        primary={
                          <div className="flex items-center gap-2">
                            <span>{lesson.title}</span>
                            {progressStatus && (
                              <Chip
                                label={progressLabel}
                                size="small"
                                color={progressColor}
                              />
                            )}
                          </div>
                        }
                        secondary={
                          <span className="text-sm text-gray-500">
                            {lesson.description} · {lesson.durationMinutes} min
                          </span>
                        }
                      />
                    </div>
                  </ListItemButton>
                );
              })}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No lessons available in this module.
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Quizzes Section */}
      {!isQuizLoading &&
        moduleQuizzes &&
        moduleQuizzes?.data.quizzes.length > 0 &&
        userId && (
          <Card className="shadow-sm">
            <CardContent>
              <Typography variant="h6" fontWeight={600} className="mb-4">
                Module Quizzes
              </Typography>
              <Divider className="mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {moduleQuizzes.data.quizzes.map((quiz) => (
                  <QuizCardWithAttempts
                    key={quiz.id}
                    quiz={quiz}
                    userId={userId}
                    enrollmentId={enrollmentId}
                    courseId={courseId}
                    moduleId={moduleId}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
};

export default Module;
