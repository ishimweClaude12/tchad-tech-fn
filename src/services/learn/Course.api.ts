import axiosInstance from "../../lib/axios";
import type {
  GetCoursesApiResponse,
  Course,
  GetCourseApiResponse,
} from "../../types/Course.types";
import type { GetCourseModulesApiResponse } from "./Moduels.api";

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
    const { data } = await axiosInstance.get<GetCourseApiResponse>(
      `/courses/${id}`
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
      `/courses/slug/${slug}`
    );
    return data;
  },
  getAllCourseModules: async (courseId: string) => {
    const { data } = await axiosInstance.get<GetCourseModulesApiResponse>(
      `/modules/course/${courseId}/all`
    );
    return data;
  },
  getPublishedCourses: async () => {
    const { data } = await axiosInstance.get<GetCoursesApiResponse>(
      "/courses/published"
    );
    return data;
  },
};
