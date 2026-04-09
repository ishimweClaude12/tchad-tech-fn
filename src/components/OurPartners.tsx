import { Button, Typography, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

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

function TrustedByBanner() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="pb-6 overflow-hidden w-full">
      <Typography
        variant="overline"
        component="h2"
        className="block text-center font-bold tracking-widest mb-4"
        sx={{ color: "text.secondary" }}
      >
        {t.trustedPartners}
      </Typography>

      <div className="relative w-full overflow-hidden py-3 group">
        {/* Gradient masks */}
        <div className="absolute left-0 top-0 h-full w-16 lg:w-24 bg-linear-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 h-full w-16 lg:w-24 bg-linear-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

        <div
          className="flex group-hover:[animation-play-state:paused]"
          style={{
            animation: "scrollRight 30s linear infinite",
            width: "max-content",
            willChange: "transform",
          }}
        >
          {duplicatedLogos.map((logo, index) => (
            <div
              key={index}
              className="shrink-0 mx-6 lg:mx-12 flex items-center"
            >
              <img
                src={`/icons/${logo.toLowerCase().replaceAll(" ", "-")}-logo.svg`}
                alt={logo}
                className="h-8 md:h-10 lg:h-14 w-auto object-contain opacity-50 hover:opacity-80 transition-opacity"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Keyframe defined via a style tag once — minimal footprint */}
      <style>{`@keyframes scrollRight { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </div>
  );
}

export default function PartnersSection() {
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
    <section
      className="w-full py-12 lg:py-24 px-4 sm:px-6 lg:px-16 xl:px-24 bg-linear-to-br from-gray-50 via-white to-blue-50 overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto">
        <TrustedByBanner />

        {/* Partnership CTA */}
        <Paper
          elevation={0}
          className="rounded-3xl p-8 lg:p-16 xl:p-20 text-center mb-12 lg:mb-16"
          sx={{ background: "linear-gradient(135deg, #1d4ed8, #7c3aed)" }}
        >
          <Typography
            variant="h3"
            component="h2"
            className="font-bold mb-4 lg:mb-6"
            sx={{ color: "white" }}
          >
            {t.becomePartner}
          </Typography>
          <Typography
            variant="body1"
            className="max-w-3xl mx-auto mb-8 lg:text-lg"
            sx={{ color: "#ddd6fe" }}
          >
            {t.partnershipDescription}
          </Typography>
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? "sm:flex-row-reverse" : ""}`}
          >
            <Button
              component={Link}
              to="/about-us"
              variant="contained"
              size="large"
              sx={{
                bgcolor: "white",
                color: "primary.main",
                "&:hover": { bgcolor: "grey.100" },
                fontWeight: 600,
              }}
            >
              {t.readMore}
            </Button>
            <Button
              component={Link}
              to="/contact-us"
              variant="outlined"
              size="large"
              sx={{
                borderColor: "rgba(255,255,255,0.7)",
                color: "white",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.15)",
                  borderColor: "white",
                },
                fontWeight: 600,
              }}
            >
              {t.contactUs}
            </Button>
          </div>
        </Paper>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {statsData.map((stat) => (
            <Paper
              key={stat.label}
              elevation={1}
              className="text-center p-5 lg:p-8 rounded-xl hover:shadow-md transition-shadow"
            >
              <Typography
                variant="h3"
                component="p"
                className="font-bold mb-1"
                sx={{ color: "primary.main" }}
              >
                {stat.number}
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                {stat.label}
              </Typography>
            </Paper>
          ))}
        </div>
      </div>
    </section>
  );
}
