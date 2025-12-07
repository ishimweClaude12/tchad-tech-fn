import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import {
  BookOpen,
  Users,
  GraduationCap,
  FolderOpen,
  BarChart3,
  Settings,
  Home,
} from "lucide-react";
import { Outlet } from "react-router-dom";

const LearnDashboardLayout: React.FC = () => {
  const { language } = useLanguage();
  const currentPath = window.location.pathname;

  const content = {
    en: {
      title: "E-Learning Dashboard",
      nav: {
        overview: "Dashboard",
        courses: "Courses",
        users: "Users",
        myLearning: "My Learning",
        categories: "Categories",
        subCategories: "Sub-Categories",
        modules: "Modules",
        lessons: "Lessons",
        assignments: "Assignments",
        quizes: "Quizes",
        analytics: "Analytics",
        settings: "Settings",
        backToHome: "Back to Home",
      },
    },
    fr: {
      title: "Tableau de Bord E-Learning",
      nav: {
        overview: "Tableau de Bord",
        users: "Utilisateurs",
        courses: "Cours",
        instructors: "Instructeurs",
        myLearning: "Mon Apprentissage",
        categories: "Catégories",
        subCategories: "Sous-Catégories",
        modules: "Modules",
        lessons: "Leçons",
        assignments: "Devoirs",
        quizes: "Quiz",
        analytics: "Analytiques",
        settings: "Paramètres",
        backToHome: "Retour à l'Accueil",
      },
    },
    ar: {
      title: "لوحة تحكم التعليم الإلكتروني",
      nav: {
        overview: "لوحة التحكم",
        users: "المستخدمون",
        courses: "الدورات",
        instructors: "المدرسون",
        myLearning: "تعلمي",
        subCategories: "الفئات الفرعية",
        modules: "الوحدات",
        lessons: "الدروس",
        assignments: "الواجبات",
        quizes: "الاختبارات",
        categories: "الفئات",
        analytics: "التحليلات",
        settings: "الإعدادات",
        backToHome: "العودة للرئيسية",
      },
    },
  };

  const currentContent = content[language] || content.en;

  const navigation = [
    {
      name: currentContent.nav.overview,
      href: "/learn/dashboard",
      icon: BarChart3,
      current: currentPath === "/learn/dashboard",
    },

    {
      name: currentContent.nav.users,
      href: "/learn/dashboard/users",
      icon: Users,
      current: currentPath === "/learn/dashboard/users",
    },

    {
      name: currentContent.nav.courses,
      href: "/learn/dashboard/courses",
      icon: BookOpen,
      current: currentPath === "/learn/dashboard/courses",
    },

    {
      name: currentContent.nav.myLearning,
      href: "/learn/dashboard/my-learning",
      icon: GraduationCap,
      current: currentPath === "/learn/dashboard/my-learning",
    },
    {
      name: currentContent.nav.categories,
      href: "/learn/dashboard/categories",
      icon: FolderOpen,
      current: currentPath === "/learn/dashboard/categories",
    },
    {
      name: currentContent.nav.subCategories,
      href: "/learn/dashboard/sub-categories",
      icon: FolderOpen,
      current: currentPath === "/learn/dashboard/sub-categories",
    },
    {
      name: currentContent.nav.analytics,
      href: "/learn/dashboard/analytics",
      icon: BarChart3,
      current: currentPath === "/learn/dashboard/analytics",
    },
    {
      name: currentContent.nav.settings,
      href: "/learn/dashboard/settings",
      icon: Settings,
      current: currentPath === "/learn/dashboard/settings",
    },
    {
      name: currentContent.nav.modules,
      href: "/learn/dashboard/modules",
      icon: FolderOpen,
      current: currentPath === "/learn/dashboard/modules",
    },
    {
      name: currentContent.nav.lessons,
      href: "/learn/dashboard/lessons",
      icon: FolderOpen,
      current: currentPath === "/learn/dashboard/lessons",
    },
    {
      name: currentContent.nav.assignments,
      href: "/learn/dashboard/assignments",
      icon: FolderOpen,
      current: currentPath === "/learn/dashboard/assignments",
    },
    {
      name: currentContent.nav.quizes,
      href: "/learn/dashboard/quizes",
      icon: FolderOpen,
      current: currentPath === "/learn/dashboard/quizes",
    },
  ];

  return (
    <div
      className="flex h-screen bg-gray-100"
      style={{ width: "100vw", maxWidth: "100vw" }}
    >
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg  shrink-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-center h-16 px-4 bg-blue-600 text-white">
            <GraduationCap className="w-8 h-8 mr-2" />
            <h4 className="text-lg font-semibold">{currentContent.title}</h4>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    item.current
                      ? "bg-blue-100 text-blue-700 border-l-4 border-blue-700"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </a>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <a
              href="/learn"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
            >
              <Home className="w-5 h-5 mr-3" />
              {currentContent.nav.backToHome}
            </a>
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
              {navigation.find((item) => item.current)?.name ||
                currentContent.nav.overview}
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
