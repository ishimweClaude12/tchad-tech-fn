import React, { useEffect, useRef } from "react";
import { useLanguage } from "../contexts/LanguageContext";

interface HeroSectionProps {
  videoSrc?: string;
}

const translations = {
  en: {
    badge: "🚀 Pioneering Tchad's Digital Future",
    title: "Welcome to",
    brandName: "Tchad Tech Hub",
    motto: "Innovating Today, Transforming Tchad Tomorrow",
    description:
      "TChad-Tech-Hub is a comprehensive digital innovation platform designed to bridge the technological gap in TChad by providing cutting-edge IT solutions, business consultancy, research support, and an innovation space for start-ups. The system integrates various services, including tech product sales, I services management as software development, AI solutions, IoT, networking... data science, innovation project tracking and digital consultancy.",

    stats: {
      members: "Active Members",
      courses: "Courses Available",
      projects: "Projects Funded",
      products: "Disponible products",
    },
    floating: {
      collab: "Live Collaboration",
      support: "24/7 Support",
    },
  },
  fr: {
    badge: "🚀 Pionnier de l'Avenir Numérique du Tchad",
    title: "Bienvenue à",
    brandName: "Chad Tech Hub",
    motto: "Innover Aujourd'hui, Transformer le Tchad Demain",
    description:
      "Votre passerelle vers la transformation numérique au Tchad. Connectant innovateurs, entreprises, investisseurs et apprenants à travers des solutions IT de pointe, e-learning et espaces d'innovation.",
    cta1: "Commencer Votre Parcours",
    cta2: "Explorer la Plateforme",
    stats: {
      members: "Membres Actifs",
      courses: "Cours Disponibles",
      projects: "Projets Financés",
      products: "Produits Disponibles",
    },
    floating: {
      collab: "Collaboration en Direct",
      support: "Support 24/7",
    },
  },
  ar: {
    badge: "🚀 رائدة المستقبل الرقمي لتشاد",
    title: "مرحبا بكم في",
    brandName: "Tchad Tech Hub",
    motto: "الابتكار اليوم، تحويل تشاد غداً",
    description:
      "بوابتك للتحول الرقمي في تشاد. ربط المبتكرين والشركات والمستثمرين والمتعلمين من خلال حلول تكنولوجيا المعلومات المتطورة والتعلم الإلكتروني ومساحات الابتكار.",
    cta1: "ابدأ رحلتك",
    cta2: "استكشف المنصة",
    stats: {
      members: "أعضاء نشطون",
      courses: "دورات متاحة",
      projects: "مشاريع ممولة",
      products: "منتجات متاحة",
    },
    floating: {
      collab: "تعاون مباشر",
      support: "دعم 24/7",
    },
  },
};

const HeroSection: React.FC<HeroSectionProps> = ({
  videoSrc = "/videos/hero-background-v2.mp4",
}) => {
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Force video to play on mount
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Video autoplay failed:", error);
      });
    }
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Video Background */}
      {videoSrc && (
        <>
          <div className="absolute inset-0 overflow-hidden z-10">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            >
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="absolute inset-0 bg-linear-to-br from-slate-900/80 via-purple-900/70 to-slate-900/80 z-10"></div>
        </>
      )}

      {!videoSrc && (
        <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 z-0"></div>
      )}

      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse z-30"></div>
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000 z-30"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-500/20 rounded-full blur-xl animate-pulse delay-500 z-30"></div>

      <div className="relative z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-linear-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 mb-6 backdrop-blur-sm">
              <span className="text-blue-300 text-sm font-medium">
                {t.badge}
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
              {t.title}{" "}
              <span className="bg-linear-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent animate-pulse">
                {t.brandName}
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-purple-300 mb-6 font-semibold italic">
              {t.motto}
            </p>

            <p className="text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed   drop-shadow-md">
              {t.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-8 pt-8 border-t border-gray-700/50">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1 drop-shadow-md">
                  500+
                </div>
                <div className="text-sm text-gray-400">{t.stats.members}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1 drop-shadow-md">
                  50+
                </div>
                <div className="text-sm text-gray-400">{t.stats.courses}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1 drop-shadow-md">
                  100+
                </div>
                <div className="text-sm text-gray-400">{t.stats.projects}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1 drop-shadow-md">
                  100+
                </div>
                <div className="text-xs text-gray-400">{t.stats.products}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
