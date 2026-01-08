import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { enrollmentApi } from "../../services/learn/Enrollment.api";

export const useEnrolInCourse = () => {
  return useMutation({
    mutationFn: ({ courseId, userId }: { courseId: string; userId: string }) =>
      enrollmentApi.enrollInCourse(courseId, userId),
    onSuccess: () => {
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
    queryFn: () => {
      return enrollmentApi.isUserEnrolled(courseId, userId);
    },
    enabled: !!courseId && !!userId,
  });
};

export const useUserEnrollments = (userId: string) => {
  return useQuery({
    queryKey: ["user-enrollments", userId],
    queryFn: () => {
      return enrollmentApi.getUserEnrollments(userId);
    },
    enabled: !!userId,
  });
};
