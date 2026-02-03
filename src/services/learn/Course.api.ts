import type { ApiResponse, PaginationMeta } from "src/types/Api.types";
import axiosInstance from "../../lib/axios";
import type { Course, GetCourseApiResponse } from "../../types/Course.types";
import type { GetCourseModulesApiResponse } from "./Moduels.api";
import type { UserRole } from "src/types/Users.types";

export const coursesApi = {
  // Get all courses
  getAll: async (params?: {
    category?: string;
    level?: string;
    search?: string;
  }) => {
    const { data } = await axiosInstance.get<
      ApiResponse<{
        courses: Course[];
        meta: PaginationMeta;
      }>
    >("/courses", { params });
    return data;
  },

  // Get course by ID
  getById: async (id: string) => {
    const { data } = await axiosInstance.get<GetCourseApiResponse>(
      `/courses/${id}`,
    );
    return data;
  },

  // Create new course
  create: async (course: Omit<Course, "id">) => {
    const { data } = await axiosInstance.post<Course>("/courses", course);
    return data;
  },

  // Update course
  update: async (id: string, course: Partial<Course>) => {
    const { data } = await axiosInstance.put<Course>(`/courses/${id}`, {
      ...course,
      estimatedDurationHours: Number(course.estimatedDurationHours),
    });
    return data;
  },

  // Publish or unpublish course
  publish: async (id: string, publish: boolean) => {
    const { data } = await axiosInstance.put<Course>(`/courses/${id}`, {
      status: publish ? "PUBLISHED" : "DRAFT",
    });
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
  getBySlug: async (slug: string) => {
    const { data } = await axiosInstance.get<GetCourseApiResponse>(
      `/courses/slug/${slug}`,
    );
    return data;
  },
  getAllCourseModules: async (courseId: string) => {
    const { data } = await axiosInstance.get<GetCourseModulesApiResponse>(
      `/modules/course/${courseId}/all`,
    );
    return data;
  },
  getPublishedCourses: async () => {
    const { data } = await axiosInstance.get<
      ApiResponse<{
        courses: {
          data: Course[];
          meta: {
            currentPage: number;
            totalPages: number;
            pageSize: number;
            totalItems: number;
          };
        };
      }>
    >("/courses/published");
    return data;
  },
  CheckCourseWishListed: async (userId: string, courseId: string) => {
    const { data } = await axiosInstance.get<
      ApiResponse<{
        isInWishlist: boolean;
        wishlistItem: {
          id: string;
          userId: string;
          courseId: string;
          createdAt: string;
        };
      }>
    >(`/wishlist/check/${userId}/${courseId}`);

    console.log("WishList Check Data:", data);
    return data;
  },
  getUserWishListedCourses: async (userId: string) => {
    const { data } = await axiosInstance.get<
      ApiResponse<{
        wishlist: {
          id: string;
          userId: string;
          courseId: string;
          createdAt: string;
          course: {
            id: string;
            title: string;
            slug: string;
            description: string;
            price: string;
            thumbnailUrl: string;
            instructorId: string;
            instructor: {
              userId: string;
              role: UserRole;
            };
          };
        }[];
        count: number;
      }>
    >(`/wishlist/user/${userId}`);
    return data;
  },
  addCourseToWishList: async (userId: string, courseId: string) => {
    const { data } = await axiosInstance.post<
      ApiResponse<{ wishlistItem: Course }>
    >(`/wishlist/add`, { userId, courseId });
    return data;
  },
  removeCourseFromWishList: async (userId: string, courseId: string) => {
    const { data } = await axiosInstance.delete<
      ApiResponse<{ success: boolean }>
    >(`/wishlist/remove/${userId}/${courseId}`);
    return data;
  },
  clearUserWishList: async (userId: string) => {
    const { data } = await axiosInstance.delete<
      ApiResponse<{ success: boolean }>
    >(`/wishlist/user/${userId}/clear`);
    return data;
  },
};
