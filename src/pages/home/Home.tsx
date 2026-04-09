import type React from "react";
import HeroSection from "../../components/HeroSection";
import ServicesSection from "../../components/Services";
import PartnersSection from "../../components/OurPartners";
import { useLanguage } from "../../contexts/LanguageContext";
import TeamSection from "../../layouts/Team";
import {
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SchoolIcon from "@mui/icons-material/School";
import ApartmentIcon from "@mui/icons-material/Apartment";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import { Link } from "react-router-dom";

const translations = {
  en: {
    explore: {
      title: "Explore Our Platform",
      subtitle:
        "Discover the tools and resources that will accelerate your success",
    },
    features: {
      ecommerce: {
        title: "E-commerce",
        description:
          "Shop products from local businesses and service providers.",
        cta: "Explore Shop",
        href: "/shop",
      },
      elearning: {
        title: "E-learning",
        description: "Learn new skills with our comprehensive course catalog.",
        cta: "Start Learning",
        href: "/learn",
      },
      hub: {
        title: "Hub Management",
        description: "Book co-working spaces and manage your projects.",
        cta: "Access Hub",
        href: "/hub",
      },
      techHub: {
        title: "Tech Hub",
        description:
          "Connect with the tech community and collaborate on projects.",
        cta: "Access Community",
        href: "/tech_hub",
      },
    },
    innovators: {
      title: "For Innovators",
      description:
        "Transform your ideas into reality with our comprehensive ecosystem of tools, resources, and community support.",
      features: [
        "Access to co-working spaces",
        "Project management tools",
        "Investor networking",
        "Skill development courses",
      ],
    },
    businesses: {
      title: "For Businesses",
      description:
        "Grow your business with our integrated platform for e-commerce, learning, and professional networking.",
      features: [
        "Online storefront setup",
        "Digital marketing tools",
        "Staff training programs",
        "Business networking events",
      ],
    },
  },
  fr: {
    explore: {
      title: "Explorez Notre Plateforme",
      subtitle:
        "Découvrez les outils et ressources qui accéléreront votre succès",
    },
    features: {
      ecommerce: {
        title: "E-commerce",
        description:
          "Achetez des produits auprès d'entreprises locales et de prestataires de services.",
        cta: "Explorer la Boutique",
        href: "/shop",
      },
      elearning: {
        title: "E-learning",
        description:
          "Apprenez de nouvelles compétences avec notre catalogue complet de cours.",
        cta: "Commencer à Apprendre",
        href: "/learn",
      },
      hub: {
        title: "Gestion du Hub",
        description: "Réservez des espaces de coworking et gérez vos projets.",
        cta: "Accéder au Hub",
        href: "/hub",
      },
      techHub: {
        title: "Tech Hub",
        description:
          "Connectez-vous avec la communauté tech et collaborez sur des projets.",
        cta: "Accéder à la Communauté",
        href: "/tech_hub",
      },
    },
    innovators: {
      title: "Pour les Innovateurs",
      description:
        "Transformez vos idées en réalité avec notre écosystème complet d'outils, de ressources et de soutien communautaire.",
      features: [
        "Accès aux espaces de coworking",
        "Outils de gestion de projet",
        "Réseau d'investisseurs",
        "Cours de développement des compétences",
      ],
    },
    businesses: {
      title: "Pour les Entreprises",
      description:
        "Développez votre entreprise avec notre plateforme intégrée pour le commerce électronique, l'apprentissage et le réseautage professionnel.",
      features: [
        "Configuration de boutique en ligne",
        "Outils de marketing numérique",
        "Programmes de formation du personnel",
        "Événements de réseautage d'affaires",
      ],
    },
  },
  ar: {
    explore: {
      title: "استكشف منصتنا",
      subtitle: "اكتشف الأدوات والموارد التي ستسرع نجاحك",
    },
    features: {
      ecommerce: {
        title: "التجارة الإلكترونية",
        description: "تسوق المنتجات من الشركات المحلية ومقدمي الخدمات.",
        cta: "استكشف المتجر",
        href: "/shop",
      },
      elearning: {
        title: "التعلم الإلكتروني",
        description: "تعلم مهارات جديدة مع كتالوج الدورات الشامل لدينا.",
        cta: "ابدأ التعلم",
        href: "/learn",
      },
      hub: {
        title: "إدارة المركز",
        description: "احجز مساحات العمل المشترك وأدر مشاريعك.",
        cta: "الوصول إلى المركز",
        href: "/hub",
      },
      techHub: {
        title: "المركز التقني",
        description: "تواصل مع مجتمع التكنولوجيا وتعاون في المشاريع.",
        cta: "الوصول إلى المجتمع",
        href: "/tech_hub",
      },
    },
    innovators: {
      title: "للمبتكرين",
      description:
        "حوّل أفكارك إلى واقع مع نظامنا البيئي الشامل من الأدوات والموارد ودعم المجتمع.",
      features: [
        "الوصول إلى مساحات العمل المشترك",
        "أدوات إدارة المشاريع",
        "شبكة المستثمرين",
        "دورات تطوير المهارات",
      ],
    },
    businesses: {
      title: "للشركات",
      description:
        "نمِّ عملك مع منصتنا المتكاملة للتجارة الإلكترونية والتعلم والتواصل المهني.",
      features: [
        "إعداد واجهة المتجر عبر الإنترنت",
        "أدوات التسويق الرقمي",
        "برامج تدريب الموظفين",
        "فعاليات التواصل التجاري",
      ],
    },
  },
};

type FeatureKey = "ecommerce" | "elearning" | "hub" | "techHub";

const featureIcons: Record<FeatureKey, React.ReactNode> = {
  ecommerce: <ShoppingCartIcon sx={{ fontSize: 36 }} />,
  elearning: <SchoolIcon sx={{ fontSize: 36 }} />,
  hub: <ApartmentIcon sx={{ fontSize: 36 }} />,
  techHub: <RocketLaunchIcon sx={{ fontSize: 36 }} />,
};

const featureColors: Record<FeatureKey, "primary" | "success" | "secondary" | "warning"> = {
  ecommerce: "primary",
  elearning: "success",
  hub: "secondary",
  techHub: "warning",
};

export default function HomePage() {
  const { language, isRTL } = useLanguage();
  const t = translations[language];

  const featureKeys: FeatureKey[] = ["ecommerce", "elearning", "hub", "techHub"];

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      {/* Hero Section */}
      <HeroSection videoSrc="/videos/hero-background-v2.mp4" />

      {/* Platform Overview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-12">
            <Typography variant="h3" component="h2" className="font-bold mb-3" sx={{ color: "text.primary" }}>
              {t.explore.title}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "text.secondary" }} className="max-w-2xl mx-auto">
              {t.explore.subtitle}
            </Typography>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
            {featureKeys.map((key) => {
              const feature = t.features[key];
              const color = featureColors[key];
              return (
                <Card
                  key={key}
                  className="flex flex-col h-full hover:shadow-xl transition-shadow duration-300"
                  elevation={2}
                >
                  <CardContent className="flex flex-col flex-1 gap-3 p-6">
                    <div className="flex items-center justify-center w-14 h-14 rounded-xl mb-1"
                      style={{ background: `var(--chad-blue)10` }}
                    >
                      <Chip
                        icon={featureIcons[key] as React.ReactElement}
                        label=""
                        color={color}
                        sx={{ width: 52, height: 52, borderRadius: 3, "& .MuiChip-icon": { margin: 0 }, "& .MuiChip-label": { display: "none" } }}
                      />
                    </div>
                    <Typography variant="h6" component="h3" className="font-semibold">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }} className="flex-1">
                      {feature.description}
                    </Typography>
                    <Button
                      component={Link}
                      to={feature.href}
                      variant="contained"
                      color={color}
                      size="small"
                      className="self-start mt-2"
                    >
                      {feature.cta}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Audience cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Innovators */}
            <Card elevation={2} className="p-2">
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <EmojiObjectsIcon sx={{ color: "secondary.main", fontSize: 32 }} />
                  <Typography variant="h5" component="h3" className="font-semibold">
                    {t.innovators.title}
                  </Typography>
                </div>
                <Typography variant="body1" sx={{ color: "text.secondary" }}>
                  {t.innovators.description}
                </Typography>
                <ul className="flex flex-col gap-2">
                  {t.innovators.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircleOutlineIcon sx={{ color: "success.main", fontSize: 20 }} />
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {feature}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Businesses */}
            <Card elevation={2} className="p-2">
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <BusinessCenterIcon sx={{ color: "primary.main", fontSize: 32 }} />
                  <Typography variant="h5" component="h3" className="font-semibold">
                    {t.businesses.title}
                  </Typography>
                </div>
                <Typography variant="body1" sx={{ color: "text.secondary" }}>
                  {t.businesses.description}
                </Typography>
                <ul className="flex flex-col gap-2">
                  {t.businesses.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircleOutlineIcon sx={{ color: "success.main", fontSize: 20 }} />
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {feature}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <ServicesSection />

      {/* Team Section */}
      <TeamSection />

      {/* Partners Section */}
      <PartnersSection />
    </div>
  );
}
