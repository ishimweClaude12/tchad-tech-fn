import type {
  CourseEnrollment,
  Enrollment,
  EnrollmentStatus,
  EnrollmentType,
  PayCoursePayload,
  UserEnrollment,
} from "src/types/Enrollment.types";
import axiosInstance from "../../lib/axios";
import type { ApiResponse } from "../../types/Api.types";

export const enrollmentApi = {
  enrollInCourse: async (courseId: string, userId: string) => {
    const { data } = await axiosInstance.post<
      ApiResponse<{ enrollment: Enrollment }>
    >(`/enrollments`, { courseId, userId });
    return data;
  },
  isUserEnrolled: async (courseId: string, userId: string) => {
    const { data } = await axiosInstance.get<
      ApiResponse<{ isEnrolled: boolean; enrollment: Enrollment }>
    >(`/enrollments/check/${userId}/${courseId}`);
    return data;
  },
  getUserEnrollments: async (userId: string) => {
    const { data } = await axiosInstance.get<
      ApiResponse<{ enrollments: CourseEnrollment[] }>
    >(`/enrollments/user/${userId}`);
    return data;
  },
  payCourse: async (payload: PayCoursePayload) => {
    const { data } = await axiosInstance.post<
      ApiResponse<{ paymentUrl: string }>
    >(`/payment-transactions/process`, {
      ...payload,
      currency: "FIS",
      provider: "MOMO",
    });
    return data;
  },
  getEnrolledUsers: async (courseId: string) => {
    const { data } = await axiosInstance.get<
      ApiResponse<{ enrollments: UserEnrollment[] }>
    >(`/enrollments/course/${courseId}`);
    return data;
  },
  updateEnrollment: async (
    enrollmentType: EnrollmentType,
    status: EnrollmentStatus,
    enrollmentId: string
  ) => {
    const { data } = await axiosInstance.put<
      ApiResponse<{ enrollment: Enrollment }>
    >(`/enrollments/${enrollmentId}`, { enrollmentType, status });
    return data;
  },
  deleteEnrollment: async (enrollmentId: string) => {
    const { data } = await axiosInstance.delete<
      ApiResponse<{ success: boolean }>
    >(`/enrollments/${enrollmentId}`);
    return data;
  },
};
