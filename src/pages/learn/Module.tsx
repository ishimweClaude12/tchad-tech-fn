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
  const latestAttempt = hasAttempts ? attempts.at(-1) : undefined;

  const handleQuizClick = () => {
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

interface LessonListItemProps {
  lesson: {
    id: string;
    title: string;
    description: string;
    contentType: string;
    durationMinutes: number;
  };
  enrollmentId: string;
  courseId: string;
  moduleId: string;
}

const LessonListItem: React.FC<LessonListItemProps> = ({
  lesson,
  enrollmentId,
  courseId,
  moduleId,
}) => {
  const navigate = useNavigate();
  const { mutate: startLessonProgress } = useStartLessonProgress();
  const { data: lessonProgressData } = useLessonProgress(
    enrollmentId,
    lesson.id,
  );

  const progressStatus = lessonProgressData?.data?.progress?.status ?? null;

  let progressLabel = "Not Started";
  let progressColor: "default" | "primary" | "success" = "default";

  if (progressStatus === ModuleProgressStatus.COMPLETED) {
    progressLabel = "Completed";
    progressColor = "success";
  } else if (progressStatus === ModuleProgressStatus.IN_PROGRESS) {
    progressLabel = "In Progress";
    progressColor = "primary";
  }

  const handleClick = () => {
    if (
      enrollmentId &&
      progressStatus !== ModuleProgressStatus.COMPLETED &&
      progressStatus !== ModuleProgressStatus.IN_PROGRESS
    ) {
      startLessonProgress({ enrollmentId, lessonId: lesson.id });
    }
    navigate(
      `/learn/enrollment/${enrollmentId}/course/${courseId}/module/${moduleId}/lesson/${lesson.id}`,
    );
  };

  const icon =
    lesson.contentType === "VIDEO" ? (
      <PlayCircleOutlineIcon fontSize="small" />
    ) : (
      <DescriptionOutlinedIcon fontSize="small" />
    );

  return (
    <ListItemButton className="rounded-lg mb-1" onClick={handleClick}>
      <div className="flex items-start gap-3 w-full">
        {icon}
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
};

const Module = () => {
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
  const { data: moduleQuizzes, isLoading: isQuizLoading } =
    useModuleQuizzes(moduleId);

  if (isLoading) {
    return <div className="p-6">Loading module...</div>;
  }

  if (error || !moduleData) {
    return <div className="p-6 text-red-500">Error loading module.</div>;
  }

  const { title, description, estimatedDurationMinutes, lessons, isPreview } =
    moduleData;

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
              {lessons.map((lesson) => (
                <LessonListItem
                  key={lesson.id}
                  lesson={lesson}
                  enrollmentId={enrollmentId}
                  courseId={courseId}
                  moduleId={moduleId}
                />
              ))}
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
