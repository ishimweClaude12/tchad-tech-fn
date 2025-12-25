import type { ApiResponse, PaginationMeta } from "./Api.types";
import type { BaseCourse } from "./Module.types";

export type GetLessonsApiResponse = ApiResponse<LessonsResponse>;
export interface LessonsResponse {
  lessons: Lesson[];
  meta: PaginationMeta;
}

export interface BaseLesson {
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

export interface Lesson extends BaseLesson {
  course: BaseCourse;
  module: LessonModule | null;
}
export type LessonContentType = "VIDEO" | "TEXT";

export interface LessonModule {
  id: string;
  title: string;
  sortOrder: number;
}
