import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

interface NavigationItem {
  name: string;
  href: string;
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

interface NavigationProps {
  navigationItems: NavigationItem[];
  onLanguageChange?: (language: string) => void;
  currentLanguage?: string;
}

// Translation object for all UI text
const translations = {
  en: {
    home: "Home",
    techProducts: "Tech Products",
    learn: "Learn",
    hub: "Hub",
    community: "Community",
    aboutUs: "About Us",
    contactUs: "Contact Us",
    language: "Language",
    openMenu: "Open main menu",
    adminUser: "Admin User",
    dashboard: "Dashboard",
  },
  fr: {
    home: "Accueil",
    techProducts: "Produits Tech",
    learn: "Apprendre",
    hub: "Hub",
    community: "Communauté",
    aboutUs: "À Propos",
    contactUs: "Nous Contacter",
    language: "Langue",
    openMenu: "Ouvrir le menu principal",
    adminUser: "Utilisateur Admin",
    dashboard: "Tableau de Bord",
  },
  ar: {
    home: "الرئيسية",
    techProducts: "المنتجات التقنية",
    learn: "تعلم",
    hub: "المركز",
    community: "المجتمع",
    aboutUs: "من نحن",
    contactUs: "اتصل بنا",
    language: "اللغة",
    openMenu: "افتح القائمة الرئيسية",
    adminUser: "مستخدم مشرف",
    dashboard: "لوحة القيادة",
  },
};

const Navigation: React.FC<NavigationProps> = ({
  navigationItems,
  onLanguageChange,
  currentLanguage = "en",
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const location = useLocation();
  const languageDropdownRef = useRef<HTMLDivElement>(null);

  const languages: Language[] = [
    { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
    { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
    { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  ];

  // Get current translations
  const t =
    translations[currentLanguage as keyof typeof translations] ||
    translations.en;

  // Determine dashboard route based on current location
  const getDashboardRoute = () => {
    const path = location.pathname;
    if (path.startsWith("/learn")) {
      return "/learn/dashboard";
    } else if (path.startsWith("/shop")) {
      return "/shop/dashboard";
    } else if (path.startsWith("/hub")) {
      return "/hub/dashboard";
    } else if (path.startsWith("/tech")) {
      return "/tech/dashboard";
    }
    return "/admin";
  };

  // Default navigation with translations
  const defaultNavigation: NavigationItem[] = [
    { name: t.home, href: "/" },
    { name: t.techProducts, href: "/shop" },
    { name: t.learn, href: "/learn" },
    { name: t.hub, href: "/hub" },
    { name: t.community, href: "/community" },
    { name: t.aboutUs, href: "/about-us" },
    { name: t.contactUs, href: "/contact-us" },
    {
      name: t.dashboard,
      href: getDashboardRoute(),
    },
  ];

  const navigation = navigationItems || defaultNavigation;
  const selectedLanguage =
    languages.find((lang) => lang.code === currentLanguage) || languages[0];

  // Add RTL support for Arabic
  const isRTL = currentLanguage === "ar";

  const isActivePath = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  const handleLanguageChange = (languageCode: string) => {
    if (onLanguageChange) {
      onLanguageChange(languageCode);
    }
    setLanguageDropdownOpen(false);
  };

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node)
      ) {
        setLanguageDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu on window resize (prevents stuck menus)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Desktop & Tablet Navigation (768px+) */}
      <div
        className={`hidden md:flex items-center space-x-3 lg:space-x-6 xl:space-x-8 ${
          isRTL ? "flex-row-reverse space-x-reverse" : ""
        }`}
      >
        <nav
          className={`flex items-center space-x-2 lg:space-x-4 xl:space-x-6 ${
            isRTL ? "flex-row-reverse space-x-reverse" : ""
          }`}
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center px-2 py-2 md:px-3 lg:px-4 text-xs md:text-sm lg:text-base font-medium rounded-md transition-all duration-200 whitespace-nowrap hover:scale-105 ${
                isActivePath(item.href)
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Language Dropdown */}
        <div className="relative shrink-0" ref={languageDropdownRef}>
          <button
            onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
            className={`flex items-center space-x-2 px-3 py-2 md:px-4 lg:px-4 text-xs md:text-sm lg:text-base font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 shadow-sm border ${
              languageDropdownOpen
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
            } ${isRTL ? "flex-row-reverse space-x-reverse" : ""}`}
            aria-label={t.language}
            style={{
              backgroundColor: languageDropdownOpen ? "#eff6ff" : "white",
            }}
          >
            <span className="text-base md:text-lg lg:text-xl">
              {selectedLanguage.flag}
            </span>
            <span className="hidden lg:inline font-semibold">
              {selectedLanguage.nativeName}
            </span>
            <span className="lg:hidden font-semibold">
              {selectedLanguage.code.toUpperCase()}
            </span>
            <svg
              className={`w-3 h-3 md:w-4 md:h-4 transition-transform duration-200 ${
                languageDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {languageDropdownOpen && (
            <div
              className={`absolute ${
                isRTL ? "left-0" : "right-0"
              } mt-2 w-44 md:w-48 lg:w-52 rounded-lg shadow-xl border border-gray-200 z-50 animate-fadeIn overflow-hidden`}
              style={{ backgroundColor: "white" }}
            >
              <div className="py-1" style={{ backgroundColor: "white" }}>
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={`w-full px-3 py-2.5 md:py-3 text-xs md:text-sm flex items-center space-x-3 transition-colors duration-150 ${
                      currentLanguage === language.code
                        ? "text-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    } ${
                      language.code === "ar"
                        ? "flex-row-reverse space-x-reverse text-right"
                        : "text-left"
                    }`}
                    style={{
                      backgroundColor:
                        currentLanguage === language.code
                          ? "#eff6ff"
                          : "transparent",
                    }}
                  >
                    <span className="text-base md:text-lg">
                      {language.flag}
                    </span>
                    <div className="flex-1">
                      <div className="font-medium">{language.nativeName}</div>
                      <div className="text-xs text-gray-500 hidden md:block">
                        {language.name}
                      </div>
                    </div>
                    {currentLanguage === language.code && (
                      <svg
                        className="w-4 h-4 text-blue-600 shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu button (optimized touch target) */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden p-3 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 active:scale-95"
        aria-label={t.openMenu}
        aria-expanded={mobileMenuOpen}
      >
        <span className="sr-only">{t.openMenu}</span>
        {mobileMenuOpen ? (
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Mobile Navigation Menu with smooth transitions */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0   z-30 md:hidden animate-fadeIn"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Mobile menu panel */}
          <div
            className="fixed top-16 left-0 right-0 bottom-0 md:hidden bg-white shadow-2xl z-40 overflow-y-auto animate-slideDown"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <div className="min-h-full flex flex-col">
              {/* Navigation Links */}
              <div className="px-3 pt-4 pb-3 space-y-1 flex-1">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center px-4 py-3.5 text-base font-medium rounded-lg transition-all duration-200 active:scale-98 ${
                      isActivePath(item.href)
                        ? "bg-blue-50 text-blue-700 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Mobile Language Selector */}
              <div className="px-4 py-4 border-t border-gray-200 bg-gray-50">
                <div className="mb-3">
                  <p
                    className={`text-sm font-semibold text-gray-900 mb-3 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t.language}
                  </p>
                  <div className="space-y-2">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => {
                          handleLanguageChange(language.code);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full px-4 py-3.5 text-sm rounded-lg flex items-center space-x-3 transition-all duration-200 active:scale-98 ${
                          currentLanguage === language.code
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-white text-gray-700 hover:bg-gray-100 active:bg-gray-200 border border-gray-200"
                        } ${
                          language.code === "ar"
                            ? "flex-row-reverse space-x-reverse text-right"
                            : "text-left"
                        }`}
                        dir={language.code === "ar" ? "rtl" : "ltr"}
                      >
                        <span className="text-xl">{language.flag}</span>
                        <div className="flex-1">
                          <div className="font-semibold">
                            {language.nativeName}
                          </div>
                          <div
                            className={`text-xs ${
                              currentLanguage === language.code
                                ? "text-blue-100"
                                : "text-gray-500"
                            }`}
                          >
                            {language.name}
                          </div>
                        </div>
                        {currentLanguage === language.code && (
                          <svg
                            className="w-5 h-5  shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile User Info */}
              <div className="px-4 py-4 border-t border-gray-200 bg-white">
                <div
                  className={`flex items-center space-x-3 ${
                    isRTL ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  <div className="w-10 h-10 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shrink-0 shadow-md">
                    <span className="text-white text-lg">👤</span>
                  </div>
                  <div
                    className={`flex-1 min-w-0 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {t.adminUser}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      admin@chadtechhub.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            transform: translateY(-10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .active\\:scale-98:active {
          transform: scale(0.98);
        }
      `}</style>
    </>
  );
};

export default Navigation;
