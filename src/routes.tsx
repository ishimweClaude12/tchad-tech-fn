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

export default function AppRouter() {
  return (
    <Routes>
      {/* Main App Layout */}
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/learn" element={<LearnHome />} />
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
        <Route path="users" element={<ELearningUsersAdmin />} />
        <Route path="my-learning" element={<div>My Learning Page</div>} />
        <Route path="categories" element={<CourseCategoriesAdmin />} />
        <Route path="sub-categories" element={<CourseSubCategoriesAdmin />} />
        <Route path="modules" element={<Modules />} />
        <Route path="lessons" element={<CourseLessons />} />
        <Route path="assignments" element={<div>Assignments Page</div>} />
        <Route path="quizes" element={<div>Quizes Page</div>} />
        <Route path="analytics" element={<div>Analytics Page</div>} />
        <Route path="settings" element={<div>Settings Page</div>} />
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
