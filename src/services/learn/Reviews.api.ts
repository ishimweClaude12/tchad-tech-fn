import axiosInstance from "src/lib/axios";
import type { ApiResponse } from "src/types/Api.types";
import type {
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
};
