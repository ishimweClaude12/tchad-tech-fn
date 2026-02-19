import { useParams, useNavigate } from "react-router-dom";
import { useQuizAttemptDetails } from "../../hooks/learn/useQuizApi";
import {
  CheckCircle,
  XCircle,
  Clock,
  Award,
  Calendar,
  AlertCircle,
} from "lucide-react";
import type { AttemptAnswer } from "../../types/Quiz.types";
import { QuestionType } from "../../utils/enums/Quiz.enums";
import { Button } from "@/components/tiptap-ui-primitive/button/button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UserCard from "src/components/learn/UserCard";

const AttemptDetails = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const {
    data: attemptData,
    isLoading,
    error,
  } = useQuizAttemptDetails(attemptId!);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading attempt details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <h3 className="text-lg font-semibold text-red-900">
              Error Loading Attempt
            </h3>
          </div>
          <p className="text-red-700">
            Unable to load attempt details. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  if (!attemptData?.data.attempt) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">No attempt data found.</p>
      </div>
    );
  }

  const attempt = attemptData.data.attempt;
  const { quiz, user, answers } = attempt;

  const scorePercentage = (
    (Number.parseFloat(attempt.totalScore) /
      Number.parseFloat(attempt.maxPossibleScore)) *
    100
  ).toFixed(1);

  const passingPercentage = Number.parseFloat(quiz.passingScore);
  const isPassed = attempt.isPassed;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateDuration = () => {
    if (!attempt.startedAt || !attempt.completedAt) return "N/A";
    const start = new Date(attempt.startedAt);
    const end = new Date(attempt.completedAt);
    const durationMs = end.getTime() - start.getTime();
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const getQuestionTypeLabel = (type: QuestionType): string => {
    const typeMap: Record<QuestionType, string> = {
      multiple_choice: "Multiple Choice",
      true_false: "True/False",
      short_answer: "Short Answer",
      //   essay: "Essay",
      //   matching: "Matching",
    };
    return typeMap[type] || type;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Button
          onClick={() => navigate(-1)}
          className="mb-4 px-3 py-1 rounded hover:bg-gray-200 transition-colors"
        >
          <ArrowBackIcon /> Back
        </Button>
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {quiz.title}
              </h1>
              <p className="text-gray-600">{quiz.description}</p>
            </div>
            <div
              className={`px-4 py-2 rounded-full font-semibold ${
                isPassed
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {isPassed ? "Passed" : "Failed"}
            </div>
          </div>

          {/* Student Info */}
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">Student</p>
            <UserCard userId={user.userId} />
          </div>

          {/* Attempt Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Award className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Attempt Number</p>
                <p className="font-semibold text-gray-900">
                  #{attempt.attemptNumber}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed At</p>
                <p className="font-semibold text-gray-900 text-sm">
                  {formatDate(attempt.completedAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-semibold text-gray-900">
                  {calculateDuration()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Score Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Score Summary
          </h2>

          <div className="flex items-center gap-6 mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Score</p>
              <p className="text-3xl font-bold text-gray-900">
                {attempt.totalScore} / {attempt.maxPossibleScore}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Percentage</p>
              <p className="text-3xl font-bold text-gray-900">
                {scorePercentage}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Passing Score</p>
              <p className="text-xl font-semibold text-gray-700">
                {passingPercentage}%
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isPassed ? "bg-green-500" : "bg-red-500"
              }`}
              style={{
                width: `${Math.min(Number.parseFloat(scorePercentage), 100)}%`,
              }}
            />
            {/* Passing threshold marker */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-yellow-500"
              style={{ left: `${passingPercentage}%` }}
            >
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-yellow-700 whitespace-nowrap">
                Pass: {passingPercentage}%
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <span>Grading Status:</span>
            <span className="font-semibold capitalize">
              {attempt.gradingStatus.replace("-", " ")}
            </span>
          </div>
        </div>

        {/* Questions & Answers */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">
            Questions & Answers
          </h2>

          {answers.map((answer: AttemptAnswer, index: number) => {
            const question = quiz.questions.find(
              (q) => q.id === answer.questionId,
            );
            const isCorrect = answer.isCorrect;

            return (
              <div
                key={answer.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                {/* Question Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full">
                        Q{index + 1}
                      </span>
                      <span className="text-sm text-gray-500">
                        {getQuestionTypeLabel(answer.question.questionType)}
                      </span>
                      <span className="text-sm font-semibold text-gray-700">
                        {answer.question.points}{" "}
                        {answer.question.points === 1 ? "point" : "points"}
                      </span>
                    </div>
                    <p className="text-gray-900 font-medium text-lg">
                      {answer.question.questionText}
                    </p>
                  </div>

                  {/* Correct/Incorrect Badge */}
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                      isCorrect
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <XCircle className="h-5 w-5" />
                    )}
                    <span className="font-semibold text-sm">
                      {isCorrect ? "Correct" : "Incorrect"}
                    </span>
                  </div>
                </div>

                {/* Question Image if exists */}
                {question?.mediaUrl && (
                  <div className="mb-4">
                    <img
                      src={question.mediaUrl}
                      alt="Question media"
                      className="max-w-md rounded-lg border border-gray-200"
                    />
                  </div>
                )}

                {/* Answer Options (for multiple choice/true-false) */}
                {question && question.options.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {question.options.map((option) => {
                      const isSelected =
                        option.quizQuestionOptionId === answer.selectedOptionId;
                      const isCorrectOption = option.isCorrect;

                      const getOptionClassName = (): string => {
                        if (isSelected && isCorrectOption) {
                          return "border-green-500 bg-green-50";
                        }
                        if (isSelected && !isCorrectOption) {
                          return "border-red-500 bg-red-50";
                        }
                        if (isCorrectOption) {
                          return "border-green-300 bg-green-50";
                        }
                        return "border-gray-200 bg-gray-50";
                      };

                      const optionClassName = getOptionClassName();

                      return (
                        <div
                          key={option.quizQuestionOptionId}
                          className={`p-4 rounded-lg border-2 transition-all ${optionClassName}`}
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-gray-900">{option.optionText}</p>
                            <div className="flex items-center gap-2">
                              {isSelected && (
                                <span className="text-sm font-semibold text-blue-600">
                                  Student's Answer
                                </span>
                              )}
                              {isCorrectOption && (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Text/Essay Answers */}
                {(answer.textAnswer || answer.matchingAnswer) && (
                  <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900 mb-2">
                      Student's Answer:
                    </p>
                    <p className="text-gray-900">
                      {answer.textAnswer || answer.matchingAnswer}
                    </p>
                  </div>
                )}

                {/* Manual Grading Notice */}
                {answer.requiresManualGrading && (
                  <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <p className="text-sm text-yellow-800">
                      This question requires manual grading
                    </p>
                  </div>
                )}

                {/* Explanation */}
                {question?.explanation && (
                  <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Explanation:
                    </p>
                    <p className="text-gray-600">{question.explanation}</p>
                  </div>
                )}

                {/* Points Earned */}
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-sm text-gray-600">Points Earned:</span>
                  <span
                    className={`font-bold text-lg ${
                      answer.earnedPoints === answer.question.points
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {answer.earnedPoints} / {answer.question.points}
                  </span>
                </div>

                {answer.gradedAt && (
                  <div className="mt-2 text-sm text-gray-500">
                    Graded at: {formatDate(answer.gradedAt)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quiz Settings Reference */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Quiz Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Time Limit</p>
              <p className="font-semibold text-gray-900">
                {quiz.timeLimitMinutes} minutes
              </p>
            </div>
            <div>
              <p className="text-gray-500">Max Attempts</p>
              <p className="font-semibold text-gray-900">{quiz.maxAttempts}</p>
            </div>
            <div>
              <p className="text-gray-500">Shuffle Questions</p>
              <p className="font-semibold text-gray-900">
                {quiz.shuffleQuestions ? "Yes" : "No"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Shuffle Options</p>
              <p className="font-semibold text-gray-900">
                {quiz.shuffleOptions ? "Yes" : "No"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Webcam Required</p>
              <p className="font-semibold text-gray-900">
                {quiz.requireWebCam ? "Yes" : "No"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Mandatory</p>
              <p className="font-semibold text-gray-900">
                {quiz.isMandatory ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttemptDetails;
