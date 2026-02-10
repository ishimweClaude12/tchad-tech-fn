import React, { useState } from "react";
import {
  BookOpen,
  Users,
  GraduationCap,
  BarChart3,
  Settings,
  Home,
  Megaphone,
  Folder,
  Layers,
  Box,
  FileText,
  LayoutDashboard,
  Bell,
  Star,
  Menu,
  X,
} from "lucide-react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "@mui/material";

const LearnDashboardLayout: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    {
      name: "Dashboard",
      href: "/learn/dashboard",
      icon: LayoutDashboard,
      current: currentPath === "/learn/dashboard",
    },
    {
      name: "Users",
      href: "/learn/dashboard/users",
      icon: Users,
      current: currentPath === "/learn/dashboard/users",
    },
    {
      name: "Courses",
      href: "/learn/dashboard/courses",
      icon: BookOpen,
      current: currentPath === "/learn/dashboard/courses",
    },
    {
      name: "My Learning",
      href: "/learn/dashboard/my-learning",
      icon: GraduationCap,
      current: currentPath === "/learn/dashboard/my-learning",
    },
    {
      name: "Categories",
      href: "/learn/dashboard/categories",
      icon: Folder,
      current: currentPath === "/learn/dashboard/categories",
    },
    {
      name: "Sub-Categories",
      href: "/learn/dashboard/sub-categories",
      icon: Layers,
      current: currentPath === "/learn/dashboard/sub-categories",
    },
    {
      name: "Modules",
      href: "/learn/dashboard/modules",
      icon: Box,
      current: currentPath === "/learn/dashboard/modules",
    },
    {
      name: "Lessons",
      href: "/learn/dashboard/lessons",
      icon: FileText,
      current: currentPath === "/learn/dashboard/lessons",
    },
    {
      name: "Analytics",
      href: "/learn/dashboard/analytics",
      icon: BarChart3,
      current: currentPath === "/learn/dashboard/analytics",
    },
    {
      name: "Announcements",
      href: "/learn/dashboard/announcements",
      icon: Megaphone,
      current: currentPath === "/learn/dashboard/announcements",
    },
    {
      name: "Notifications",
      href: "/learn/dashboard/notifications",
      icon: Bell,
      current: currentPath === "/learn/dashboard/notifications",
    },
    {
      name: "Reviews",
      href: "/learn/dashboard/reviews",
      icon: Star,
      current: currentPath === "/learn/dashboard/reviews",
    },
    {
      name: "Settings",
      href: "/learn/dashboard/settings",
      icon: Settings,
      current: currentPath === "/learn/dashboard/settings",
    },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const currentPage =
    navigation.find((item) => item.current)?.name || "Dashboard";

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800 truncate">
              {currentPage}
            </h2>
          </div>
          <Button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </Button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-none z-40 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static
          top-0 left-0 bottom-0
          w-64 bg-white shadow-lg
          z-50
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          flex flex-col h-screen
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 bg-blue-600 text-white shrink-0">
          <div className="flex items-center">
            <GraduationCap className="w-8 h-8 mr-2" />
            <h4 className="text-lg font-semibold">E-Learning Dashboard</h4>
          </div>
          <Button
            onClick={closeSidebar}
            className="lg:hidden p-1 rounded hover:bg-blue-700 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={closeSidebar}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  item.current
                    ? "bg-blue-100 text-blue-700 border-l-4 border-blue-700"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 shrink-0">
          <Link
            to="/learn"
            onClick={closeSidebar}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
          >
            <Home className="w-5 h-5 mr-3" />
            Back to Home
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 pt-16 lg:pt-0">
        {/* Desktop Header */}
        <header className="hidden lg:block bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {currentPage}
            </h2>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LearnDashboardLayout;
