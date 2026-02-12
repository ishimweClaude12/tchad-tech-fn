import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPortal } from "react-dom";
import { useELearningUser } from "src/hooks/useApi";
import { useUser } from "@clerk/clerk-react";
import { UserRole } from "src/types/Users.types";
import { Button } from "@mui/material";
import type { NavigationItem, NavigationProps } from "src/types/App.types";
import {
  languages,
  NavigationTranslations,
} from "src/utils/constants/app/navigation.translations";

// Translation object for all UI text

const Navigation: React.FC<NavigationProps> = ({
  onLanguageChange,
  currentLanguage = "en",
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    right: 0,
  });
  const location = useLocation();
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const languageButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Get current logged in user from Clerk
  const { user } = useUser();

  // Fetch user data from backend using Clerk user ID
  const { data: ELearningUser } = useELearningUser(user?.id || "");

  // Get current translations
  const t =
    NavigationTranslations[
      currentLanguage as keyof typeof NavigationTranslations
    ] || NavigationTranslations.en;

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
    ELearningUser?.role === UserRole.SUPPER_ADMIN || ELearningUser?.role === UserRole.INSTRUCTOR;

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

  // Update dropdown position when it opens
  useEffect(() => {
    if (languageDropdownOpen && languageButtonRef.current) {
      const rect = languageButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: isRTL ? rect.left + window.scrollX : ("auto" as any),
        right: isRTL
          ? ("auto" as any)
          : window.innerWidth - rect.right - window.scrollX,
      });
    }
  }, [languageDropdownOpen, isRTL]);

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
      {/* Desktop Navigation */}
      <div
        className={`hidden md:flex items-center gap-1 max-w-screen lg:gap-2 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <nav
          className={`flex items-center gap-0.5 lg:gap-1 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`
                flex items-center justify-center
                px-1.5 py-1.5 lg:px-2
                text-xs lg:text-sm
                font-medium rounded-md
                transition-all duration-150
                whitespace-nowrap
                hover:scale-[1.02] active:scale-95
                focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1
                ${
                  isActivePath(item.href)
                    ? "bg-blue-50 text-blue-600 font-semibold border border-blue-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
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
              flex items-center justify-center gap-1
              px-2 py-1.5
              text-xs lg:text-sm
              font-medium rounded-md
              transition-all duration-150
              whitespace-nowrap
              hover:scale-[1.02] active:scale-95
              border
              focus:outline-none focus:ring-1 focus:ring-pink-500 focus:ring-offset-1
              ${
                isActivePath("/learn/wishlist")
                  ? "bg-pink-50 text-pink-600 border-pink-100 font-semibold"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-100"
              }
              ${isRTL ? "flex-row-reverse" : ""}
              ml-0.5
            `}
            aria-label={t.wishlist}
          >
            <svg
              className="w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0"
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

        {/* Desktop Language Dropdown - Fixed to always show */}
        <div className="relative shrink-0 ml-0.5" ref={languageDropdownRef}>
          <Button
            ref={languageButtonRef}
            onClick={() => {
              console.log(
                "Language button clicked, current state:",
                languageDropdownOpen,
              );
              setLanguageDropdownOpen(!languageDropdownOpen);
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.25rem",
              px: "0.5rem",
              py: "0.375rem",
              fontSize: { xs: "0.75rem", lg: "0.875rem" },
              fontWeight: 500,
              borderRadius: "0.375rem",
              transition: "all 0.15s",
              whiteSpace: "nowrap",
              border: "1px solid",
              textTransform: "none",
              minWidth: "60px",
              backgroundColor: languageDropdownOpen ? "#EFF6FF" : "#FFFFFF",
              color: languageDropdownOpen ? "#2563EB" : "#4B5563",
              borderColor: languageDropdownOpen ? "#BFDBFE" : "#E5E7EB",
              flexDirection: isRTL ? "row-reverse" : "row",
              "&:hover": {
                transform: "scale(1.02)",
                backgroundColor: "#F9FAFB",
              },
              "&:active": {
                transform: "scale(0.95)",
              },
              "&:focus": {
                outline: "none",
                boxShadow: "0 0 0 1px rgb(59 130 246)",
              },
            }}
            aria-label={t.language}
            aria-expanded={languageDropdownOpen}
            aria-haspopup="true"
          >
            <span className="text-base shrink-0">{selectedLanguage.flag}</span>
            <span className="font-medium truncate hidden lg:inline">
              {selectedLanguage.code.toUpperCase()}
            </span>
            <svg
              className={`w-3 h-3 lg:w-3.5 lg:h-3.5 shrink-0 transition-transform duration-150 ${
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

          {/* Language Dropdown Menu - Using Portal for proper rendering */}
          {languageDropdownOpen &&
            createPortal(
              <div
                className="w-40 rounded-lg shadow-xl border border-gray-200 bg-white overflow-hidden animate-fadeIn"
                style={{
                  position: "fixed",
                  top: `${dropdownPosition.top}px`,
                  [isRTL ? "left" : "right"]: isRTL
                    ? `${dropdownPosition.left}px`
                    : `${dropdownPosition.right}px`,
                  zIndex: 9999,
                }}
                role="menu"
                aria-orientation="vertical"
              >
                <div className="py-1">
                  {languages.map((language) => (
                    <Button
                      key={language.code}
                      onClick={() => handleLanguageChange(language.code)}
                      role="menuitem"
                      sx={{
                        width: "100%",
                        px: "0.75rem",
                        py: "0.5rem",
                        fontSize: "0.875rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        transition: "colors 0.1s",
                        textTransform: "none",
                        justifyContent: "flex-start",
                        borderRadius: 0,
                        backgroundColor:
                          currentLanguage === language.code
                            ? "#EFF6FF"
                            : "transparent",
                        color:
                          currentLanguage === language.code
                            ? "#2563EB"
                            : "#374151",
                        flexDirection: isRTL ? "row-reverse" : "row",
                        textAlign: isRTL ? "right" : "left",
                        "&:hover": {
                          backgroundColor:
                            currentLanguage === language.code
                              ? "#EFF6FF"
                              : "#F9FAFB",
                        },
                      }}
                      dir={language.code === "ar" ? "rtl" : "ltr"}
                    >
                      <span className="text-base shrink-0">
                        {language.flag}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {language.nativeName}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {language.name}
                        </div>
                      </div>
                      {currentLanguage === language.code && (
                        <svg
                          className="w-3.5 h-3.5 text-blue-500 shrink-0"
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
              </div>,
              document.body,
            )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <Button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        sx={{
          display: { xs: "inline-flex", md: "none" },
          alignItems: "center",
          justifyContent: "center",
          p: "0.5rem",
          borderRadius: "0.375rem",
          color: "#4B5563",
          minWidth: "auto",
          "&:hover": {
            color: "#111827",
            backgroundColor: "#F3F4F6",
          },
          "&:focus": {
            outline: "none",
            boxShadow: "0 0 0 1px rgb(59 130 246)",
          },
        }}
        aria-label={t.openMenu}
        aria-expanded={mobileMenuOpen}
        aria-controls="mobile-menu"
      >
        <span className="sr-only">{t.openMenu}</span>
        {mobileMenuOpen ? (
          <svg
            className="w-5 h-5"
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
            className="w-5 h-5"
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
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden animate-fadeIn"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Mobile menu panel */}
          <div
            id="mobile-menu"
            ref={mobileMenuRef}
            className={`
              fixed top-14 bottom-0
              ${isRTL ? "right-0 left-auto" : "left-0 right-auto"}
              w-full max-w-xs md:hidden
              bg-white
              shadow-xl
              z-50
              overflow-y-auto
              animate-slideIn
            `}
            dir={isRTL ? "rtl" : "ltr"}
            role="dialog"
            aria-modal="true"
            aria-label={t.openMenu}
          >
            <div className="min-h-full flex flex-col">
              {/* Navigation Links - Compact */}
              <nav className="px-2 pt-3 pb-2 space-y-0.5 flex-1">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`
                      flex items-center
                      px-3 py-2.5
                      text-sm font-medium
                      rounded-md
                      transition-all duration-150
                      active:scale-98
                      focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-inset
                      ${
                        isActivePath(item.href)
                          ? "bg-blue-50 text-blue-600 font-semibold"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
                      flex items-center gap-2
                      px-3 py-2.5
                      text-sm font-medium
                      rounded-md
                      transition-all duration-150
                      active:scale-98
                      focus:outline-none focus:ring-1 focus:ring-pink-500 focus:ring-inset
                      ${
                        isActivePath("/learn/wishlist")
                          ? "bg-pink-50 text-pink-600 font-semibold"
                          : "text-gray-600 hover:bg-pink-50 hover:text-pink-600"
                      }
                      ${isRTL ? "flex-row-reverse" : ""}
                    `}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg
                      className="w-4 h-4 shrink-0"
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
              <div className="px-3 py-3 border-t border-gray-100 bg-gray-50">
                <p
                  className={`
                    text-xs font-semibold text-gray-700 mb-2
                    ${isRTL ? "text-right" : "text-left"}
                  `}
                >
                  {t.language}
                </p>
                <div className="space-y-1 z-50">
                  {languages.map((language) => (
                    <Button
                      key={language.code}
                      onClick={() => {
                        handleLanguageChange(language.code);
                        setMobileMenuOpen(false);
                      }}
                      sx={{
                        width: "100%",
                        px: "0.75rem",
                        py: "0.5rem",
                        fontSize: "0.875rem",
                        borderRadius: "0.375rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        transition: "all 0.15s",
                        textTransform: "none",
                        justifyContent: "flex-start",
                        backgroundColor:
                          currentLanguage === language.code
                            ? "#DBEAFE"
                            : "transparent",
                        color:
                          currentLanguage === language.code
                            ? "#1D4ED8"
                            : "#4B5563",
                        fontWeight:
                          currentLanguage === language.code ? 500 : 400,
                        flexDirection: isRTL ? "row-reverse" : "row",
                        textAlign: isRTL ? "right" : "left",
                        "&:hover": {
                          backgroundColor:
                            currentLanguage === language.code
                              ? "#DBEAFE"
                              : "#F3F4F6",
                        },
                      }}
                      dir={language.code === "ar" ? "rtl" : "ltr"}
                    >
                      <span className="text-lg shrink-0">{language.flag}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {language.nativeName}
                        </div>
                        <div
                          className={`
                            text-xs truncate
                            ${
                              currentLanguage === language.code
                                ? "text-blue-600"
                                : "text-gray-500"
                            }
                          `}
                        >
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

              {/* Mobile User Info */}
              {user && (
                <div className="px-3 py-3 border-t border-gray-100 bg-white">
                  <div
                    className={`
                      flex items-center gap-2
                      ${isRTL ? "flex-row-reverse" : ""}
                    `}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-white text-sm">👤</span>
                    </div>
                    <div
                      className={`
                        flex-1 min-w-0
                        ${isRTL ? "text-right" : "text-left"}
                      `}
                    >
                      <p className="text-sm font-medium text-gray-900 truncate">
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
          animation: fadeIn 0.15s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
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
