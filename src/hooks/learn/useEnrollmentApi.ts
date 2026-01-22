import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { enrollmentApi } from "../../services/learn/Enrollment.api";
import type {
  EnrollmentStatus,
  EnrollmentType,
  PayCoursePayload,
} from "src/types/Enrollment.types";

export const useEnrolInCourse = () => {
  return useMutation({
    mutationFn: ({ courseId, userId }: { courseId: string; userId: string }) =>
      enrollmentApi.enrollInCourse(courseId, userId),
    onSuccess: () => toast.success("Enrolled in course successfully."),
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
