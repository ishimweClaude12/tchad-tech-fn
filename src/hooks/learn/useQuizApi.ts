import type {
  QuestionOptionPayload,
  QuestionPayload,
  QuizPayload,
} from "../../types/Quiz.types";
import { quizApi } from "../../services/learn/Quiz.api";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
export const useCourseQuizzes = (courseId: string) => {
  return useQuery({
    queryKey: ["courseQuizzes", courseId],
    queryFn: () => quizApi.getAllCourseQuizes(courseId),
    enabled: !!courseId,
  });
};

export const useCreateQuiz = () => {
  return useMutation({
    mutationFn: (payload: QuizPayload) => quizApi.createQuiz(payload),
    onSuccess: () => {
      toast.success("Quiz created successfully.");
    },
    onError: (error) => {
      toast.error("Failed to create quiz.");
      console.error("Create Quiz Error:", error);
    },
  });
};

export const useUpdateQuiz = () => {
  return useMutation({
    mutationFn: ({
      quizId,
      payload,
    }: {
      quizId: string;
      payload: QuizPayload;
    }) => quizApi.updateQuiz(quizId, payload),
    onSuccess: () => {
      toast.success("Quiz updated successfully.");
    },
    onError: (error) => {
      toast.error("Failed to update quiz.");
      console.error("Update Quiz Error:", error);
    },
  });
};

export const useDeleteQuiz = () => {
  return useMutation({
    mutationFn: (quizId: string) => quizApi.deleteQuiz(quizId),
    onSuccess: () => {
      toast.success("Quiz deleted successfully.");
    },
    onError: (error) => {
      toast.error("Failed to delete quiz.");
      console.error("Delete Quiz Error:", error);
    },
  });
};

export const useModuleQuizzes = (moduleId: string) => {
  return useQuery({
    queryKey: ["moduleQuizzes", moduleId],
    queryFn: () => quizApi.getAllModuleQuizzes(moduleId),
    enabled: !!moduleId,
  });
};

export const useLessonQuizzes = (lessonId: string) => {
  return useQuery({
    queryKey: ["lessonQuizzes", lessonId],
    queryFn: () => quizApi.getAllLessonQuizzes(lessonId),
    enabled: !!lessonId,
  });
};

export const useQuizDetails = (quizId: string) => {
  return useQuery({
    queryKey: ["quizDetails", quizId],
    queryFn: () => quizApi.getQuizById(quizId),
    enabled: !!quizId,
  });
};

export const useQuizQuestions = (quizId: string) => {
  return useQuery({
    queryKey: ["quizQuestions", quizId],
    queryFn: () => quizApi.getQuizQuestions(quizId),
    enabled: !!quizId,
  });
};

export const useCreateQuizQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: QuestionPayload) => quizApi.createQuestion(payload),
    onError: (error) => {
      toast.error("Failed to create question.");
      console.error("Create Question Error:", error);
    },
    onSuccess: (_, payload) => {
      toast.success("Question created successfully.");
      queryClient.invalidateQueries({
        queryKey: ["quizQuestions", payload.quizId],
      });
    },
  });
};

export const useUpdateQuizQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      questionId,
      payload,
    }: {
      questionId: string;
      payload: Partial<QuestionPayload>;
    }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { quizId, ...restPayload } = payload;

      return quizApi.updateQuestion(questionId, restPayload);
    },
    onError: (error) => {
      toast.error("Failed to update question.");
      console.error("Update Question Error:", error);
    },
    onSuccess: (_, vars) => {
      toast.success("Question updated successfully.");
      queryClient.invalidateQueries({
        queryKey: ["quizQuestions", vars.payload.quizId],
      });
    },
  });
};

export const useDeleteQuizQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ questionId }: { questionId: string; quizId: string }) =>
      quizApi.deleteQuestion(questionId),
    onError: (error) => {
      toast.error("Failed to delete question.");
      console.error("Delete Question Error:", error);
    },
    onSuccess: (_, { quizId }) => {
      toast.success("Question deleted successfully.");
      queryClient.invalidateQueries({
        queryKey: ["quizQuestions", quizId],
      });
    },
  });
};

export const useCreateQuestionOption = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: QuestionOptionPayload & { quizId?: string }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { quizId: _, ...optionPayload } = payload;
      return quizApi.createQuestionOption(optionPayload);
    },
    onError: (error) => {
      toast.error("Failed to create question option.");
      console.error("Create Question Option Error:", error);
    },
    onSuccess: (_, payload) => {
      toast.success("Question option created successfully.");
      if (payload.quizId) {
        queryClient.invalidateQueries({
          queryKey: ["quizQuestions", payload.quizId],
        });
      }
    },
  });
};

export const useUpdateQuestionOption = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      optionId,
      payload,
    }: {
      optionId: string;
      payload: Partial<QuestionOptionPayload> & { quizId?: string };
    }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { quizId: _, questionId: __, ...optionPayload } = payload;
      return quizApi.updateQuestionOption(optionId, optionPayload);
    },
    onError: (error) => {
      toast.error("Failed to update question option.");
      console.error("Update Question Option Error:", error);
    },
    onSuccess: (_, vars) => {
      toast.success("Question option updated successfully.");
      if (vars.payload.quizId) {
        queryClient.invalidateQueries({
          queryKey: ["quizQuestions", vars.payload.quizId],
        });
      }
    },
  });
};

export const useDeleteQuestionOption = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      optionId,
    }: {
      optionId: string;
      questionId: string;
      quizId: string;
    }) => quizApi.deleteQuestionOption(optionId),
    onError: (error) => {
      toast.error("Failed to delete question option.");
      console.error("Delete Question Option Error:", error);
    },
    onSuccess: (_, { quizId }) => {
      toast.success("Question option deleted successfully.");
      queryClient.invalidateQueries({
        queryKey: ["quizQuestions", quizId],
      });
    },
  });
};
