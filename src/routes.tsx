import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import LearnDashboardLayout from "./layouts/LearnDashboardLayout";
import ShopDashboardLayout from "./layouts/ShopDashboardLayout";
import AppDashboardLayout from "./layouts/AppDashboardLayout";

import LearnHome from "./pages/learn/LearnHome";
import LearnDashboard from "./pages/learn/LearnDashboard";

import ShopHome from "./pages/shop/ShopHome";
import ShopDashboard from "./pages/shop/ShopDashboard";

import AppDashboard from "./pages/home/HomeDashboard";
import Home from "./pages/home/Home";
import AboutUsPage from "./pages/home/AboutPage";
import ContactUsPage from "./pages/home/ContactUsPage";
import NotFound from "./pages/shared/NotFound";
import DashboardOverview from "./pages/learn/DashboardOverview";
import ELearningUsersAdmin from "./pages/learn/E_LearningUsers";
import CourseCategoriesAdmin from "./pages/learn/CourseCategories";
import CourseSubCategoriesAdmin from "./pages/learn/CourseSubCategories";
import CoursesAdmin from "./pages/learn/Courses";
import Modules from "./pages/learn/Modules";
import CourseLessons from "./pages/learn/CourseLessons";
import { CourseDetails } from "./components/learn/CourseDetails";
import { ModuleDetails } from "./pages/learn/ModuleDetails";
import QuizDetails from "./pages/learn/QuizDetails";
import MoreCourseDetails from "./components/learn/MoreCourseDetails";
import Enrollments from "./pages/learn/Enrollments";
import CheckoutPage from "./pages/learn/Checkout";
import CourseLayout from "./layouts/CourseLayout";
import Lesson from "./pages/learn/Lesson";
import Module from "./pages/learn/Module";
import WishList from "./pages/learn/WishList";
import CourseLandingPage from "./pages/learn/CourseLandingPage";
import QuizAttempt from "./pages/learn/QuizAttempt";
import Announcements from "./pages/learn/Announcements";
import CourseAnnouncements from "./pages/learn/CourseAnnouncements";
import Notifications from "./pages/learn/Notifications";
import Reviews from "./pages/learn/Reviews";
import InstructorCourses from "./pages/learn/InstructorCourses";
import InstructorCourseDetails from "./pages/learn/InstructorCourseDetails";
import QuizAttempts from "./pages/learn/QuizAttempts";
import { InstructorModuleDetails } from "./pages/learn/InstructorModuleDetails";
import AttemptDetails from "./pages/learn/AttemptDetails";
import ForumPage from "./pages/learn/ForumPage";
import ForumDetails from "./pages/learn/ForumDetails";

export default function AppRouter() {
  return (
    <Routes>
      {/* Main App Layout */}
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/learn" element={<LearnHome />} />
        <Route path="/learn/:id/checkout" element={<CheckoutPage />} />
        <Route path="/learn/wishlist" element={<WishList />} />
        <Route path="/learn/course/:slug" element={<MoreCourseDetails />} />
        <Route path="/shop" element={<ShopHome />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
      </Route>

      {/* Main App Dashboard - /dashboard */}
      <Route path="/dashboard" element={<AppDashboardLayout />}>
        <Route index element={<AppDashboard />} />
      </Route>

      {/* E-Learning Dashboard - /learn/dashboard */}
      <Route path="/learn/dashboard" element={<LearnDashboardLayout />}>
        <Route index element={<DashboardOverview />} />
        <Route path="overview" element={<LearnDashboard />} />
        <Route path="courses" element={<CoursesAdmin />} />
        <Route path="courses/:courseId" element={<CourseDetails />} />
        <Route
          path="courses/:courseId/quiz/:quizId"
          element={<QuizDetails />}
        />
        <Route
          path="courses/:courseId/module/:moduleId"
          element={<ModuleDetails />}
        />
        <Route
          path="courses/:courseId/module/:moduleId/quiz/:quizId"
          element={<QuizDetails />}
        />
        <Route path="course/:courseId/enrollments" element={<Enrollments />} />
        <Route
          path="course/:courseId/announcements"
          element={<CourseAnnouncements />}
        />
        <Route path="users" element={<ELearningUsersAdmin />} />
        <Route path="my-learning" element={<div>My Learning Page</div>} />
        <Route path="categories" element={<CourseCategoriesAdmin />} />
        <Route path="sub-categories" element={<CourseSubCategoriesAdmin />} />
        <Route path="modules" element={<Modules />} />
        <Route path="lessons" element={<CourseLessons />} />
        <Route path="assignments" element={<div>Assignments Page</div>} />
        <Route path="quizes" element={<div>Quizes Page</div>} />
        <Route path="analytics" element={<div>Analytics Page</div>} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="settings" element={<div>Settings Page</div>} />
        <Route path="forum" element={<ForumPage />} />
        <Route path="forum/:forumId" element={<ForumDetails />} />

        {/* Instructor-specific routes */}
        <Route path="instructor/courses" element={<InstructorCourses />} />
        <Route
          path="instructor/course/:courseId"
          element={<InstructorCourseDetails />}
        />
        <Route
          path="instructor/course/:courseId/quiz/:quizId"
          element={<QuizDetails />}
        />
        <Route
          path="instructor/course/:courseId/quiz-attempts/:quizId"
          element={<QuizAttempts />}
        />
        <Route
          path="instructor/course/:courseId/quiz-attempts/:quizId/attempt/:attemptId"
          element={<AttemptDetails />}
        />
        <Route
          path="instructor/course/:courseId/module/:moduleId"
          element={<InstructorModuleDetails />}
        />
        <Route
          path="instructor/course/:courseId/module/:moduleId/quiz/:quizId"
          element={<QuizAttempts />}
        />
        <Route
          path="instructor/course/:courseId/module/:moduleId/quiz/:quizId/attempt/:attemptId"
          element={<AttemptDetails />}
        />
      </Route>

      {/* E-Learning Course Learning  - /learn/progress */}
      <Route
        path="/learn/enrollment/:enrollmentId/course/:courseId"
        element={<CourseLayout />}
      >
        <Route index element={<CourseLandingPage />} />
        <Route path="quiz/:quizId" element={<QuizAttempt />} />
        <Route path="module/:moduleId" element={<Module />} />
        <Route path="module/:moduleId/quiz/:quizId" element={<QuizAttempt />} />
        <Route path="module/:moduleId/lesson/:lessonId" element={<Lesson />} />
        <Route
          path="module/:moduleId/lesson/:lessonId/quiz/:quizId"
          element={<QuizAttempt />}
        />
      </Route>

      {/* E-Commerce Dashboard - /shop/dashboard */}
      <Route path="/shop/dashboard" element={<ShopDashboardLayout />}>
        <Route index element={<ShopDashboard />} />
      </Route>

      {/* Fallback: redirect unmatched routes to NotFound */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
