import React, { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { Button, IconButton, Chip, Box } from "@mui/material";
import {
  Close,
  Campaign,
  CalendarToday,
  NavigateNext,
  NavigateBefore,
} from "@mui/icons-material";
import { useGlobalAnnouncements } from "src/hooks/learn/useAnnouncementsApi";

// Types
interface HeroTranslations {
  en: {
    tagline: string;
    headline: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats: {
      students: string;
      courses: string;
      instructors: string;
      satisfaction: string;
    };
    imageAlt: string;
  };
  fr: {
    tagline: string;
    headline: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats: {
      students: string;
      courses: string;
      instructors: string;
      satisfaction: string;
    };
    imageAlt: string;
  };
  ar: {
    tagline: string;
    headline: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats: {
      students: string;
      courses: string;
      instructors: string;
      satisfaction: string;
    };
    imageAlt: string;
  };
}

interface HeroProps {
  onExploreClick?: () => void;
  onViewCoursesClick?: () => void;
  heroImageSrc?: string; // Allow custom image path
}

// Translations
const translations: HeroTranslations = {
  en: {
    tagline: "Transform Your Future",
    headline: "Master New Skills with Expert-Led Courses",
    subheadline:
      "Join thousands of learners advancing their careers through industry-relevant courses, hands-on projects, and globally recognized certifications.",
    ctaPrimary: "Explore Courses",
    ctaSecondary: "View Learning Paths",
    stats: {
      students: "500+ Active Students",
      courses: "50+ Courses",
      instructors: "100+ Expert Instructors",
      satisfaction: "95% Satisfaction Rate",
    },
    imageAlt: "Students learning online with expert instructors",
  },
  fr: {
    tagline: "Transformez Votre Avenir",
    headline: "Maîtrisez de Nouvelles Compétences avec des Cours d'Experts",
    subheadline:
      "Rejoignez des milliers d'apprenants qui font progresser leur carrière grâce à des cours pertinents, des projets pratiques et des certifications reconnues mondialement.",
    ctaPrimary: "Explorer les Cours",
    ctaSecondary: "Voir les Parcours",
    stats: {
      students: "10 000+ Étudiants Actifs",
      courses: "50+ Cours",
      instructors: "100+ Instructeurs Experts",
      satisfaction: "95% de Satisfaction",
    },
    imageAlt: "Étudiants apprenant en ligne avec des instructeurs experts",
  },
  ar: {
    tagline: "حوّل مستقبلك",
    headline: "أتقن مهارات جديدة مع دورات يقودها خبراء",
    subheadline:
      "انضم إلى آلاف المتعلمين الذين يطورون مسيرتهم المهنية من خلال دورات ذات صلة بالصناعة ومشاريع عملية وشهادات معترف بها عالميًا.",
    ctaPrimary: "استكشف الدورات",
    ctaSecondary: "عرض مسارات التعلم",
    stats: {
      students: "أكثر من 10,000 طالب نشط",
      courses: "أكثر من 500 دورة",
      instructors: "أكثر من 100 مدرب خبير",
      satisfaction: "معدل رضا 95%",
    },
    imageAlt: "طلاب يتعلمون عبر الإنترنت مع مدربين خبراء",
  },
};

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onViewCoursesClick,
  heroImageSrc,
}) => {
  const { language } = useLanguage();

  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const content = translations[language];
  const isRTL = language === "ar";
  const { data: announcements } = useGlobalAnnouncements();

  const publishedAnnouncements =
    announcements?.data?.announcements?.filter((a) => a.isPublished) || [];

  // Use asset utility for the image path
  const imageSrc = heroImageSrc ?? "assets/images/hero-image.jpg";

  const handleExploreCourses = () => {
    onExploreClick?.();
  };

  const handleViewPaths = () => {
    onViewCoursesClick?.();
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleAnnouncementClose = () => {
    setShowAnnouncement(false);
  };

  const handleNext = () => {
    if (currentIndex < publishedAnnouncements.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentAnnouncement = publishedAnnouncements[currentIndex];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <section
      className="relative bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 text-white w-full"
      dir={isRTL ? "rtl" : "ltr"}
      aria-label="Hero section"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-purple-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-cyan-300 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Inline Announcement and Notifications Banners */}
      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-4 sm:pt-6">
        {/* Desktop: Side by side layout */}
        <div className="hidden md:flex gap-3 lg:gap-4">
          {/* Announcement Banner */}
          {publishedAnnouncements.length > 0 &&
            showAnnouncement &&
            currentAnnouncement && (
              <div className="flex-1 min-w-0">
                <Box
                  sx={{
                    background:
                      "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
                    borderRadius: { xs: 3, md: 4 },
                    boxShadow: "0 20px 50px rgba(30, 64, 175, 0.4)",
                    overflow: "hidden",
                    position: "relative",
                    animation: "slideDown 0.5s ease-out",
                    border: "2px solid rgba(59, 130, 246, 0.3)",
                    backdropFilter: "blur(10px)",
                    "@keyframes slideDown": {
                      from: { opacity: 0, transform: "translateY(-20px)" },
                      to: { opacity: 1, transform: "translateY(0)" },
                    },
                  }}
                >
                  {/* Animated top border */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "3px",
                      background:
                        "linear-gradient(90deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)",
                      animation: "shimmer 3s infinite",
                      backgroundSize: "200% 100%",
                      "@keyframes shimmer": {
                        "0%": { backgroundPosition: "-200% 0" },
                        "100%": { backgroundPosition: "200% 0" },
                      },
                    }}
                  />

                  <div className="p-4 lg:p-6">
                    {/* Announcement Header Badge */}
                    <div className="flex items-center justify-between mb-3 lg:mb-4">
                      <div className="flex items-center gap-2 lg:gap-3 flex-wrap">
                        <div className="flex items-center gap-2 bg-blue-500/20 px-3 lg:px-4 py-1.5 lg:py-2 rounded-full border border-blue-300/30">
                          <Campaign
                            sx={{
                              color: "#60a5fa",
                              fontSize: { xs: 18, lg: 22 },
                              animation: "pulse 2s infinite",
                              "@keyframes pulse": {
                                "0%, 100%": { transform: "scale(1)" },
                                "50%": { transform: "scale(1.1)" },
                              },
                            }}
                          />
                          <span className="text-blue-100 font-semibold text-xs lg:text-sm tracking-wide uppercase">
                            📢 Announcement
                          </span>
                        </div>
                        {currentAnnouncement.isGlobal && (
                          <Chip
                            label="Global"
                            size="small"
                            sx={{
                              background: "rgba(96, 165, 250, 0.2)",
                              color: "#93c5fd",
                              fontWeight: 600,
                              border: "1px solid rgba(147, 197, 253, 0.3)",
                              fontSize: { xs: "0.7rem", lg: "0.75rem" },
                            }}
                          />
                        )}
                      </div>
                      <IconButton
                        onClick={handleAnnouncementClose}
                        size="small"
                        sx={{
                          color: "#93c5fd",
                          background: "rgba(96, 165, 250, 0.1)",
                          "&:hover": {
                            background: "rgba(96, 165, 250, 0.2)",
                            transform: "rotate(90deg)",
                          },
                          transition: "all 0.3s ease",
                          padding: { xs: "4px", lg: "8px" },
                        }}
                      >
                        <Close sx={{ fontSize: { xs: 18, lg: 24 } }} />
                      </IconButton>
                    </div>

                    <div className="flex items-start justify-between gap-3 lg:gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Title */}
                        <h3
                          style={{
                            fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
                            fontWeight: 800,
                            color: "#ffffff",
                            marginBottom: "0.75rem",
                            textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                            lineHeight: 1.3,
                            wordBreak: "break-word",
                          }}
                        >
                          {currentAnnouncement.title}
                        </h3>

                        {/* Meta Information */}
                        <div className="flex items-center gap-2 lg:gap-3 flex-wrap mb-3 lg:mb-4">
                          {currentAnnouncement.publishedAt && (
                            <div className="flex items-center gap-1 text-blue-200 text-xs lg:text-sm bg-blue-500/10 px-2 lg:px-3 py-1 rounded-full">
                              <CalendarToday
                                sx={{ fontSize: { xs: 14, lg: 16 } }}
                              />
                              <span className="font-medium">
                                {formatDate(currentAnnouncement.publishedAt)}
                              </span>
                            </div>
                          )}
                          {publishedAnnouncements.length > 1 && (
                            <Chip
                              label={`${currentIndex + 1} of ${publishedAnnouncements.length}`}
                              size="small"
                              sx={{
                                background: "rgba(96, 165, 250, 0.15)",
                                color: "#dbeafe",
                                fontWeight: 600,
                                border: "1px solid rgba(147, 197, 253, 0.3)",
                                fontSize: { xs: "0.7rem", lg: "0.75rem" },
                              }}
                            />
                          )}
                        </div>

                        {/* Content */}
                        <div
                          style={{
                            background: "rgba(255, 255, 255, 0.95)",
                            borderRadius: "12px",
                            padding: "1rem",
                            marginBottom: "0.75rem",
                            border: "1px solid rgba(59, 130, 246, 0.2)",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          }}
                        >
                          <p
                            style={{
                              color: "#1f2937",
                              lineHeight: 1.7,
                              fontSize: "clamp(0.875rem, 1.5vw, 1rem)",
                              margin: 0,
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                            }}
                          >
                            {currentAnnouncement.content}
                          </p>
                        </div>

                        {/* Navigation buttons for multiple announcements */}
                        {publishedAnnouncements.length > 1 && (
                          <div className="flex gap-2 mt-3 lg:mt-4">
                            <IconButton
                              onClick={handlePrevious}
                              disabled={currentIndex === 0}
                              size="small"
                              sx={{
                                background: "rgba(255, 255, 255, 0.9)",
                                color: "#1e40af",
                                padding: { xs: "6px", lg: "8px" },
                                "&:hover": {
                                  background: "#ffffff",
                                  transform: "translateX(-2px)",
                                },
                                "&:disabled": {
                                  background: "rgba(255, 255, 255, 0.3)",
                                  color: "rgba(30, 64, 175, 0.3)",
                                },
                                transition: "all 0.3s ease",
                                border: "1px solid rgba(59, 130, 246, 0.3)",
                              }}
                            >
                              <NavigateBefore
                                sx={{ fontSize: { xs: 20, lg: 24 } }}
                              />
                            </IconButton>
                            <IconButton
                              onClick={handleNext}
                              disabled={
                                currentIndex ===
                                publishedAnnouncements.length - 1
                              }
                              size="small"
                              sx={{
                                background: "rgba(255, 255, 255, 0.9)",
                                color: "#1e40af",
                                padding: { xs: "6px", lg: "8px" },
                                "&:hover": {
                                  background: "#ffffff",
                                  transform: "translateX(2px)",
                                },
                                "&:disabled": {
                                  background: "rgba(255, 255, 255, 0.3)",
                                  color: "rgba(30, 64, 175, 0.3)",
                                },
                                transition: "all 0.3s ease",
                                border: "1px solid rgba(59, 130, 246, 0.3)",
                              }}
                            >
                              <NavigateNext
                                sx={{ fontSize: { xs: 20, lg: 24 } }}
                              />
                            </IconButton>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Box>
              </div>
            )}
        </div>

        {/* Mobile: Stacked layout */}
        <div className="md:hidden space-y-3">
          {/* Announcement Banner Mobile */}
          {publishedAnnouncements.length > 0 &&
            showAnnouncement &&
            currentAnnouncement && (
              <Box
                sx={{
                  background:
                    "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
                  borderRadius: 3,
                  boxShadow: "0 10px 30px rgba(30, 64, 175, 0.3)",
                  overflow: "hidden",
                  position: "relative",
                  animation: "slideDown 0.5s ease-out",
                  border: "2px solid rgba(59, 130, 246, 0.3)",
                  backdropFilter: "blur(10px)",
                  "@keyframes slideDown": {
                    from: { opacity: 0, transform: "translateY(-20px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                  },
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background:
                      "linear-gradient(90deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)",
                    animation: "shimmer 3s infinite",
                    backgroundSize: "200% 100%",
                    "@keyframes shimmer": {
                      "0%": { backgroundPosition: "-200% 0" },
                      "100%": { backgroundPosition: "200% 0" },
                    },
                  }}
                />

                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 bg-blue-500/20 px-2.5 py-1 rounded-full border border-blue-300/30">
                        <Campaign
                          sx={{
                            color: "#60a5fa",
                            fontSize: 16,
                            animation: "pulse 2s infinite",
                          }}
                        />
                        <span className="text-blue-100 font-semibold text-xs tracking-wide uppercase">
                          📢
                        </span>
                      </div>
                      {currentAnnouncement.isGlobal && (
                        <Chip
                          label="Global"
                          size="small"
                          sx={{
                            background: "rgba(96, 165, 250, 0.2)",
                            color: "#93c5fd",
                            fontWeight: 600,
                            fontSize: "0.65rem",
                            height: "20px",
                          }}
                        />
                      )}
                    </div>
                    <IconButton
                      onClick={handleAnnouncementClose}
                      size="small"
                      sx={{
                        color: "#93c5fd",
                        background: "rgba(96, 165, 250, 0.1)",
                        padding: "4px",
                      }}
                    >
                      <Close sx={{ fontSize: 18 }} />
                    </IconButton>
                  </div>

                  <div>
                    <h3
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: 700,
                        color: "#ffffff",
                        marginBottom: "0.5rem",
                        lineHeight: 1.3,
                        wordBreak: "break-word",
                      }}
                    >
                      {currentAnnouncement.title}
                    </h3>

                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      {currentAnnouncement.publishedAt && (
                        <div className="flex items-center gap-1 text-blue-200 text-xs bg-blue-500/10 px-2 py-0.5 rounded-full">
                          <CalendarToday sx={{ fontSize: 12 }} />
                          <span className="font-medium text-xs">
                            {formatDate(currentAnnouncement.publishedAt)}
                          </span>
                        </div>
                      )}
                      {publishedAnnouncements.length > 1 && (
                        <Chip
                          label={`${currentIndex + 1}/${publishedAnnouncements.length}`}
                          size="small"
                          sx={{
                            background: "rgba(96, 165, 250, 0.15)",
                            color: "#dbeafe",
                            fontSize: "0.65rem",
                            height: "20px",
                          }}
                        />
                      )}
                    </div>

                    <div
                      style={{
                        background: "rgba(255, 255, 255, 0.95)",
                        borderRadius: "8px",
                        padding: "0.75rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <p
                        style={{
                          color: "#1f2937",
                          lineHeight: 1.6,
                          fontSize: "0.875rem",
                          margin: 0,
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {currentAnnouncement.content}
                      </p>
                    </div>

                    {publishedAnnouncements.length > 1 && (
                      <div className="flex gap-2 mt-2">
                        <IconButton
                          onClick={handlePrevious}
                          disabled={currentIndex === 0}
                          size="small"
                          sx={{
                            background: "rgba(255, 255, 255, 0.9)",
                            color: "#1e40af",
                            padding: "4px",
                          }}
                        >
                          <NavigateBefore sx={{ fontSize: 18 }} />
                        </IconButton>
                        <IconButton
                          onClick={handleNext}
                          disabled={
                            currentIndex === publishedAnnouncements.length - 1
                          }
                          size="small"
                          sx={{
                            background: "rgba(255, 255, 255, 0.9)",
                            color: "#1e40af",
                            padding: "4px",
                          }}
                        >
                          <NavigateNext sx={{ fontSize: 18 }} />
                        </IconButton>
                      </div>
                    )}
                  </div>
                </div>
              </Box>
            )}
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-10 sm:py-12 md:py-16 lg:py-20 xl:py-28">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
          {/* Content Column */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8 order-2 lg:order-1">
            {/* Tagline */}
            <div className="inline-block">
              <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-sm rounded-full text-xs sm:text-sm font-semibold tracking-wide border border-white/30">
                {content.tagline}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold leading-tight">
              {content.headline}
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg lg:text-xl text-blue-100 leading-relaxed max-w-2xl">
              {content.subheadline}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
              <Button
                onClick={handleExploreCourses}
                color="inherit"
                variant="outlined"
                aria-label={content.ctaPrimary}
                sx={{
                  padding: { xs: "10px 24px", sm: "12px 32px" },
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  fontWeight: 600,
                  borderWidth: 2,
                  borderColor: "white",
                  color: "white",
                  "&:hover": {
                    borderWidth: 2,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                {content.ctaPrimary}
              </Button>
              <Button
                onClick={handleViewPaths}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-white/50 text-sm sm:text-base"
                aria-label={content.ctaSecondary}
              >
                {content.ctaSecondary}
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-white/20">
              {Object.values(content.stats).map((stat, index) => (
                <div key={index} className="space-y-1">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold">
                    {stat.split(" ")[0]}
                  </div>
                  <div className="text-xs sm:text-sm text-blue-200">
                    {stat.split(" ").slice(1).join(" ")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Column */}
          <div className="relative flex justify-center items-center order-1 lg:order-2">
            <div className="relative w-full max-w-lg lg:max-w-none">
              {/* Main Image Container */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                {/* Loading Skeleton */}
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-linear-to-br from-blue-400 to-purple-500 animate-pulse" />
                )}

                {/* Hero Image */}
                <img
                  src={imageSrc}
                  alt={content.imageAlt}
                  className={`w-full h-auto object-cover object-center min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] transition-opacity duration-500 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  loading="eager"
                  onLoad={handleImageLoad}
                  onError={(e) => {
                    console.error("Failed to load hero image:", imageSrc);
                    e.currentTarget.style.display = "none";
                    setImageLoaded(true);
                  }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
              </div>

              {/* Floating Cards - Hidden on mobile, visible on tablets+ */}
              <div className="hidden sm:block absolute -top-4 sm:-top-6 -left-4 sm:-left-6 bg-white text-gray-800 rounded-xl shadow-xl p-3 sm:p-4 animate-float">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-sm sm:text-base">
                      Certified
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Professional
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden sm:block absolute -bottom-4 sm:-bottom-6 -right-4 sm:-right-6 bg-white text-gray-800 rounded-xl shadow-xl p-3 sm:p-4 animate-float-delayed">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-full flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-sm sm:text-base">50+</div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Courses
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animate-fade-in-delayed {
          animation: fade-in 0.8s ease-out 0.3s forwards;
          opacity: 0;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float 3s ease-in-out 1.5s infinite;
        }

        /* Custom scrollbar for notification list */
        div[style*="overflowY: auto"]::-webkit-scrollbar {
          width: 6px;
        }

        div[style*="overflowY: auto"]::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }

        div[style*="overflowY: auto"]::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.3);
          border-radius: 10px;
        }

        div[style*="overflowY: auto"]::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.5);
        }
      `}</style>
    </section>
  );
};
