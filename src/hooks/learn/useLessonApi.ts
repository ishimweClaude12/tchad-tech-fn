import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { lessonsApi } from "../../services/learn/Lessons.api";
import type { GetLessonsApiResponse } from "../../types/CourseLessons.types";
import { toast } from "react-hot-toast";
import type { LessonPayload } from "src/components/learn/forms/LessonForm";

export const useLessons = () => {
  return useQuery<GetLessonsApiResponse>({
    queryKey: ["lessons"],
    queryFn: lessonsApi.getAll,
  });
};

export const useLessonsByModuleId = (moduleId: string) => {
  return useQuery({
    queryKey: ["lessons", moduleId],
    queryFn: () => lessonsApi.getAllLessonsInModule(moduleId),
    enabled: !!moduleId,
  });
};

export const useCreateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lesson: LessonPayload) => lessonsApi.create(lesson),
    onSuccess: () => {
      toast.success("Lesson created successfully");
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
    onError: (error) => {
      toast.error("Failed to create lesson");
      console.error("Error creating lesson:", error);
    },
  });
};

export const useUpdateLesson = (lessonId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (lesson: Partial<LessonPayload>) =>
      lessonsApi.update(lessonId, lesson),
    onSuccess: () => {
      toast.success("Lesson updated successfully");
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
    onError: (error) => {
      toast.error("Failed to update lesson");
      console.error("Error updating lesson:", error);
    },
  });
};

export const useDeleteLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lessonId: string) => lessonsApi.delete(lessonId),
    onSuccess: () => {
      toast.success("Lesson deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
    onError: (error) => {
      toast.error("Failed to delete lesson");
      console.error("Error deleting lesson:", error);
    },
  });
};

export const usePublishLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      lessonId,
      isPublished,
    }: {
      lessonId: string;
      isPublished: boolean;
    }) => lessonsApi.publish(lessonId, isPublished),
    onSuccess: () => {
      toast.success(`Lesson publication status updated`);
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
    onError: (error) => {
      toast.error("Failed to update lesson publication status");
      console.error("Error updating lesson publication status:", error);
    },
  });
};
