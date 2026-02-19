import type {
  QuizKind,
  QuizScope,
  QuizDeliveryMode,
  QuestionType,
} from "src/utils/enums/Quiz.enums";
import type { LessonModule } from "./CourseLessons.types";
import type { BaseCourse } from "./Module.types";

export interface Quiz {
  id: string;
  title: string;
  kind: QuizKind;
  scope: QuizScope;

  courseId: string;
  moduleId: string | null;
  lessonId: string;

  deliveryMode: QuizDeliveryMode;

  openAt: string;
  closeAt: string;

  description: string;

  passingScore: string;
  timeLimitMinutes: number;
  maxAttempts: number;

  shuffleQuestions: boolean;
  shuffleOptions: boolean;

  showCorrectAnswers: boolean;
  showResultsImmediately: boolean;

  isMandatory: boolean;
  requireWebCam: boolean;

  sortOrder: number;

  createdAt: string;
  updatedAt: string;
  course: BaseCourse | null;
  module: LessonModule | null;
  lesson: LessonModule | null;
}

export interface QuizPayload {
  title: string;
  kind: QuizKind;
  scope: QuizScope;
  lessonId: string;
  moduleId: string | null;
  courseId: string;
  deliveryMode: QuizDeliveryMode;
  openAt: string;
  closeAt: string;
  description: string;
  passingScore: number;
  timeLimitMinutes: number;
  maxAttempts: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showCorrectAnswers: boolean;
  showResultsImmediately: boolean;
  isMandatory: boolean;
  requireWebCam: boolean;
  sortOrder: number;
}

export interface QuestionOption {
  quizQuestionOptionId: string;
  questionId: string;
  optionText: string;
  isCorrect: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  quizId: string;
  questionText: string;
  questionType: QuestionType;
  points: number;
  explanation: string | null;
  mediaUrl: string | null;
  sortOrder: number;
  isRequired: boolean;
  createdAt: string;
  updatedAt: string;
  options: QuestionOption[];
}

export interface QuestionPayload {
  quizId: string;
  questionText: string;
  questionType: QuestionType;
  points: number;
  explanation: string;
  mediaUrl: string;
  sortOrder: number;
  isRequired: boolean;
}

export interface QuestionOptionPayload {
  questionId: string;
  optionText: string;
  isCorrect: boolean;
  sortOrder: number;
}

export interface QuizAttemptPayload {
  attemptId: string;
  answers: {
    questionId: string;
    selectedOptionId: string;
  }[];
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  attemptNumber: number;
  startedAt: string;
  completedAt: string;
  totalScore: string;
  maxPossibleScore: string;
  gradingStatus: "finalized" | "auto-graded";
  isPassed: boolean;
  createdAt: string;
  updatedAt: string;
  answers: {
    id: string;
    attemptId: string;
    questionId: string;
    selectedOptionId: string | null;
    textAnswer: null;
    matchingAnswer: null;
    isCorrect: true;
    earnedPoints: number;
    requiresManualGrading: boolean;
    gradedAt: string;
    answeredAt: string;
    question: {
      id: string;
      questionText: string;
      questionType: string;
      points: number;
    };
  }[];
}

export interface AttemptUser {
  userId: string;
  role: string;
}

export interface AnswerQuestionSnapshot {
  id: string;
  questionText: string;
  questionType: QuestionType;
  points: number;
  explanation: string;
}

export interface SelectedOption {
  quizQuestionOptionId: string;
  optionText: string;
  isCorrect: boolean;
}

export interface AttemptAnswer {
  id: string;
  attemptId: string;
  questionId: string;
  selectedOptionId: string | null;
  textAnswer: string | null;
  matchingAnswer: string | null;

  isCorrect: boolean;
  earnedPoints: number;
  requiresManualGrading: boolean;

  gradedAt: string;
  answeredAt: string;

  question: AnswerQuestionSnapshot;
  selectedOption: SelectedOption | null;
}

export interface QuizWithQuestions extends Quiz {
  questions: Question[];
}

export interface QuizAttemptDetails extends Omit<QuizAttempt, "answers"> {
  quiz: QuizWithQuestions;
  user: AttemptUser;
  answers: AttemptAnswer[];
}

export interface QuizAttemptUpdatePayload {
  totalScore: number;
  maxPossibleScore: number;
  gradingStatus: "finalized" | "auto-graded";
  isPassed: boolean;
}
