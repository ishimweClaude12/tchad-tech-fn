// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   coursesApi,
//   instructorsApi,
//   myLearningApi,
//   Course,
//   categoriesApi,
// } from "../services/api";

// // ============================================
// // Query Keys
// // ============================================

// export const queryKeys = {
//   courses: {
//     all: ["courses"] as const,
//     list: (filters?: Record<string, unknown>) =>
//       [...queryKeys.courses.all, "list", filters] as const,
//     detail: (id: string) => [...queryKeys.courses.all, "detail", id] as const,
//   },
//   instructors: {
//     all: ["instructors"] as const,
//     list: (filters?: Record<string, unknown>) =>
//       [...queryKeys.instructors.all, "list", filters] as const,
//     detail: (id: string) =>
//       [...queryKeys.instructors.all, "detail", id] as const,
//     courses: (id: string) =>
//       [...queryKeys.instructors.all, "courses", id] as const,
//   },
//   myLearning: {
//     all: ["my-learning"] as const,
//     enrollments: () => [...queryKeys.myLearning.all, "enrollments"] as const,
//   },
// };

// // ============================================
// // Courses Hooks
// // ============================================

// // Get all courses
// export const useCourses = (filters?: {
//   category?: string;
//   level?: string;
//   search?: string;
// }) => {
//   return useQuery({
//     queryKey: queryKeys.courses.list(filters),
//     queryFn: () => coursesApi.getAll(filters),
//   });
// };

// // Get course by ID
// export const useCourse = (id: string) => {
//   return useQuery({
//     queryKey: queryKeys.courses.detail(id),
//     queryFn: () => coursesApi.getById(id),
//     enabled: !!id,
//   });
// };

// // Create course
// export const useCreateCourse = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: coursesApi.create,
//     onSuccess: () => {
//       // Invalidate courses list to refetch
//       queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
//     },
//   });
// };

// // Update course
// export const useUpdateCourse = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ id, data }: { id: string; data: Partial<Course> }) =>
//       coursesApi.update(id, data),
//     onSuccess: (_, variables) => {
//       // Invalidate both list and specific course
//       queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
//       queryClient.invalidateQueries({
//         queryKey: queryKeys.courses.detail(variables.id),
//       });
//     },
//   });
// };

// // Delete course
// export const useDeleteCourse = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: coursesApi.delete,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
//     },
//   });
// };

// // Enroll in course
// export const useEnrollCourse = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: coursesApi.enroll,
//     onSuccess: () => {
//       // Invalidate my learning to show new enrollment
//       queryClient.invalidateQueries({ queryKey: queryKeys.myLearning.all });
//     },
//   });
// };

// // ============================================
// // Instructors Hooks
// // ============================================

// // Get all instructors
// export const useInstructors = (filters?: {
//   search?: string;
//   expertise?: string;
// }) => {
//   return useQuery({
//     queryKey: queryKeys.instructors.list(filters),
//     queryFn: () => instructorsApi.getAll(filters),
//   });
// };

// // Get instructor by ID
// export const useInstructor = (id: string) => {
//   return useQuery({
//     queryKey: queryKeys.instructors.detail(id),
//     queryFn: () => instructorsApi.getById(id),
//     enabled: !!id,
//   });
// };

// // Get instructor courses
// export const useInstructorCourses = (instructorId: string) => {
//   return useQuery({
//     queryKey: queryKeys.instructors.courses(instructorId),
//     queryFn: () => instructorsApi.getCourses(instructorId),
//     enabled: !!instructorId,
//   });
// };

// // ============================================
// // My Learning Hooks
// // ============================================

// // Get user enrollments
// export const useMyEnrollments = () => {
//   return useQuery({
//     queryKey: queryKeys.myLearning.enrollments(),
//     queryFn: myLearningApi.getEnrollments,
//   });
// };

// // Update course progress
// export const useUpdateProgress = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({
//       courseId,
//       progress,
//     }: {
//       courseId: string;
//       progress: number;
//     }) => myLearningApi.updateProgress(courseId, progress),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: queryKeys.myLearning.enrollments(),
//       });
//     },
//   });
// };

// // Complete lesson
// export const useCompleteLesson = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({
//       courseId,
//       lessonId,
//     }: {
//       courseId: string;
//       lessonId: string;
//     }) => myLearningApi.completeLesson(courseId, lessonId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: queryKeys.myLearning.enrollments(),
//       });
//     },
//   });
// };

// // ============================================
// // Category Hooks
// // ============================================
// export const useCategories = () => {
//   return useQuery({
//     queryKey: ["categories"],
//     queryFn: () => categoriesApi.getAll(),
//   });
// };
