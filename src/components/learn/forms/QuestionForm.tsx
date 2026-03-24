import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  MenuItem,
  Switch,
  FormControlLabel,
  LinearProgress,
  Typography,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { QuestionType } from "../../../utils/enums/Quiz.enums";
import type { QuestionPayload, Question } from "src/types/Quiz.types";
import { useImageUpload } from "../../../hooks/learn/useVideoApi";

interface Props {
  open: boolean;
  quizId: string;
  onClose: () => void;
  onSubmit: (data: QuestionPayload) => void;
  loading?: boolean;
  initialData?: Question | null;
  isAutoGraded?: boolean;
}

const ALL_QUESTION_TYPES: QuestionType[] = [
  QuestionType.MULTIPLE_CHOICE,
  QuestionType.DOCUMENT,
  QuestionType.SHORT_ANSWER,
];

const NON_AUTO_GRADED_TYPES: QuestionType[] = [
  QuestionType.DOCUMENT,
  QuestionType.SHORT_ANSWER,
];

const QuizQuestionFormModal = ({
  open,
  quizId,
  onClose,
  onSubmit,
  loading = false,
  initialData = null,
  isAutoGraded,
}: Props) => {
  const availableTypes =
    isAutoGraded === false ? NON_AUTO_GRADED_TYPES : ALL_QUESTION_TYPES;
  const defaultQuestionType =
    isAutoGraded === false
      ? QuestionType.DOCUMENT
      : QuestionType.MULTIPLE_CHOICE;

  const [form, setForm] = useState({
    quizId,
    questionText: "",
    questionType: defaultQuestionType,
    points: 1,
    explanation: "",
    mediaUrl: "",
    sortOrder: 1,
    isRequired: true,
  });

  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const imageUploadMutation = useImageUpload();

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
      setSelectedFileName(null);
      setUploadError(null);
    } else {
      setForm({
        quizId,
        questionText: "",
        questionType: defaultQuestionType,
        points: 1,
        explanation: "",
        mediaUrl: "",
        sortOrder: 1,
        isRequired: true,
      });
      setSelectedFileName(null);
      setUploadError(null);
    }
  }, [initialData, quizId, defaultQuestionType]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "questionType") {
      setForm((prev) => ({
        ...prev,
        questionType: value as QuestionType,
        mediaUrl: "",
      }));
      setSelectedFileName(null);
      setUploadError(null);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setUploadError("Please select a PDF file.");
      return;
    }

    setUploadError(null);
    setSelectedFileName(file.name);

    imageUploadMutation.mutate(file, {
      onSuccess: (response) => {
        setForm((prev) => ({ ...prev, mediaUrl: response.data.url }));
      },
      onError: () => {
        setUploadError("Failed to upload PDF. Please try again.");
        setSelectedFileName(null);
        setForm((prev) => ({ ...prev, mediaUrl: "" }));
      },
    });
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
          {availableTypes.map((type) => (
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

        {/* Media — PDF upload for DOCUMENT, plain URL field otherwise */}
        {form.questionType === QuestionType.DOCUMENT ? (
          <div className="flex flex-col gap-2">
            <Typography variant="body2" color="text.secondary">
              Upload Document (PDF)
            </Typography>
            <input
              ref={pdfInputRef}
              type="file"
              accept="application/pdf"
              style={{ display: "none" }}
              onChange={handlePdfUpload}
            />
            <Button
              variant="outlined"
              component="span"
              disabled={imageUploadMutation.isPending}
              onClick={() => pdfInputRef.current?.click()}
            >
              {imageUploadMutation.isPending ? "Uploading..." : "Select PDF"}
            </Button>
            {imageUploadMutation.isPending && <LinearProgress />}
            {selectedFileName && !uploadError && (
              <Typography variant="caption" color="text.secondary">
                {form.mediaUrl
                  ? `Uploaded: ${selectedFileName}`
                  : `Selected: ${selectedFileName}`}
              </Typography>
            )}
            {uploadError && (
              <Typography variant="caption" color="error">
                {uploadError}
              </Typography>
            )}
            {form.mediaUrl && !imageUploadMutation.isPending && (
              <div className="flex flex-col gap-1 mt-1">
                <Typography variant="caption" color="text.secondary">
                  Document preview:
                </Typography>
                <iframe
                  src={form.mediaUrl}
                  title="Document preview"
                  width="100%"
                  height="320px"
                  style={{ border: "1px solid #e0e0e0", borderRadius: 4 }}
                />
                <a
                  href={form.mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 12 }}
                >
                  Open in new tab
                </a>
              </div>
            )}
          </div>
        ) : (
          <TextField
            label="Media URL (Optional)"
            name="mediaUrl"
            value={form.mediaUrl}
            onChange={handleChange}
            fullWidth
          />
        )}

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
            disabled={loading || imageUploadMutation.isPending}
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
