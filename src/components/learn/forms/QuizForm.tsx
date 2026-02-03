import {
  Modal,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import type { QuizPayload, Quiz } from "../../../types/Quiz.types";
import type { UseMutationResult } from "@tanstack/react-query";
 
import { QuizDeliveryMode, QuizKind, QuizScope } from "../../../utils/enums/Quiz.enums";
import type { ApiResponse } from "src/types/Api.types";

interface QuizFormModalProps {
  open: boolean;
  onClose: () => void;
  quiz?: Quiz | null;
  createQuizMutation?: UseMutationResult<ApiResponse<{ quiz: Quiz }>
  , Error, QuizPayload, unknown>;
  updateQuizMutation?: UseMutationResult<
    ApiResponse<{ quiz: Quiz }>,
    Error,
    { quizId: string; payload: QuizPayload },
    unknown
  >;
  queryClient: ReturnType<typeof useQueryClient>;
  // Context-based IDs - at least one must be provided
  courseId?: string;
  moduleId?: string;
  lessonId?: string;
  // Callback for cache invalidation
  onSuccessCallback?: () => void;
}

const QuizFormModal: React.FC<QuizFormModalProps> = ({
  open,
  onClose,
  quiz,
  createQuizMutation,
  updateQuizMutation,
  queryClient,
  courseId,
  moduleId,
  lessonId,
  onSuccessCallback,
}) => {
  const isEditMode = !!quiz;
  const mutation = isEditMode ? updateQuizMutation : createQuizMutation;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    kind: QuizKind.QUIZ,
    scope: QuizScope.COURSE,
    deliveryMode: QuizDeliveryMode.INDIVIDUAL,
    openAt: "",
    closeAt: "",
    passingScore: 70,
    timeLimitMinutes: 30,
    maxAttempts: 3,
    shuffleQuestions: false,
    shuffleOptions: false,
    showCorrectAnswers: false,
    showResultsImmediately: false,
    isMandatory: false,
    requireWebCam: false,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      kind: QuizKind.QUIZ,
      scope: QuizScope.COURSE,
      deliveryMode:  QuizDeliveryMode.INDIVIDUAL,
      openAt: "",
      closeAt: "",
      passingScore: 70,
      timeLimitMinutes: 30,
      maxAttempts: 3,
      shuffleQuestions: false,
      shuffleOptions: false,
      showCorrectAnswers: false,
      showResultsImmediately: false,
      isMandatory: false,
      requireWebCam: false,
    });
  };

  useEffect(() => {
    if (!open) return;
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (isEditMode && quiz) {
      const newData = {
        title: quiz.title,
        description: quiz.description,
        kind: quiz.kind,
        scope: quiz.scope,
        deliveryMode: quiz.deliveryMode,
        openAt: quiz.openAt,
        closeAt: quiz.closeAt,
        passingScore: Number(quiz.passingScore),
        timeLimitMinutes: quiz.timeLimitMinutes,
        maxAttempts: quiz.maxAttempts,
        shuffleQuestions: quiz.shuffleQuestions,
        shuffleOptions: quiz.shuffleOptions,
        showCorrectAnswers: quiz.showCorrectAnswers,
        showResultsImmediately: quiz.showResultsImmediately,
        isMandatory: quiz.isMandatory,
        requireWebCam: quiz.requireWebCam,
      };

      timer = setTimeout(() => setFormData(newData), 0);
    } else {
      timer = setTimeout(resetForm, 0);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [open, quiz, isEditMode]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    // Validation

    if (!formData.title.trim()) {
      toast.error("Quiz title is required");
      return;
    }

    if (!formData.openAt || !formData.closeAt) {
      toast.error("Open and close dates are required");
      return;
    }

    if (new Date(formData.openAt) >= new Date(formData.closeAt)) {
      toast.error("Close date must be after open date");
      return;
    }

    if (isEditMode && updateQuizMutation && quiz) {
      const payload: QuizPayload = {
        ...formData,
        passingScore: Number(formData.passingScore),
        kind: formData.kind  ,
        scope: formData.scope,
        deliveryMode: formData.deliveryMode,
        lessonId: lessonId || "",
        moduleId: moduleId || null,
        courseId: courseId || "",
        sortOrder: 0,
      };

      updateQuizMutation.mutate(
        { quizId: quiz.id, payload },
        {
          onSuccess: () => {
            toast.success("Quiz updated successfully");
            resetForm();
            invalidateQuizCache();
            onClose();
          },
          onError: (error) => {
            toast.error(
              error instanceof Error ? error.message : "Failed to update quiz"
            );
          },
        }
      );
    } else if (!isEditMode && createQuizMutation) {
      const payload: QuizPayload = {
        ...formData,
        courseId: courseId || "",
        lessonId: lessonId || "",
        moduleId: moduleId || null,
        passingScore: Number(formData.passingScore),
        sortOrder: 0,
        kind: formData.kind,
        scope: formData.scope ,
        deliveryMode: formData.deliveryMode ,
      };

      createQuizMutation.mutate(payload, {
        onSuccess: () => {
          resetForm();
          invalidateQuizCache();
          onClose();
        },
        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : "Failed to create quiz",
          );
        },
      });
    }
  };

  const invalidateQuizCache = () => {
    // Invalidate appropriate cache based on context
    if (onSuccessCallback) {
      onSuccessCallback();
    } else {
      // Default cache invalidation
      if (courseId) {
        queryClient.invalidateQueries({
          queryKey: ["courseQuizzes", courseId],
        });
      }
      if (moduleId) {
        queryClient.invalidateQueries({
          queryKey: ["moduleQuizzes", moduleId],
        });
      }
      if (lessonId) {
        queryClient.invalidateQueries({
          queryKey: ["lessonQuizzes", lessonId],
        });
      }
    }
  };

  const handleClose = () => {
    if (!mutation?.isPending) {
      resetForm();
      onClose();
    }
  };

  const isLoading = mutation?.isPending ?? false;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="absolute top-1/2 left-1/2 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg overflow-y-auto max-h-[90vh]">
        <Typography variant="h6" fontWeight={600}>
          {isEditMode ? "Edit Quiz" : "Create Quiz"}
        </Typography>

        <div className="mt-6 space-y-8">
          {/* Basic Info */}
          <section className="space-y-4">
            <Typography fontWeight={500}>Basic Information</Typography>

            <TextField
              label="Title"
              fullWidth
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              disabled={isLoading}
            />

            <TextField
              label="Description"
              multiline
              rows={3}
              fullWidth
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              disabled={isLoading}
            />
          </section>

          {/* Type and Scope */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormControl fullWidth disabled={isLoading}>
              <InputLabel>Kind</InputLabel>
              <Select
                label="Kind"
                value={formData.kind}
                onChange={(e) => handleChange("kind", e.target.value)}
              >
                <MenuItem value="QUIZ">Quiz</MenuItem>
                <MenuItem value="ASSESSMENT">Assessment</MenuItem>
                <MenuItem value="EXAM">Exam</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth disabled={isLoading}>
              <InputLabel>Scope</InputLabel>
              <Select
                label="Scope"
                value={formData.scope}
                onChange={(e) => handleChange("scope", e.target.value)}
              >
                <MenuItem value="COURSE">Course</MenuItem>
                <MenuItem value="MODULE">Module</MenuItem>
                <MenuItem value="LESSON">Lesson</MenuItem>
              </Select>
            </FormControl>
          </section>

          {/* Delivery and Schedule */}
          <section className="space-y-4">
            <FormControl fullWidth disabled={isLoading}>
              <InputLabel>Delivery Mode</InputLabel>
              <Select
                label="Delivery Mode"
                value={formData.deliveryMode}
                onChange={(e) => handleChange("deliveryMode", e.target.value)}
              >
                <MenuItem value="INDIVIDUAL">Individual</MenuItem>
                <MenuItem value="SCHEDULED">Scheduled</MenuItem>
              </Select>
            </FormControl>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                type="datetime-local"
                label="Open At"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.openAt}
                onChange={(e) => handleChange("openAt", e.target.value)}
                disabled={isLoading}
              />

              <TextField
                type="datetime-local"
                label="Close At"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.closeAt}
                onChange={(e) => handleChange("closeAt", e.target.value)}
                disabled={isLoading}
              />
            </div>
          </section>

          {/* Rules */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TextField
              label="Passing Score (%)"
              type="number"
              fullWidth
              value={formData.passingScore}
              onChange={(e) => handleChange("passingScore", e.target.value)}
              inputProps={{ min: 0, max: 100 }}
              disabled={isLoading}
            />

            <TextField
              label="Time Limit (minutes)"
              type="number"
              fullWidth
              value={formData.timeLimitMinutes}
              onChange={(e) =>
                handleChange("timeLimitMinutes", Number(e.target.value))
              }
              inputProps={{ min: 1 }}
              disabled={isLoading}
            />

            <TextField
              label="Max Attempts"
              type="number"
              fullWidth
              value={formData.maxAttempts}
              onChange={(e) =>
                handleChange("maxAttempts", Number(e.target.value))
              }
              inputProps={{ min: 1 }}
              disabled={isLoading}
            />
          </section>

          {/* Settings */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormControlLabel
              control={
                <Switch
                  checked={formData.shuffleQuestions}
                  onChange={(e) =>
                    handleChange("shuffleQuestions", e.target.checked)
                  }
                  disabled={isLoading}
                />
              }
              label="Shuffle Questions"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.shuffleOptions}
                  onChange={(e) =>
                    handleChange("shuffleOptions", e.target.checked)
                  }
                  disabled={isLoading}
                />
              }
              label="Shuffle Options"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.showCorrectAnswers}
                  onChange={(e) =>
                    handleChange("showCorrectAnswers", e.target.checked)
                  }
                  disabled={isLoading}
                />
              }
              label="Show Correct Answers"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.showResultsImmediately}
                  onChange={(e) =>
                    handleChange("showResultsImmediately", e.target.checked)
                  }
                  disabled={isLoading}
                />
              }
              label="Show Results Immediately"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.isMandatory}
                  onChange={(e) =>
                    handleChange("isMandatory", e.target.checked)
                  }
                  disabled={isLoading}
                />
              }
              label="Mandatory Quiz"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.requireWebCam}
                  onChange={(e) =>
                    handleChange("requireWebCam", e.target.checked)
                  }
                  disabled={isLoading}
                />
              }
              label="Require Webcam"
            />
          </section>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              onClick={handleClose}
              variant="outlined"
              disabled={isLoading}
            >
              Cancel
            </Button>

            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : isEditMode ? (
                "Update Quiz"
              ) : (
                "Create Quiz"
              )}
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default QuizFormModal;
