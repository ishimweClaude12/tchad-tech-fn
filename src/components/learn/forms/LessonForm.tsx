import { useForm, Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
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
import { useVideoUpload } from "../../../hooks/learn/useVideoApi";
import { CloudUpload } from "@mui/icons-material";
import toast from "react-hot-toast";

const CONTENT_TYPES = ["TEXT", "VIDEO", "AUDIO", "DOCUMENT"] as const;
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
  const decodeHtml = (html?: string | null) => {
    if (!html) return "";
    try {
      const doc = new DOMParser().parseFromString(html, "text/html");
      return doc.documentElement.textContent || html;
    } catch (e) {
      console.error("Error decoding HTML content:", e);
      return html;
    }
  };
  const { courseId, moduleId } = useParams<{
    courseId: string;
    moduleId: string;
  }>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

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
        textContent: initialLesson ? decodeHtml(initialLesson.textContent) : "",
        contentUrl: initialLesson?.contentUrl ?? null,
        muxId: initialLesson?.muxVideoId ?? null,
      },
    });

  const createLessonMutation = useCreateLesson();
  const updateLessonMutation = useUpdateLesson(initialLesson?.id ?? "");
  const uploadVideoMutation = useVideoUpload();

  const contentType = watch("contentType");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const muxId = watch("muxId");

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
      setValue("textContent", decodeHtml(initialLesson.textContent));
      setValue("contentUrl", initialLesson.contentUrl ?? null);
      setValue("muxId", initialLesson.muxVideoId ?? null);
    }
  }, [courseId, moduleId, setValue, initialLesson]);

  const onSubmit = (data: LessonPayload) => {
    const textContent = contentType === "TEXT" ? data.textContent : null;

    if (initialLesson) {
      const payload = {
        title: data.title,
        description: data.description,
        contentType: data.contentType,
        muxId: data.muxId ?? null,
        contentUrl: data.contentUrl ?? null,
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
        muxId: data.muxId ?? null,
        contentUrl: data.contentUrl ?? null,
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
      onSuccess: (response: { assetId: string }) => {
        setValue("muxId", response.assetId, { shouldDirty: true });
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

          {/* Media Fields */}
          {contentType !== "TEXT" && (
            <div className="space-y-3">
              <Typography fontWeight={500}>Upload Video</Typography>

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
                <Typography variant="body2" className="text-gray-700">
                  Selected file: {selectedFile.name}
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
