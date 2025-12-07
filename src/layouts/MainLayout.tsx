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

  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Tech Products", href: "/shop" },
    { name: "Learn", href: "/learn" },
    { name: "Hub", href: "/hub" },
    { name: "Community", href: "/community" },
    { name: "About Us", href: "/about-us" },
    { name: "Contact Us", href: "/contact-us" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  // Check if current path contains 'dashboard'
  const isDashboardRoute = location.pathname.includes("/dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation - Hidden on dashboard routes */}
      {!isDashboardRoute && (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="  mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}

              <div className="flex items-center">
                <img className="h-8" src={logo} alt="Chad Tech Hub Logo" />
              </div>

              {/* Navigation Component */}
              <Navigation
                // navigationItems={navigationItems}
                currentLanguage={language}
                onLanguageChange={(lang: string) =>
                  setLanguage(lang as "en" | "fr" | "ar")
                }
              />

              {/* Right side items */}
              {/* Auth Section */}
              <div className="flex items-center space-x-4">
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button variant="contained">Sign In</Button>
                  </SignInButton>
                </SignedOut>
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
      )}

      {/* Page content */}
      <main>
        <Outlet />
      </main>

      {/* Page Footer - Hidden on dashboard routes */}
      {!isDashboardRoute && <Footer />}

      {/* WhatsApp Floating Button - Hidden on dashboard routes */}
      {!isDashboardRoute && <WhatsAppFloatingButton />}
    </div>
  );
};

export default MainLayout;
