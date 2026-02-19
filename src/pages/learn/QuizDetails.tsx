import {
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Typography,
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import QuizIcon from "@mui/icons-material/Quiz";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import {
  useCreateQuizQuestion,
  useQuizDetails,
  useQuizQuestions,
  useUpdateQuizQuestion,
  useDeleteQuizQuestion,
  useCreateQuestionOption,
  useUpdateQuestionOption,
  useDeleteQuestionOption,
} from "../../hooks/learn/useQuizApi";
import QuizQuestionFormModal from "../../components/learn/forms/QuestionForm";
import QuestionOptionFormModal from "../../components/learn/forms/QuestionOptionForm";
import type {
  QuestionPayload,
  Question,
  QuestionOptionPayload,
  QuestionOption,
} from "src/types/Quiz.types";

const QuizDetails = () => {
  const navigate = useNavigate();
  const { quizId } = useParams<{ quizId: string }>();
  const [openQuestionModal, setOpenQuestionModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [openOptionModal, setOpenOptionModal] = useState(false);
  const [optionAnchorEl, setOptionAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [selectedOption, setSelectedOption] = useState<QuestionOption | null>(
    null
  );
  const [editingOption, setEditingOption] = useState<QuestionOption | null>(
    null
  );
  const [deleteOptionDialogOpen, setDeleteOptionDialogOpen] = useState(false);

  const { data: quizData, isLoading, error } = useQuizDetails(quizId ?? "");
  const { data: quizQuestionsData } = useQuizQuestions(quizId ?? "");
  const createQuestionMutation = useCreateQuizQuestion();
  const updateQuestionMutation = useUpdateQuizQuestion();
  const deleteQuestionMutation = useDeleteQuizQuestion();
  const createOptionMutation = useCreateQuestionOption();
  const updateOptionMutation = useUpdateQuestionOption();
  const deleteOptionMutation = useDeleteQuestionOption();

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setOpenQuestionModal(true);
  };

  const handleCloseModal = () => {
    setOpenQuestionModal(false);
    setEditingQuestion(null);
  };

  const handleSubmitQuestion = (questionData: QuestionPayload) => {
    if (editingQuestion) {
      updateQuestionMutation.mutate(
        {
          questionId: editingQuestion.id,
          payload: questionData,
        },
        {
          onSuccess: () => {
            setOpenQuestionModal(false);
            setEditingQuestion(null);
          },
        }
      );
    } else {
      createQuestionMutation.mutate(questionData, {
        onSuccess: () => {
          setOpenQuestionModal(false);
        },
      });
    }
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    question: Question
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedQuestion(question);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    if (selectedQuestion) {
      setEditingQuestion(selectedQuestion);
      setOpenQuestionModal(true);
    }
    handleMenuClose();
  };

  const handleDeleteClick = (question: Question) => {
    setSelectedQuestion(question);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedQuestion) {
      deleteQuestionMutation.mutate(
        { questionId: selectedQuestion.id, quizId: quizId ?? "" },
        {
          onSuccess: () => {
            setDeleteDialogOpen(false);
            setSelectedQuestion(null);
          },
        }
      );
    } else {
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedQuestion(null);
  };

  const handleAddOptionClick = () => {
    setEditingOption(null);
    setOpenOptionModal(true);
    handleMenuClose();
  };

  const handleCloseOptionModal = () => {
    setOpenOptionModal(false);
    setEditingOption(null);
  };

  const handleSubmitOption = (optionData: QuestionOptionPayload) => {
    if (editingOption) {
      updateOptionMutation.mutate(
        {
          optionId: editingOption.quizQuestionOptionId,
          payload: { ...optionData, quizId: quizId ?? "" },
        },
        {
          onSuccess: () => {
            setOpenOptionModal(false);
            setEditingOption(null);
          },
        }
      );
    } else {
      createOptionMutation.mutate(
        { ...optionData, quizId: quizId ?? "" },
        {
          onSuccess: () => {
            setOpenOptionModal(false);
          },
        }
      );
    }
  };

  const handleOptionMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    option: QuestionOption
  ) => {
    setOptionAnchorEl(event.currentTarget);
    setSelectedOption(option);
  };

  const handleOptionMenuClose = () => {
    setOptionAnchorEl(null);
    setSelectedOption(null);
  };

  const handleEditOption = () => {
    if (selectedOption) {
      setEditingOption(selectedOption);
      setOpenOptionModal(true);
    }
   
  };

  const handleDeleteOptionClick = () => {
    setDeleteOptionDialogOpen(true);
  };

  const handleDeleteOptionConfirm = () => {
    if (selectedOption) {
      deleteOptionMutation.mutate(
        {
          optionId: selectedOption.quizQuestionOptionId,
          questionId: selectedOption.questionId,
          quizId: quizId ?? "",
        },
        {
          onSuccess: () => {
            setDeleteOptionDialogOpen(false);
            setSelectedOption(null);
          },
        }
      );
    }
  };

  const handleDeleteOptionCancel = () => {
    setDeleteOptionDialogOpen(false);
    setSelectedOption(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (error || !quizData) {
    return (
      <div className="text-center text-red-500">
        Failed to load quiz details.
      </div>
    );
  }

  const quiz = quizData.data.quiz;
  const questions = quizQuestionsData?.data.questions ?? [];

  return (
    <div className="space-y-6 p-6">
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        variant="text"
        onClick={() => navigate(-1)}
      >
        Back
      </Button>

      {/* Quiz Summary */}
      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <Typography variant="h5" fontWeight={600}>
                {quiz.title}
              </Typography>

              <Typography className="text-gray-600">
                {quiz.description}
              </Typography>
            </div>

            <Chip
              icon={<QuizIcon />}
              label={quiz.kind}
              color="primary"
              variant="outlined"
            />
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-3">
            <Chip label={`Scope: ${quiz.scope}`} variant="outlined" />
            <Chip label={`Delivery: ${quiz.deliveryMode}`} variant="outlined" />
            <Chip
              icon={<AccessTimeIcon />}
              label={`${quiz.timeLimitMinutes} minutes`}
              variant="outlined"
            />
            <Chip label={`Attempts: ${quiz.maxAttempts}`} variant="outlined" />
            <Chip
              label={quiz.isMandatory ? "Mandatory" : "Optional"}
              color={quiz.isMandatory ? "error" : "default"}
              variant="outlined"
            />
          </div>
        </CardContent>
      </Card>

      {/* Questions Section */}
      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Typography variant="h6" fontWeight={600}>
              Questions ({questions.length})
            </Typography>

            <Button
              variant="contained"
              size="small"
              onClick={handleAddQuestion}
            >
              Add Question
            </Button>
          </div>

          <Divider />

          {questions.length === 0 && (
            <Typography className="text-gray-500 text-center py-6">
              No questions added to this quiz yet.
            </Typography>
          )}

          <div className="space-y-4">
            {questions.map((question, index) => (
              <Card
                key={question.id}
                variant="outlined"
                className="hover:shadow-sm transition"
              >
                <CardContent className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <Typography fontWeight={500}>
                      {index + 1}. {question.questionText}
                    </Typography>

                    <div className="flex items-center gap-2">
                      <Chip
                        size="small"
                        label={question.questionType}
                        variant="outlined"
                      />
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, question)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    <span>Points: {question.points}</span>
                    {question.isRequired && (
                      <Chip
                        size="small"
                        color="error"
                        label="Required"
                        variant="outlined"
                      />
                    )}
                  </div>

                  {question.options.length > 0 && (
                    <div className="space-y-2">
                      {question.options.map((option) => (
                        <div
                          key={option.quizQuestionOptionId}
                          className={`flex items-center justify-between gap-2 rounded px-3 py-2 text-sm ${
                            option.isCorrect
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <span>{option.optionText}</span>
                            {option.isCorrect && (
                              <Chip
                                size="small"
                                color="success"
                                label="Correct"
                              />
                            )}
                          </div>
                          <IconButton
                            size="small"
                            onClick={(e) => handleOptionMenuOpen(e, option)}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleAddOptionClick}>
          <ListItemIcon>
            <AddCircleOutlineIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>Add Option</ListItemText>
        </MenuItem>

        <MenuItem
          sx={{ color: "error.main" }}
          onClick={() => handleDeleteClick(selectedQuestion!)}
        >
          <ListItemIcon>
            <DeleteOutlineIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Question</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this question? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteQuestionMutation.isPending}
          >
            {deleteQuestionMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Option Context Menu */}
      <Menu
        anchorEl={optionAnchorEl}
        open={Boolean(optionAnchorEl)}
        onClose={handleOptionMenuClose}
      >
        <MenuItem onClick={handleEditOption}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>

        <MenuItem
          sx={{ color: "error.main" }}
          onClick={handleDeleteOptionClick}
        >
          <ListItemIcon>
            <DeleteOutlineIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Delete Option Confirmation Dialog */}
      <Dialog open={deleteOptionDialogOpen} onClose={handleDeleteOptionCancel}>
        <DialogTitle>Delete Option</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this option? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteOptionCancel} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteOptionConfirm}
            color="error"
            variant="contained"
            disabled={deleteOptionMutation.isPending}
          >
            {deleteOptionMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <QuizQuestionFormModal
        open={openQuestionModal}
        quizId={quizId ?? ""}
        onClose={handleCloseModal}
        onSubmit={handleSubmitQuestion}
        loading={
          createQuestionMutation.isPending || updateQuestionMutation.isPending
        }
        initialData={editingQuestion}
      />

      <QuestionOptionFormModal
        open={openOptionModal}
        questionId={selectedQuestion?.id ?? editingOption?.questionId ?? ""}
        onClose={handleCloseOptionModal}
        onSubmit={handleSubmitOption}
        loading={
          createOptionMutation.isPending || updateOptionMutation.isPending
        }
        initialData={editingOption}
      />
    </div>
  );
};

export default QuizDetails;
