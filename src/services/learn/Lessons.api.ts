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
};
