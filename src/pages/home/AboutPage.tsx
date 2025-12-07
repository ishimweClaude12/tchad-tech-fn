import React from "react";
import {
  ShoppingCart,
  GraduationCap,
  Building2,
  Users,
  Target,
  Lightbulb,
  TrendingUp,
  Globe,
  Award,
  Heart,
  Rocket,
} from "lucide-react";
import { useScrollToTop } from "../../utils/hooks/ScrollTop";
import { useLanguage } from "../../contexts/LanguageContext";

interface Translations {
  [key: string]: {
    en: string;
    fr: string;
    ar: string;
  };
}

const translations: Translations = {
  aboutUs: {
    en: "About Us",
    fr: "À Propos de Nous",
    ar: "من نحن",
  },
  heroTitle: {
    en: "Empowering Innovation Through Technology",
    fr: "Autonomiser l'Innovation par la Technologie",
    ar: "تمكين الابتكار من خلال التكنولوجيا",
  },
  heroDescription: {
    en: "We are committed to addressing pressing global challenges through innovative tech solutions, empowering individuals with the knowledge and skills they need to succeed and collaborating with international organizations for wider impact.",
    fr: "Nous nous engageons à relever les défis mondiaux urgents grâce à des solutions technologiques innovantes, en donnant aux individus les connaissances et les compétences dont ils ont besoin pour réussir et en collaborant avec des organisations internationales pour un impact plus large.",
    ar: "نحن ملتزمون بمعالجة التحديات العالمية الملحة من خلال حلول تقنية مبتكرة، وتمكين الأفراد بالمعرفة والمهارات التي يحتاجونها للنجاح والتعاون مع المنظمات الدولية لتحقيق تأثير أوسع.",
  },
  ourMission: {
    en: "Our Mission",
    fr: "Notre Mission",
    ar: "مهمتنا",
  },
  missionDescription: {
    en: "To create a unified ecosystem where businesses, learners, innovators, and investors can collaborate, trade, learn, and grow together through cutting-edge technology solutions.",
    fr: "Créer un écosystème unifié où les entreprises, les apprenants, les innovateurs et les investisseurs peuvent collaborer, échanger, apprendre et grandir ensemble grâce à des solutions technologiques de pointe.",
    ar: "إنشاء نظام بيئي موحد حيث يمكن للشركات والمتعلمين والمبتكرين والمستثمرين التعاون والتجارة والتعلم والنمو معًا من خلال حلول تكنولوجية متطورة.",
  },
  ourVision: {
    en: "Our Vision",
    fr: "Notre Vision",
    ar: "رؤيتنا",
  },
  visionDescription: {
    en: "To become the leading platform in Africa that bridges the gap between technology, education, and entrepreneurship, fostering sustainable economic growth and innovation.",
    fr: "Devenir la plateforme leader en Afrique qui comble le fossé entre la technologie, l'éducation et l'entrepreneuriat, favorisant une croissance économique durable et l'innovation.",
    ar: "أن نصبح المنصة الرائدة في أفريقيا التي تسد الفجوة بين التكنولوجيا والتعليم وريادة الأعمال، وتعزز النمو الاقتصادي المستدام والابتكار.",
  },
  whatWeDo: {
    en: "What We Do",
    fr: "Ce Que Nous Faisons",
    ar: "ما نفعله",
  },
  ecommerce: {
    en: "E-Commerce Platform",
    fr: "Plateforme E-Commerce",
    ar: "منصة التجارة الإلكترونية",
  },
  ecommerceDesc: {
    en: "Connect small businesses with customers through our secure and user-friendly marketplace. Manage products, process orders, and grow your business online.",
    fr: "Connectez les petites entreprises avec les clients grâce à notre marché sécurisé et convivial. Gérez les produits, traitez les commandes et développez votre entreprise en ligne.",
    ar: "ربط الشركات الصغيرة بالعملاء من خلال سوقنا الآمن وسهل الاستخدام. إدارة المنتجات ومعالجة الطلبات وتنمية عملك عبر الإنترنت.",
  },
  elearning: {
    en: "E-Learning Hub",
    fr: "Hub E-Learning",
    ar: "مركز التعلم الإلكتروني",
  },
  elearningDesc: {
    en: "Access quality education and skill development courses. From technology to business, our platform offers comprehensive learning paths with certifications.",
    fr: "Accédez à des cours de formation de qualité et de développement des compétences. De la technologie aux affaires, notre plateforme offre des parcours d'apprentissage complets avec des certifications.",
    ar: "الوصول إلى دورات تعليمية عالية الجودة وتطوير المهارات. من التكنولوجيا إلى الأعمال، توفر منصتنا مسارات تعليمية شاملة مع شهادات.",
  },
  hubManagement: {
    en: "Hub Management",
    fr: "Gestion du Hub",
    ar: "إدارة المركز",
  },
  hubManagementDesc: {
    en: "Book co-working spaces, manage projects with Kanban boards, and connect with investors. Everything innovators and startups need in one place.",
    fr: "Réservez des espaces de coworking, gérez des projets avec des tableaux Kanban et connectez-vous avec des investisseurs. Tout ce dont les innovateurs et les startups ont besoin en un seul endroit.",
    ar: "احجز مساحات العمل المشترك، وإدارة المشاريع مع لوحات كانبان، والتواصل مع المستثمرين. كل ما يحتاجه المبتكرون والشركات الناشئة في مكان واحد.",
  },
  ourValues: {
    en: "Our Values",
    fr: "Nos Valeurs",
    ar: "قيمنا",
  },
  innovation: {
    en: "Innovation",
    fr: "Innovation",
    ar: "الابتكار",
  },
  innovationDesc: {
    en: "We embrace cutting-edge technology and creative solutions to solve complex problems.",
    fr: "Nous adoptons des technologies de pointe et des solutions créatives pour résoudre des problèmes complexes.",
    ar: "نتبنى التكنولوجيا المتطورة والحلول الإبداعية لحل المشاكل المعقدة.",
  },
  collaboration: {
    en: "Collaboration",
    fr: "Collaboration",
    ar: "التعاون",
  },
  collaborationDesc: {
    en: "We believe in the power of working together to achieve greater impact and success.",
    fr: "Nous croyons au pouvoir de travailler ensemble pour obtenir un impact et un succès plus importants.",
    ar: "نؤمن بقوة العمل معًا لتحقيق تأثير ونجاح أكبر.",
  },
  empowerment: {
    en: "Empowerment",
    fr: "Autonomisation",
    ar: "التمكين",
  },
  empowermentDesc: {
    en: "We equip individuals and businesses with the tools and knowledge they need to thrive.",
    fr: "Nous fournissons aux individus et aux entreprises les outils et les connaissances dont ils ont besoin pour prospérer.",
    ar: "نزود الأفراد والشركات بالأدوات والمعرفة التي يحتاجونها للازدهار.",
  },
  excellence: {
    en: "Excellence",
    fr: "Excellence",
    ar: "التميز",
  },
  excellenceDesc: {
    en: "We strive for quality in everything we do, from product development to customer service.",
    fr: "Nous recherchons la qualité dans tout ce que nous faisons, du développement de produits au service client.",
    ar: "نسعى لتحقيق الجودة في كل ما نقوم به، من تطوير المنتجات إلى خدمة العملاء.",
  },
  impact: {
    en: "Our Impact",
    fr: "Notre Impact",
    ar: "تأثيرنا",
  },
  businesses: {
    en: "Businesses Supported",
    fr: "Entreprises Soutenues",
    ar: "الشركات المدعومة",
  },
  learners: {
    en: "Active Learners",
    fr: "Apprenants Actifs",
    ar: "المتعلمون النشطون",
  },
  projects: {
    en: "Projects Funded",
    fr: "Projets Financés",
    ar: "المشاريع الممولة",
  },
  joinUs: {
    en: "Join Our Community",
    fr: "Rejoignez Notre Communauté",
    ar: "انضم إلى مجتمعنا",
  },
  joinDescription: {
    en: "Be part of a growing ecosystem of entrepreneurs, learners, and innovators shaping the future of technology in Africa.",
    fr: "Faites partie d'un écosystème croissant d'entrepreneurs, d'apprenants et d'innovateurs qui façonnent l'avenir de la technologie en Afrique.",
    ar: "كن جزءًا من نظام متنامٍ من رواد الأعمال والمتعلمين والمبتكرين الذين يشكلون مستقبل التكنولوجيا في أفريقيا.",
  },
  getStarted: {
    en: "Get Started",
    fr: "Commencer",
    ar: "ابدأ الآن",
  },
  contactUs: {
    en: "Contact Us",
    fr: "Contactez-nous",
    ar: "اتصل بنا",
  },
};

