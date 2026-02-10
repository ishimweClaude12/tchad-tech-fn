import { Button } from "@mui/material";
import { useLanguage } from "../contexts/LanguageContext";

// Translation definitions
const translations = {
  en: {
    trustedPartners: "Our Trusted Partners",
    becomePartner: "Become a Partner",
    partnershipDescription:
      "Join us in building the future of technology in Tchad and across Africa. Together, we create opportunities and drive innovation that transforms communities and empowers the next generation of tech leaders.",
    readMore: "Learn More About Our Mission",
    contactUs: "Contact Us",
    stats: {
      partners: "Active Partners",
      countries: "Countries Served",
      funding: "Total Funding",
      projects: "Projects Delivered",
    },
  },
  fr: {
    trustedPartners: "Nos Partenaires de Confiance",
    becomePartner: "Devenez Partenaire",
    partnershipDescription:
      "Rejoignez-nous pour construire l'avenir de la technologie au Tchad et à travers l'Afrique. Ensemble, nous créons des opportunités et stimulons l'innovation qui transforme les communautés et autonomise la prochaine génération de leaders technologiques.",
    readMore: "En Savoir Plus Sur Notre Mission",
    contactUs: "Nous Contacter",
    stats: {
      partners: "Partenaires Actifs",
      countries: "Pays Desservis",
      funding: "Financement Total",
      projects: "Projets Livrés",
    },
  },
  ar: {
    trustedPartners: "شركاؤنا الموثوقون",
    becomePartner: "كن شريكاً معنا",
    partnershipDescription:
      "انضم إلينا في بناء مستقبل التكنولوجيا في تشاد وعبر أفريقيا. معاً، ننشئ الفرص ونحفز الابتكار الذي يحول المجتمعات ويمكن الجيل القادم من قادة التكنولوجيا.",
    readMore: "تعرف على مهمتنا أكثر",
    contactUs: "اتصل بنا",
    stats: {
      partners: "شركاء نشطون",
      countries: "دول مخدومة",
      funding: "إجمالي التمويل",
      projects: "مشاريع منجزة",
    },
  },
};

const TrustedByBanner = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const logos = [
    "UNICEF",
    "World Bank",
    "UNESCO",
    "Microsoft",
    "Google",
    "aws",
    "African Development Bank",
  ];

  const duplicatedLogos = [...logos, ...logos];

  return (
    <div className="pb-4 sm:pb-6 md:pb-8 overflow-x-hidden overflow-y-visible w-full box-border max-w-full">
      <style>
        {`
          @keyframes scrollRight {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          
          .scroll-container {
            animation: scrollRight 30s linear infinite;
            width: max-content;
            will-change: transform;
          }
          
          .scroll-container:hover {
            animation-play-state: paused;
          }

          /* Responsive animation speed */
          @media (max-width: 640px) {
            .scroll-container {
              animation: scrollRight 20s linear infinite;
            }
          }
        `}
      </style>

      <h1 className="text-center text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-600 uppercase tracking-wider mb-3 sm:mb-4 md:mb-6 px-2 sm:px-4 wrap-break-words max-w-full">
        {t.trustedPartners}
      </h1>

      <div className="relative w-full max-w-[360px] overflow-x-hidden py-2 sm:py-3 md:py-4">
        <div className="flex scroll-container">
          {duplicatedLogos.map((logo, index) => (
            <div
              key={index}
              className="shrink-0 mx-2 sm:mx-4 md:mx-6 lg:mx-8 text-gray-400 hover:text-gray-700 transition-colors duration-300 cursor-pointer"
            >
              <img
                src={`/icons/${logo.toLowerCase()}-logo.svg`}
                alt={logo}
                className="h-6 sm:h-8 md:h-10 lg:h-12 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PartnersSection = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const isRTL = language === "ar";

  const statsData = [
    { number: "5+", label: t.stats.partners },
    { number: "2", label: t.stats.countries },
    { number: "$2M+", label: t.stats.funding },
    { number: "100+", label: t.stats.projects },
  ];

  return (
    <div
      className="w-full max-w-full min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50 py-6 sm:py-8 md:py-12 lg:py-16 px-3 sm:px-4 md:px-6 lg:px-8 overflow-x-hidden box-border"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <style>
        {`
          @keyframes fadeInScale {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto w-full ">
        <TrustedByBanner />

        <div
          style={{ animation: "fadeIn 1s ease-out 0.8s both" }}
          className="w-full"
        >
          <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 text-center shadow-2xl box-border">
            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 md:mb-4 lg:mb-6 px-2 wrap-break-words max-w-full">
              {t.becomePartner}
            </h3>
            <p className="text-blue-100 text-xs sm:text-sm md:text-base lg:text-lg mb-4 sm:mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-2 wrap-break-words">
              {t.partnershipDescription}
            </p>
            <div
              className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center ${
                isRTL ? "sm:flex-row-reverse" : ""
              }`}
            >
              <Button
                onClick={() => (window.location.href = "/about-us")}
                className="bg-white text-blue-600 font-semibold px-3 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-lg sm:rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:bg-gray-50 text-[11px] sm:text-sm md:text-base w-full sm:w-auto wrap-break-words"
              >
                {t.readMore}
              </Button>
              <Button
                onClick={() => (window.location.href = "/contact-us")}
                className="bg-transparent border-2 border-white text-white font-semibold px-3 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-lg sm:rounded-xl hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300 text-[11px] sm:text-sm md:text-base w-full sm:w-auto wrap-break-words"
              >
                {t.contactUs}
              </Button>
            </div>
          </div>
        </div>

        <div
          className="mt-6 sm:mt-8 md:mt-12 lg:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 w-full"
          style={{ animation: "fadeIn 1s ease-out 1s both" }}
        >
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="text-center p-3 sm:p-4 md:p-6 bg-white/50 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 box-border"
            >
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600 mb-1 sm:mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium text-[10px] sm:text-xs md:text-sm lg:text-base leading-tight px-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnersSection;
