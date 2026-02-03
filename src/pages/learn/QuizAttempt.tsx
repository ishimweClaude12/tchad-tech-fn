import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useQuizDetails,
  useQuizQuestions,
  useQuizAttempts,
  useSubmitQuizAttempt,
  useStartQuizAttempt,
} from "src/hooks/learn/useQuizApi";
import { useAuth } from "@clerk/clerk-react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
  Chip,
  LinearProgress,
  Box,
  Alert,
  Divider,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { QuestionType } from "src/utils/enums/Quiz.enums";

interface Answer {
  questionId: string;
  answer: string;
}

const QuizAttempt = () => {
  const navigate = useNavigate();
  const { quizId = "" } = useParams<{ quizId: string }>();
  const { userId } = useAuth();
  const { data: quizData, isLoading, error } = useQuizDetails(quizId ?? "");
  const { data: quizQuestionsData, isLoading: questionsLoading } =
    useQuizQuestions(quizId ?? "");
  const { data: quizAttemptsData } = useQuizAttempts(
    quizId ?? "",
    userId ?? "",
  );
  const { mutate: submitQuizAttempt, isPending: isSubmitting } =
    useSubmitQuizAttempt();
  const { mutate: startQuizAttempt, isPending: isStartingAttempt } =
    useStartQuizAttempt();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);

  const quiz = quizData?.data?.quiz;
  const questions = quizQuestionsData?.data?.questions || [];
  const attempts = quizAttemptsData?.data?.attempts || [];
  const attemptCount = attempts.length;
  const canAttempt = attemptCount < (quiz?.maxAttempts ?? 0);
  const latestAttempt =
    attempts.length > 0 ? attempts[attempts.length - 1] : null;

  // Timer countdown
  useEffect(() => {
    if (!quizStarted || timeRemaining === null || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, timeRemaining]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === questionId);
      if (existing) {
        return prev.map((a) =>
          a.questionId === questionId ? { ...a, answer } : a,
        );
      }
      return [...prev, { questionId, answer }];
    });
  };

  const getCurrentAnswer = (questionId: string) => {
    return answers.find((a) => a.questionId === questionId)?.answer || "";
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleStartQuiz = () => {
    if (!userId || !quizId) return;

    startQuizAttempt(
      { quizId, userId },
      {
        onSuccess: () => {
          if (quiz?.timeLimitMinutes) {
            setTimeRemaining(quiz.timeLimitMinutes * 60);
          }
          setQuizStarted(true);
        },
      },
    );
  };

  const handleSubmitQuiz = () => {
    // Get the most recent attempt ID
    const attempts = quizAttemptsData?.data?.attempts || [];
    if (attempts.length === 0) {
      alert("No active quiz attempt found. Please start the quiz again.");
      return;
    }

    const latestAttempt = attempts.at(-1);
    if (!latestAttempt) {
      alert("No active quiz attempt found. Please start the quiz again.");
      return;
    }
    const attemptId = latestAttempt.id;

    // Format answers for submission
    const formattedAnswers = answers.map((answer) => ({
      questionId: answer.questionId,
      selectedOptionId: answer.answer,
    }));

    // Submit the quiz
    submitQuizAttempt(
      { attemptId, answers: formattedAnswers },
      {
        onSuccess: () => {
          // Navigate back to the lesson page after successful submission
          navigate(-1);
        },
      },
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading || questionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Typography>Loading quiz...</Typography>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert severity="error">Failed to load quiz. Please try again.</Alert>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="space-y-6">
            <Typography variant="h4" fontWeight={600}>
              {quiz.title}
            </Typography>

            <Typography variant="body1" color="text.secondary">
              {quiz.description}
            </Typography>

            <Divider />

            {/* Attempt Status */}
            <Alert severity={canAttempt ? "info" : "warning"}>
              {canAttempt ? (
                <>
                  You have used <strong>{attemptCount}</strong> of{" "}
                  <strong>{quiz.maxAttempts}</strong> attempts.{" "}
                  {attemptCount > 0 && "You can take this quiz again."}
                </>
              ) : (
                <>
                  You have reached the maximum number of attempts ({" "}
                  <strong>{quiz.maxAttempts}</strong>). You cannot retake this
                  quiz.
                </>
              )}
            </Alert>

            {/* Show Latest Attempt Results if exists */}
            {latestAttempt && (
              <Card variant="outlined" className="bg-gray-50">
                <CardContent className="space-y-2">
                  <Typography variant="h6" fontWeight={600}>
                    Your Last Attempt
                  </Typography>
                  <div className="flex items-center justify-between">
                    <div>
                      <Typography variant="body2" color="text.secondary">
                        Score
                      </Typography>
                      <Typography variant="h5" fontWeight={600}>
                        {latestAttempt.totalScore} /{" "}
                        {latestAttempt.maxPossibleScore}
                      </Typography>
                    </div>
                    <div className="text-right">
                      <Typography variant="body2" color="text.secondary">
                        Result
                      </Typography>
                      <Chip
                        label={latestAttempt.isPassed ? "Passed" : "Failed"}
                        color={latestAttempt.isPassed ? "success" : "error"}
                      />
                    </div>
                  </div>
                  {latestAttempt.completedAt && (
                    <Typography variant="caption" color="text.secondary">
                      Completed:{" "}
                      {new Date(latestAttempt.completedAt).toLocaleString()}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <AccessTimeIcon />
                  <Typography>
                    Time Limit: {quiz.timeLimitMinutes} minutes
                  </Typography>
                </div>
                <div>
                  <Typography>Total Questions: {questions.length}</Typography>
                </div>
                <div>
                  <Typography>Passing Score: {quiz.passingScore}%</Typography>
                </div>
                <div>
                  <Typography>
                    Attempts: {attemptCount} / {quiz.maxAttempts}
                  </Typography>
                </div>
              </div>

              <div className="flex gap-2">
                <Chip label={quiz.kind} />
                {quiz.isMandatory && <Chip label="Mandatory" color="warning" />}
              </div>
            </div>

            {canAttempt && (
              <Alert severity="info">
                Once you start the quiz, the timer will begin. Make sure you
                have a stable internet connection and enough time to complete
                the quiz.
              </Alert>
            )}

            <div className="flex gap-3">
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
              >
                Back
              </Button>
              {canAttempt && (
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleStartQuiz}
                  disabled={isStartingAttempt}
                >
                  {(() => {
                    if (isStartingAttempt) return "Starting...";
                    if (attemptCount > 0) return "Retake Quiz";
                    return "Start Quiz";
                  })()}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header with Timer */}
      <Card className="shadow-sm">
        <CardContent>
          <div className="flex justify-between items-center">
            <Typography variant="h6" fontWeight={600}>
              {quiz.title}
            </Typography>
            {timeRemaining !== null && (
              <Chip
                icon={<AccessTimeIcon />}
                label={formatTime(timeRemaining)}
                color={timeRemaining < 300 ? "error" : "primary"}
              />
            )}
          </div>
          <Box className="mt-4">
            <Typography
              variant="caption"
              color="text.secondary"
              className="mb-1"
            >
              Question {currentQuestionIndex + 1} of {questions.length}
            </Typography>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
        </CardContent>
      </Card>

      {/* Question Card */}
      {currentQuestion && (
        <Card className="shadow-sm">
          <CardContent className="space-y-6">
            <div className="flex justify-between items-start">
              <Typography variant="h6" fontWeight={500}>
                {currentQuestion.questionText}
                {currentQuestion.isRequired && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </Typography>
              <Chip
                label={`${currentQuestion.points} pts`}
                size="small"
                variant="outlined"
              />
            </div>

            {currentQuestion.mediaUrl && (
              <img
                src={currentQuestion.mediaUrl}
                alt="Question media"
                className="rounded-lg max-w-full h-auto"
              />
            )}

            <FormControl component="fieldset" className="w-full">
              {currentQuestion.questionType ===
                QuestionType.MULTIPLE_CHOICE && (
                <RadioGroup
                  value={getCurrentAnswer(currentQuestion.id)}
                  onChange={(e) =>
                    handleAnswerChange(currentQuestion.id, e.target.value)
                  }
                >
                  {currentQuestion.options.map((option) => (
                    <FormControlLabel
                      key={option.quizQuestionOptionId}
                      value={option.quizQuestionOptionId}
                      control={<Radio />}
                      label={option.optionText}
                      className="border rounded-lg px-4 py-2 mb-2 hover:bg-gray-50"
                    />
                  ))}
                </RadioGroup>
              )}

              {currentQuestion.questionType === QuestionType.TRUE_FALSE && (
                <RadioGroup
                  value={getCurrentAnswer(currentQuestion.id)}
                  onChange={(e) =>
                    handleAnswerChange(currentQuestion.id, e.target.value)
                  }
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label="True"
                    className="border rounded-lg px-4 py-2 mb-2 hover:bg-gray-50"
                  />
                  <FormControlLabel
                    value="false"
                    control={<Radio />}
                    label="False"
                    className="border rounded-lg px-4 py-2 hover:bg-gray-50"
                  />
                </RadioGroup>
              )}

              {currentQuestion.questionType === QuestionType.SHORT_ANSWER && (
                <TextField
                  multiline
                  rows={4}
                  fullWidth
                  placeholder="Type your answer here..."
                  value={getCurrentAnswer(currentQuestion.id)}
                  onChange={(e) =>
                    handleAnswerChange(currentQuestion.id, e.target.value)
                  }
                />
              )}
            </FormControl>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        <Typography variant="body2" color="text.secondary">
          {answers.length} of {questions.length} answered
        </Typography>

        {currentQuestionIndex < questions.length - 1 ? (
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={handleNext}
          >
            Next
          </Button>
        ) : (
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmitQuiz}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Quiz"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizAttempt;
