import type { LessonContentType, LessonModule } from "./CourseLessons.types";

export enum EnrollmentType {
  PAID = "paid",
  FREE = "free",
  SCHOLARSHIP = "scholarship",
}

export enum EnrollmentStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
  PENDING_PAYMENT = "pending_payment",
  CANCELLED = "cancelled",
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrollmentType: EnrollmentType;
  status: EnrollmentStatus;
  enrolledAt: string;
  completedAt: null;
  createdAt: string;
  updatedAt: string;
}

export interface CourseEnrollment {
  id: string;
  userId: string;
  courseId: string;
  enrollmentType: EnrollmentType;
  status: EnrollmentStatus;
  enrolledAt: string;
  completedAt: null;
  createdAt: string;
  updatedAt: string;
  course: {
    id: string;
    title: string;
    slug: string;
    description: string;
    thumbnailUrl: string;
    price: number;
  };
}

export interface PayCoursePayload {
  enrollmentId: string;
  amount: number;
  phoneNumber: string;
}

export type UserEnrollment = Enrollment & {
  user: {
    userId: string;
  };
};

export enum ModuleProgressStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export interface ModuleProgress {
  id: string;
  enrollmentId: string;
  moduleId: string;
  status: ModuleProgressStatus;
  totalLessons: number;
  completedLessons: number | null;
  totalQuizzes: number;
  completedQuizzes: number | null;
  completionPercentage: string;
  startedAt: string;
  completedAt: string | null;
  lastAccessedAt: string;
  createdAt: string;
  updatedAt: string;
  module: {
    id: string;
    title: string;
    description: string;
    sortOrder: number;
  };
}

export interface EnrollmentProgress {
  id: string;
  enrollmentId: string;
  lessonId: string;
  status: ModuleProgressStatus;
  completedAt: string;
  lastAccessedAt: string;
  createdAt: string;
  updatedAt: string;
  lesson: ProgressLesson;
}

export interface ProgressLesson {
  id: string;
  title: string;
  description: string;
  contentType: LessonContentType;
  sortOrder: number;
  moduleId: string;
  module: LessonModule;
}
