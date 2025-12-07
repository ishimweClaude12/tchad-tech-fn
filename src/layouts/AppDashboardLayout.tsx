import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { SignedIn, UserButton, useUser } from "@clerk/clerk-react";
import { useLanguage } from "../contexts/LanguageContext";

interface SubItem {
  id: string;
  label: {
    en: string;
    fr: string;
    ar: string;
  };
  path: string;
  icon: string;
  roles?: string[];
}

interface SidebarItem {
  id: string;
  label: {
    en: string;
    fr: string;
    ar: string;
  };
  path: string;
  icon: string;
  roles?: string[];
  subItems?: SubItem[];
  isExpandable?: boolean;
}

const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // TODO: Get user role from Clerk metadata
  // Get user role from Clerk metadata
  //   const getUserRole = (): string => {
  //     return user?.publicMetadata?.role || "client";
  //   };

  //   const userRole = getUserRole();

  // Toggle expansion of sidebar items
  const toggleExpansion = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Sidebar navigation items with sub-items
  const sidebarItems: SidebarItem[] = [
    {
      id: "overview",
      label: {
        en: "Overview",
        fr: "Aperçu",
        ar: "نظرة عامة",
      },
      path: "/admin",
      icon: "📊",
      roles: ["admin", "moderator"],
    },
    {
      id: "users",
      label: {
        en: "Users",
        fr: "Utilisateurs",
        ar: "المستخدمين",
      },
      path: "/admin/users",
      icon: "👥",
      roles: ["admin"],
      isExpandable: true,
      subItems: [
        {
          id: "all-users",
          label: {
            en: "All Users",
            fr: "Tous les utilisateurs",
            ar: "جميع المستخدمين",
          },
          path: "/admin/users",
          icon: "👤",
          roles: ["admin"],
        },
        {
          id: "user-roles",
          label: {
            en: "User Roles",
            fr: "Rôles des utilisateurs",
            ar: "أدوار المستخدمين",
          },
          path: "/admin/users/roles",
          icon: "🔐",
          roles: ["admin"],
        },
        {
          id: "user-permissions",
          label: {
            en: "Permissions",
            fr: "Autorisations",
            ar: "الأذونات",
          },
          path: "/admin/users/permissions",
          icon: "🛡️",
          roles: ["admin"],
        },
        {
          id: "user-activity",
          label: {
            en: "Activity Logs",
            fr: "Journaux d'activité",
            ar: "سجلات النشاط",
          },
          path: "/admin/users/activity",
          icon: "📋",
          roles: ["admin"],
        },
      ],
    },
    {
      id: "ecommerce",
      label: {
        en: "E-commerce",
        fr: "E-commerce",
        ar: "التجارة الإلكترونية",
      },
      path: "/admin/ecommerce",
      icon: "🛍️",
      roles: ["admin", "moderator"],
      isExpandable: true,
      subItems: [
        {
          id: "ecommerce-overview",
          label: {
            en: "Overview",
            fr: "Aperçu",
            ar: "نظرة عامة",
          },
          path: "/admin/ecommerce",
          icon: "📊",
          roles: ["admin", "moderator"],
        },
        {
          id: "ecommerce-users",
          label: {
            en: "Customers",
            fr: "Clients",
            ar: "العملاء",
          },
          path: "/admin/ecommerce/users",
          icon: "👥",
          roles: ["admin", "moderator"],
        },
        {
          id: "products",
          label: {
            en: "Products",
            fr: "Produits",
            ar: "المنتجات",
          },
          path: "/admin/ecommerce/products",
          icon: "📦",
          roles: ["admin", "moderator"],
        },
        {
          id: "orders",
          label: {
            en: "Orders",
            fr: "Commandes",
            ar: "الطلبات",
          },
          path: "/admin/ecommerce/orders",
          icon: "🛒",
          roles: ["admin", "moderator"],
        },
        {
          id: "inventory",
          label: {
            en: "Inventory",
            fr: "Inventaire",
            ar: "المخزون",
          },
          path: "/admin/ecommerce/inventory",
          icon: "📋",
          roles: ["admin", "moderator"],
        },
        {
          id: "business-agents",
          label: {
            en: "Business Agents",
            fr: "Agents commerciaux",
            ar: "الوكلاء التجاريين",
          },
          path: "/admin/ecommerce/agents",
          icon: "🤝",
          roles: ["admin", "moderator"],
        },
        {
          id: "payments",
          label: {
            en: "Payments",
            fr: "Paiements",
            ar: "المدفوعات",
          },
          path: "/admin/ecommerce/payments",
          icon: "💳",
          roles: ["admin"],
        },
      ],
    },
    {
      id: "elearning",
      label: {
        en: "E-learning",
        fr: "E-learning",
        ar: "التعلم الإلكتروني",
      },
      path: "/admin/elearning",
      icon: "🎓",
      roles: ["admin", "moderator"],
      isExpandable: true,
      subItems: [
        {
          id: "elearning-overview",
          label: {
            en: "Overview",
            fr: "Aperçu",
            ar: "نظرة عامة",
          },
          path: "/admin/elearning",
          icon: "📊",
          roles: ["admin", "moderator"],
        },
        {
          id: "elearning-users",
          label: {
            en: "Students",
            fr: "Étudiants",
            ar: "الطلاب",
          },
          path: "/admin/elearning/users",
          icon: "👨‍🎓",
          roles: ["admin", "moderator"],
        },
        {
          id: "courses",
          label: {
            en: "Courses",
            fr: "Cours",
            ar: "الدورات",
          },
          path: "/admin/elearning/courses",
          icon: "📚",
          roles: ["admin", "moderator"],
        },
        {
          id: "instructors",
          label: {
            en: "Instructors",
            fr: "Instructeurs",
            ar: "المدربين",
          },
          path: "/admin/elearning/instructors",
          icon: "👨‍🏫",
          roles: ["admin", "moderator"],
        },
        {
          id: "enrollments",
          label: {
            en: "Enrollments",
            fr: "Inscriptions",
            ar: "التسجيلات",
          },
          path: "/admin/elearning/enrollments",
          icon: "📝",
          roles: ["admin", "moderator"],
        },
        {
          id: "certifications",
          label: {
            en: "Certifications",
            fr: "Certifications",
            ar: "الشهادات",
          },
          path: "/admin/elearning/certifications",
          icon: "🏆",
          roles: ["admin", "moderator"],
        },
        {
          id: "progress-tracking",
          label: {
            en: "Progress Tracking",
            fr: "Suivi des progrès",
            ar: "تتبع التقدم",
          },
          path: "/admin/elearning/progress",
          icon: "📈",
          roles: ["admin", "moderator"],
        },
        {
          id: "course-categories",
          label: {
            en: "Course Categories",
            fr: "Catégories de cours",
            ar: "فئات الدورات",
          },
          path: "/admin/elearning/course-categories",
          icon: "📂",
          roles: ["admin", "moderator"],
        },
        {
          id: "course-sub-categories",
          label: {
            en: "Course Sub-categories",
            fr: "Sous-catégories de cours",
            ar: "الفئات الفرعية للدورات",
          },
          path: "/admin/elearning/course-sub-categories",
          icon: "📁",
          roles: ["admin", "moderator"],
        },
      ],
    },
    {
      id: "hub",
      label: {
        en: "Hub Management",
        fr: "Gestion Hub",
        ar: "إدارة المركز",
      },
      path: "/admin/hub",
      icon: "🏢",
      roles: ["admin", "moderator"],
      isExpandable: true,
      subItems: [
        {
          id: "hub-overview",
          label: {
            en: "Overview",
            fr: "Aperçu",
            ar: "نظرة عامة",
          },
          path: "/admin/hub",
          icon: "📊",
          roles: ["admin", "moderator"],
        },
        {
          id: "hub-users",
          label: {
            en: "Members",
            fr: "Membres",
            ar: "الأعضاء",
          },
          path: "/admin/hub/users",
          icon: "👥",
          roles: ["admin", "moderator"],
        },
        {
          id: "spaces",
          label: {
            en: "Spaces",
            fr: "Espaces",
            ar: "المساحات",
          },
          path: "/admin/hub/spaces",
          icon: "🏢",
          roles: ["admin", "moderator"],
        },
        {
          id: "bookings",
          label: {
            en: "Bookings",
            fr: "Réservations",
            ar: "الحجوزات",
          },
          path: "/admin/hub/bookings",
          icon: "📅",
          roles: ["admin", "moderator"],
        },
        {
          id: "projects",
          label: {
            en: "Projects",
            fr: "Projets",
            ar: "المشاريع",
          },
          path: "/admin/hub/projects",
          icon: "📋",
          roles: ["admin", "moderator"],
        },
        {
          id: "innovators",
          label: {
            en: "Innovators",
            fr: "Innovateurs",
            ar: "المبتكرين",
          },
          path: "/admin/hub/innovators",
          icon: "💡",
          roles: ["admin", "moderator"],
        },
        {
          id: "investors",
          label: {
            en: "Investors",
            fr: "Investisseurs",
            ar: "المستثمرين",
          },
          path: "/admin/hub/investors",
          icon: "💰",
          roles: ["admin", "moderator"],
        },
        {
          id: "service-providers",
          label: {
            en: "Service Providers",
            fr: "Fournisseurs de services",
            ar: "مقدمي الخدمات",
          },
          path: "/admin/hub/providers",
          icon: "🔧",
          roles: ["admin", "moderator"],
        },
      ],
    },
    {
      id: "analytics",
      label: {
        en: "Analytics",
        fr: "Analytiques",
        ar: "التحليلات",
      },
      path: "/admin/analytics",
      icon: "📈",
      roles: ["admin"],
      isExpandable: true,
      subItems: [
        {
          id: "analytics-overview",
          label: {
            en: "Overview",
            fr: "Aperçu",
            ar: "نظرة عامة",
          },
          path: "/admin/analytics",
          icon: "📊",
          roles: ["admin"],
        },
        {
          id: "user-analytics",
          label: {
            en: "User Analytics",
            fr: "Analytiques utilisateur",
            ar: "تحليلات المستخدمين",
          },
          path: "/admin/analytics/users",
          icon: "👥",
          roles: ["admin"],
        },
        {
          id: "revenue-analytics",
          label: {
            en: "Revenue",
            fr: "Revenus",
            ar: "الإيرادات",
          },
          path: "/admin/analytics/revenue",
          icon: "💰",
          roles: ["admin"],
        },
        {
          id: "performance-metrics",
          label: {
            en: "Performance",
            fr: "Performance",
            ar: "الأداء",
          },
          path: "/admin/analytics/performance",
          icon: "⚡",
          roles: ["admin"],
        },
        {
          id: "reports",
          label: {
            en: "Reports",
            fr: "Rapports",
            ar: "التقارير",
          },
          path: "/admin/analytics/reports",
          icon: "📋",
          roles: ["admin"],
        },
      ],
    },
    {
      id: "settings",
      label: {
        en: "Settings",
        fr: "Paramètres",
        ar: "الإعدادات",
      },
      path: "/admin/settings",
      icon: "⚙️",
      roles: ["admin"],
      isExpandable: true,
      subItems: [
        {
          id: "general-settings",
          label: {
            en: "General",
            fr: "Général",
            ar: "عام",
          },
          path: "/admin/settings",
          icon: "⚙️",
          roles: ["admin"],
        },
        {
          id: "system-config",
          label: {
            en: "System Config",
            fr: "Configuration système",
            ar: "تكوين النظام",
          },
          path: "/admin/settings/system",
          icon: "🔧",
          roles: ["admin"],
        },
        {
          id: "security-settings",
          label: {
            en: "Security",
            fr: "Sécurité",
            ar: "الأمان",
          },
          path: "/admin/settings/security",
          icon: "🔒",
          roles: ["admin"],
        },
        {
          id: "integrations",
          label: {
            en: "Integrations",
            fr: "Intégrations",
            ar: "التكاملات",
          },
          path: "/admin/settings/integrations",
          icon: "🔗",
          roles: ["admin"],
        },
        {
          id: "backup-restore",
          label: {
            en: "Backup & Restore",
            fr: "Sauvegarde et restauration",
            ar: "النسخ الاحتياطي والاستعادة",
          },
          path: "/admin/settings/backup",
          icon: "💾",
          roles: ["admin"],
        },
      ],
    },
  ];

  // TODO: Implement role-based filtering logic here
  const filteredSidebarItems = sidebarItems;

  const isCurrentPath = (path: string): boolean => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  const isParentActive = (item: SidebarItem): boolean => {
    if (isCurrentPath(item.path)) return true;
    if (item.subItems) {
      return item.subItems.some((subItem) => isCurrentPath(subItem.path));
    }
    return false;
  };

  const handleBackToMain = () => {
    navigate("/");
  };

  // Auto-expand parent items if a sub-item is active
  React.useEffect(() => {
    const activeParents = sidebarItems
      .filter((item) => item.isExpandable && isParentActive(item))
      .map((item) => item.id);

    setExpandedItems((prev) => {
      const newExpanded = [...new Set([...prev, ...activeParents])];
      return newExpanded;
    });
  }, [location.pathname]);

  const renderSidebarItem = (item: SidebarItem) => {
    const isExpanded = expandedItems.includes(item.id);
    const isActive = isCurrentPath(item.path);
    const hasActiveChild = item.subItems?.some((subItem) =>
      isCurrentPath(subItem.path)
    );

    return (
      <li key={item.id}>
        <div className="flex items-center">
          <Link
            to={item.path}
            className={`flex-1 flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              isActive || hasActiveChild
                ? "bg-blue-50 text-blue-700"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="flex-1">
              {item.label[language as keyof typeof item.label]}
            </span>
          </Link>

          {item.isExpandable && (
            <button
              onClick={() => toggleExpansion(item.id)}
              className={`p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors ${
                isExpanded ? "rotate-90" : ""
              }`}
            >
              <span className="text-sm transform transition-transform duration-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="24"
                  viewBox="0 0 12 24"
                >
                  <path
                    fill="currentColor"
                    fill-rule="evenodd"
                    d="M10.157 12.711L4.5 18.368l-1.414-1.414l4.95-4.95l-4.95-4.95L4.5 5.64l5.657 5.657a1 1 0 0 1 0 1.414"
                  />
                </svg>
              </span>
            </button>
          )}
        </div>

        {/* Sub-items */}
        {item.isExpandable && item.subItems && (
          <div
            className={`mt-1 ml-4 pl-4 border-l-2 border-gray-200 transition-all duration-300 ${
              isExpanded
                ? "max-h-96 opacity-100"
                : "max-h-0 opacity-0 overflow-hidden"
            }`}
          >
            <ul className="space-y-1 py-2">
              {item.subItems.map((subItem) => (
                <li key={subItem.id}>
                  <Link
                    to={subItem.path}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors ${
                      isCurrentPath(subItem.path)
                        ? "bg-blue-100 text-blue-800 font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                    }`}
                  >
                    <span className="text-sm">{subItem.icon}</span>
                    <span>
                      {subItem.label[language as keyof typeof subItem.label]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </li>
    );
  };

  return (
    <div
      className="h-screen bg-gray-100 flex overflow-hidden"
      style={{ width: "100vw", maxWidth: "100vw" }}
    >
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}
      >
        {/* Sidebar Header - Fixed */}
        <div className=" shrink-0 flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <img
              className="h-8"
              src={"assets/images/logo.png"}
              alt="Chad Tech Hub Logo"
            />
            <span className="text-lg font-semibold text-gray-900">
              {language === "en" && "Admin Panel"}
              {language === "fr" && "Panneau Admin"}
              {language === "ar" && "لوحة الإدارة"}
            </span>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            <span className="text-xl">✕</span>
          </button>
        </div>

        {/* Navigation Menu - Scrollable */}
        <nav className="flex-1 px-4 py-4 overflow-y-auto">
          <ul className="space-y-2">
            {filteredSidebarItems.map(renderSidebarItem)}
          </ul>
        </nav>

        {/* Back to Main Site - Fixed at bottom */}
        <div className=" shrink-0 p-4 border-t border-gray-200">
          <button
            onClick={handleBackToMain}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            <span>←</span>
            <span>
              {language === "en" && "Back to Main Site"}
              {language === "fr" && "Retour au site principal"}
              {language === "ar" && "العودة للموقع الرئيسي"}
            </span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Top Header - Fixed */}
        <header className="shrink-0 bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <span className="text-xl">☰</span>
            </button>

            {/* Mobile logo */}
            <div className="flex items-center">
              <img
                className="h-8"
                src={"assets/images/logo.png"}
                alt="Chad Tech Hub Logo"
              />
            </div>

            {/* User button */}
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                    userButtonPopoverCard: "shadow-lg",
                  },
                }}
                showName={false}
                userProfileMode="modal"
              />
            </SignedIn>
          </div>
        </header>

        {/* Desktop Header - Fixed */}
        <header className="shrink-0 hidden lg:block bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            {/* Page Title */}
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {location.pathname === "/admin" && (
                  <>
                    {language === "en" && "Dashboard Overview"}
                    {language === "fr" && "Aperçu du tableau de bord"}
                    {language === "ar" && "نظرة عامة على لوحة القيادة"}
                  </>
                )}
                {location.pathname.includes("/users") && (
                  <>
                    {language === "en" && "User Management"}
                    {language === "fr" && "Gestion des utilisateurs"}
                    {language === "ar" && "إدارة المستخدمين"}
                  </>
                )}
                {location.pathname.includes("/ecommerce") && (
                  <>
                    {language === "en" && "E-commerce Management"}
                    {language === "fr" && "Gestion E-commerce"}
                    {language === "ar" && "إدارة التجارة الإلكترونية"}
                  </>
                )}
                {location.pathname.includes("/elearning") && (
                  <>
                    {language === "en" && "E-learning Management"}
                    {language === "fr" && "Gestion E-learning"}
                    {language === "ar" && "إدارة التعلم الإلكتروني"}
                  </>
                )}
                {location.pathname.includes("/hub") && (
                  <>
                    {language === "en" && "Hub Management"}
                    {language === "fr" && "Gestion Hub"}
                    {language === "ar" && "إدارة المركز"}
                  </>
                )}
                {location.pathname.includes("/analytics") && (
                  <>
                    {language === "en" && "Analytics"}
                    {language === "fr" && "Analytiques"}
                    {language === "ar" && "التحليلات"}
                  </>
                )}
                {location.pathname.includes("/settings") && (
                  <>
                    {language === "en" && "Settings"}
                    {language === "fr" && "Paramètres"}
                    {language === "ar" && "الإعدادات"}
                  </>
                )}
              </h1>
            </div>

            {/* Right side items */}
            <div className="flex items-center space-x-4">
              {/* User info and actions */}
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  {language === "en" &&
                    `Welcome, ${user?.firstName || "Admin"}`}
                  {language === "fr" &&
                    `Bienvenue, ${user?.firstName || "Admin"}`}
                  {language === "ar" && `مرحباً، ${user?.firstName || "مدير"}`}
                </span>
                <SignedIn>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8",
                        userButtonPopoverCard: "shadow-lg",
                      },
                    }}
                    showName={false}
                    userProfileMode="modal"
                  />
                </SignedIn>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          <Outlet />
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
