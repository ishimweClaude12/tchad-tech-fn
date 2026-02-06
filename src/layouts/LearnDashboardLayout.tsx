import React from "react";
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
} from "lucide-react";
import { Outlet, Link, useLocation } from "react-router-dom";

const LearnDashboardLayout: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

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

  return (
    <div
      className="flex h-screen bg-gray-100"
      style={{ width: "100vw", maxWidth: "100vw" }}
    >
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg shrink-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-center h-16 px-4 bg-blue-600 text-white">
            <GraduationCap className="w-8 h-8 mr-2" />
            <h4 className="text-lg font-semibold">E-Learning Dashboard</h4>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
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
          <div className="p-4 border-t border-gray-200">
            <Link
              to="/learn"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
            >
              <Home className="w-5 h-5 mr-3" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className="flex-1 flex flex-col overflow-hidden"
        style={{ minWidth: 0 }}
      >
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {navigation.find((item) => item.current)?.name || "Dashboard"}
            </h2>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LearnDashboardLayout;
