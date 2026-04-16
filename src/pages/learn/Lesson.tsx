import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLessonById } from "src/hooks/learn/useLessonApi";
import {
  useCompleteLesson,
  useLessonProgress,
  useModuleProgress,
} from "src/hooks/learn/useEnrollmentApi";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";
import { useLessonQuizzes, useQuizAttempts } from "src/hooks/learn/useQuizApi";
import { useAuth } from "@clerk/clerk-react";
import type { Quiz } from "src/types/Quiz.types";
import QuizAttemptCard from "src/components/learn/QuizAttemptCard";
import { useCourseModules } from "src/hooks/learn/useCourseApi";
import { useModuleById } from "src/hooks/learn/useModulesApi";
import { ArrowBack } from "@mui/icons-material";

// Component to handle individual quiz card with attempts check
export const QuizCardWithAttempts: React.FC<{
  quiz: Quiz;
  userId: string;
  onQuizClick: (quizId: string, hasAttempts: boolean) => void;
  onStatusChange?: (
    quizId: string,
    isMandatory: boolean,
    isPassed: boolean,
  ) => void;
}> = ({ quiz, userId, onQuizClick, onStatusChange }) => {
  const { data: quizAttemptsData } = useQuizAttempts(quiz.id, userId);
  const attempts = quizAttemptsData?.data?.attempts || [];
  const hasAttempts = attempts.length > 0;
  const latestAttempt = hasAttempts ? attempts.at(-1) : undefined;
  const isPassed = latestAttempt?.isPassed ?? false;

  // Notify parent component of quiz status
  React.useEffect(() => {
    if (onStatusChange) {
      onStatusChange(quiz.id, quiz.isMandatory, isPassed);
    }
  }, [quiz.id, quiz.isMandatory, isPassed, onStatusChange]);

  return (
    <QuizAttemptCard
      quiz={quiz}
      attempt={latestAttempt}
      showMenu={false}
      onClick={() => onQuizClick(quiz.id, hasAttempts)}
    />
  );
};

// Decode HTML entities while preserving HTML structure
const decodeHTMLEntities = (text: string): string => {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
};

