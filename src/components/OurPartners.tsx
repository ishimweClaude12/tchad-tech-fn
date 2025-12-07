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
    <div className="pb-4 overflow-hidden ">
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
          }
          
          .scroll-container:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      <h1 className="text-center text-lg font-bold text-gray-600 uppercase tracking-wider mb-6">
        {t.trustedPartners}
      </h1>

      <div className="relative w-full py-4">
        <div className="flex scroll-container">
          {duplicatedLogos.map((logo, index) => (
            <div
              key={index}
              className="flex-shrink-0 mx-8 md:mx-12 text-gray-400 hover:text-gray-700 transition-colors duration-300 font-bold text-lg cursor-pointer whitespace-nowrap"
            >
              <img
                src={`assets/icons/${logo.toLowerCase()}-logo.svg`}
                alt={logo}
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
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-16 px-4"
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

      <div className="max-w-7xl lg:px-8 mx-auto">
        <TrustedByBanner />

        <div style={{ animation: "fadeIn 1s ease-out 0.8s both" }}>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center shadow-2xl">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t.becomePartner}
            </h3>
            <p className="text-blue-100 text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
              {t.partnershipDescription}
            </p>
            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center ${
                isRTL ? "sm:flex-row-reverse" : ""
              }`}
            >
              <button
                onClick={() => (window.location.href = "/about-us")}
                className="bg-white text-blue-600 font-semibold px-8 py-4 rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:bg-gray-50"
              >
                {t.readMore}
              </button>
              <button
                onClick={() => (window.location.href = "/contact-us")}
                className="bg-transparent border-2 border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300"
              >
                {t.contactUs}
              </button>
            </div>
          </div>
        </div>

        <div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          style={{ animation: "fadeIn 1s ease-out 1s both" }}
        >
          {statsData.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnersSection;
