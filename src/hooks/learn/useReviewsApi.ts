import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { ReviewsApi } from "src/services/learn/Reviews.api";
import type { ReviewModerationStatus } from "src/types/Reviews";

export const useReviews = () => {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const data = await ReviewsApi.getAllReviews();
      return data;
    },
  });
};

export const useModerateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      reviewId,
      userId,
      action,
    }: {
      reviewId: string;
      userId: string;
      action: ReviewModerationStatus;
    }) => ReviewsApi.moderateReview(reviewId, userId, action),
    onSuccess: () => {
      toast.success("Review moderated successfully!");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (error) => {
      toast.error("Failed to moderate review. Please try again.");
      console.error("Moderate review error:", error);
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: string) => ReviewsApi.deleteReview(reviewId),
    onSuccess: () => {
      toast.success("Review deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (error) => {
      toast.error("Failed to delete review. Please try again.");
      console.error("Delete review error:", error);
    },
  });
};

export const useCheckUserReview = (courseId: string, userId: string) => {
  return useQuery({
    queryKey: ["checkUserReview", courseId, userId],
    queryFn: async () => {
      const data = await ReviewsApi.checkIfUserHasReviewedCourse(
        courseId,
        userId,
      );
      return data;
    },
    enabled: !!courseId && !!userId, // Only run if both courseId and userId are available
  });
};

export const useAddReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Parameters<typeof ReviewsApi.addReview>[0]) =>
      ReviewsApi.addReview(payload),
    onSuccess: (_, variables) => {
      toast.success("Review added successfully!");
      console.log("Invalidating queries for add with:", {
        courseId: variables.courseId,
        userId: variables.userId,
      });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({
        queryKey: ["checkUserReview", variables.courseId, variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["courseReviews", variables.courseId],
      });
    },
    onError: (error) => {
      toast.error("Failed to add review. Please try again.");
      console.error("Add review error:", error);
    },
  });
};

export const useGetCourseReviews = (courseId: string) => {
  return useQuery({
    queryKey: ["courseReviews", courseId],
    queryFn: async () => {
      const data = await ReviewsApi.getReviewsForCourse(courseId);
      return data;
    },
    enabled: !!courseId, // Only run if courseId is available
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      reviewId,
      payload,
    }: {
      reviewId: string;
      payload: Parameters<typeof ReviewsApi.updateReview>[1];
      courseId?: string;
    }) => ReviewsApi.updateReview(reviewId, payload),
    onSuccess: (_, variables) => {
      toast.success("Review updated successfully!");
      console.log("Invalidating queries for update with:", {
        courseId: variables.courseId,
        userId: variables.payload.userId,
      });

      // Invalidate all reviews
      queryClient.invalidateQueries({ queryKey: ["reviews"] });

      // Invalidate specific course reviews
      if (variables.courseId) {
        console.log("Invalidating courseReviews for:", variables.courseId);
        queryClient.invalidateQueries({
          queryKey: ["courseReviews", variables.courseId],
        });
      }

      // Invalidate user review check
      if (variables.payload.userId && variables.courseId) {
        console.log(
          "Invalidating checkUserReview for:",
          variables.courseId,
          variables.payload.userId,
        );
        queryClient.invalidateQueries({
          queryKey: [
            "checkUserReview",
            variables.courseId,
            variables.payload.userId,
          ],
        });
      }
    },
    onError: (error) => {
      toast.error("Failed to update review. Please try again.");
      console.error("Update review error:", error);
    },
  });
};

export const useGetPosts = () => {
  return useQuery({
    queryKey: ["forumPosts"],
    queryFn: async () => {
      const data = await ReviewsApi.getPosts();
      return data;
    },
  });
};

export const useAddPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Parameters<typeof ReviewsApi.createPost>[0]) =>
      ReviewsApi.createPost(payload),
    onSuccess: () => {
      toast.success("Post added successfully!");
      queryClient.invalidateQueries({ queryKey: ["forumPosts"] });
    },
    onError: (error) => {
      toast.error("Failed to add post. Please try again.");
      console.error("Add post error:", error);
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
      payload,
    }: {
      postId: string;
      payload: Parameters<typeof ReviewsApi.updatePost>[1];
    }) => ReviewsApi.updatePost(postId, payload),
    onSuccess: () => {
      toast.success("Post updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["forumPosts"] });
    },
    onError: (error) => {
      toast.error("Failed to update post. Please try again.");
      console.error("Update post error:", error);
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => ReviewsApi.deletePost(postId),
    onSuccess: () => {
      toast.success("Post deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["forumPosts"] });
    },
    onError: (error) => {
      toast.error("Failed to delete post. Please try again.");
      console.error("Delete post error:", error);
    },
  });
};
