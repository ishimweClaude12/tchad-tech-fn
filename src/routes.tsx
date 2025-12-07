import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import ShopLayout from "./layouts/ShopLayout";

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

export default function AppRouter() {
  return (
    <Routes>
      {/* Main App Layout */}
      <Route element={<MainLayout />}>
        {/* Global dashboard */}
        <Route index element={<Home />} />
        <Route path="/learn" element={<LearnHome />} />
        <Route path="/shop" element={<ShopHome />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
        <Route element={<AppDashboardLayout />}>
          <Route path="/dashboard" element={<AppDashboard />} />
        </Route>
      </Route>

      {/* E-Learning Public Section */}
      <Route path="/learn/dashboard" element={<LearnDashboardLayout />}>
        <Route index element={<LearnHome />} />

        {/* E-Learning Dashboard */}
        <Route element={<LearnDashboardLayout />}>
          <Route path="dashboard" element={<LearnDashboard />} />
        </Route>
      </Route>

      {/* E-Commerce Public Section */}
      <Route path="/shop" element={<ShopLayout />}>
        <Route index element={<ShopHome />} />

        {/* E-Commerce Dashboard */}
        <Route element={<ShopDashboardLayout />}>
          <Route path="dashboard" element={<ShopDashboard />} />
        </Route>
      </Route>

      {/* Fallback: redirect unmatched routes to NotFound */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
