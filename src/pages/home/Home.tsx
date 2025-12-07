import HeroSection from "../../components/HeroSection";
import React from "react";
import ServicesSection from "../../components/Services";
import PartnersSection from "../../components/OurPartners";
import { useLanguage } from "../../contexts/LanguageContext";
import TeamSection from "../../layouts/Team";

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
      },
      elearning: {
        title: "E-learning",
        description: "Learn new skills with our comprehensive course catalog.",
        cta: "Start Learning",
      },
      hub: {
        title: "Hub Management",
        description: "Book co-working spaces and manage your projects.",
        cta: "Access Hub",
      },
      techHub: {
        title: "Tech Hub",
        description:
          "Connect with the tech community and collaborate on projects.",
        cta: "Access Community",
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

    // TODO: Remove these commented codes if no feedback about them
    // cta: {
    //   title: "Ready to Start Your Journey?",
    //   description:
    //     "Join hundreds of entrepreneurs, innovators, and businesses already thriving in our ecosystem.",
    //   primary: "Get Started Today",
    //   secondary: "Learn More",
    // },
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
      },
      elearning: {
        title: "E-learning",
        description:
          "Apprenez de nouvelles compétences avec notre catalogue complet de cours.",
        cta: "Commencer à Apprendre",
      },
      hub: {
        title: "Gestion du Hub",
        description: "Réservez des espaces de coworking et gérez vos projets.",
        cta: "Accéder au Hub",
      },
      techHub: {
        title: "Tech Hub",
        description:
          "Connectez-vous avec la communauté tech et collaborez sur des projets.",
        cta: "Accéder à la Communauté",
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
    cta: {
      title: "Prêt à Commencer Votre Parcours?",
      description:
        "Rejoignez des centaines d'entrepreneurs, innovateurs et entreprises qui prospèrent déjà dans notre écosystème.",
      primary: "Commencer Aujourd'hui",
      secondary: "En Savoir Plus",
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
      },
      elearning: {
        title: "التعلم الإلكتروني",
        description: "تعلم مهارات جديدة مع كتالوج الدورات الشامل لدينا.",
        cta: "ابدأ التعلم",
      },
      hub: {
        title: "إدارة المركز",
        description: "احجز مساحات العمل المشترك وأدر مشاريعك.",
        cta: "الوصول إلى المركز",
      },
      techHub: {
        title: "المركز التقني",
        description: "تواصل مع مجتمع التكنولوجيا وتعاون في المشاريع.",
        cta: "الوصول إلى المجتمع",
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
    cta: {
      title: "هل أنت مستعد لبدء رحلتك؟",
      description:
        "انضم إلى مئات من رواد الأعمال والمبتكرين والشركات الذين يزدهرون بالفعل في نظامنا البيئي.",
      primary: "ابدأ اليوم",
      secondary: "تعرف على المزيد",
    },
  },
};

const HomePage: React.FC = () => {
  //   useScrollToTop({ smooth: true });
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div>
      {/* Hero Section with Video Background */}
      <HeroSection videoSrc={"/videos/hero-background-v2.mp4"} />
      {/* Existing Content */}
      <div className="lg:p-8 pt-8 bg-gray-50">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t.explore.title}
            </h2>
            <p className="text-lg text-gray-600">{t.explore.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-lg border hover:shadow-xl transition-shadow duration-300 group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                🛒
              </div>
              <h3 className="text-lg font-semibold mb-3">
                {t.features.ecommerce.title}
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                {t.features.ecommerce.description}
              </p>
              <a
                href="/shop"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                {t.features.ecommerce.cta}
              </a>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border hover:shadow-xl transition-shadow duration-300 group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                📚
              </div>
              <h3 className="text-lg font-semibold mb-3">
                {t.features.elearning.title}
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                {t.features.elearning.description}
              </p>
              <a
                href="/learn"
                className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                {t.features.elearning.cta}
              </a>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border hover:shadow-xl transition-shadow duration-300 group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                🏢
              </div>
              <h3 className="text-lg font-semibold mb-3">
                {t.features.hub.title}
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                {t.features.hub.description}
              </p>
              <a
                href="/hub"
                className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
              >
                {t.features.hub.cta}
              </a>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border hover:shadow-xl transition-shadow duration-300 group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                🚀
              </div>
              <h3 className="text-lg font-semibold mb-3">
                {t.features.techHub.title}
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                {t.features.techHub.description}
              </p>
              <a
                href="/tech_hub"
                className="inline-block px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
              >
                {t.features.techHub.cta}
              </a>
            </div>
          </div>

          {/* Additional sections */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-8 rounded-xl shadow-lg border">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 flex items-center">
                <span className="text-2xl mr-3">🎯</span>
                {t.innovators.title}
              </h3>
              <p className="text-gray-600 mb-4">{t.innovators.description}</p>
              <ul className="text-sm text-gray-600 space-y-2">
                {t.innovators.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 flex items-center">
                <span className="text-2xl mr-3">💼</span>
                {t.businesses.title}
              </h3>
              <p className="text-gray-600 mb-4">{t.businesses.description}</p>
              <ul className="text-sm text-gray-600 space-y-2">
                {t.businesses.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Call to action */}
          {/* TODO: Remove these commented codes if no feedback about them */}
          {/* <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-xl shadow-lg text-white">
            <h3 className="text-2xl font-bold mb-4">{t.cta.title}</h3>
            <p className="mb-6 opacity-90">{t.cta.description}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
                {t.cta.primary}
              </button>
              <button className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-semibold">
                {t.cta.secondary}
              </button>
            </div>
          </div> */}
        </div>
      </div>
      {/* Our services Section */}
      <ServicesSection />
      {/* Team members section */}
      <TeamSection />
      <PartnersSection />
    </div>
  );
};

export default HomePage;
