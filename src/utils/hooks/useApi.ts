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

const res = {
  success: true,
  message: "Lessons found successfully.",
  data: {
    lessons: [
      {
        id: "339c95f9-6b47-4345-ac2f-e3c4e43726c7",
        courseId: "252a1c28-cc6c-4185-b2de-4807c84f686b",
        moduleId: "b727e215-601c-4a62-b258-68df91362b09",
        title: "Dancing with the stranger",
        description:
          "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisqu",
        contentType: "TEXT",
        contentUrl: null,
        muxVideoId: null,
        textContent:
          "&lt;p>&lt;strong>I just wanna keep doing this &lt;/strong>&lt;/p>&lt;p>&lt;/p>&lt;p>&lt;u>Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.&lt;/u>&lt;/p>&lt;p>&lt;em>Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.&lt;/em>&lt;/p>&lt;p>&lt;/p>&lt;h3>Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.&lt;/h3>&lt;blockquote>&lt;p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.&lt;/p>&lt;/blockquote>&lt;p>&lt;/p>",
        durationMinutes: 120,
        sortOrder: 3,
        isPublished: true,
        createdAt: "2025-12-22T18:26:44.000Z",
        updatedAt: "2025-12-24T10:59:35.000Z",
        course: {
          id: "252a1c28-cc6c-4185-b2de-4807c84f686b",
          title: "Complete Python Programming Bootcamp",
          slug: "complete-python-programming-bootcamp",
        },
        module: {
          id: "b727e215-601c-4a62-b258-68df91362b09",
          title: "Learn core programming concepts using Python.",
          sortOrder: 1,
        },
      },
      {
        id: "48972a71-0349-4d34-8cdf-9e2912f1b657",
        courseId: "8dbeb3c2-02c4-4113-a469-8742d8f23c07",
        moduleId: "8942c0be-9053-4c54-83a3-be5493cf261f",
        title: "Introduction to Databases",
        description: "This lesson explains basic database concepts.",
        contentType: "VIDEO",
        contentUrl: "https://example.com/lesson-video.mp4",
        muxVideoId: null,
        textContent: null,
        durationMinutes: 15,
        sortOrder: 1,
        isPublished: false,
        createdAt: "2025-11-23T05:57:37.000Z",
        updatedAt: "2025-11-23T05:57:37.000Z",
        course: {
          id: "8dbeb3c2-02c4-4113-a469-8742d8f23c07",
          title: "Complete Web Development Bootcamp 2024",
          slug: "complete-web-development-bootcamp-2024",
        },
        module: null,
      },
      {
        id: "541e8704-f927-4fbd-83c5-dd4823606fea",
        courseId: "8dbeb3c2-02c4-4113-a469-8742d8f23c07",
        moduleId: "8942c0be-9053-4c54-83a3-be5493cf261f",
        title: "Introduction to Databases",
        description: "This lesson explains basic database concepts.",
        contentType: "TEXT",
        contentUrl: "https://example.com/lesson-video.mp4",
        muxVideoId: "d01f1f41-2400-43be-880c-f9083ec0cee7",
        textContent: null,
        durationMinutes: 15,
        sortOrder: 1,
        isPublished: false,
        createdAt: "2025-11-23T13:23:30.000Z",
        updatedAt: "2025-11-23T13:23:30.000Z",
        course: {
          id: "8dbeb3c2-02c4-4113-a469-8742d8f23c07",
          title: "Complete Web Development Bootcamp 2024",
          slug: "complete-web-development-bootcamp-2024",
        },
        module: null,
      },
      {
        id: "54c5348f-cfe4-4cbd-9b8b-d2220db27266",
        courseId: "252a1c28-cc6c-4185-b2de-4807c84f686b",
        moduleId: "b727e215-601c-4a62-b258-68df91362b09",
        title: "Lesson with video",
        description:
          "Found the problem! The axios instance has a hardcoded Content-Type: application/json header. When sending FormData, you need to let the browser set th",
        contentType: "VIDEO",
        contentUrl: null,
        muxVideoId: "kwjmz02zGWoCtT9qfLe00zR01LVHzzEHyXxM5iaxaVqXXo",
        textContent: null,
        durationMinutes: 5,
        sortOrder: 1,
        isPublished: false,
        createdAt: "2025-12-23T08:10:16.000Z",
        updatedAt: "2025-12-24T10:45:46.000Z",
        course: {
          id: "252a1c28-cc6c-4185-b2de-4807c84f686b",
          title: "Complete Python Programming Bootcamp",
          slug: "complete-python-programming-bootcamp",
        },
        module: {
          id: "b727e215-601c-4a62-b258-68df91362b09",
          title: "Learn core programming concepts using Python.",
          sortOrder: 1,
        },
      },
      {
        id: "76152287-ac00-450c-93d6-21a0d14d5416",
        courseId: "8dbeb3c2-02c4-4113-a469-8742d8f23c07",
        moduleId: "8942c0be-9053-4c54-83a3-be5493cf261f",
        title: "Introduction to Databases",
        description: "This lesson explains basic database concepts.",
        contentType: "VIDEO",
        contentUrl:
          "https://stream.mux.com/aTuXVCeIRFsp028hxTqp3YC1ATGKrhUinhQ2bHN002wzs.m3u8?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhVHVYVkNlSVJGc3AwMjhoeFRxcDNZQzFBVEdLcmhVaW5oUTJiSE4wMDJ3enMiLCJhdWQiOiJ2IiwiZXhwIjoxNzY2NzY0Nzc1LCJraWQiOiJhQ2lJVWV5aHcwMlRWY0pFYkMyRmVYbDU5TlNBYWtDSHZZVXZicHRESFFFZyIsImlhdCI6MTc2Njc1NzU3NX0.eDZoBfXc3AIdROinNqgvgRuxKl_D8YspwYpLXm_ikRRtXXQPs_3zGufTYF5AEAID87QbP9cxwAmKcaXDSaO0fBEuxAr6F1kMBoSoSfwsbroN-I7RO2grCR0PyefG3oUxYvTB92Uiv9Kxsg5hCEv_2fyynZI02-256KU2mijRGo0aUeQkj9Bup11ltsaFkV1x_qsrFCT0so4dpzqE9yoIiiG2jZ5oCL5uGynQ6Bl6jli_m5w2aRsEKx_yQ6DSuzCPrg2MyrMf0UjSII58h5Z4hjkXRvz7GzUqEul38iqV7wM40RJHC5GkuYmBsOTQ_bomAhPN9yQf5ijzP57NYo3wlQ",
        muxVideoId: "d01f1f41-2400-43be-880c-f9083ec0cee7",
        textContent: null,
        durationMinutes: 15,
        sortOrder: 1,
        isPublished: false,
        createdAt: "2025-11-23T10:26:40.000Z",
        updatedAt: "2025-11-23T10:26:40.000Z",
        course: {
          id: "8dbeb3c2-02c4-4113-a469-8742d8f23c07",
          title: "Complete Web Development Bootcamp 2024",
          slug: "complete-web-development-bootcamp-2024",
        },
        module: null,
      },
      {
        id: "884bfef6-509c-4efc-9c14-aed07bd53e8e",
        courseId: "8dbeb3c2-02c4-4113-a469-8742d8f23c07",
        moduleId: "d5d52ab3-2a42-46ee-972d-8eb2b3e122ca",
        title: "Introduction to Databases",
        description: "This lesson explains basic database concepts.",
        contentType: "VIDEO",
        contentUrl:
          "https://stream.mux.com/NILc802hQnOiEBx6hgIS02qxVvU4NZHjtKSUOwYjg6t2g.m3u8?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJOSUxjODAyaFFuT2lFQng2aGdJUzAycXhWdlU0TlpIanRLU1VPd1lqZzZ0MmciLCJhdWQiOiJ2IiwiZXhwIjoxNzY2NzY0Nzc1LCJraWQiOiJhQ2lJVWV5aHcwMlRWY0pFYkMyRmVYbDU5TlNBYWtDSHZZVXZicHRESFFFZyIsImlhdCI6MTc2Njc1NzU3NX0.d9y3s6KUSsNPNz-x31K2tyc56eyA81Idu1cNtWpIvr1kRbMRHFclqlaCkr6RKWi5Di7fZ86BcmhiG-mc_HjchzPOoO01LT524C5ZUaIBntuOGeu04SdU6rz9W53VzvqPpSY_iA7-RFt92fofMfjE4cSXIxMVN2KmWLmuJea2L2rEn_e0T16pkSj80aOAgb6309x4JMevClAotUIc0nWaQ5uzorUZilO5ksQ0xzremFTj00T9LXdcaBjqxd9YJv070GL1QggnQHGFRySB1YflPLk2VjqOPESJxEnkAm2VJJzpvUGee6eSPfKS94JHA6uGuP6hzbcZwK17sg_2nv8DcA",
        muxVideoId: "3ef6a194-4d88-4a2d-a921-e4185a707126",
        textContent: null,
        durationMinutes: 15,
        sortOrder: 1,
        isPublished: false,
        createdAt: "2025-12-16T05:49:32.000Z",
        updatedAt: "2025-12-16T05:49:32.000Z",
        course: {
          id: "8dbeb3c2-02c4-4113-a469-8742d8f23c07",
          title: "Complete Web Development Bootcamp 2024",
          slug: "complete-web-development-bootcamp-2024",
        },
        module: {
          id: "d5d52ab3-2a42-46ee-972d-8eb2b3e122ca",
          title: "Introduction to Web Development",
          sortOrder: 1,
        },
      },
      {
        id: "9c2b6577-b5dd-458c-a536-1d223f7467c5",
        courseId: "8dbeb3c2-02c4-4113-a469-8742d8f23c07",
        moduleId: "d5d52ab3-2a42-46ee-972d-8eb2b3e122ca",
        title: "Introduction to Databasesfffffffffffffffffffffffff",
        description: "This lesson explains basic database concepts.",
        contentType: "VIDEO",
        contentUrl:
          "https://stream.mux.com/aTuXVCeIRFsp028hxTqp3YC1ATGKrhUinhQ2bHN002wzs.m3u8?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhVHVYVkNlSVJGc3AwMjhoeFRxcDNZQzFBVEdLcmhVaW5oUTJiSE4wMDJ3enMiLCJhdWQiOiJ2IiwiZXhwIjoxNzY2NzY0Nzc1LCJraWQiOiJhQ2lJVWV5aHcwMlRWY0pFYkMyRmVYbDU5TlNBYWtDSHZZVXZicHRESFFFZyIsImlhdCI6MTc2Njc1NzU3NX0.eDZoBfXc3AIdROinNqgvgRuxKl_D8YspwYpLXm_ikRRtXXQPs_3zGufTYF5AEAID87QbP9cxwAmKcaXDSaO0fBEuxAr6F1kMBoSoSfwsbroN-I7RO2grCR0PyefG3oUxYvTB92Uiv9Kxsg5hCEv_2fyynZI02-256KU2mijRGo0aUeQkj9Bup11ltsaFkV1x_qsrFCT0so4dpzqE9yoIiiG2jZ5oCL5uGynQ6Bl6jli_m5w2aRsEKx_yQ6DSuzCPrg2MyrMf0UjSII58h5Z4hjkXRvz7GzUqEul38iqV7wM40RJHC5GkuYmBsOTQ_bomAhPN9yQf5ijzP57NYo3wlQ",
        muxVideoId: "d01f1f41-2400-43be-880c-f9083ec0cee7",
        textContent: null,
        durationMinutes: 15,
        sortOrder: 1,
        isPublished: false,
        createdAt: "2025-12-26T13:48:57.000Z",
        updatedAt: "2025-12-26T13:48:57.000Z",
        course: {
          id: "8dbeb3c2-02c4-4113-a469-8742d8f23c07",
          title: "Complete Web Development Bootcamp 2024",
          slug: "complete-web-development-bootcamp-2024",
        },
        module: {
          id: "d5d52ab3-2a42-46ee-972d-8eb2b3e122ca",
          title: "Introduction to Web Development",
          sortOrder: 1,
        },
      },
      {
        id: "a8790399-741c-4a38-901c-2e20e00dd6b8",
        courseId: "8dbeb3c2-02c4-4113-a469-8742d8f23c07",
        moduleId: "d5d52ab3-2a42-46ee-972d-8eb2b3e122ca",
        title: "Introduction to Databases",
        description: "This lesson explains basic database concepts.",
        contentType: "VIDEO",
        contentUrl:
          "https://stream.mux.com/NILc802hQnOiEBx6hgIS02qxVvU4NZHjtKSUOwYjg6t2g.m3u8?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJOSUxjODAyaFFuT2lFQng2aGdJUzAycXhWdlU0TlpIanRLU1VPd1lqZzZ0MmciLCJhdWQiOiJ2IiwiZXhwIjoxNzY2NzY0Nzc1LCJraWQiOiJhQ2lJVWV5aHcwMlRWY0pFYkMyRmVYbDU5TlNBYWtDSHZZVXZicHRESFFFZyIsImlhdCI6MTc2Njc1NzU3NX0.d9y3s6KUSsNPNz-x31K2tyc56eyA81Idu1cNtWpIvr1kRbMRHFclqlaCkr6RKWi5Di7fZ86BcmhiG-mc_HjchzPOoO01LT524C5ZUaIBntuOGeu04SdU6rz9W53VzvqPpSY_iA7-RFt92fofMfjE4cSXIxMVN2KmWLmuJea2L2rEn_e0T16pkSj80aOAgb6309x4JMevClAotUIc0nWaQ5uzorUZilO5ksQ0xzremFTj00T9LXdcaBjqxd9YJv070GL1QggnQHGFRySB1YflPLk2VjqOPESJxEnkAm2VJJzpvUGee6eSPfKS94JHA6uGuP6hzbcZwK17sg_2nv8DcA",
        muxVideoId: "3ef6a194-4d88-4a2d-a921-e4185a707126",
        textContent: null,
        durationMinutes: 15,
        sortOrder: 1,
        isPublished: false,
        createdAt: "2025-12-16T05:48:42.000Z",
        updatedAt: "2025-12-16T05:48:42.000Z",
        course: {
          id: "8dbeb3c2-02c4-4113-a469-8742d8f23c07",
          title: "Complete Web Development Bootcamp 2024",
          slug: "complete-web-development-bootcamp-2024",
        },
        module: {
          id: "d5d52ab3-2a42-46ee-972d-8eb2b3e122ca",
          title: "Introduction to Web Development",
          sortOrder: 1,
        },
      },
      {
        id: "f1c60486-24ef-4882-9d06-4a35514d70bc",
        courseId: "252a1c28-cc6c-4185-b2de-4807c84f686b",
        moduleId: "b727e215-601c-4a62-b258-68df91362b09",
        title: "Easy Next Enhancements",
        description:
          "Primary CTA for creating lessons is visible at the top\n\nEdit and delete are contextual and unobtrusive\n\nIcons reduce visual noise in a data heavy dashboard",
        contentType: "TEXT",
        contentUrl: null,
        muxVideoId: null,
        textContent:
          "&lt;p>&lt;strong>Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.&lt;/strong>&lt;/p>&lt;blockquote>&lt;p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.&lt;/p>&lt;/blockquote>&lt;p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.&lt;/p>&lt;pre>&lt;code>Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.&lt;/code>&lt;/pre>&lt;p>&lt;code>Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.&lt;/code>&lt;/p>",
        durationMinutes: 80,
        sortOrder: 1,
        isPublished: true,
        createdAt: "2025-12-22T10:25:07.000Z",
        updatedAt: "2025-12-24T10:57:31.000Z",
        course: {
          id: "252a1c28-cc6c-4185-b2de-4807c84f686b",
          title: "Complete Python Programming Bootcamp",
          slug: "complete-python-programming-bootcamp",
        },
        module: {
          id: "b727e215-601c-4a62-b258-68df91362b09",
          title: "Learn core programming concepts using Python.",
          sortOrder: 1,
        },
      },
    ],
    meta: {
      currentPage: 1,
      nextPage: null,
      prevPage: null,
      itemsPerPage: 50,
      totalPages: 1,
      totalItems: 9,
    },
  },
};
