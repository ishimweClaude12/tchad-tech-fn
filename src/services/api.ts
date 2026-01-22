import axiosInstance from "../lib/axios";
import type { Course, Instructor } from "../types/Course.types";
import {
  type CourseCategory,
  type CourseCategoryApiResponse,
  type CourseSubCategoryApiResponse,
} from "../types/CourseCategories.types";
import {
  type User,
  type UserListResponse,
  UserRole,
} from "../types/Users.types";
import type {
  GetModulesApiResponse,
  Module,
  ModuleFormData,
} from "../types/Module.types";
import type { ApiResponse, PaginationMeta } from "../types/Api.types";

// ============================================
// API Service Functions for E-learning
// ============================================

// Types

export const instructorsApi = {
  // Get all instructors
  getAll: async (params?: { search?: string; expertise?: string }) => {
    const { data } = await axiosInstance.get<Instructor[]>("/instructors", {
      params,
    });
    return data;
  },

  // Get instructor by ID
  getById: async (id: string) => {
    const { data } = await axiosInstance.get<Instructor>(`/instructors/${id}`);
    return data;
  },

  // Get instructor courses
  getCourses: async (instructorId: string) => {
    const { data } = await axiosInstance.get<Course[]>(
      `/instructors/${instructorId}/courses`,
    );
    return data;
  },
};

// ============================================
// Categories API
// ============================================

export const categoriesApi = {
  getAll: async () => {
    const { data } =
      await axiosInstance.get<CourseCategoryApiResponse>("/course-categories");
    return data;
  },
  createCategory: async (category: { name: string; description: string }) => {
    const { data } = await axiosInstance.post<
      ApiResponse<{ category: CourseCategory }>
    >("/course-categories", category);
    return data;
  },
  updateCategory: async (
    id: string,
    category: { name?: string; description?: string },
  ) => {
    const { data } = await axiosInstance.put<
      ApiResponse<{ category: CourseCategory }>
    >(`/course-categories/${id}`, category);
    return data;
  },
  deleteCategory: async (id: string) => {
    const { data } = await axiosInstance.delete<
      ApiResponse<{ category: CourseCategory }>
    >(`/course-categories/${id}`);
    return data;
  },
};

export const subCategoriesApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get<CourseSubCategoryApiResponse>(
      "/course-sub-categories",
    );
    return data;
  },
  createSubCategory: async (subCategory: {
    name: string;
    description: string;
  }) => {
    const { data } = await axiosInstance.post<
      ApiResponse<{ category: CourseCategory }>
    >("/course-sub-categories", subCategory);
    return data;
  },
  updateSubCategory: async (
    id: string,
    category: { name?: string; description?: string },
  ) => {
    const { data } = await axiosInstance.put<
      ApiResponse<{ category: CourseCategory }>
    >(`/course-sub-categories/${id}`, category);
    return data;
  },
  deleteSubCategory: async (id: string) => {
    const { data } = await axiosInstance.delete<
      ApiResponse<{ category: CourseCategory }>
    >(`/course-sub-categories/${id}`);
    return data;
  },
  getByCategory: async (categoryId: string) => {
    const { data } = await axiosInstance.get<
      ApiResponse<{ subCategories: CourseCategory[] }>
    >(`/course-sub-categories/category/${categoryId}`);
    return data;
  },
};

// ============================================
// Users API
// ============================================

export const usersApi = {
  getAll: async (page: string, limit: string) => {
    const { data } = await axiosInstance.get<UserListResponse>(
      `/users/?page=${page}&limit=${limit}`,
    );
    return data;
  },

  updateUser: async (id: string, role: UserRole) => {
    const { data } = await axiosInstance.patch<
      ApiResponse<{ userId: string; role: UserRole }>
    >(`/users/${id}`, {
      role,
    });
    return data;
  },
  getUserProfile: async (id: string) => {
    const { data } = await axiosInstance.get<ApiResponse<{ user: User }>>(
      `/users/${id}`,
    );
    return data;
  },
  getAllInstructors: async (page: string, limit: string) => {
    const { data } = await axiosInstance.get<
      ApiResponse<{ users: User[]; meta: PaginationMeta }>
    >(`/users/instructors/?page=${page}&limit=${limit}`);
    return data;
  },
};

// ============================================
// Module ApiResponse
// ============================================

export const modulesApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get<GetModulesApiResponse>("/modules");
    return data;
  },

  create: async (module: ModuleFormData) => {
    const { data } = await axiosInstance.post<ApiResponse<Module>>(
      "/modules",
      module
    );
    return data;
  },

  delete: async (id: string) => {
    const { data } = await axiosInstance.delete(`/modules/${id}`);
    return data;
  },
  toggleIsPublished: async (id: string, isPublished: boolean) => {
    const { data } = await axiosInstance.patch<ApiResponse<Module>>(
      `/modules/${id}/publish`,
      { isPublished }
    );
    return data;
  },
};
