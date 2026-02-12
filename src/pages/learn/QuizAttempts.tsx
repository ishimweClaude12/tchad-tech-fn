import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Card,
  CardContent,
  LinearProgress,
  Box,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  Schedule,
  TrendingUp,
  FileDownload,
  Visibility,
  MoreVert,
} from "@mui/icons-material";
import { useInstructorQuizAttempts } from "src/hooks/learn/useQuizApi";
import UserCard from "src/components/learn/UserCard";
import { Button } from "@/components/tiptap-ui-primitive/button/button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const QuizAttempts: React.FC = () => {
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();

  // State management
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedAttempt, setSelectedAttempt] = React.useState<string | null>(
    null,
  );

  // Fetch quiz attempts
  const { data: quizAttemptsData, isLoading } = useInstructorQuizAttempts(
    quizId || "",
  );

  // Calculate statistics
  const statistics = useMemo(() => {
    if (!quizAttemptsData?.data.attempts) {
      return {
        totalAttempts: 0,
        uniqueStudents: 0,
        averageScore: 0,
        passRate: 0,
      };
    }

    const attempts = quizAttemptsData.data.attempts;
    const uniqueUsers = new Set(attempts.map((a) => a.userId));
    const passedAttempts = attempts.filter((a) => a.isPassed);
    const totalScore = attempts.reduce(
      (sum, a) => sum + Number.parseFloat(a.totalScore),
      0,
    );

    return {
      totalAttempts: attempts.length,
      uniqueStudents: uniqueUsers.size,
      averageScore: attempts.length > 0 ? totalScore / attempts.length : 0,
      passRate:
        attempts.length > 0
          ? (passedAttempts.length / attempts.length) * 100
          : 0,
    };
  }, [quizAttemptsData]);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    attemptId: string,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedAttempt(attemptId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAttempt(null);
  };

  const handleViewDetails = (attemptId: string) => {
    navigate(
      `/instructor/courses/${courseId}/quizzes/${quizId}/attempts/${attemptId}`,
    );
    handleMenuClose();
  };

  const handleExportData = () => {
    // Implement export functionality
    console.log("Exporting data...");
    handleMenuClose();
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "success";
    if (percentage >= 60) return "warning";
    return "error";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeTaken = (startedAt: string, completedAt: string) => {
    const start = new Date(startedAt).getTime();
    const end = new Date(completedAt).getTime();
    const minutes = Math.floor((end - start) / 60000);
    return `${minutes} min`;
  };

  if (isLoading) {
    return (
      <div className="w-full min-w-0 p-4 sm:p-6">
        <div className="mb-8">
          <Typography variant="h4" fontWeight={700} className="mb-2">
            Quiz Attempts
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Loading quiz performance data...
          </Typography>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 w-full">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <LinearProgress />
      </div>
    );
  }

  if (!quizAttemptsData || quizAttemptsData.data.attempts.length === 0) {
    return (
      <div className="w-full min-w-0 p-4 sm:p-6">
        {/* Back Button */}
        <Button
          onClick={() => navigate(-1)}
          className="mb-4 px-3 py-1 rounded hover:bg-gray-200 transition-colors"
        >
          <ArrowBackIcon /> Back to Quiz
        </Button>
        <div className="mb-8">
          <Typography variant="h4" fontWeight={700} className="mb-2">
            Quiz Attempts
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Review student performance and provide feedback
          </Typography>
        </div>
        <Paper className="p-12 text-center">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Schedule fontSize="large" className="text-gray-400" />
            </div>
            <Typography variant="h6" fontWeight={600} className="mb-2">
              No Attempts Yet
            </Typography>
            <Typography variant="body1" color="textSecondary" className="mb-4">
              Students haven't started taking this quiz yet. Check back later to
              see their results.
            </Typography>
          </div>
        </Paper>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 p-4 sm:p-6">
      {/* Back Button */}
      <Button
        onClick={() => navigate(-1)}
        className="mb-4 px-3 py-1 rounded hover:bg-gray-200 transition-colors"
      >
        <ArrowBackIcon /> Back to Quiz
      </Button>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <Typography variant="h4" fontWeight={700}>
            Quiz Attempts
          </Typography>
          <Tooltip title="Export data">
            <IconButton onClick={handleExportData} className="text-gray-600">
              <FileDownload />
            </IconButton>
          </Tooltip>
        </div>
        <Typography variant="body1" color="textSecondary">
          Review student performance and track progress
        </Typography>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 w-full">
        <Card className="bg-linear-to-br from-blue-50 to-blue-100 border-none shadow-sm">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="mb-1"
                >
                  Total Attempts
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                  {statistics.totalAttempts}
                </Typography>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Schedule className="text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-green-50 to-green-100 border-none shadow-sm">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="mb-1"
                >
                  Unique Students
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                  {statistics.uniqueStudents}
                </Typography>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <TrendingUp className="text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-purple-50 to-purple-100 border-none shadow-sm">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="mb-1"
                >
                  Average Score
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                  {statistics.averageScore.toFixed(1)}%
                </Typography>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <TrendingUp className="text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-orange-50 to-orange-100 border-none shadow-sm">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="mb-1"
                >
                  Pass Rate
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                  {statistics.passRate.toFixed(1)}%
                </Typography>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <CheckCircle className="text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attempts List */}
      <div className="space-y-4 w-full">
        {quizAttemptsData.data.attempts.map((attempt) => {
          const scorePercentage =
            (Number.parseFloat(attempt.totalScore) /
              Number.parseFloat(attempt.maxPossibleScore)) *
            100;

          return (
            <Paper
              key={attempt.id}
              className="p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleViewDetails(attempt.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  {/* Student Info */}
                  <div className="flex-1">
                    <UserCard userId={attempt.userId} />
                    <div className="flex items-center gap-2 mt-2">
                      <Chip
                        label={`Attempt #${attempt.attemptNumber}`}
                        size="small"
                        className="bg-gray-100"
                      />
                      <span className="flex items-center gap-1 text-sm text-gray-600">
                        <Schedule fontSize="small" />
                        {formatDate(attempt.completedAt)}
                      </span>
                      <span className="text-sm text-gray-600">
                        Time:{" "}
                        {getTimeTaken(attempt.startedAt, attempt.completedAt)}
                      </span>
                    </div>
                  </div>

                  {/* Score Section */}
                  <div className="hidden md:flex items-center space-x-6">
                    <div className="text-center min-w-[120px]">
                      <Typography
                        variant="h5"
                        fontWeight={700}
                        color={getScoreColor(
                          Number.parseFloat(attempt.totalScore),
                          Number.parseFloat(attempt.maxPossibleScore),
                        )}
                      >
                        {attempt.totalScore}/{attempt.maxPossibleScore}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {scorePercentage.toFixed(1)}%
                      </Typography>
                      <Box className="mt-2">
                        <LinearProgress
                          variant="determinate"
                          value={scorePercentage}
                          color={getScoreColor(
                            Number.parseFloat(attempt.totalScore),
                            Number.parseFloat(attempt.maxPossibleScore),
                          )}
                          className="h-2 rounded-full"
                        />
                      </Box>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {attempt.isPassed ? (
                        <Chip
                          icon={<CheckCircle />}
                          label="Passed"
                          color="success"
                          variant="outlined"
                        />
                      ) : (
                        <Chip
                          icon={<Cancel />}
                          label="Failed"
                          color="error"
                          variant="outlined"
                        />
                      )}
                      {attempt.gradingStatus !== "finalized" && (
                        <Chip
                          label="Pending"
                          size="small"
                          className="ml-2 bg-yellow-100 text-yellow-800"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions Menu */}
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuClick(e, attempt.id);
                  }}
                  className="ml-2"
                >
                  <MoreVert />
                </IconButton>
              </div>

              {/* Mobile Score Display */}
              <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      color={getScoreColor(
                        Number.parseFloat(attempt.totalScore),
                        Number.parseFloat(attempt.maxPossibleScore),
                      )}
                    >
                      {attempt.totalScore}/{attempt.maxPossibleScore}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {scorePercentage.toFixed(1)}%
                    </Typography>
                  </div>
                  {attempt.isPassed ? (
                    <Chip
                      icon={<CheckCircle />}
                      label="Passed"
                      color="success"
                      size="small"
                    />
                  ) : (
                    <Chip
                      icon={<Cancel />}
                      label="Failed"
                      color="error"
                      size="small"
                    />
                  )}
                </div>
                <LinearProgress
                  variant="determinate"
                  value={scorePercentage}
                  color={getScoreColor(
                    Number.parseFloat(attempt.totalScore),
                    Number.parseFloat(attempt.maxPossibleScore),
                  )}
                  className="h-2 rounded-full mt-2"
                />
              </div>
            </Paper>
          );
        })}
      </div>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => selectedAttempt && handleViewDetails(selectedAttempt)}
        >
          <Visibility className="mr-2" fontSize="small" />
          View Details
        </MenuItem>
        <MenuItem onClick={handleExportData}>
          <FileDownload className="mr-2" fontSize="small" />
          Export Data
        </MenuItem>
      </Menu>
    </div>
  );
};

export default QuizAttempts;
