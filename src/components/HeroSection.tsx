import { useEffect, useRef } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Typography, Button, Chip } from "@mui/material";
import { Link } from "react-router-dom";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

interface HeroSectionProps {
  videoSrc?: string;
}

const translations = {
  en: {
    badge: "Pioneering Tchad's Digital Future",
    title: "Welcome to",
    brandName: "Tchad Tech Hub",
    motto: "Innovating Today, Transforming Tchad Tomorrow",
    description:
      "TChad-Tech-Hub is a comprehensive digital innovation platform designed to bridge the technological gap in TChad by providing cutting-edge IT solutions, business consultancy, research support, and an innovation space for start-ups.",
    cta1: "Start Your Journey",
    cta2: "Explore Platform",
    stats: {
      members: "Active Members",
      courses: "Courses Available",
      projects: "Projects Funded",
      products: "Available Products",
    },
  },
  fr: {
    badge: "Pionnier de l'Avenir Numérique du Tchad",
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
  },
  ar: {
    badge: "رائدة المستقبل الرقمي لتشاد",
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
  },
};

const statValues = ["500+", "50+", "100+", "100+"] as const;
const statKeys = ["members", "courses", "projects", "products"] as const;

export default function HeroSection({
  videoSrc = "/videos/hero-background-v2.mp4",
}: Readonly<HeroSectionProps>) {
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.error("Video autoplay failed:", err);
      });
    }
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
      aria-label={t.brandName}
    >
      {/* Video background */}
      {videoSrc ? (
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
              tabIndex={-1}
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          </div>
          <div className="absolute inset-0 bg-linear-to-br from-slate-900/80 via-purple-900/70 to-slate-900/80 z-10" />
        </>
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 z-0" />
      )}

      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse z-20 pointer-events-none" />
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse z-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-500/20 rounded-full blur-xl animate-pulse z-20 pointer-events-none" />

      {/* Content */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left max-w-3xl mx-auto lg:mx-0">
          {/* Badge */}
          <Chip
            icon={<RocketLaunchIcon />}
            label={t.badge}
            size="small"
            className="mb-6"
            sx={{
              bgcolor: "rgba(37,99,235,0.2)",
              color: "#93c5fd",
              border: "1px solid rgba(59,130,246,0.3)",
              backdropFilter: "blur(4px)",
              "& .MuiChip-icon": { color: "#93c5fd" },
            }}
          />

          {/* Heading */}
          <Typography
            variant="h1"
            component="h1"
            className="font-bold leading-tight mb-4 drop-shadow-lg"
            sx={{ color: "white", fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4.5rem" } }}
          >
            {t.title}{" "}
            <span className="bg-linear-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              {t.brandName}
            </span>
          </Typography>

          {/* Motto */}
          <Typography
            variant="h6"
            component="p"
            className="mb-5 font-semibold italic"
            sx={{ color: "#c084fc" }}
          >
            {t.motto}
          </Typography>

          {/* Description */}
          <Typography
            variant="body1"
            className="mb-8 leading-relaxed"
            sx={{ color: "rgba(209,213,219,1)", fontSize: { xs: "1rem", md: "1.125rem" } }}
          >
            {t.description}
          </Typography>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button
              component={Link}
              to="/learn"
              variant="contained"
              color="primary"
              size="large"
              className="font-semibold"
            >
              {t.cta1}
            </Button>
            <Button
              component={Link}
              to="/about-us"
              variant="outlined"
              size="large"
              className="font-semibold"
              sx={{ borderColor: "rgba(255,255,255,0.5)", color: "white", "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.1)" } }}
            >
              {t.cta2}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-white/20 w-full">
            {statKeys.map((key, i) => (
              <div key={key} className="text-center">
                <Typography variant="h5" component="p" className="font-bold mb-1" sx={{ color: "white" }}>
                  {statValues[i]}
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(156,163,175,1)" }}>
                  {t.stats[key]}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
