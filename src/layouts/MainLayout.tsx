import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navigation from "./Navigation";
import {
  SignedOut,
  SignInButton,
  SignedIn,
  UserButton,
} from "@clerk/clerk-react";
import Footer from "./Footer";
import { useLanguage } from "../contexts/LanguageContext";
import WhatsAppFloatingButton from "../components/WhatsAppFloatingButton";
import logo from "../assets/images/logo.png";
import Button from "@mui/material/Button";

const MainLayout: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();

  // Check if current path contains 'dashboard'
  const isDashboardRoute = location.pathname.includes("/dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation - Hidden on dashboard routes */}
      {!isDashboardRoute && (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8">
            <div className="flex items-center justify-between gap-2 sm:gap-3 lg:gap-4 h-16">
              {/* Logo */}
              <div className="flex items-center shrink-0">
                <img
                  className="h-6 sm:h-7 md:h-8 w-auto"
                  src={logo}
                  alt="Chad Tech Hub Logo"
                />
              </div>

              {/* Navigation Component - Hidden on mobile */}
              <div className="flex-1 flex justify-center overflow-x-auto scrollbar-hide">
                <Navigation
                  currentLanguage={language}
                  onLanguageChange={(lang: string) =>
                    setLanguage(lang as "en" | "fr" | "ar")
                  }
                />
              </div>

              {/* Auth Section */}
              <div className="flex items-center gap-2 sm:gap-3 flex-0">
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button
                      variant="contained"
                      size="small"
                      className="text-xs! sm:text-sm! px-3! sm:px-4! py-1.5! sm:py-2!"
                    >
                      <span className="hidden sm:inline">Sign In</span>
                      <span className="sm:hidden">Sign In</span>
                    </Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-7 h-7 sm:w-8 sm:h-8",
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
      )}

      {/* Page content */}
      <main className="w-full min-w-screen max-w-screen box-border">
        <Outlet />
      </main>

      {/* Page Footer - Hidden on dashboard routes */}
      {!isDashboardRoute && <Footer />}

      {/* WhatsApp Floating Button - Hidden on dashboard routes */}
      {!isDashboardRoute && <WhatsAppFloatingButton />}

      {/* Scrollbar hide styles */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default MainLayout;
