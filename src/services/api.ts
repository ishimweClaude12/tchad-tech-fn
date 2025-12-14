import axiosInstance from "../lib/axios";
import type {
  Course,
  GetCoursesApiResponse,
  Instructor,
} from "../types/Course.types";
import {
  type CourseCategoryApiResponse,
  type CourseSubCategoryApiResponse,
} from "../types/CourseCategories.types";
import { type UserListResponse, UserRole } from "../types/Users.types";
import type {
  GetModulesApiResponse,
  Module,
  ModuleFormData,
} from "../types/Module.types";
import type { ApiResponse } from "../types/Api.types";

// ============================================
// API Service Functions for E-learning
// ============================================

// Types

export interface Enrollment {
  id: string;
  courseId: string;
  progress: number;
  startedAt: string;
  lastAccessedAt: string;
}

// ============================================
// Courses API
// ============================================

export const coursesApi = {
  // Get all courses
  getAll: async (params?: {
    category?: string;
    level?: string;
    search?: string;
  }) => {
    const { data } = await axiosInstance.get<GetCoursesApiResponse>(
      "/courses",
      { params }
    );
    return data;
  },

  // Get course by ID
  getById: async (id: string) => {
    const { data } = await axiosInstance.get<Course>(`/courses/${id}`);
    return data;
  },

  // Create new course
  create: async (course: Omit<Course, "id">) => {
    const { data } = await axiosInstance.post<Course>("/courses", course);
    return data;
  },

  // Update course
  update: async (id: string, course: Partial<Course>) => {
    const { data } = await axiosInstance.put<Course>(`/courses/${id}`, course);
    return data;
  },

  // Delete course
  delete: async (id: string) => {
    const { data } = await axiosInstance.delete(`/courses/${id}`);
    return data;
  },

  // Enroll in course
  enroll: async (courseId: string) => {
    const { data } = await axiosInstance.post(`/courses/${courseId}/enroll`);
    return data;
  },
};

// ============================================
// Instructors API
// ============================================

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
      `/instructors/${instructorId}/courses`
    );
    return data;
  },
};

// ============================================
// My Learning API
// ============================================

export const myLearningApi = {
  // Get user enrollments
  getEnrollments: async () => {
    const { data } = await axiosInstance.get<Enrollment[]>(
      "/my-learning/enrollments"
    );
    return data;
  },

  // Update progress
  updateProgress: async (courseId: string, progress: number) => {
    const { data } = await axiosInstance.patch(
      `/my-learning/${courseId}/progress`,
      { progress }
    );
    return data;
  },

  // Complete lesson
  completeLesson: async (courseId: string, lessonId: string) => {
    const { data } = await axiosInstance.post(
      `/my-learning/${courseId}/lessons/${lessonId}/complete`
    );
    return data;
  },
};

// ============================================
// Categories API
// ============================================

export const categoriesApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get<CourseCategoryApiResponse>(
      "/course-categories"
    );
    return data;
  },
  createCategory: async (category: { name: string; description: string }) => {
    const { data } = await axiosInstance.post<any>(
      "/course-categories",
      category
    );
    return data;
  },
  updateCategory: async (
    id: string,
    category: { name?: string; description?: string }
  ) => {
    const { data } = await axiosInstance.put<any>(
      `/course-categories/${id}`,
      category
    );
    return data;
  },
  deleteCategory: async (id: string) => {
    const { data } = await axiosInstance.delete<any>(
      `/course-categories/${id}`
    );
    return data;
  },
};

export const subCategoriesApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get<CourseSubCategoryApiResponse>(
      "/course-sub-categories"
    );
    return data;
  },
  createSubCategory: async (subCategory: {
    name: string;
    description: string;
  }) => {
    const { data } = await axiosInstance.post<any>(
      "/course-sub-categories",
      subCategory
    );
    return data;
  },
  updateSubCategory: async (
    id: string,
    category: { name?: string; description?: string }
  ) => {
    const { data } = await axiosInstance.put<any>(
      `/course-sub-categories/${id}`,
      category
    );
    return data;
  },
  deleteSubCategory: async (id: string) => {
    const { data } = await axiosInstance.delete<any>(
      `/course-sub-categories/${id}`
    );
    return data;
  },
};

// ============================================
// Users API
// ============================================

export const usersApi = {
  getAll: async (page: string, limit: string) => {
    const { data } = await axiosInstance.get<UserListResponse>(
      `/users/?page=${page}&limit=${limit}`
    );
    return data;
  },

  updateUser: async (id: string, role: UserRole) => {
    const { data } = await axiosInstance.patch<any>(`/users/${id}`, {
      role,
    });
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
