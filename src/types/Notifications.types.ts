export interface UserNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedId: string | null;
  relatedType: RelatedEntityType | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export enum NotificationType {
  COURSE_UPDATE = "COURSE_UPDATE",
  ASSIGNMENT_DUE = "ASSIGNMENT_DUE",
  QUIZ_AVAILABLE = "QUIZ_AVAILABLE",
  CERTIFICATE_EARNED = "CERTIFICATE_EARNED",
  REVIEW_REMINDER = "REVIEW_REMINDER",
  SYSTEM = "SYSTEM",
}

export enum RelatedEntityType {
  COURSE = "COURSE",
  QUIZ = "QUIZ",
  CERTIFICATE = "CERTIFICATE",
  SYSTEM = "SYSTEM",
  ANNOUNCEMENT = "announcement",
}

export interface NotificationPayload {
  userIds: string[];
  type: NotificationType;
  title: string;
  message: string;
  relatedId: string;
  relatedType: RelatedEntityType;
}
