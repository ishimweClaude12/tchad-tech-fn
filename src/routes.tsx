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
import E_LearningUsersAdmin from "./pages/learn/E_LearningUsers";
import CourseCategoriesAdmin from "./pages/learn/CourseCategories";
import CourseSubCategoriesAdmin from "./pages/learn/CourseSubCategories";
import CoursesAdmin from "./pages/learn/Courses";
import Modules from "./pages/learn/Modules";

export default function AppRouter() {
  return (
    <Routes>
      {/* Main App Layout */}
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/learn" element={<LearnHome />} />
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
        <Route path="users" element={<E_LearningUsersAdmin />} />
        <Route path="my-learning" element={<div>My Learning Page</div>} />
        <Route path="categories" element={<CourseCategoriesAdmin />} />
        <Route path="sub-categories" element={<CourseSubCategoriesAdmin />} />
        <Route path="modules" element={<Modules />} />
        <Route path="lessons" element={<div>Lessons Page</div>} />
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
