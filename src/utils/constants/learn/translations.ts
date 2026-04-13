import type { Language } from "src/contexts/LanguageContext";

// ---------------------------------------------------------------------------
// Hero Section
// ---------------------------------------------------------------------------

interface HeroStats {
  students: string;
  courses: string;
  instructors: string;
  satisfaction: string;
}

export interface HeroContent {
  tagline: string;
  headline: string;
  subheadline: string;
  ctaPrimary: string;
  ctaSecondary: string;
  stats: HeroStats;
  imageAlt: string;
}

export const heroTranslations: Record<Language, HeroContent> = {
  en: {
    tagline: "Transform Your Future",
    headline: "Master New Skills with Expert-Led Courses",
    subheadline:
      "Join thousands of learners advancing their careers through industry-relevant courses, hands-on projects, and globally recognized certifications.",
    ctaPrimary: "Explore Courses",
    ctaSecondary: "View Learning Paths",
    stats: {
      students: "500+ Active Students",
      courses: "50+ Courses",
      instructors: "100+ Expert Instructors",
      satisfaction: "95% Satisfaction Rate",
    },
    imageAlt: "Students learning online with expert instructors",
  },
  fr: {
    tagline: "Transformez Votre Avenir",
    headline: "Maîtrisez de Nouvelles Compétences avec des Cours d'Experts",
    subheadline:
      "Rejoignez des milliers d'apprenants qui font progresser leur carrière grâce à des cours pertinents, des projets pratiques et des certifications reconnues mondialement.",
    ctaPrimary: "Explorer les Cours",
    ctaSecondary: "Voir les Parcours",
    stats: {
      students: "10 000+ Étudiants Actifs",
      courses: "50+ Cours",
      instructors: "100+ Instructeurs Experts",
      satisfaction: "95% de Satisfaction",
    },
    imageAlt: "Étudiants apprenant en ligne avec des instructeurs experts",
  },
  ar: {
    tagline: "حوّل مستقبلك",
    headline: "أتقن مهارات جديدة مع دورات يقودها خبراء",
    subheadline:
      "انضم إلى آلاف المتعلمين الذين يطورون مسيرتهم المهنية من خلال دورات ذات صلة بالصناعة ومشاريع عملية وشهادات معترف بها عالميًا.",
    ctaPrimary: "استكشف الدورات",
    ctaSecondary: "عرض مسارات التعلم",
    stats: {
      students: "أكثر من 10,000 طالب نشط",
      courses: "أكثر من 500 دورة",
      instructors: "أكثر من 100 مدرب خبير",
      satisfaction: "معدل رضا 95%",
    },
    imageAlt: "طلاب يتعلمون عبر الإنترنت مع مدربين خبراء",
  },
};

// ---------------------------------------------------------------------------
// Courses Section
// ---------------------------------------------------------------------------

export const coursesSectionTranslations: Record<
  Language,
  { heading: string; subheading: string; errorLoading: string }
> = {
  en: {
    heading: "Browse Courses",
    subheading:
      "Explore our wide range of courses designed to help you learn and grow",
    errorLoading: "Error loading courses.",
  },
  fr: {
    heading: "Parcourir les Cours",
    subheading:
      "Explorez notre large gamme de cours conçus pour vous aider à apprendre et à progresser",
    errorLoading: "Erreur lors du chargement des cours.",
  },
  ar: {
    heading: "استعراض الدورات",
    subheading:
      "استكشف نطاقنا الواسع من الدورات المصممة لمساعدتك على التعلم والنمو",
    errorLoading: "خطأ في تحميل الدورات.",
  },
};

// ---------------------------------------------------------------------------
// Enrolled Courses Section
// ---------------------------------------------------------------------------

export const enrolledSectionTranslations: Record<
  Language,
  { heading: string; subheading: string }
> = {
  en: {
    heading: "My Courses",
    subheading: "Track your learning progress and manage your enrollments",
  },
  fr: {
    heading: "Mes Cours",
    subheading: "Suivez votre progression et gérez vos inscriptions",
  },
  ar: {
    heading: "دوراتي",
    subheading: "تتبع تقدمك في التعلم وإدارة تسجيلاتك",
  },
};

// ---------------------------------------------------------------------------
// Why Learn With Us
// ---------------------------------------------------------------------------

interface WhyLearnBenefit {
  icon: string;
  title: string;
  description: string;
}

interface WhyLearnStats {
  students: string;
  studentsLabel: string;
  completion: string;
  completionLabel: string;
  satisfaction: string;
  satisfactionLabel: string;
  courses: string;
  coursesLabel: string;
}

export interface WhyLearnContent {
  heading: string;
  subheading: string;
  benefits: WhyLearnBenefit[];
  cta: string;
  stats: WhyLearnStats;
}

export const whyLearnTranslations: Record<Language, WhyLearnContent> = {
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

// ---------------------------------------------------------------------------
// Student Testimonials
// ---------------------------------------------------------------------------

interface TestimonialStory {
  name: string;
  location: string;
  avatar: string;
  beforeRole: string;
  afterRole: string;
  course: string;
  testimonial: string;
  rating: number;
  achievement: string;
  timeframe: string;
  salaryBefore: string;
  salaryAfter: string;
  hasVideo: boolean;
}

interface TestimonialsStats {
  avgIncrease: string;
  avgIncreaseLabel: string;
  graduated: string;
  graduatedLabel: string;
  employed: string;
  employedLabel: string;
  satisfaction: string;
  satisfactionLabel: string;
}

export interface TestimonialsContent {
  heading: string;
  subheading: string;
  before: string;
  after: string;
  courseTaken: string;
  achievement: string;
  timeframe: string;
  watchVideo: string;
  readMore: string;
  verified: string;
  stories: TestimonialStory[];
  stats: TestimonialsStats;
}

export const testimonialsTranslations: Record<Language, TestimonialsContent> = {
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
