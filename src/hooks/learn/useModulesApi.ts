import { useQuery } from "@tanstack/react-query";
import {
  modulesApi,
  type GetCourseModulesApiResponse,
} from "../../services/learn/Moduels.api";
import type { Module } from "../../types/Module.types";

export const useModulesById = (courseId: string) => {
  return useQuery<GetCourseModulesApiResponse>({
    queryKey: ["modules", courseId],
    queryFn: () => modulesApi.getAll(courseId),
  });
};

export const useModuleById = (moduleId: string) => {
  return useQuery<Module>({
    queryKey: ["module", moduleId],
    queryFn: () => modulesApi.getModuleById(moduleId),
    enabled: !!moduleId,
  });
};
