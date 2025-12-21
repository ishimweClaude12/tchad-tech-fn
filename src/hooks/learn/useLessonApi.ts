import { useQuery } from "@tanstack/react-query";
import { lessonsApi } from "../../services/learn/Lessons.api";
import type { GetLessonsApiResponse } from "../../types/CourseLessons.types";

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
