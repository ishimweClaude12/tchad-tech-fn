import type { ApiResponse, PaginationMeta } from "./Api.types";
import type { BaseLesson } from "./CourseLessons.types";

export interface ModulesResponse {
  modules: Module[];
  meta: PaginationMeta;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  sortOrder: number;
  isPreview: boolean;
  estimatedDurationMinutes: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  course: BaseCourse;
  lessons: BaseLesson[];
}

export interface BaseCourse {
  id: string;
  title: string;
  slug: string;
  instructorId?: string;
}

 

export type GetModulesApiResponse = ApiResponse<ModulesResponse>;

export interface ModuleFormData {
  courseId: string;
  title: string;
  description: string;
  sortOrder: number;
  isPreview: boolean;
  estimatedDurationMinutes: number;
  isPublished: boolean;
}
