import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  modulesApi,
  type GetCourseModulesApiResponse,
} from "../../services/learn/Moduels.api";
import type { Module } from "../../types/Module.types";
import toast from "react-hot-toast";

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

export const usePublishModule = (moduleId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      modulesApi.publish(moduleId),
    onSuccess: () => {
      toast.success("Module publication status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["modules"] });
    },
    onError: (error) => {
      toast.error("Failed to update module publication status");
      console.error("Error updating module publication status:", error);
    },
  });
};
