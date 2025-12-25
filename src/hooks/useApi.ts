import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { UserRole } from "../types/Users.types";
import {
  categoriesApi,
  instructorsApi,
  modulesApi,
  myLearningApi,
  subCategoriesApi,
  usersApi,
} from "../services/api";

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
    slug: (slug: string) => [...queryKeys.courses.all, "slug", slug] as const,
    modules: (courseId: string) =>
      [...queryKeys.courses.all, "modules", courseId] as const,
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

      queryClient.invalidateQueries({
        queryKey: ["modules"],
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.all,
      });
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
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.all,
      });
    },
  });
};
