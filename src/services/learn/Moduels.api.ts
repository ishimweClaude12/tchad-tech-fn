import axiosInstance from "../../lib/axios";
import type { ApiResponse, PaginationMeta } from "../../types/Api.types";
import type { Module, UpdateModulePayload } from "../../types/Module.types";

export type GetCourseModulesApiResponse = ApiResponse<CourseModulesResponse>;
export interface CourseModulesResponse {
  modules: Module[];
  meta: PaginationMeta;
}

export const modulesApi = {
  getAll: async (courseId: string) => {
    const { data } = await axiosInstance.get<GetCourseModulesApiResponse>(
      `/modules/course/${courseId}`,
    );
    return data;
  },

  getModuleById: async (moduleId: string): Promise<Module> => {
    const { data } = await axiosInstance.get<ApiResponse<{ module: Module }>>(
      `/modules/${moduleId}`,
    );
    if (!data.success) throw new Error("Module not found");
    return data.data.module;
  },
  publish: async (moduleId: string) => {
    const { data } = await axiosInstance.patch<ApiResponse<{ module: Module }>>(
      `/modules/${moduleId}/publish`,
    );
    return data;
  },
  delete: async (id: string) => {
    const { data } = await axiosInstance.delete<ApiResponse<null>>(
      `/modules/${id}`,
    );
    return data;
  },
  update: async (id: string, data: Partial<Module>) => {
    const updatedModule: UpdateModulePayload = {
      title: data.title || "",
      description: data.description || "",
      sortOrder: data.sortOrder || 0,
      isPreview: data.isPreview || false,
      estimatedDurationMinutes: data.estimatedDurationMinutes || 0,
      isPublished: data.isPublished || false,
    };
    const response = await axiosInstance.put<ApiResponse<{ module: Module }>>(
      `/modules/${id}`,
      updatedModule,
    );
    return response.data;
  },
  getPublishedModulesByCourseId: async (courseId: string) => {
    const { data } = await axiosInstance.get<GetCourseModulesApiResponse>(
      `/modules/course/${courseId}`,
    );
    return data;
  },
};
