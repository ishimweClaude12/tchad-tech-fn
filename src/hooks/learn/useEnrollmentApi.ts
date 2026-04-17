import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { enrollmentApi } from "../../services/learn/Enrollment.api";
import type {
  CardPaymentPayload,
  EnrollmentStatus,
  EnrollmentType,
  MobileMoneyPaymentPayload,
  PayCoursePayload,
} from "src/types/Enrollment.types";

export const useEnrolInCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, userId }: { courseId: string; userId: string }) =>
      enrollmentApi.enrollInCourse(courseId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["check-enrollment"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-enrollments"],
      });
      toast.success("Enrolled in course successfully.");
    },
    onError: (error) => {
      toast.error("Failed to enroll in course.");
      console.error("Enroll In Course Error:", error);
    },
  });
};

export const useCheckEnrollment = (courseId: string, userId: string) => {
  return useQuery({
    queryKey: ["check-enrollment", courseId, userId],
    queryFn: () => enrollmentApi.isUserEnrolled(courseId, userId),
    enabled: !!courseId && !!userId,
  });
};

export const useUserEnrollments = (userId: string) => {
  return useQuery({
    queryKey: ["user-enrollments", userId],
    queryFn: () => enrollmentApi.getUserEnrollments(userId),
    enabled: !!userId,
  });
};

export const usePayCourse = () => {
  return useMutation({
    mutationFn: (payload: PayCoursePayload) => enrollmentApi.payCourse(payload),
    onSuccess: () => toast.success("Payment initiated successfully."),
    onError: (error) => {
      toast.error("Failed to initiate payment.");
      console.error("Pay Course Error:", error);
    },
  });
};

export const usePayWithCard = () => {
  return useMutation({
    mutationFn: (payload: CardPaymentPayload) =>
      enrollmentApi.payWithCard(payload),
    onSuccess: () => toast.success("Card payment initiated successfully."),
    onError: (error) => {
      toast.error("Failed to initiate card payment.");
      console.error("Pay With Card Error:", error);
    },
  });
};

export const usePayWithMobileMoney = () => {
  return useMutation({
    mutationFn: (payload: MobileMoneyPaymentPayload) =>
      enrollmentApi.payWithMobileMoney(payload),
    onSuccess: () =>
      toast.success("Mobile money payment initiated successfully."),
    onError: (error) => {
      toast.error("Failed to initiate mobile money payment.");
      console.error("Pay With Mobile Money Error:", error);
    },
  });
};

export const useGetAllPayments = (enrollmentId: string) => {
  return useQuery({
    queryKey: ["enrollment-payments", enrollmentId],
    queryFn: () => enrollmentApi.getAllPayments(enrollmentId),
    enabled: !!enrollmentId,
  });
};

export const useGetAllPaymentsMade = (params: {
  page: number;
  limit: number;
}) => {
  return useQuery({
    queryKey: ["all-payments", params.page, params.limit],
    queryFn: () => enrollmentApi.getAllPaymentsMade(params),
  });
};

export const useEnrolledUsers = (courseId: string) => {
  return useQuery({
    queryKey: ["enrolled-users", courseId],
    queryFn: () => enrollmentApi.getEnrolledUsers(courseId),
    enabled: !!courseId,
  });
};

export const useUpdateEnrollment = () => {
  return useMutation({
    mutationFn: ({
      type,
      status,
      enrollmentId,
    }: {
      type: EnrollmentType;
      status: EnrollmentStatus;
      enrollmentId: string;
    }) => enrollmentApi.updateEnrollment(type, status, enrollmentId),
    onSuccess: () => toast.success("Enrollment updated successfully."),
    onError: (error) => {
      toast.error("Failed to update enrollment.");
      console.error("Update Enrollment Error:", error);
    },
  });
};

export const useDeleteEnrollment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (enrollmentId: string) =>
      enrollmentApi.deleteEnrollment(enrollmentId),
    onSuccess: () => {
      // invalidate relevant queries if needed
      queryClient.invalidateQueries({
        queryKey: ["enrolled-users"],
      });
      toast.success("Enrollment deleted successfully.");
    },
    onError: (error) => {
      toast.error("Failed to delete enrollment.");
      console.error("Delete Enrollment Error:", error);
    },
  });
};

export const useModuleProgress = (enrollmentId: string, moduleId: string) => {
  return useQuery({
    queryKey: ["module-progress", enrollmentId, moduleId],
    queryFn: () => enrollmentApi.getModuleProgress(enrollmentId, moduleId),
    enabled: !!enrollmentId && !!moduleId,
  });
};

