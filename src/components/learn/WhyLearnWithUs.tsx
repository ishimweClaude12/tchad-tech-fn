import {
  Award,
  BookOpen,
  Users,
  TrendingUp,
  Clock,
  Target,
  CheckCircle,
  Zap,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

// Translations object
const translations = {
  en: {
    heading: "Why Learn With Us?",
    subheading:
      "Join thousands of learners transforming their careers and building skills for the future",
    benefits: [
      {
        icon: "Award",
        title: "Industry-Recognized Certifications",
        description:
          "Earn certificates that employers value and showcase your expertise to the world",
      },
      {
        icon: "BookOpen",
        title: "Expert-Led Curriculum",
        description:
          "Learn from industry professionals with real-world experience and proven teaching methods",
      },
      {
        icon: "Clock",
        title: "Learn at Your Own Pace",
        description:
          "Flexible scheduling that fits your lifestyle with lifetime access to course materials",
      },
      {
        icon: "Users",
        title: "Active Learning Community",
        description:
          "Connect with peers, mentors, and instructors in our vibrant learning ecosystem",
      },
      {
        icon: "Target",
        title: "Hands-On Projects",
        description:
          "Build real-world projects that strengthen your portfolio and demonstrate your skills",
      },
      {
        icon: "TrendingUp",
        title: "Career Advancement",
        description:
          "Gain skills that lead to promotions, career changes, and increased earning potential",
      },
      {
        icon: "Zap",
        title: "Cutting-Edge Content",
        description:
          "Stay ahead with courses updated regularly to match industry trends and demands",
      },
      {
        icon: "CheckCircle",
        title: "Proven Results",
        description:
          "Join 10,000+ successful graduates who've transformed their professional lives",
      },
    ],
    cta: "Start Learning Today",
    stats: {
      students: "500+",
      studentsLabel: "Active Learners",
      completion: "85%",
      completionLabel: "Completion Rate",
      satisfaction: "4.8/5",
      satisfactionLabel: "Student Rating",
      courses: "50+",
      coursesLabel: "Courses Available",
    },
  },
  fr: {
    heading: "Pourquoi Apprendre Avec Nous?",
    subheading:
      "Rejoignez des milliers d'apprenants qui transforment leur carrière et développent des compétences pour l'avenir",
    benefits: [
      {
        icon: "Award",
        title: "Certifications Reconnues",
        description:
          "Obtenez des certificats valorisés par les employeurs et présentez votre expertise au monde",
      },
      {
        icon: "BookOpen",
        title: "Programme d'Experts",
        description:
          "Apprenez auprès de professionnels avec une expérience réelle et des méthodes éprouvées",
      },
      {
        icon: "Clock",
        title: "Apprenez à Votre Rythme",
        description:
          "Horaires flexibles adaptés à votre style de vie avec accès à vie aux cours",
      },
      {
        icon: "Users",
        title: "Communauté d'Apprentissage",
        description:
          "Connectez-vous avec des pairs, mentors et instructeurs dans notre écosystème vibrant",
      },
      {
        icon: "Target",
        title: "Projets Pratiques",
        description:
          "Créez des projets réels qui enrichissent votre portfolio et démontrent vos compétences",
      },
      {
        icon: "TrendingUp",
        title: "Avancement de Carrière",
        description:
          "Acquérez des compétences menant à des promotions et une augmentation de revenus",
      },
      {
        icon: "Zap",
        title: "Contenu à la Pointe",
        description:
          "Restez en avance avec des cours mis à jour selon les tendances de l'industrie",
      },
      {
        icon: "CheckCircle",
        title: "Résultats Prouvés",
        description:
          "Rejoignez 10 000+ diplômés qui ont transformé leur vie professionnelle",
      },
    ],
    cta: "Commencer l'Apprentissage",
    stats: {
      students: "10 000+",
      studentsLabel: "Apprenants Actifs",
      completion: "85%",
      completionLabel: "Taux de Réussite",
      satisfaction: "4,8/5",
      satisfactionLabel: "Note des Étudiants",
      courses: "50+",
      coursesLabel: "Cours Disponibles",
    },
  },
  ar: {
    heading: "لماذا التعلم معنا؟",
    subheading:
      "انضم إلى آلاف المتعلمين الذين يحولون مسيرتهم المهنية ويبنون مهارات المستقبل",
    benefits: [
      {
        icon: "Award",
        title: "شهادات معترف بها",
        description: "احصل على شهادات يقدرها أصحاب العمل واعرض خبرتك للعالم",
      },
      {
        icon: "BookOpen",
        title: "منهج من الخبراء",
        description: "تعلم من محترفين ذوي خبرة واقعية وطرق تدريس مثبتة",
      },
      {
        icon: "Clock",
        title: "تعلم بالسرعة التي تناسبك",
        description:
          "جدولة مرنة تناسب نمط حياتك مع وصول مدى الحياة للمواد الدراسية",
      },
      {
        icon: "Users",
        title: "مجتمع تعليمي نشط",
        description:
          "تواصل مع الأقران والمرشدين والمدرسين في نظامنا التعليمي النابض بالحياة",
      },
      {
        icon: "Target",
        title: "مشاريع عملية",
        description: "انشئ مشاريع واقعية تقوي ملفك الشخصي وتظهر مهاراتك",
      },
      {
        icon: "TrendingUp",
        title: "تقدم مهني",
        description:
          "اكتسب مهارات تؤدي إلى الترقيات وتغيير المسار المهني وزيادة الدخل",
      },
      {
        icon: "Zap",
        title: "محتوى متطور",
        description:
          "ابق في المقدمة مع دورات محدثة بانتظام لتناسب اتجاهات الصناعة",
      },
      {
        icon: "CheckCircle",
        title: "نتائج مثبتة",
        description: "انضم إلى أكثر من 10000 خريج ناجح حولوا حياتهم المهنية",
      },
    ],
    cta: "ابدأ التعلم اليوم",
    stats: {
      students: "+10,000",
      studentsLabel: "متعلم نشط",
      completion: "85%",
      completionLabel: "معدل الإكمال",
      satisfaction: "4.8/5",
      satisfactionLabel: "تقييم الطلاب",
      courses: "+50",
      coursesLabel: "دورة متاحة",
    },
  },
};

// Icon mapping component
const IconMap = {
  Award,
  BookOpen,
  Users,
  TrendingUp,
  Clock,
  Target,
  CheckCircle,
  Zap,
};

const WhyLearnWithUs = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const isRTL = language === "ar";

  return (
    <section
      className={`py-16 px-4 bg-linear-to-b from-white to-blue-50 ${
        isRTL ? "rtl" : "ltr"
      }`}
    >
      <div className="  lg:px-8 mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t.heading}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {t.subheading}
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-5xl mx-auto">
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">
              {t.stats.students}
            </div>
            <div className="text-sm md:text-base text-gray-600">
              {t.stats.studentsLabel}
            </div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-3xl md:text-4xl font-bold text-green-600 mb-1">
              {t.stats.completion}
            </div>
            <div className="text-sm md:text-base text-gray-600">
              {t.stats.completionLabel}
            </div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-3xl md:text-4xl font-bold text-yellow-600 mb-1">
              {t.stats.satisfaction}
            </div>
            <div className="text-sm md:text-base text-gray-600">
              {t.stats.satisfactionLabel}
            </div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-1">
              {t.stats.courses}
            </div>
            <div className="text-sm md:text-base text-gray-600">
              {t.stats.coursesLabel}
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {t.benefits.map((benefit, index) => {
            const IconComponent = IconMap[benefit.icon as keyof typeof IconMap];
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                    <IconComponent
                      className="w-7 h-7 text-blue-600"
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
            aria-label={t.cta}
          >
            {t.cta}
          </button>
        </div>
      </div>
    </section>
  );
};

export default WhyLearnWithUs;
