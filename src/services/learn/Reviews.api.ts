import axiosInstance from "src/lib/axios";
import type { ApiResponse } from "src/types/Api.types";
import type {
  Post,
  Review,
  ReviewModerationStatus,
  ReviewPayload,
} from "src/types/Reviews";

export const ReviewsApi = {
  getAllReviews: async () => {
    const { data } = await axiosInstance.get<
      ApiResponse<{
        reviews: Review[];
      }>
    >(`/reviews`);
    return data;
  },
  moderateReview: async (
    reviewId: string,
    userId: string,
    action: ReviewModerationStatus,
  ) => {
    const { data } = await axiosInstance.patch<
      ApiResponse<{
        review: Review;
      }>
    >(`/reviews/${reviewId}/moderate`, {
      moderatedBy: userId,
      moderationStatus: action,
    });
    return data;
  },
  deleteReview: async (reviewId: string) => {
    const { data } = await axiosInstance.delete<
      ApiResponse<{
        message: string;
      }>
    >(`/reviews/${reviewId}`);
    return data;
  },
  checkIfUserHasReviewedCourse: async (courseId: string, userId: string) => {
    const { data } = await axiosInstance.get<
      ApiResponse<{
        hasReviewed: boolean;
        review?: Review;
      }>
    >(`/reviews/check/${userId}/${courseId}`);
    return data;
  },
  addReview: async (payload: ReviewPayload) => {
    const { data } = await axiosInstance.post<
      ApiResponse<{
        review: Review;
      }>
    >(`/reviews`, payload);
    return data;
  },
  getReviewsForCourse: async (courseId: string) => {
    const { data } = await axiosInstance.get<
      ApiResponse<{
        reviews: Review[];
      }>
    >(`/reviews/course/${courseId}`);
    return data;
  },
  updateReview: async (reviewId: string, payload: Partial<ReviewPayload>) => {
    const { data } = await axiosInstance.put<
      ApiResponse<{
        review: Review;
      }>
    >(`/reviews/${reviewId}`, payload);
    return data;
  },
  getPosts: async () => {
    const { data } = await axiosInstance.get<
      ApiResponse<{
        posts: Post[];
        postCount: number;
      }>
    >(`/forum/`);
    return data;
  },
  createPost: async (payload: { title: string; content: string }) => {
    const fullPayload = {
      ...payload,
      attachment: null,
      view_count: 0,
      comment_count: 0,
    };
    const { data } = await axiosInstance.post<
      ApiResponse<{
        post: Post;
      }>
    >(`/forum/`, fullPayload);
    return data;
  },
  updatePost: async (postId: string, payload: Partial<Post>) => {
    const { data } = await axiosInstance.patch<
      ApiResponse<{
        post: Post;
      }>
    >(`/forum/${postId}`, payload);
    return data;
  },
  deletePost: async (postId: string) => {
    const { data } = await axiosInstance.delete<
      ApiResponse<{
        message: string;
      }>
    >(`/forum/${postId}`);
    return data;
  },
};
