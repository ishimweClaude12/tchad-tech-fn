// ============================================
// Courses Hooks
// ============================================

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";
import { coursesApi } from "../../services/learn/Course.api";
import type { Course } from "../../types/Course.types";
import { queryKeys } from "../useApi";

// Get all courses
export const useCourses = (filters?: {
  category?: string;
  level?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: queryKeys.courses.list(filters),
    queryFn: () => coursesApi.getAll(filters),
  });
};

// Get course by ID
export const useCourseById = (id: string) => {
  return useQuery({
    queryKey: queryKeys.courses.detail(id),
    queryFn: () => coursesApi.getById(id),
    enabled: !!id,
  });
};

// Create course
export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: coursesApi.create,
    onSuccess: () => {
      // Invalidate courses list to refetch
      toast.success("Course created successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
    },
  });
};

// Update course
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Course> }) =>
      coursesApi.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate both list and specific course
      toast.success("Course updated successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.detail(variables.id),
      });
    },
    onError: () => {
      toast.error("Failed to update course");
    },
  });
};

// Delete course
export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: coursesApi.delete,
    onSuccess: () => {
      toast.success("Course deleted successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
    },
    onError: () => {
      toast.error("Failed to delete course");
    },
  });
};

// Get course by slug
export const useCourseBySlug = (slug: string) => {
  return useQuery({
    queryKey: queryKeys.courses.slug(slug),
    queryFn: () => coursesApi.getBySlug(slug),
    enabled: !!slug,
  });
};

// Get Published courses
export const usePublishedCourses = () => {
  return useQuery({
    queryKey: queryKeys.courses.published(),
    queryFn: () => coursesApi.getPublishedCourses(),
  });
};

// Get all modules for a course
export const useCourseModules = (courseId: string) => {
  return useQuery({
    queryKey: queryKeys.courses.modules(courseId),
    queryFn: () => coursesApi.getAllCourseModules(courseId),
    enabled: !!courseId,
  });
};

// publish or unpublish course
export const usePublishCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, publish }: { id: string; publish: boolean }) =>
      coursesApi.publish(id, publish),
    onSuccess: (_, variables) => {
      toast.success(
        `Course ${variables.publish ? "published" : "unpublished"} successfully`,
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.detail(variables.id),
      });
    },
  });
};

// Check if course is wishlisted by user
export const useCheckCourseWishListed = (userId: string, courseId: string) => {
  return useQuery({
    queryKey: queryKeys.courses.wishListCheck(userId, courseId),
    queryFn: () => coursesApi.CheckCourseWishListed(userId, courseId),
    enabled: !!userId && !!courseId,
  });
};

// Get user's wishlisted courses
export const useUserWishListedCourses = (userId: string) => {
  return useQuery({
    queryKey: ["wishlists", "user", userId],
    queryFn: () => coursesApi.getUserWishListedCourses(userId),
    enabled: !!userId,
  });
};

// Add course to wishlist
export const useAddCourseToWishList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, courseId }: { userId: string; courseId: string }) =>
      coursesApi.addCourseToWishList(userId, courseId),
    onSuccess: (_, variables) => {
      toast.success("Course added to wishlist");
      queryClient.invalidateQueries({
        queryKey: ["wishlists", "user", variables.userId],
      });
    },
    onError: (error) => {
      let errorMessage = "Failed to add course to wishlist";

      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);
    },
  });
};

// Remove course from wishlist
export const useRemoveCourseFromWishList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, courseId }: { userId: string; courseId: string }) =>
      coursesApi.removeCourseFromWishList(userId, courseId),
    onSuccess: (_, variables) => {
      toast.success("Course removed from wishlist");
      queryClient.invalidateQueries({
        queryKey: ["wishlists", "user", variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.wishListCheck(
          variables.userId,
          variables.courseId,
        ),
      });
    },
    onError: () => {
      toast.error("Failed to remove course from wishlist");
    },
  });
};

// Clear user's wishlist
export const useClearUserWishList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => coursesApi.clearUserWishList(userId),
    onSuccess: (_, userId) => {
      toast.success("Wishlist cleared successfully");
      queryClient.invalidateQueries({
        queryKey: ["wishlists", "user", userId],
      });
    },
    onError: () => {
      toast.error("Failed to clear wishlist");
    },
  });
};