const AboutUsPage: React.FC = () => {
  const { language, isRTL } = useLanguage();
  useScrollToTop({ smooth: true });

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const platformFeatures = [
    {
      icon: ShoppingCart,
      title: "ecommerce",
      description: "ecommerceDesc",
      color: "bg-blue-500",
    },
    {
      icon: GraduationCap,
      title: "elearning",
      description: "elearningDesc",
      color: "bg-green-500",
    },
    {
      icon: Building2,
      title: "hubManagement",
      description: "hubManagementDesc",
      color: "bg-purple-500",
    },
    {
      icon: Rocket,
      title: "Tech Service Delivery",
      description:
        "We provide cutting-edge tech solutions to enhance business operations.",
      color: "bg-red-500",
    },
  ];

  const values = [
    {
      icon: Lightbulb,
      title: "innovation",
      description: "innovationDesc",
      color: "text-yellow-500",
    },
    {
      icon: Users,
      title: "collaboration",
      description: "collaborationDesc",
      color: "text-blue-500",
    },
    {
      icon: TrendingUp,
      title: "empowerment",
      description: "empowermentDesc",
      color: "text-green-500",
    },
    {
      icon: Award,
      title: "excellence",
      description: "excellenceDesc",
      color: "text-purple-500",
    },
  ];

  const stats = [
    { value: "100+", label: "businesses" },
    { value: "500+", label: "learners" },
    { value: "100+", label: "projects" },
    { value: "100+", label: "Tech Products" },
  ];

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? "rtl" : "ltr"}>
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className=" mx-auto relative z-10">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              {t("aboutUs")}
            </h1>
            <p className="text-2xl md:text-3xl font-light max-w-4xl mx-auto">
              {t("heroTitle")}
            </p>
            <p className="text-lg md:text-xl text-indigo-100 max-w-3xl mx-auto leading-relaxed">
              {t("heroDescription")}
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-6 bg-slate-50">
        <div className=" mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-white rounded-2xl p-8 shadow-lg  ">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800">
                  {t("ourMission")}
                </h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-lg">
                {t("missionDescription")}
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-2xl p-8 shadow-lg ">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Globe className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800">
                  {t("ourVision")}
                </h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-lg">
                {t("visionDescription")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              {t("whatWeDo")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {platformFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                  <div
                    className={`w-16 h-16 ${feature.color} rounded-xl flex items-center justify-center mb-6`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">
                    {t(feature.title)}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {t(feature.description)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              {t("ourValues")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 text-center shadow-lg "
                >
                  <div className="flex justify-center mb-4">
                    <Icon className={`w-12 h-12 ${value.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">
                    {t(value.title)}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {t(value.description)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 px-6 bg-linear-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t("impact")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl md:text-6xl font-bold mb-2">
                  {stat.value}
                </div>
                <div className="text-xl text-indigo-100">{t(stat.label)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-3xl p-12 shadow-xl">
            <Heart className="w-16 h-16 text-indigo-600 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              {t("joinUs")}
            </h2>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              {t("joinDescription")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors text-lg">
                {t("getStarted")}
              </button>
              <button className="bg-white hover:bg-slate-50 text-indigo-600 px-8 py-4 rounded-lg font-semibold border-2 border-indigo-600 transition-colors text-lg">
                {t("contactUs")}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
