import type {
  CardPaymentPayload,
  CardPaymentResponse,
  MomoPaymentResponse,
  CourseEnrollment,
  Enrollment,
  EnrollmentProgress,
  EnrollmentStatus,
  EnrollmentType,
  MobileMoneyPaymentPayload,
  ModuleProgress,
  PayCoursePayload,
  Payment,
  UserEnrollment,
} from "src/types/Enrollment.types";
import axiosInstance from "../../lib/axios";
import type { ApiResponse, PaginationMeta } from "../../types/Api.types";

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
  getAllPayments: async (enrollmentId: string) => {
    const { data } = await axiosInstance.get<
      ApiResponse<{ payments: Payment[] }>
    >(`/payment-transactions/enrollment/${enrollmentId}`);
    return data;
  },
  getAllPaymentsMade: async (params: { page: number; limit: number }) => {
    const { data } = await axiosInstance.get<
      ApiResponse<{ payments: Payment[]; meta: PaginationMeta }>
    >(`/payment-transactions?page=${params.page}&limit=${params.limit}`);
    return data;
  },
  updatePayment: async (
    paymentId: string,
    partialPayment: Partial<Payment>,
  ) => {
    const { data } = await axiosInstance.put<ApiResponse<{ payment: Payment }>>(
      `/payment-transactions/${paymentId}`,
      partialPayment,
    );
    return data;
  },
  deletePayment: async (paymentId: string) => {
    const { data } = await axiosInstance.delete<
      ApiResponse<{ success: boolean }>
    >(`/payment-transactions/${paymentId}`);
    return data;
  },
  updatePaymentStatus: async (paymentId: string, status: string) => {
    const { data } = await axiosInstance.put<ApiResponse<{ payment: Payment }>>(
      `/payment-transactions/${paymentId}/status`,
      { status },
    );
    return data;
  },
  refundPayment: async (paymentId: string) => {
    const { data } = await axiosInstance.patch<
      ApiResponse<{ payment: Payment }>
    >(`/payment-transactions/${paymentId}/refund`, {
      reason: "Admin wants to refund the payment",
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
    enrollmentId: string,
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
  getModuleProgress: async (enrollmentId: string, moduleId: string) => {
    const { data } = await axiosInstance.get<
      ApiResponse<{ moduleProgress: ModuleProgress | null }>
    >(`/progress/module/${enrollmentId}/${moduleId}`);
    return data;
  },
  startModuleProgress: async (enrollmentId: string, moduleId: string) => {
    const { data } = await axiosInstance.post<
      ApiResponse<{ progress: ModuleProgress }>
    >(`/progress/module/start`, { enrollmentId, moduleId });
    return data;
  },
  completeLesson: async (enrollmentId: string, lessonId: string) => {
    const { data } = await axiosInstance.post<
      ApiResponse<{ progress: ModuleProgress }>
    >(`/progress/lesson/complete`, {
      enrollmentId,
      lessonId,
    });
    return data;
  },
  startLessonProgress: async (enrollmentId: string, lessonId: string) => {
    const { data } = await axiosInstance.post<
      ApiResponse<{ progress: ModuleProgress }>
    >(`/progress/lesson/start`, { enrollmentId, lessonId });
    return data;
  },
  getLessonProgress: async (enrollmentId: string) => {
    const { data } = await axiosInstance.get<
      ApiResponse<{ progress: EnrollmentProgress[] }>
    >(`/progress/enrollment/${enrollmentId}`);
    return data;
  },
  payWithMobileMoney: async (payload: MobileMoneyPaymentPayload) => {
    const { data } = await axiosInstance.post<ApiResponse<MomoPaymentResponse>>(
      `/payments/momo`,
      payload,
    );
    return data;
  },
  payWithCard: async (payload: CardPaymentPayload) => {
    const { data } = await axiosInstance.post<ApiResponse<CardPaymentResponse>>(
      `/payments/card`,
      payload,
    );
    return data;
  },
  getCertificate: async (enrollmentId: string) => {
    const { data } = await axiosInstance.get<
      ApiResponse<{ certificateUrl: string }>
    >(`/certificates/${enrollmentId}`);
    return data;
  },
};
