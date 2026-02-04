import type { BaseCourse } from "./Module.types";
import type { UserRole } from "./Users.types";

export interface Announcement {
  id: string;
  courseId: string;
  authorId: string;
  title: string;
  content: string;
  isGlobal: boolean;
  isPublished: boolean;
  publishedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: {
    userId: string;
    role: UserRole;
  };
  course: BaseCourse;
}

export interface AnnouncementPayload {
  courseId: string;
  authorId: string;
  title: string;
  content: string;
  isGlobal: boolean;
  isPublished: boolean;
  expiresAt?: string;
}
