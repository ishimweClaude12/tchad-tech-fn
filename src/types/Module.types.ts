import type { ApiResponse, PaginationMeta } from "./Api.types";

export interface ModulesResponse {
  modules: Module[];
  meata: PaginationMeta; // API typo kept intentionally for exact mapping
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
  course: ModuleCourse;
  lessons: Lesson[];
}

export interface ModuleCourse {
  id: string;
  title: string;
  slug: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  moduleId: string;
  title: string;
  description: string;
  contentType: LessonContentType;
  contentUrl: string;
  muxVideoId: string | null;
  textContent: string | null;
  durationMinutes: number;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export type LessonContentType = "VIDEO" | "TEXT";

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
