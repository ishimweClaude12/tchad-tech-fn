import { Card, CardContent, Chip, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import type { Quiz, QuizAttempt } from "../../types/Quiz.types";

interface QuizAttemptCardProps {
  quiz: Quiz;
  attempt?: QuizAttempt;
  onClick?: () => void;
  showMenu?: boolean;
}

const QuizAttemptCard: React.FC<QuizAttemptCardProps> = ({
  quiz,
  attempt,
  onClick,
}) => {
  const hasAttempt = !!attempt;
  const percentage = hasAttempt
    ? (
        (Number.parseFloat(attempt.totalScore) /
          Number.parseFloat(attempt.maxPossibleScore)) *
        100
      ).toFixed(1)
    : null;

  return (
    <Card
      onClick={onClick}
      className="cursor-pointer transition hover:shadow-lg"
    >
      <CardContent className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1 flex-1">
            <Typography fontWeight={600}>{quiz.title}</Typography>

            <Typography variant="body2" className="text-gray-600 line-clamp-2">
              {quiz.description}
            </Typography>
          </div>
        </div>

        {/* Attempt Status */}
        {hasAttempt ? (
          <div className="space-y-3">
            {/* Score Display */}
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div>
                <Typography variant="caption" color="text.secondary">
                  Score
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {attempt.totalScore} / {attempt.maxPossibleScore}
                </Typography>
              </div>
              <div className="text-right">
                <Typography variant="caption" color="text.secondary">
                  Percentage
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {percentage}%
                </Typography>
              </div>
            </div>

            {/* Status Chips */}
            <div className="flex flex-wrap gap-2">
              {attempt.isPassed ? (
                <Chip
                  icon={<CheckCircleIcon />}
                  label="Passed"
                  color="success"
                  size="small"
                />
              ) : (
                <Chip
                  icon={<CancelIcon />}
                  label="Failed"
                  color="error"
                  size="small"
                />
              )}
              <Chip
                label={`Attempt ${attempt.attemptNumber}`}
                size="small"
                variant="outlined"
              />
              {attempt.gradingStatus === "finalized" && (
                <Chip
                  label="Graded"
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
            </div>

            {/* Completion Date */}
            {attempt.completedAt && (
              <Typography variant="caption" color="text.secondary">
                Completed: {new Date(attempt.completedAt).toLocaleString()}
              </Typography>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {/* Quiz Metadata for non-attempted quizzes */}
            <div className="flex flex-wrap gap-2">
              <Chip label={quiz.kind} size="small" />
              {quiz.isMandatory && (
                <Chip label="Mandatory" size="small" color="warning" />
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <AccessTimeIcon fontSize="small" />
              <span>{quiz.timeLimitMinutes} minutes</span>
            </div>

            <Typography variant="body2" color="primary" fontWeight={500}>
              Click to start quiz
            </Typography>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuizAttemptCard;
