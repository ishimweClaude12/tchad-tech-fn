import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { UserRole } from "../types/Users.types";
import {
  categoriesApi,
  modulesApi,
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
    published: () => [...queryKeys.courses.all, "published"] as const,
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

export const useSubCategoriesByCategory = (categoryId: string) => {
  return useQuery({
    queryKey: ["sub-categories", "by-category", categoryId],
    queryFn: async () => {
      const response = await subCategoriesApi.getByCategory(categoryId);
      return response.success ? response.data.subCategories : [];
    },
    enabled: !!categoryId,
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
      return response.success ? response.data : { users: [], meta: null };
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

export const useELearningUser = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await usersApi.getUserProfile(id);
      return response.success ? response.data.user : null;
    },
  });
};

export const useInstructors = (page: string, limit: string) => {
  return useQuery({
    queryKey: ["instructors", page, limit],
    queryFn: async () => {
      const response = await usersApi.getAllInstructors(page, limit);
      return response.success ? response.data.users : [];
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
