import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useState, useEffect } from "react";
import type {
  QuestionOptionPayload,
  QuestionOption,
} from "src/types/Quiz.types";

interface Props {
  open: boolean;
  questionId: string;
  onClose: () => void;
  onSubmit: (data: QuestionOptionPayload) => void;
  loading?: boolean;
  initialData?: QuestionOption | null;
}

const QuestionOptionFormModal = ({
  open,
  questionId,
  onClose,
  onSubmit,
  loading = false,
  initialData = null,
}: Props) => {
  const [form, setForm] = useState({
    questionId,
    optionText: "",
    isCorrect: false,
    sortOrder: 1,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        questionId: initialData.questionId,
        optionText: initialData.optionText,
        isCorrect: initialData.isCorrect,
        sortOrder: initialData.sortOrder,
      });
    } else {
      setForm({
        questionId,
        optionText: "",
        isCorrect: false,
        sortOrder: 1,
      });
    }
  }, [questionId, open, initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  const getButtonText = () => {
    if (loading) {
      return "Saving...";
    }
    if (initialData) {
      return "Update Option";
    }
    return "Add Option";
  };

  const buttonText = getButtonText();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {initialData ? "Edit Question Option" : "Add Question Option"}
      </DialogTitle>

      <DialogContent className="space-y-6 pt-4">
        {/* Option Text */}
        <TextField
          label="Option Text"
          name="optionText"
          value={form.optionText}
          onChange={handleChange}
          fullWidth
          multiline
          minRows={2}
          required
        />

        {/* Sort Order */}
        <TextField
          label="Sort Order"
          name="sortOrder"
          type="number"
          value={form.sortOrder}
          onChange={handleChange}
          fullWidth
        />

        {/* Is Correct Toggle */}
        <FormControlLabel
          control={
            <Switch
              checked={form.isCorrect}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  isCorrect: e.target.checked,
                }))
              }
            />
          }
          label="This is the correct answer"
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="contained"
            disabled={loading || !form.optionText.trim()}
            onClick={handleSubmit}
          >
            {buttonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionOptionFormModal;