export const useStartModuleProgress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { enrollmentId: string; moduleId: string }) =>
      enrollmentApi.startModuleProgress(payload.enrollmentId, payload.moduleId),
    onSuccess: (_, variables) => {
      // Invalidate module progress query to refetch updated status
      queryClient.invalidateQueries({
        queryKey: [
          "module-progress",
          variables.enrollmentId,
          variables.moduleId,
        ],
      });
      // Invalidate user enrollments to update overall progress
      queryClient.invalidateQueries({
        queryKey: ["user-enrollments"],
      });
    },
    onError: (error) => {
      console.error("Start Module Progress Error:", error);
    },
  });
};

export const useCompleteLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      enrollmentId,
      lessonId,
    }: {
      enrollmentId: string;
      lessonId: string;
    }) => enrollmentApi.completeLesson(enrollmentId, lessonId),
    onSuccess: (_, variables) => {
      toast.success("Lesson marked as complete.");
      // Invalidate lesson progress query
      queryClient.invalidateQueries({
        queryKey: ["lesson-progress", variables.enrollmentId],
      });
      // Invalidate module progress query
      queryClient.invalidateQueries({
        queryKey: ["module-progress"],
      });
      // Invalidate user enrollments to update overall progress
      queryClient.invalidateQueries({
        queryKey: ["user-enrollments"],
      });
    },
    onError: (error) => {
      toast.error("Failed to complete lesson.");
      console.error("Complete Lesson Error:", error);
    },
  });
};

export const useStartLessonProgress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      enrollmentId,
      lessonId,
    }: {
      enrollmentId: string;
      lessonId: string;
    }) => enrollmentApi.startLessonProgress(enrollmentId, lessonId),
    onSuccess: (_, variables) => {
      toast.success("Lesson progress started.");
      // Invalidate lesson progress query
      queryClient.invalidateQueries({
        queryKey: ["lesson-progress", variables.enrollmentId],
      });
      // Invalidate module progress query
      queryClient.invalidateQueries({
        queryKey: ["module-progress"],
      });
      // Invalidate user enrollments to update overall progress
      queryClient.invalidateQueries({
        queryKey: ["user-enrollments"],
      });
    },
    onError: (error) => {
      toast.error("Failed to start lesson progress.");
      console.error("Start Lesson Progress Error:", error);
    },
  });
};

export const useLessonProgress = (enrollmentId: string, lessonId: string) => {
  return useQuery({
    queryKey: ["lesson-progress", enrollmentId, lessonId],
    queryFn: () => enrollmentApi.getLessonProgress(enrollmentId, lessonId),
    enabled: !!enrollmentId && !!lessonId,
  });
};

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      paymentId,
      partialPayment,
    }: {
      paymentId: string;
      partialPayment: Partial<import("src/types/Enrollment.types").Payment>;
    }) => enrollmentApi.updatePayment(paymentId, partialPayment),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["all-payments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["enrollment-payments"],
      });
      toast.success("Payment updated successfully.");
    },
    onError: (error) => {
      toast.error("Failed to update payment.");
      console.error("Update Payment Error:", error);
    },
  });
};

export const useDeletePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (paymentId: string) => enrollmentApi.deletePayment(paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["all-payments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["enrollment-payments"],
      });
      toast.success("Payment deleted successfully.");
    },
    onError: (error) => {
      toast.error("Failed to delete payment.");
      console.error("Delete Payment Error:", error);
    },
  });
};

export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      paymentId,
      status,
    }: {
      paymentId: string;
      status: string;
    }) => enrollmentApi.updatePaymentStatus(paymentId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["all-payments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["enrollment-payments"],
      });
      toast.success("Payment status updated successfully.");
    },
    onError: (error) => {
      toast.error("Failed to update payment status.");
      console.error("Update Payment Status Error:", error);
    },
  });
};

export const useRefundPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (paymentId: string) => enrollmentApi.refundPayment(paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["all-payments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["enrollment-payments"],
      });
      toast.success("Payment refunded successfully.");
    },
    onError: (error) => {
      toast.error("Failed to refund payment.");
      console.error("Refund Payment Error:", error);
    },
  });
};

export const useDownloadCertificate = () => {
  return useMutation({
    mutationFn: (enrollmentId: string) =>
      enrollmentApi.getCertificate(enrollmentId),
    onSuccess: (blob) => {
      const pdfBlob = new Blob([blob], { type: "application/pdf" });
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "certificate.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    },
    onError: (error) => {
      toast.error("Failed to download certificate.");
      console.error("Download Certificate Error:", error);
    },
  });
};