const Lesson = () => {
  const navigate = useNavigate();
  const {
    lessonId = "",
    enrollmentId = "",
    moduleId = "",
    courseId = "",
  } = useParams<{
    lessonId: string;
    enrollmentId: string;
    moduleId: string;
    courseId: string;
  }>();

  const { data: lessonData, isLoading, error } = useLessonById(lessonId);
  const { data: lessonQuiz, isLoading: isQuizLoading } =
    useLessonQuizzes(lessonId);
  const { userId, isSignedIn } = useAuth();

  const { mutate: completeLesson, isPending: isCompletingLesson } =
    useCompleteLesson();

  const { data: lessonProgressData } = useLessonProgress(
    enrollmentId,
    lessonId,
  );
  const { data: moduleLessonsData } = useModuleById(moduleId);
  const { data: moduleProgressData } = useModuleProgress(
    enrollmentId,
    moduleId,
  );
  const { data: courseModulesData } = useCourseModules(courseId);

  // Track mandatory quiz completion status
  const [quizStatuses, setQuizStatuses] = React.useState<
    Record<string, { isMandatory: boolean; isPassed: boolean }>
  >({});

  const handleQuizStatusChange = React.useCallback(
    (quizId: string, isMandatory: boolean, isPassed: boolean) => {
      setQuizStatuses((prev) => ({
        ...prev,
        [quizId]: { isMandatory, isPassed },
      }));
    },
    [],
  );

  // Check if current lesson is the last in the module
  const isLastLessonInModule = React.useMemo(() => {
    if (!moduleLessonsData) return false;
    const lessons = moduleLessonsData.lessons;
    const currentIndex = lessons.findIndex((l) => l.id === lessonId);
    return currentIndex === lessons.length - 1;
  }, [moduleLessonsData, lessonId]);

  // Check if current module is the last in the course
  const isLastModule = React.useMemo(() => {
    if (!courseModulesData || !moduleId) return false;
    const modules = courseModulesData.data.modules;
    const sortedModules = [...modules].sort(
      (a, b) => a.sortOrder - b.sortOrder,
    );
    const lastModule = sortedModules.at(-1);
    return lastModule?.id === moduleId;
  }, [courseModulesData, moduleId]);

  // Check if the course will be completed after this lesson
  const willCompleteCourse = isLastLessonInModule && isLastModule;

  // Function to open the next lesson in the module
  const openNextLesson = (currentLessonId: string) => {
    if (!moduleLessonsData) return;
    const lessons = moduleLessonsData.lessons;
    const currentIndex = lessons.findIndex((l) => l.id === currentLessonId);
    console.log(
      "Current lesson index:",
      currentIndex,
      "Total lessons:",
      lessons,
    );
    if (currentIndex === -1 || currentIndex === lessons.length) {
      console.warn("Current lesson not found or it's the last lesson");
      return;
    }
    const nextLesson = lessons[currentIndex + 1];
    navigate(
      `/learn/enrollment/${enrollmentId}/course/${courseId}/module/${moduleId}/lesson/${nextLesson.id}`,
    );
  };

  // Check if all mandatory quizzes are passed
  const mandatoryQuizzes = Object.entries(quizStatuses).filter(
    ([, status]) => status.isMandatory,
  );
  const allMandatoryQuizzesPassed = mandatoryQuizzes.every(
    ([, status]) => status.isPassed,
  );
  const hasMandatoryQuizzes = mandatoryQuizzes.length > 0;
  const canCompleteLesson = !hasMandatoryQuizzes || allMandatoryQuizzesPassed;

  const handleQuizClick = (quizId: string) => {
    if (!userId || !isSignedIn) {
      return;
    }

    // Always navigate to quiz page - it will handle attempt logic there
    navigate(
      `/learn/enrollment/${enrollmentId}/course/${courseId}/module/${moduleId}/lesson/${lessonId}/quiz/${quizId}`,
    );
  };

  // Determine the button text based on completion state
  const getCompleteLessonButtonText = () => {
    if (isCompletingLesson) return "Completing...";
    return willCompleteCourse ? "Complete Course" : "Complete Lesson";
  };

  const completeLessonButtonText = getCompleteLessonButtonText();

  if (isLoading) {
    return <div className="p-6">Loading lesson...</div>;
  }

  if (error || !lessonData) {
    return <div className="p-6 text-red-500">Failed to load lesson.</div>;
  }

  const lesson = lessonData.data.lesson;
  const lessonStatus = lessonProgressData?.data?.progress?.status ?? null;

  return (
    <div className="mx-auto px-6 py-6 space-y-6">
      {/* Navigation */}
      <Button variant="outlined" onClick={() => navigate(-1)}>
        <ArrowBack />
        Back
      </Button>

      {/* Lesson Header */}
      <Card className="shadow-sm">
        <CardContent className="space-y-2">
          <Typography variant="h4" fontWeight={600}>
            {lesson.title}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {lesson.description}
          </Typography>

          <Divider />

          <Typography variant="caption" color="text.secondary">
            {lesson.durationMinutes} minutes
          </Typography>
        </CardContent>
      </Card>

      {/* Lesson Content */}
      {lesson.contentType === "TEXT" && lesson.textContent && (
        <Card className="shadow-sm">
          <CardContent className="p-6">
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
                __html: decodeHTMLEntities(lesson.textContent || ""),
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Video Content Placeholder */}
      {lesson.contentType === "VIDEO" && lesson.contentUrl && (
        <Card className="shadow-sm">
          <CardContent>
            <video
              controls
              className="w-full rounded-lg"
              src={lesson.contentUrl}
            >
              <track kind="captions" />
            </video>
          </CardContent>
        </Card>
      )}

      {/* Quizzes Section */}
      {!isQuizLoading &&
        lessonQuiz &&
        lessonQuiz?.data.quizzes.length > 0 &&
        userId && (
          <div className="space-y-4">
            <Typography variant="h6" fontWeight={600}>
              Quizzes
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lessonQuiz.data.quizzes.map((quiz) => (
                <QuizCardWithAttempts
                  key={quiz.id}
                  quiz={quiz}
                  userId={userId}
                  onQuizClick={handleQuizClick}
                  onStatusChange={handleQuizStatusChange}
                />
              ))}
            </div>
          </div>
        )}

      {/* Complete Lesson Button */}
      {lessonStatus !== "completed" && (
        <div className="space-y-3">
          {hasMandatoryQuizzes && !allMandatoryQuizzesPassed && (
            <Alert severity="warning">
              You must pass all mandatory quizzes before completing this lesson.
            </Alert>
          )}
          {willCompleteCourse && (
            <Alert severity="success">
              🎉 Completing this lesson will mark the entire course as complete!
            </Alert>
          )}
          {isLastLessonInModule && !isLastModule && (
            <Alert severity="info">
              This is the last lesson in this module. You can proceed to the
              next module after completion.
            </Alert>
          )}
          <div className="flex justify-end">
            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled={isCompletingLesson || !canCompleteLesson}
              onClick={() => {
                if (enrollmentId && lessonId) {
                  completeLesson({ enrollmentId, lessonId });
                }
              }}
            >
              {completeLessonButtonText}
            </Button>
          </div>
        </div>
      )}

      {/* Open next lesson Button*/}

      {lessonStatus === "completed" && (
        <div className="space-y-3">
          {hasMandatoryQuizzes && !allMandatoryQuizzesPassed && (
            <Alert severity="warning">
              You must pass all mandatory quizzes before going to the next
              lesson.
            </Alert>
          )}
          {moduleProgressData?.data?.moduleProgress?.status === "completed" && (
            <Alert severity="success">
              🎉 Congratulations! You have completed this Lesson!
            </Alert>
          )}
          {isLastLessonInModule && (
            <Alert severity="info">
              This is the last lesson in this module.{" "}
              {isLastModule
                ? "You have completed the entire course!"
                : "Please use the sidebar to continue with the next module."}
            </Alert>
          )}
          {!isLastLessonInModule && (
            <div className="flex justify-end">
              <Button
                variant="outlined"
                color="primary"
                size="large"
                disabled={isCompletingLesson || !canCompleteLesson}
                onClick={() => {
                  if (enrollmentId && lessonId) {
                    openNextLesson(lessonId);
                  }
                }}
              >
                {isCompletingLesson ? "Navigating..." : "Go to Next Lesson"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Lesson;
