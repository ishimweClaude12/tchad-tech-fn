import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  modulesApi,
  type GetCourseModulesApiResponse,
} from "../../services/learn/Moduels.api";
import type { Module } from "../../types/Module.types";
import toast from "react-hot-toast";
import { queryKeys } from "../useApi";

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
    mutationFn: () => modulesApi.publish(moduleId),
    onSuccess: () => {
      toast.success("Module publication status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.all,
      });
    },
    onError: (error) => {
      toast.error("Failed to update module publication status");
      console.error("Error updating module publication status:", error);
    },
  });
};

export const useDeleteModule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => modulesApi.delete(id),
    onSuccess: () => {
      toast.success("Module deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.all,
      });
    },
    onError: (error) => {
      toast.error("Failed to delete module");
      console.error("Error deleting module:", error);
    },
  });
};

export const useUpdateModule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Module> }) =>
      modulesApi.update(id, data),
    onSuccess: (_, variables) => {
      toast.success("Module updated successfully");
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      queryClient.invalidateQueries({
        queryKey: ["module", variables.id],
      });
    },
    onError: (error) => {
      toast.error("Failed to update module");
      console.error("Error updating module:", error);
    },
  });
};
