import type { ApiResponse, PaginationMeta } from "./Api.types";
import type { CourseCategory } from "./CourseCategories.types";

export interface CourseResponse {
  courses: {
    data: Course[];
    meta: PaginationMeta;
  };
}

export interface Course {
  id: string;
  instructorId: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  shortDescription: string;
  thumbnailUrl: string;
  previewVideoId: string;
  learningObjectives: string[];
  prerequisites: string;
  targetAudience: string;
  difficultyLevel: string;
  estimatedDurationHours: string;
  price: string;
  discountPrice: string;
  currency: string;
  categoryId: string;
  subcategoryId: string;
  tags: string[];
  status: CourseStatus;
  publicationDate: string | null;
  lastUpdatedDate: string | null;
  enrollmentCount: number;
  completionCount: number;
  ratingAverage: number | null;
  ratingCount: number;
  totalLessons: number;
  totalQuizzes: number;
  totalAssignments: number;
  totalDurationMinutes: number;
  hasCertificate: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  instructor: Instructor;
  category: CourseCategory;
  subcategory: CourseCategory;
  muxVideo: MuxVideo;
}

export interface Instructor {
  id: string;
  userId: string;
  role: string;
}

export enum CourseStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

export interface MuxVideo {
  id: string;
  assetId: string;
  playbackId: string;
  status: string;
  duration: number | null;
  aspectRatio: string | null;
  uploadedAt: string;
  processedAt: string | null;
  deletedAt: string | null;
}

export type GetCoursesApiResponse = ApiResponse<CourseResponse>;
export type GetCourseApiResponse = ApiResponse<{ course: Course }>;
