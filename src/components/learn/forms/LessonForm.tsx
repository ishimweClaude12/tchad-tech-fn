import { useForm, Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  Typography,
  LinearProgress,
} from "@mui/material";
import { ControlledEditor } from "./ControlledEditor";
import {
  useCreateLesson,
  useUpdateLesson,
} from "../../../hooks/learn/useLessonApi";
import type { Lesson } from "src/types/CourseLessons.types";
import {
  useVideoUpload,
  useImageUpload,
} from "../../../hooks/learn/useVideoApi";
import { CloudUpload } from "@mui/icons-material";
import toast from "react-hot-toast";

const CONTENT_TYPES = ["TEXT", "VIDEO", "DOCUMENT"] as const;
const MAX_VIDEO_SIZE_MB = 1;
const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024;

type LessonContentType = (typeof CONTENT_TYPES)[number];

export interface LessonPayload {
  courseId: string;
  moduleId: string;
  title: string;
  description: string;
  contentType: LessonContentType;
  muxId?: string | null;
  contentUrl?: string | null;
  textContent?: string | null;
  durationMinutes: number;
  sortOrder: number;
  isPublished: boolean;
}

interface LessonFormProps {
  initialLesson?: Lesson | null;
  onClose?: () => void;
}

const LessonForm: React.FC<LessonFormProps> = ({ initialLesson, onClose }) => {
  const { courseId, moduleId } = useParams<{
    courseId: string;
    moduleId: string;
  }>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<File | null>(null);
  const [documentError, setDocumentError] = useState<string | null>(null);
  const isInitialMount = useRef(true);

  const { control, register, handleSubmit, watch, setValue } =
    useForm<LessonPayload>({
      defaultValues: {
        courseId: initialLesson?.courseId ?? courseId ?? "",
        moduleId: initialLesson?.moduleId ?? moduleId ?? "",
        title: initialLesson?.title ?? "",
        description: initialLesson?.description ?? "",
        contentType:
          (initialLesson?.contentType as LessonPayload["contentType"]) ??
          "TEXT",
        isPublished: initialLesson?.isPublished ?? false,
        durationMinutes: initialLesson?.durationMinutes ?? 0,
        sortOrder: initialLesson?.sortOrder ?? 1,
        textContent: initialLesson?.textContent ?? "",
        contentUrl: initialLesson?.contentUrl ?? null,
        muxId: initialLesson?.muxVideoId ?? null,
      },
    });

  const createLessonMutation = useCreateLesson();
  const updateLessonMutation = useUpdateLesson(initialLesson?.id ?? "");
  const uploadVideoMutation = useVideoUpload();
  const uploadDocumentMutation = useImageUpload();

  const contentType = watch("contentType");

  useEffect(() => {
    if (courseId) setValue("courseId", courseId);
    if (moduleId) setValue("moduleId", moduleId);

    if (initialLesson) {
      setValue("title", initialLesson.title);
      setValue("description", initialLesson.description);
      setValue("contentType", initialLesson.contentType);
      setValue("durationMinutes", initialLesson.durationMinutes);
      setValue("sortOrder", initialLesson.sortOrder);
      setValue("isPublished", initialLesson.isPublished);
      setValue("textContent", initialLesson.textContent ?? "");
      setValue("contentUrl", initialLesson.contentUrl ?? null);
      setValue("muxId", initialLesson.muxVideoId ?? null);
    }
  }, [courseId, moduleId, setValue, initialLesson]);

  // Clear irrelevant fields when contentType changes (skip on initial mount)
  useEffect(() => {
    // Skip cleanup on initial mount to preserve initialLesson data
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (contentType === "TEXT") {
      // Clear video and document fields
      setValue("muxId", null);
      setValue("contentUrl", null);
      setSelectedFile(null);
      setSelectedDocument(null);
      setVideoError(null);
      setDocumentError(null);
    } else if (contentType === "VIDEO") {
      // Clear document and text fields
      setValue("contentUrl", null);
      setValue("textContent", "");
      setSelectedDocument(null);
      setDocumentError(null);
    } else if (contentType === "DOCUMENT") {
      // Clear video and text fields
      setValue("muxId", null);
      setValue("textContent", "");
      setSelectedFile(null);
      setVideoError(null);
    }
  }, [contentType, setValue]);

  const onSubmit = (data: LessonPayload) => {
    // Validate content based on contentType
    // When editing, check if content already exists OR if new content is provided
    if (contentType === "VIDEO" && !data.muxId) {
      toast.error("Please upload a video before submitting");
      return;
    }
    if (contentType === "DOCUMENT" && !data.contentUrl) {
      toast.error("Please upload a document before submitting");
      return;
    }
    if (contentType === "TEXT" && !data.textContent?.trim()) {
      toast.error("Please add lesson content before submitting");
      return;
    }

    // Set content fields based on contentType
    const textContent = contentType === "TEXT" ? data.textContent : null;
    const muxId = contentType === "VIDEO" ? data.muxId : null;
    const contentUrl = contentType === "DOCUMENT" ? data.contentUrl : null;

    console.log("Form submission - contentType:", contentType);
    console.log("Form submission - data.contentUrl:", data.contentUrl);
    console.log("Form submission - data.muxId:", data.muxId);
    console.log("Form submission - final contentUrl:", contentUrl);

    if (initialLesson) {
      const payload = {
        title: data.title,
        description: data.description,
        contentType: data.contentType,
        muxId,
        contentUrl,
        textContent,
        durationMinutes: data.durationMinutes,
        sortOrder: data.sortOrder,
        isPublished: data.isPublished,
      };

      updateLessonMutation.mutate(payload, {
        onSuccess: () => {
          onClose?.();
        },
        onError: (error) => {
          toast.error("Failed to update lesson");
          console.error("Error updating lesson:", error);
        },
      });
      console.log("Lesson update payload", payload);
    } else {
      const payload = {
        courseId: data.courseId,
        moduleId: data.moduleId,
        title: data.title,
        description: data.description,
        contentType: data.contentType,
        muxId,
        contentUrl,
        textContent,
        durationMinutes: data.durationMinutes,
        sortOrder: data.sortOrder,
        isPublished: data.isPublished,
      };

      createLessonMutation.mutate(payload, {
        onSuccess: () => {
          onClose?.();
        },
      });
      console.log("Lesson create payload", payload);
    }
  };

  const handleVideoUpload = (file: File) => {
    if (file.size > MAX_VIDEO_SIZE_BYTES) {
      setVideoError("Video size must be 1 MB or less");
      setSelectedFile(null);
      return;
    }

    setVideoError(null);
    setSelectedFile(file);

    uploadVideoMutation.mutate(file, {
      onSuccess: (response: {
        maxId: string;
        assetId: string;
        playbackId: string;
      }) => {
        setValue("muxId", response.maxId, { shouldDirty: true });
        setVideoError(null);
        toast.success("Video uploaded successfully");
      },
      onError: (error) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to upload video. Please try again.";
        setVideoError(errorMessage);
        setSelectedFile(null);
        toast.error(errorMessage);
        console.error("Video upload error:", error);
      },
    });
  };

  const handleDocumentUpload = (file: File) => {
    setDocumentError(null);
    setSelectedDocument(file);

    uploadDocumentMutation.mutate(file, {
      onSuccess: (response) => {
        setValue("contentUrl", response.data.url, { shouldDirty: true });
        setDocumentError(null);
        toast.success("Document uploaded successfully");
      },
      onError: (error) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to upload document. Please try again.";
        setDocumentError(errorMessage);
        setSelectedDocument(null);
        toast.error(errorMessage);
        console.error("Document upload error:", error);
      },
    });
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardContent className="space-y-6">
        <Typography variant="h5" fontWeight={600}>
          Lesson Details
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Title */}
          <div>
            <TextField
              label="Lesson Title"
              fullWidth
              {...register("title", { required: true })}
            />
          </div>

          {/* Description */}
          <div>
            <TextField
              label="Short Description"
              fullWidth
              multiline
              rows={3}
              {...register("description")}
            />
          </div>

          {/* Hidden muxId field to ensure it's registered with the form */}
          <input type="hidden" {...register("muxId")} />
          <input type="hidden" {...register("contentUrl")} />

          {/* Content Type */}
          <div>
            <TextField
              select
              label="Content Type"
              fullWidth
              {...register("contentType")}
            >
              {CONTENT_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </div>

          {/* TEXT Content */}
          {contentType === "TEXT" && (
            <Controller
              name="textContent"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Typography fontWeight={500}>Lesson Content</Typography>
                  <div className="min-h-[40vh] max-h-[60vh] overflow-y-auto">
                    <ControlledEditor
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </div>
                </div>
              )}
            />
          )}

          {/* Video Upload */}
          {contentType === "VIDEO" && (
            <div className="space-y-3">
              <Typography fontWeight={500}>Upload Video</Typography>

              {/* Show existing video if editing */}
              {initialLesson?.muxVideoId && !selectedFile && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Typography variant="body2" className="text-blue-800">
                    ✓ Video already uploaded (ID:{" "}
                    {initialLesson.muxVideoId.substring(0, 20)}...)
                  </Typography>
                  <Typography variant="caption" className="text-blue-600">
                    Upload a new video to replace it
                  </Typography>
                </div>
              )}

              <label
                htmlFor="video-upload"
                className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer
                 hover:border-blue-500 transition bg-gray-50"
              >
                <CloudUpload className="text-gray-500 mb-2" fontSize="large" />

                <Typography variant="body2" className="text-gray-600">
                  Click to upload or drag and drop
                </Typography>

                <Typography variant="caption" className="text-gray-400">
                  MP4, MOV supported
                </Typography>

                <input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  disabled={uploadVideoMutation.isPending}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleVideoUpload(file);
                    }
                  }}
                />
              </label>

              {selectedFile && (
                <Typography variant="body2" className="text-green-700">
                  ✓ New file selected: {selectedFile.name}
                </Typography>
              )}

              {uploadVideoMutation.isPending && <LinearProgress />}

              {videoError && (
                <Typography variant="body2" color="error">
                  {videoError}
                </Typography>
              )}
            </div>
          )}

          {/* Document Upload */}
          {contentType === "DOCUMENT" && (
            <div className="space-y-3">
              <Typography fontWeight={500}>Upload Document</Typography>

              {/* Show existing document if editing */}
              {initialLesson?.contentUrl && !selectedDocument && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Typography variant="body2" className="text-blue-800">
                    ✓ Document already uploaded
                  </Typography>
                  <Typography
                    variant="caption"
                    className="text-blue-600"
                    sx={{ display: "block", mt: 0.5 }}
                  >
                    <a
                      href={initialLesson.contentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      View current document
                    </a>
                  </Typography>
                  <Typography
                    variant="caption"
                    className="text-blue-600"
                    sx={{ display: "block", mt: 0.5 }}
                  >
                    Upload a new document to replace it
                  </Typography>
                </div>
              )}

              <label
                htmlFor="document-upload"
                className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer
                 hover:border-blue-500 transition bg-gray-50"
              >
                <CloudUpload className="text-gray-500 mb-2" fontSize="large" />

                <Typography variant="body2" className="text-gray-600">
                  Click to upload or drag and drop
                </Typography>

                <Typography variant="caption" className="text-gray-400">
                  PDF supported
                </Typography>

                <input
                  id="document-upload"
                  type="file"
                  accept="application/pdf"
                  disabled={uploadDocumentMutation.isPending}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleDocumentUpload(file);
                    }
                  }}
                />
              </label>

              {selectedDocument && (
                <Typography variant="body2" className="text-green-700">
                  ✓ New file selected: {selectedDocument.name}
                </Typography>
              )}

              {uploadDocumentMutation.isPending && <LinearProgress />}

              {documentError && (
                <Typography variant="body2" color="error">
                  {documentError}
                </Typography>
              )}
            </div>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TextField
              label="Duration (minutes)"
              type="number"
              {...register("durationMinutes")}
            />

            <TextField
              label="Sort Order"
              type="number"
              {...register("sortOrder")}
            />

            <Controller
              name="isPublished"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch checked={field.value} onChange={field.onChange} />
                  }
                  label="Published"
                />
              )}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outlined"
              onClick={() => {
                onClose?.();
              }}
            >
              Cancel
            </Button>
            <Button variant="contained" type="submit">
              {(() => {
                if (initialLesson) {
                  return updateLessonMutation.isPending
                    ? "Updating..."
                    : "Update Lesson";
                }
                return createLessonMutation.isPending
                  ? "Creating..."
                  : "Create Lesson";
              })()}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LessonForm;
