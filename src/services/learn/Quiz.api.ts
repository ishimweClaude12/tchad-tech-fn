import axiosInstance from "../../lib/axios";
import { type ApiResponse } from "../../types/Api.types";
import type {
  Question,
  QuestionOption,
  QuestionOptionPayload,
  QuestionPayload,
  QuiAttempt,
  Quiz,
  QuizAttemptPayload,
  QuizPayload,
} from "../../types/Quiz.types";

export const quizApi = {
  getAllCourseQuizes: async (courseId: string) => {
    const { data } = await axiosInstance.get<
      ApiResponse<{
        quizzes: Quiz[];
      }>
    >(`/quizzes/course/${courseId}/`);
    return data;
  },
  createQuiz: async (payload: QuizPayload) => {
    const { data } = await axiosInstance.post<
      ApiResponse<{
        quiz: Quiz;
      }>
    >(`/quizzes/`, payload);
    return data;
  },
  updateQuiz: async (quizId: string, payload: Partial<QuizPayload>) => {
    const { data } = await axiosInstance.put<
      ApiResponse<{
        quiz: Quiz;
      }>
    >(`/quizzes/${quizId}/`, payload);
    return data;
  },
  deleteQuiz: async (quizId: string) => {
    const { data } = await axiosInstance.delete<
      ApiResponse<{
        success: boolean;
      }>
    >(`/quizzes/${quizId}/`);
    return data;
  },
  getAllModuleQuizzes: async (moduleId: string) => {
    const { data } = await axiosInstance.get<
      ApiResponse<{
        quizzes: Quiz[];
      }>
    >(`/quizzes/module/${moduleId}/`);
    return data;
  },
  getAllLessonQuizzes: async (lessonId: string) => {
    const { data } = await axiosInstance.get<
      ApiResponse<{
        quizzes: Quiz[];
      }>
    >(`/quizzes/lesson/${lessonId}/`);
    return data;
  },
  getQuizById: async (quizId: string) => {
    const { data } = await axiosInstance.get<
      ApiResponse<{
        quiz: Quiz;
      }>
    >(`/quizzes/${quizId}/`);
    return data;
  },
  getQuizQuestions: async (quizId: string) => {
    const { data } = await axiosInstance.get<
      ApiResponse<{
        questions: Question[];
      }>
    >(`/questions/quiz/${quizId}/`);
    return data;
  },
  createQuestion: async (payload: QuestionPayload) => {
    const { data } = await axiosInstance.post<
      ApiResponse<{
        question: Question;
      }>
    >(`/questions/`, payload);
    return data;
  },
  updateQuestion: async (
    questionId: string,
    payload: Partial<QuestionPayload>,
  ) => {
    const { data } = await axiosInstance.put<
      ApiResponse<{
        question: Question;
      }>
    >(`/questions/${questionId}/`, payload);
    return data;
  },
  deleteQuestion: async (questionId: string) => {
    const { data } = await axiosInstance.delete<
      ApiResponse<{
        success: boolean;
      }>
    >(`/questions/${questionId}/`);
    return data;
  },
  createQuestionOption: async (payload: QuestionOptionPayload) => {
    const { data } = await axiosInstance.post<
      ApiResponse<{
        option: QuestionOption;
      }>
    >(`/question-options/`, payload);
    return data;
  },
  updateQuestionOption: async (
    optionId: string,
    payload: Partial<QuestionOptionPayload>,
  ) => {
    const { data } = await axiosInstance.put<
      ApiResponse<{
        option: QuestionOption;
      }>
    >(`/question-options/${optionId}/`, payload);
    return data;
  },
  deleteQuestionOption: async (optionId: string) => {
    const { data } = await axiosInstance.delete<
      ApiResponse<{
        success: boolean;
      }>
    >(`/question-options/${optionId}/`);
    return data;
  },
  startQuizAttempt: async (quizId: string, userId: string) => {
    const { data } = await axiosInstance.post<
      ApiResponse<{
        attemptId: string;
      }>
    >(`/quiz-attempts/start`, { quizId, userId });
    return data;
  },
  answerQuizQuestion: async (payload: QuizAttemptPayload) => {
    const { data } = await axiosInstance.post<
      ApiResponse<{
        success: boolean;
      }>
    >(`/quiz-attempts/submit`, payload);
    return data;
  },
  getQuizAttempts: async (quizId: string, userId: string) => {
    const { data } = await axiosInstance.get<
      ApiResponse<{
        attempts: QuiAttempt[];
      }>
    >(`/quiz-attempts/user/${userId}/quiz/${quizId}`);
    return data;
  },
  getAllQuizzes: async () => {
    const { data } = await axiosInstance.get<
      ApiResponse<{
        quizzes: Quiz[];
      }>
    >(`/quizzes/`);
    return data;
  },
};
