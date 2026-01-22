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
}
