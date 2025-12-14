import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { UserRole } from "../types/Users.types";
import {
  categoriesApi,
  coursesApi,
  instructorsApi,
  modulesApi,
  myLearningApi,
  subCategoriesApi,
  usersApi,
} from "../services/api";
import type { Course } from "../types/Course.types";
import { toast } from "react-hot-toast";
import type { ModuleFormData } from "../types/Module.types";
// ============================================
// Query Keys
// ============================================

export const queryKeys = {
  courses: {
    all: ["courses"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.courses.all, "list", filters] as const,
    detail: (id: string) => [...queryKeys.courses.all, "detail", id] as const,
  },
  instructors: {
    all: ["instructors"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.instructors.all, "list", filters] as const,
    detail: (id: string) =>
      [...queryKeys.instructors.all, "detail", id] as const,
    courses: (id: string) =>
      [...queryKeys.instructors.all, "courses", id] as const,
  },
  myLearning: {
    all: ["my-learning"] as const,
    enrollments: () => [...queryKeys.myLearning.all, "enrollments"] as const,
  },
};

// ============================================
// Courses Hooks
// ============================================

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
export const useCourse = (id: string) => {
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
  });
};

// Enroll in course
export const useEnrollCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: coursesApi.enroll,
    onSuccess: () => {
      // Invalidate my learning to show new enrollment
      queryClient.invalidateQueries({ queryKey: queryKeys.myLearning.all });
    },
  });
};

// ============================================
// Instructors Hooks
// ============================================

// Get all instructors
export const useInstructors = (filters?: {
  search?: string;
  expertise?: string;
}) => {
  return useQuery({
    queryKey: queryKeys.instructors.list(filters),
    queryFn: () => instructorsApi.getAll(filters),
  });
};

// Get instructor by ID
export const useInstructor = (id: string) => {
  return useQuery({
    queryKey: queryKeys.instructors.detail(id),
    queryFn: () => instructorsApi.getById(id),
    enabled: !!id,
  });
};

// Get instructor courses
export const useInstructorCourses = (instructorId: string) => {
  return useQuery({
    queryKey: queryKeys.instructors.courses(instructorId),
    queryFn: () => instructorsApi.getCourses(instructorId),
    enabled: !!instructorId,
  });
};

// ============================================
// My Learning Hooks
// ============================================

// Get user enrollments
export const useMyEnrollments = () => {
  return useQuery({
    queryKey: queryKeys.myLearning.enrollments(),
    queryFn: myLearningApi.getEnrollments,
  });
};

// Update course progress
export const useUpdateProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      progress,
    }: {
      courseId: string;
      progress: number;
    }) => myLearningApi.updateProgress(courseId, progress),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.myLearning.enrollments(),
      });
    },
  });
};

// Complete lesson
export const useCompleteLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      lessonId,
    }: {
      courseId: string;
      lessonId: string;
    }) => myLearningApi.completeLesson(courseId, lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.myLearning.enrollments(),
      });
    },
  });
};

// ============================================
// Category Hooks
// ============================================
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await categoriesApi.getAll();
      return response.success ? response.data.categories : [];
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (category: { name: string; description: string }) =>
      categoriesApi.createCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoriesApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      category,
    }: {
      id: string;
      category: { name?: string; description?: string };
    }) => categoriesApi.updateCategory(id, category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

// ============================================
// Sub-Category Hooks
// ============================================
export const useSubCategories = () => {
  return useQuery({
    queryKey: ["sub-categories"],
    queryFn: async () => {
      const response = await subCategoriesApi.getAll();
      return response.success ? response.data.subCategories : [];
    },
  });
};

export const useCreateSubCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (category: { name: string; description: string }) =>
      subCategoriesApi.createSubCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sub-categories"] });
    },
  });
};

export const useDeleteSubCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => subCategoriesApi.deleteSubCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sub-categories"] });
    },
  });
};

export const useUpdateSubCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      category,
    }: {
      id: string;
      category: { name?: string; description?: string };
    }) => subCategoriesApi.updateSubCategory(id, category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sub-categories"] });
    },
  });
};

// ============================================
// Users Hooks
// ============================================
export const useUsers = (page: string, limit: string) => {
  return useQuery({
    queryKey: ["users", page, limit],
    queryFn: async () => {
      const response = await usersApi.getAll(page, limit);
      return response.success ? response.data.users : [];
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      usersApi.updateUser(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// ============================================
// Module Hooks
// ============================================
export const useModules = () => {
  return useQuery({
    queryKey: ["modules"],
    queryFn: async () => {
      const response = await modulesApi.getAll();
      return response.success ? response.data.modules : [];
    },
  });
};

export const useCreateModule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (module: ModuleFormData) => modulesApi.create(module),
    onSuccess: () => {
      toast.success("Module created successfully");
      queryClient.invalidateQueries({ queryKey: ["modules"] });
    },
  });
};

export const useDeleteModule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => modulesApi.delete(id),
    onSuccess: () => {
      toast.success("Module deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["modules"] });
    },
  });
};

export const useToggleModulePublished = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      modulesApi.toggleIsPublished(id, isPublished),
    onSuccess: () => {
      toast.success("Module publication status updated");
      queryClient.invalidateQueries({ queryKey: ["modules"] });
    },
  });
};
