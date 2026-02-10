import { useState } from "react";
import {
  Star,
  GraduationCap,
  Quote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { Button } from "@mui/material";

// Translations object
const translations = {
  en: {
    heading: "Success Stories That Inspire",
    subheading:
      "Real students, real transformations. See how our courses have changed lives and careers",
    before: "Before",
    after: "After",
    courseTaken: "Course Completed",
    achievement: "Key Achievement",
    timeframe: "Timeframe",
    watchVideo: "Watch Video",
    readMore: "Read Full Story",
    verified: "Verified Graduate",
    stories: [
      {
        name: "Michael Adeyemi",
        location: "Lagos, Nigeria",
        avatar: "MA",
        beforeRole: "Junior Web Developer",
        afterRole: "Senior Full-Stack Engineer at Tech Unicorn",
        course: "Advanced React & Node.js Masterclass",
        testimonial:
          "The hands-on projects and real-world scenarios in this course completely transformed my understanding of full-stack development. Within 6 months of completing the course, I landed my dream job with a 180% salary increase. The instructor's mentorship was invaluable.",
        rating: 5,
        achievement: "180% salary increase",
        timeframe: "6 months",
        salaryBefore: "$25k",
        salaryAfter: "$70k",
        hasVideo: true,
      },
      {
        name: "Amina Diallo",
        location: "Dakar, Senegal",
        avatar: "AD",
        beforeRole: "Marketing Assistant",
        afterRole: "Lead Data Analyst at Fortune 500",
        course: "Data Science & Machine Learning Bootcamp",
        testimonial:
          "I had zero coding experience when I started. The structured curriculum and supportive community made learning Python and ML algorithms approachable. Now I'm leading analytics projects for a global company. This platform changed my entire career trajectory.",
        rating: 5,
        achievement: "Career transition to tech",
        timeframe: "8 months",
        salaryBefore: "$18k",
        salaryAfter: "$65k",
        hasVideo: false,
      },
      {
        name: "Kofi Mensah",
        location: "Accra, Ghana",
        avatar: "KM",
        beforeRole: "Freelance Designer",
        afterRole: "UX Lead at Digital Agency",
        course: "Complete UX/UI Design Professional",
        testimonial:
          "This course taught me to think like a product designer, not just make things look pretty. The portfolio projects I built helped me land a leadership role. The investment in this course paid for itself within the first month of my new salary.",
        rating: 5,
        achievement: "Promoted to leadership",
        timeframe: "4 months",
        salaryBefore: "$30k",
        salaryAfter: "$85k",
        hasVideo: true,
      },
      {
        name: "Fatima El-Amin",
        location: "Cairo, Egypt",
        avatar: "FE",
        beforeRole: "Retail Manager",
        afterRole: "Cybersecurity Consultant",
        course: "Ethical Hacking & Security Professional",
        testimonial:
          "At 35, I thought it was too late to change careers. This course proved me wrong. The instructors were patient, the content was cutting-edge, and the job placement support was exceptional. I now help companies protect their digital assets.",
        rating: 5,
        achievement: "Complete career pivot",
        timeframe: "10 months",
        salaryBefore: "$22k",
        salaryAfter: "$68k",
        hasVideo: false,
      },
      {
        name: "Jean-Luc Kouassi",
        location: "Abidjan, Côte d'Ivoire",
        avatar: "JK",
        beforeRole: "Recent Graduate",
        afterRole: "Blockchain Developer at DeFi Startup",
        course: "Web3 & Smart Contract Development",
        testimonial:
          "This course positioned me at the forefront of blockchain technology. The practical smart contract projects gave me real portfolio pieces. I got multiple job offers before even completing the program. Best investment in my future.",
        rating: 5,
        achievement: "First job out of university",
        timeframe: "5 months",
        salaryBefore: "$0",
        salaryAfter: "$55k",
        hasVideo: true,
      },
      {
        name: "Aisha Bello",
        location: "Kano, Nigeria",
        avatar: "AB",
        beforeRole: "Teacher",
        afterRole: "Digital Marketing Manager",
        course: "Complete Digital Marketing & Growth",
        testimonial:
          "I wanted to transition from teaching to a remote career. This course covered everything from SEO to social media strategy. Now I work from home, manage campaigns for international clients, and have doubled my income while having more time with my family.",
        rating: 5,
        achievement: "Work-life balance + income",
        timeframe: "7 months",
        salaryBefore: "$15k",
        salaryAfter: "$45k",
        hasVideo: false,
      },
    ],
    stats: {
      avgIncrease: "156%",
      avgIncreaseLabel: "Average Salary Increase",
      graduated: "500+",
      graduatedLabel: "Successful Graduates",
      employed: "92%",
      employedLabel: "Got Jobs Within 6 Months",
      satisfaction: "4.9/5",
      satisfactionLabel: "Student Satisfaction",
    },
  },
  fr: {
    heading: "Histoires de Réussite Inspirantes",
    subheading:
      "De vrais étudiants, de vraies transformations. Découvrez comment nos cours ont changé des vies et des carrières",
    viewAll: "Voir Toutes les Success Stories",
    before: "Avant",
    after: "Après",
    courseTaken: "Cours Complété",
    achievement: "Réalisation Clé",
    timeframe: "Période",
    watchVideo: "Regarder la Vidéo",
    readMore: "Lire l'Histoire Complète",
    verified: "Diplômé Vérifié",
    stories: [
      {
        name: "Michael Adeyemi",
        location: "Lagos, Nigeria",
        avatar: "MA",
        beforeRole: "Développeur Web Junior",
        afterRole: "Ingénieur Full-Stack Senior chez Tech Unicorn",
        course: "Masterclass Avancée React & Node.js",
        testimonial:
          "Les projets pratiques et scénarios réels de ce cours ont complètement transformé ma compréhension du développement full-stack. Dans les 6 mois suivant l'achèvement du cours, j'ai décroché mon emploi de rêve avec une augmentation de salaire de 180%. Le mentorat de l'instructeur était inestimable.",
        rating: 5,
        achievement: "Augmentation de salaire de 180%",
        timeframe: "6 mois",
        salaryBefore: "25k$",
        salaryAfter: "70k$",
        hasVideo: true,
      },
      {
        name: "Amina Diallo",
        location: "Dakar, Sénégal",
        avatar: "AD",
        beforeRole: "Assistante Marketing",
        afterRole: "Analyste de Données Principal chez Fortune 500",
        course: "Bootcamp Data Science & Machine Learning",
        testimonial:
          "Je n'avais aucune expérience en codage quand j'ai commencé. Le curriculum structuré et la communauté de soutien ont rendu l'apprentissage de Python et des algorithmes ML accessible. Maintenant je dirige des projets d'analyse pour une entreprise mondiale. Cette plateforme a changé toute ma trajectoire professionnelle.",
        rating: 5,
        achievement: "Transition de carrière vers la tech",
        timeframe: "8 mois",
        salaryBefore: "18k$",
        salaryAfter: "65k$",
        hasVideo: false,
      },
      {
        name: "Kofi Mensah",
        location: "Accra, Ghana",
        avatar: "KM",
        beforeRole: "Designer Freelance",
        afterRole: "Responsable UX chez Agence Digitale",
        course: "UX/UI Design Professionnel Complet",
        testimonial:
          "Ce cours m'a appris à penser comme un designer de produit, pas seulement à embellir les choses. Les projets de portfolio que j'ai construits m'ont aidé à décrocher un poste de leadership. L'investissement dans ce cours s'est remboursé dès le premier mois de mon nouveau salaire.",
        rating: 5,
        achievement: "Promu au leadership",
        timeframe: "4 mois",
        salaryBefore: "30k$",
        salaryAfter: "85k$",
        hasVideo: true,
      },
      {
        name: "Fatima El-Amin",
        location: "Le Caire, Égypte",
        avatar: "FE",
        beforeRole: "Responsable Retail",
        afterRole: "Consultante en Cybersécurité",
        course: "Hacking Éthique & Sécurité Professionnelle",
        testimonial:
          "À 35 ans, je pensais qu'il était trop tard pour changer de carrière. Ce cours m'a prouvé le contraire. Les instructeurs étaient patients, le contenu était de pointe, et le soutien au placement professionnel était exceptionnel. J'aide maintenant les entreprises à protéger leurs actifs numériques.",
        rating: 5,
        achievement: "Changement complet de carrière",
        timeframe: "10 mois",
        salaryBefore: "22k$",
        salaryAfter: "68k$",
        hasVideo: false,
      },
      {
        name: "Jean-Luc Kouassi",
        location: "Abidjan, Côte d'Ivoire",
        avatar: "JK",
        beforeRole: "Récent Diplômé",
        afterRole: "Développeur Blockchain chez Startup DeFi",
        course: "Développement Web3 & Smart Contract",
        testimonial:
          "Ce cours m'a positionné à la pointe de la technologie blockchain. Les projets pratiques de smart contracts m'ont donné de vrais éléments de portfolio. J'ai reçu plusieurs offres d'emploi avant même de terminer le programme. Meilleur investissement dans mon avenir.",
        rating: 5,
        achievement: "Premier emploi après l'université",
        timeframe: "5 mois",
        salaryBefore: "0$",
        salaryAfter: "55k$",
        hasVideo: true,
      },
      {
        name: "Aisha Bello",
        location: "Kano, Nigeria",
        avatar: "AB",
        beforeRole: "Enseignante",
        afterRole: "Responsable Marketing Digital",
        course: "Marketing Digital & Croissance Complet",
        testimonial:
          "Je voulais passer de l'enseignement à une carrière à distance. Ce cours couvrait tout du SEO à la stratégie des médias sociaux. Maintenant je travaille de chez moi, gère des campagnes pour des clients internationaux, et j'ai doublé mon revenu tout en ayant plus de temps avec ma famille.",
        rating: 5,
        achievement: "Équilibre vie-travail + revenu",
        timeframe: "7 mois",
        salaryBefore: "15k$",
        salaryAfter: "45k$",
        hasVideo: false,
      },
    ],
    stats: {
      avgIncrease: "156%",
      avgIncreaseLabel: "Augmentation Moyenne du Salaire",
      graduated: "10 000+",
      graduatedLabel: "Diplômés Réussis",
      employed: "92%",
      employedLabel: "Ont Trouvé un Emploi en 6 Mois",
      satisfaction: "4,9/5",
      satisfactionLabel: "Satisfaction Étudiante",
    },
  },
  ar: {
    heading: "قصص نجاح ملهمة",
    subheading:
      "طلاب حقيقيون، تحولات حقيقية. شاهد كيف غيرت دوراتنا الحياة والمسيرات المهنية",
    viewAll: "عرض جميع قصص النجاح",
    before: "قبل",
    after: "بعد",
    courseTaken: "الدورة المكتملة",
    achievement: "الإنجاز الرئيسي",
    timeframe: "الإطار الزمني",
    watchVideo: "مشاهدة الفيديو",
    readMore: "قراءة القصة الكاملة",
    verified: "خريج موثق",
    stories: [
      {
        name: "مايكل أديمي",
        location: "لاغوس، نيجيريا",
        avatar: "MA",
        beforeRole: "مطور ويب مبتدئ",
        afterRole: "مهندس Full-Stack أول في شركة تقنية كبرى",
        course: "ماستركلاس React و Node.js المتقدم",
        testimonial:
          "المشاريع العملية والسيناريوهات الواقعية في هذه الدورة حولت فهمي للتطوير الشامل بالكامل. في غضون 6 أشهر من إكمال الدورة، حصلت على وظيفة أحلامي بزيادة راتب 180٪. كان توجيه المدرب لا يقدر بثمن.",
        rating: 5,
        achievement: "زيادة راتب بنسبة 180٪",
        timeframe: "6 أشهر",
        salaryBefore: "25 ألف$",
        salaryAfter: "70 ألف$",
        hasVideo: true,
      },
      {
        name: "أمينة ديالو",
        location: "داكار، السنغال",
        avatar: "AD",
        beforeRole: "مساعدة تسويق",
        afterRole: "محللة بيانات رئيسية في شركة Fortune 500",
        course: "معسكر علوم البيانات والتعلم الآلي",
        testimonial:
          "لم تكن لدي أي خبرة في البرمجة عندما بدأت. جعل المنهج المنظم والمجتمع الداعم تعلم Python وخوارزميات ML سهل المنال. الآن أقود مشاريع التحليلات لشركة عالمية. غيرت هذه المنصة مسار حياتي المهنية بالكامل.",
        rating: 5,
        achievement: "تحول مهني إلى التكنولوجيا",
        timeframe: "8 أشهر",
        salaryBefore: "18 ألف$",
        salaryAfter: "65 ألف$",
        hasVideo: false,
      },
      {
        name: "كوفي منساه",
        location: "أكرا، غانا",
        avatar: "KM",
        beforeRole: "مصمم حر",
        afterRole: "قائد UX في وكالة رقمية",
        course: "تصميم UX/UI الاحترافي الكامل",
        testimonial:
          "علمتني هذه الدورة التفكير كمصمم منتجات، وليس فقط جعل الأشياء تبدو جميلة. ساعدتني مشاريع الملف الشخصي التي بنيتها في الحصول على دور قيادي. استثماري في هذه الدورة سدد نفسه خلال الشهر الأول من راتبي الجديد.",
        rating: 5,
        achievement: "ترقية للقيادة",
        timeframe: "4 أشهر",
        salaryBefore: "30 ألف$",
        salaryAfter: "85 ألف$",
        hasVideo: true,
      },
      {
        name: "فاطمة الأمين",
        location: "القاهرة، مصر",
        avatar: "FE",
        beforeRole: "مديرة متجر",
        afterRole: "مستشارة أمن سيبراني",
        course: "الاختراق الأخلاقي والأمن الاحترافي",
        testimonial:
          "في سن 35، اعتقدت أنه فات الأوان لتغيير المهنة. أثبتت لي هذه الدورة خطأي. كان المدرسون صبورين، والمحتوى متطورًا، ودعم التوظيف استثنائيًا. أساعد الآن الشركات على حماية أصولها الرقمية.",
        rating: 5,
        achievement: "تحول مهني كامل",
        timeframe: "10 أشهر",
        salaryBefore: "22 ألف$",
        salaryAfter: "68 ألف$",
        hasVideo: false,
      },
      {
        name: "جان لوك كواسي",
        location: "أبيدجان، ساحل العاج",
        avatar: "JK",
        beforeRole: "خريج حديث",
        afterRole: "مطور بلوكشين في شركة DeFi ناشئة",
        course: "تطوير Web3 والعقود الذكية",
        testimonial:
          "وضعتني هذه الدورة في طليعة تكنولوجيا البلوكشين. أعطتني مشاريع العقود الذكية العملية قطع ملف شخصي حقيقية. حصلت على عروض عمل متعددة قبل حتى إكمال البرنامج. أفضل استثمار في مستقبلي.",
        rating: 5,
        achievement: "أول وظيفة بعد الجامعة",
        timeframe: "5 أشهر",
        salaryBefore: "0$",
        salaryAfter: "55 ألف$",
        hasVideo: true,
      },
      {
        name: "عائشة بيلو",
        location: "كانو، نيجيريا",
        avatar: "AB",
        beforeRole: "معلمة",
        afterRole: "مديرة تسويق رقمي",
        course: "التسويق الرقمي والنمو الكامل",
        testimonial:
          "أردت الانتقال من التدريس إلى مهنة عن بعد. غطت هذه الدورة كل شيء من SEO إلى استراتيجية وسائل التواصل الاجتماعي. الآن أعمل من المنزل، أدير حملات لعملاء دوليين، وضاعفت دخلي بينما أمتلك وقتًا أكثر مع عائلتي.",
        rating: 5,
        achievement: "توازن العمل والحياة + الدخل",
        timeframe: "7 أشهر",
        salaryBefore: "15 ألف$",
        salaryAfter: "45 ألف$",
        hasVideo: false,
      },
    ],
    stats: {
      avgIncrease: "156%",
      avgIncreaseLabel: "متوسط الزيادة في الراتب",
      graduated: "+10,000",
      graduatedLabel: "خريج ناجح",
      employed: "92%",
      employedLabel: "حصلوا على وظائف خلال 6 أشهر",
      satisfaction: "4.9/5",
      satisfactionLabel: "رضا الطلاب",
    },
  },
};

const StudentTestimonials = () => {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const t = translations[language];
  const isRTL = language === "ar";

  const storiesPerView = 2;
  const maxIndex = Math.max(0, t.stories.length - storiesPerView);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  // Color palette for avatars
  const avatarColors = [
    "bg-gradient-to-br from-blue-500 to-blue-600",
    "bg-gradient-to-br from-green-500 to-green-600",
    "bg-gradient-to-br from-purple-500 to-purple-600",
    "bg-gradient-to-br from-orange-500 to-orange-600",
    "bg-gradient-to-br from-pink-500 to-pink-600",
    "bg-gradient-to-br from-indigo-500 to-indigo-600",
  ];

  return (
    <section
      className={`py-16 px-4 bg-linear-to-b from-blue-50 to-white ${
        isRTL ? "rtl" : "ltr"
      }`}
    >
      <div className="max-w-7xl lg:px-8 mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t.heading}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {t.subheading}
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative mb-12">
          {/* Navigation Buttons */}
          {t.stories.length > storiesPerView && (
            <>
              <Button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className={`absolute ${
                  isRTL ? "right-0" : "left-0"
                } top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-blue-300`}
                aria-label="Previous testimonials"
              >
                {isRTL ? (
                  <ChevronRight className="w-6 h-6 text-gray-700" />
                ) : (
                  <ChevronLeft className="w-6 h-6 text-gray-700" />
                )}
              </Button>
              <Button
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                className={`absolute ${
                  isRTL ? "left-0" : "right-0"
                } top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-blue-300`}
                aria-label="Next testimonials"
              >
                {isRTL ? (
                  <ChevronLeft className="w-6 h-6 text-gray-700" />
                ) : (
                  <ChevronRight className="w-6 h-6 text-gray-700" />
                )}
              </Button>
            </>
          )}

          {/* Stories Grid */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out gap-6 pb-4"
              style={{
                transform: `translateX(${
                  isRTL
                    ? currentIndex * (100 / storiesPerView)
                    : -currentIndex * (100 / storiesPerView)
                }%)`,
              }}
            >
              {t.stories.map((story, index) => (
                <div
                  key={index}
                  className="shrink-0 w-full md:w-1/2 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-8 border border-gray-100"
                  style={{ minWidth: "calc(50% - 12px)" }}
                >
                  {/* Quote Icon */}
                  <div className="mb-4">
                    <Quote
                      className="w-10 h-10 text-blue-200"
                      aria-hidden="true"
                    />
                  </div>

                  {/* Student Info */}
                  <div className="flex items-start gap-4 mb-6">
                    <div
                      className={`w-16 h-16 rounded-full ${
                        avatarColors[index % avatarColors.length]
                      } flex items-center justify-center text-white text-xl font-bold shrink-0`}
                    >
                      {story.avatar}
                    </div>
                    <div className="grow">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {story.name}
                        </h3>
                        <GraduationCap
                          className="w-4 h-4 text-green-600"
                          aria-label={t.verified}
                        />
                      </div>
                      <p className="text-sm text-gray-600">{story.location}</p>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mt-2">
                        {[...Array(story.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-yellow-500 fill-yellow-500"
                            aria-hidden="true"
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">
                          {story.rating}.0
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-gray-700 leading-relaxed mb-6 italic">
                    "{story.testimonial}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentTestimonials;
