import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  MenuItem,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useState, useEffect } from "react";
import { QuestionType } from "../../../utils/enums/Quiz.enums";
import type { QuestionPayload, Question } from "src/types/Quiz.types";

interface Props {
  open: boolean;
  quizId: string;
  onClose: () => void;
  onSubmit: (data: QuestionPayload) => void;
  loading?: boolean;
  initialData?: Question | null;
}

const QUESTION_TYPES: QuestionType[] = [
  QuestionType.MULTIPLE_CHOICE,
  QuestionType.TRUE_FALSE,
  QuestionType.SHORT_ANSWER,
];

const QuizQuestionFormModal = ({
  open,
  quizId,
  onClose,
  onSubmit,
  loading = false,
  initialData = null,
}: Props) => {
  const [form, setForm] = useState({
    quizId,
    questionText: "",
    questionType: QuestionType.MULTIPLE_CHOICE,
    points: 1,
    explanation: "",
    mediaUrl: "",
    sortOrder: 1,
    isRequired: true,
  });

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        quizId: initialData.quizId,
        questionText: initialData.questionText,
        questionType: initialData.questionType,
        points: +initialData.points,
        explanation: initialData.explanation || "",
        mediaUrl: initialData.mediaUrl || "",
        sortOrder: initialData.sortOrder,
        isRequired: initialData.isRequired,
      });
    } else {
      setForm({
        quizId,
        questionText: "",
        questionType: QuestionType.MULTIPLE_CHOICE,
        points: 1,
        explanation: "",
        mediaUrl: "",
        sortOrder: 1,
        isRequired: true,
      });
    }
  }, [initialData, quizId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const getButtonText = () => {
    if (loading) return "Saving...";
    return initialData ? "Update Question" : "Create Question";
  };

  const buttonText = getButtonText();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {initialData ? "Edit Quiz Question" : "Create Quiz Question"}
      </DialogTitle>

      <DialogContent className="space-y-6 pt-4">
        {/* Question Text */}
        <TextField
          label="Question"
          name="questionText"
          value={form.questionText}
          onChange={handleChange}
          fullWidth
          multiline
          minRows={2}
          required
        />

        {/* Question Type */}
        <TextField
          select
          label="Question Type"
          name="questionType"
          value={form.questionType}
          onChange={handleChange}
          fullWidth
        >
          {QUESTION_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {type.replace("_", " ").toUpperCase()}
            </MenuItem>
          ))}
        </TextField>

        {/* Points and Order */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            label="Points"
            name="points"
            type="number"
            value={form.points}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Sort Order"
            name="sortOrder"
            type="number"
            value={form.sortOrder}
            onChange={handleChange}
            fullWidth
          />
        </div>

        {/* Explanation */}
        <TextField
          label="Explanation (Optional)"
          name="explanation"
          value={form.explanation}
          onChange={handleChange}
          fullWidth
          multiline
          minRows={2}
        />

        {/* Media URL */}
        <TextField
          label="Media URL (Optional)"
          name="mediaUrl"
          value={form.mediaUrl}
          onChange={handleChange}
          fullWidth
        />

        {/* Required Toggle */}
        <FormControlLabel
          control={
            <Switch
              checked={form.isRequired}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  isRequired: e.target.checked,
                }))
              }
            />
          }
          label="Question is required"
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="contained"
            disabled={loading}
            onClick={() => {
              onSubmit(form);
            }}
          >
            {buttonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuizQuestionFormModal;
