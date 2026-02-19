import type { UserRole } from "./Users.types";

export interface Review {
  id: string;
  userId: string;
  courseId: string;
  rating: number;
  title: string;
  comment: string;
  isPublic: boolean;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  reportCount: number;
  moderationStatus: ReviewModerationStatus;
  moderatedBy: string | null;
  moderatedAt: string;
  createdAt: string;
  updatedAt: string;
  user: {
    userId: string;
    role: UserRole;
  };
  course: {
    id: string;
    title: string;
  };
}

export enum ReviewModerationStatus {
  Rejected = "rejected",
  Approved = "approved",
  Pending = "pending",
}

export interface ReviewPayload {
  userId: string;
  courseId: string;
  rating: number; // 1-5
  title: string;
  comment: string;
}

export interface Post {
  post_id: string;
  user_id: string;
  title: string;
  content: string;
  attachment: string | null;
  created_at: string;
  updated_at: string;
  view_count: number;
  comment_count: number;
  isDeleted: boolean;
}
