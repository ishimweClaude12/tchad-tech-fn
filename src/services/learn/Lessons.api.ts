import type { LessonPayload } from "src/components/learn/forms/LessonForm";
import axiosInstance from "../../lib/axios";
import type { ApiResponse } from "../../types/Api.types";
import type {
  GetLessonsApiResponse,
  Lesson,
} from "../../types/CourseLessons.types";

export const lessonsApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get<GetLessonsApiResponse>("/lesson");
    return data;
  },
  getAllLessonsInModule: async (moduleId: string) => {
    const { data } = await axiosInstance.get<
      ApiResponse<{ lessons: Lesson[] }>
    >(`/lesson/module/${moduleId}/all`);
    return data;
  },
  create: async (lesson: LessonPayload) => {
    const { data } = await axiosInstance.post<ApiResponse<{ lesson: Lesson }>>(
      "/lesson",
      lesson
    );
    return data;
  },
  update: async (lessonId: string, lesson: Partial<LessonPayload>) => {
    const { data } = await axiosInstance.put<ApiResponse<{ lesson: Lesson }>>(
      `/lesson/${lessonId}`,
      lesson
    );
    return data;
  },
  delete: async (lessonId: string) => {
    const { data } = await axiosInstance.delete<ApiResponse<null>>(
      `/lesson/${lessonId}`
    );
    return data;
  },

  publish: async (lessonId: string, isPublished: boolean) => {
    const { data } = await axiosInstance.patch<ApiResponse<{ lesson: Lesson }>>(
      `/lesson/${lessonId}/publish`,
      { isPublished }
    );
    return data;
  },
};
