import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useELearningUser } from "src/hooks/useApi";
import { useUser } from "@clerk/clerk-react";
import { UserRole } from "src/types/Users.types";
import { Button } from "@mui/material";

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
    wishlist: "Wishlist",
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
    wishlist: "Liste de Souhaits",
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
    wishlist: "قائمة الرغبات",
  },
};

const Navigation: React.FC<NavigationProps> = ({
  onLanguageChange,
  currentLanguage = "en",
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const location = useLocation();
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Get current logged in user from Clerk
  const { user } = useUser();

  // Fetch user data from backend using Clerk user ID
  const { data: ELearningUser } = useELearningUser(user?.id || "");

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
    if (path.includes("/learn")) return "/learn/dashboard";
    if (path.includes("/shop")) return "/shop/dashboard";
    if (path.includes("/hub")) return "/hub/dashboard";
    if (path.includes("/tech")) return "/tech/dashboard";
    return "/dashboard";
  };

  // Check if user is admin or super admin
  const isAdminUser =
    ELearningUser?.role === UserRole.ADMIN ||
    ELearningUser?.role === UserRole.SUPPER_ADMIN;

  // Default navigation with translations
  const defaultNavigation: NavigationItem[] = [
    { name: t.home, href: "/" },
    { name: t.techProducts, href: "/shop" },
    { name: t.learn, href: "/learn" },
    { name: t.hub, href: "/hub" },
    { name: t.community, href: "/community" },
    { name: t.aboutUs, href: "/about-us" },
    { name: t.contactUs, href: "/contact-us" },
  ];

  // Conditionally add dashboard link for admin users only
  const navigation = isAdminUser
    ? [...defaultNavigation, { name: t.dashboard, href: getDashboardRoute() }]
    : defaultNavigation;

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

  // Close mobile menu on window resize and prevent body scroll when open
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    // Prevent body scroll when mobile menu is open
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        setLanguageDropdownOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <>
      {/* Desktop Navigation (768px - 1023px: Tablet, 1024px+: Desktop) */}
      <div
        className={`hidden md:flex items-center gap-2 lg:gap-4 xl:gap-6 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <nav
          className={`flex items-center gap-1 lg:gap-2 xl:gap-3 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`
                flex items-center justify-center
                px-2 py-2 md:px-2.5 lg:px-3 xl:px-4
                text-xs md:text-sm lg:text-base
                font-medium rounded-lg
                transition-all duration-200
                whitespace-nowrap
                hover:scale-105 active:scale-95
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${
                  isActivePath(item.href)
                    ? "bg-blue-50 text-blue-700 shadow-sm font-semibold"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }
              `}
              dir={isRTL ? "rtl" : "ltr"}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Wishlist Button - Only show on /learn when user is logged in */}
        {user && location.pathname.startsWith("/learn") && (
          <Link
            to="/learn/wishlist"
            className={`
              flex items-center justify-center gap-1.5 md:gap-2
              px-2.5 py-2 md:px-3 lg:px-4
              text-xs md:text-sm lg:text-base
              font-medium rounded-lg
              transition-all duration-200
              whitespace-nowrap
              hover:scale-105 active:scale-95
              shadow-sm border
              focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2
              ${
                isActivePath("/learn/wishlist")
                  ? "bg-pink-50 text-pink-700 border-pink-200 font-semibold"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-pink-50 hover:text-pink-700 hover:border-pink-200"
              }
              ${isRTL ? "flex-row-reverse" : ""}
            `}
            aria-label={t.wishlist}
          >
            <svg
              className="w-4 h-4 md:w-4.5 md:h-4.5 lg:w-5 lg:h-5 shrink-0"
              fill={isActivePath("/learn/wishlist") ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span className="hidden lg:inline">{t.wishlist}</span>
          </Link>
        )}

        {/* Desktop Language Dropdown */}
        <div className="relative shrink-0" ref={languageDropdownRef}>
          <Button
            onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
            className={`
              flex items-center justify-center gap-1.5 md:gap-2
              px-2.5 py-2 md:px-3 lg:px-4
              text-xs md:text-sm lg:text-base
              font-medium rounded-lg
              transition-all duration-200
              shadow-sm border
              hover:scale-105 active:scale-95
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              ${
                languageDropdownOpen
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              }
              ${isRTL ? "flex-row-reverse" : ""}
            `}
            aria-label={t.language}
            aria-expanded={languageDropdownOpen}
            aria-haspopup="true"
          >
            <span className="text-base md:text-lg shrink-0">
              {selectedLanguage.flag}
            </span>
            <span className="hidden xl:inline font-semibold truncate">
              {selectedLanguage.nativeName}
            </span>
            <span className="xl:hidden font-semibold">
              {selectedLanguage.code.toUpperCase()}
            </span>
            <svg
              className={`w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 shrink-0 transition-transform duration-200 ${
                languageDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </Button>

          {/* Language Dropdown Menu */}
          {languageDropdownOpen && (
            <div
              className={`
                absolute ${isRTL ? "left-0" : "right-0"} mt-2
                w-48 md:w-52 lg:w-56
                rounded-lg shadow-xl
                border border-gray-200
                bg-white
                z-50
                overflow-hidden
                animate-fadeIn
              `}
              role="menu"
              aria-orientation="vertical"
            >
              <div className="py-1">
                {languages.map((language) => (
                  <Button
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    role="menuitem"
                    className={`
                      w-full px-3 py-2.5 md:py-3
                      text-xs md:text-sm
                      flex items-center gap-3
                      transition-colors duration-150
                      ${
                        currentLanguage === language.code
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }
                      ${
                        language.code === "ar"
                          ? "flex-row-reverse text-right"
                          : "text-left"
                      }
                    `}
                  >
                    <span className="text-base md:text-lg shrink-0">
                      {language.flag}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {language.nativeName}
                      </div>
                      <div className="text-xs text-gray-500 truncate hidden md:block">
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
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <Button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        sx={{
          display: { xs: 'inline-flex', md: 'none !important' },
          minWidth: 'auto',
          padding: '0.625rem',
          '@media (min-width: 640px)': {
            padding: '0.75rem',
          },
        }}
        aria-label={t.openMenu}
        aria-expanded={mobileMenuOpen}
        aria-controls="mobile-menu"
      >
        <span className="sr-only">{t.openMenu}</span>
        {mobileMenuOpen ? (
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </Button>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop overlay with improved touch handling */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden animate-fadeIn"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Mobile menu panel */}
          <div
            id="mobile-menu"
            ref={mobileMenuRef}
            className={`
              fixed top-16 bottom-0
              ${isRTL ? "right-0 left-auto" : "left-0 right-auto"}
              w-full sm:w-80 md:hidden
              bg-white
              shadow-2xl
              z-50
              overflow-y-auto
              overscroll-contain
              animate-slideIn
            `}
            dir={isRTL ? "rtl" : "ltr"}
            role="dialog"
            aria-modal="true"
            aria-label={t.openMenu}
          >
            <div className="min-h-full flex flex-col">
              {/* Navigation Links */}
              <nav className="px-3 sm:px-4 pt-4 pb-3 space-y-1 flex-1">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`
                      flex items-center
                      px-4 py-3.5
                      text-base font-medium
                      rounded-lg
                      transition-all duration-200
                      active:scale-98
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset
                      ${
                        isActivePath(item.href)
                          ? "bg-blue-50 text-blue-700 shadow-sm font-semibold"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100"
                      }
                    `}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Mobile Wishlist Link */}
                {user && location.pathname.startsWith("/learn") && (
                  <Link
                    to="/learn/wishlist"
                    className={`
                      flex items-center gap-3
                      px-4 py-3.5
                      text-base font-medium
                      rounded-lg
                      transition-all duration-200
                      active:scale-98
                      focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-inset
                      ${
                        isActivePath("/learn/wishlist")
                          ? "bg-pink-50 text-pink-700 shadow-sm font-semibold"
                          : "text-gray-700 hover:bg-pink-50 hover:text-pink-700 active:bg-pink-100"
                      }
                      ${isRTL ? "flex-row-reverse" : ""}
                    `}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg
                      className="w-5 h-5 shrink-0"
                      fill={
                        isActivePath("/learn/wishlist")
                          ? "currentColor"
                          : "none"
                      }
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span>{t.wishlist}</span>
                  </Link>
                )}
              </nav>

              {/* Mobile Language Selector */}
              <div className="px-4 py-4 border-t border-gray-200 bg-gray-50">
                <p
                  className={`
                    text-sm font-semibold text-gray-900 mb-3
                    ${isRTL ? "text-right" : "text-left"}
                  `}
                >
                  {t.language}
                </p>
                <div className="space-y-2">
                  {languages.map((language) => (
                    <Button
                      key={language.code}
                      onClick={() => {
                        handleLanguageChange(language.code);
                        setMobileMenuOpen(false);
                      }}
                      className={`
                        w-full px-4 py-3.5
                        text-sm rounded-lg
                        flex items-center gap-3
                        transition-all duration-200
                        active:scale-98
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset
                        ${
                          currentLanguage === language.code
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-white text-gray-700 hover:bg-gray-100 active:bg-gray-200 border border-gray-200"
                        }
                        ${
                          language.code === "ar"
                            ? "flex-row-reverse text-right"
                            : "text-left"
                        }
                      `}
                      dir={language.code === "ar" ? "rtl" : "ltr"}
                    >
                      <span className="text-xl shrink-0">{language.flag}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">
                          {language.nativeName}
                        </div>
                        <div
                          className={`
                            text-xs truncate
                            ${
                              currentLanguage === language.code
                                ? "text-blue-100"
                                : "text-gray-500"
                            }
                          `}
                        >
                          {language.name}
                        </div>
                      </div>
                      {currentLanguage === language.code && (
                        <svg
                          className="w-5 h-5 shrink-0"
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
                    </Button>
                  ))}
                </div>
              </div>

              {/* Mobile User Info */}
              {user && (
                <div className="px-4 py-4 border-t border-gray-200 bg-white">
                  <div
                    className={`
                      flex items-center gap-3
                      ${isRTL ? "flex-row-reverse" : ""}
                    `}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shrink-0 shadow-md">
                      <span className="text-white text-lg">👤</span>
                    </div>
                    <div
                      className={`
                        flex-1 min-w-0
                        ${isRTL ? "text-right" : "text-left"}
                      `}
                    >
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user.fullName || t.adminUser}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.primaryEmailAddress?.emailAddress ||
                          "admin@chadtechhub.com"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Optimized CSS animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(${isRTL ? "100%" : "-100%"});
            opacity: 0.8;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .active\\:scale-98:active {
          transform: scale(0.98);
        }

        .active\\:scale-95:active {
          transform: scale(0.95);
        }

        /* Smooth scrolling for mobile menu */
        #mobile-menu {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }

        /* Prevent text selection during interactions */
        button {
          -webkit-tap-highlight-color: transparent;
          user-select: none;
        }
      `}</style>
    </>
  );
};

export default Navigation;
