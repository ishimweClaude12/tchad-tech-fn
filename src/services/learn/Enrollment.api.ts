import type { CourseEnrollment, Enrollment } from "src/types/Enrollment.types";
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
};
