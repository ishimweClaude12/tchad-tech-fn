import React, { useState } from "react";
import {
  ChevronDown,
  Cpu,
  Code,
  Shield,
  GraduationCap,
  Wrench,
  Megaphone,
  Briefcase,
  Monitor,
  Wifi,
  Smartphone,
  Home,
  Gamepad2,
  Printer,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

interface ServiceCategory {
  icon: React.ElementType;
  title: { en: string; fr: string; ar: string };
  items: { en: string; fr: string; ar: string }[];
}

const ServicesSection: React.FC = () => {
  const { language } = useLanguage();
  const [expandedCategory, setExpandedCategory] = useState<number | null>(0);

  const translations = {
    mainTitle: {
      en: "Our Services, Products & Courses",
      fr: "Nos Services, Produits & Cours",
      ar: "خدماتنا ومنتجاتنا ودوراتنا",
    },
    subtitle: {
      en: "Comprehensive tech solutions for businesses, innovators, and individuals",
      fr: "Solutions technologiques complètes pour entreprises, innovateurs et particuliers",
      ar: "حلول تقنية شاملة للشركات والمبتكرين والأفراد",
    },
    servicesTab: {
      en: "Services",
      fr: "Services",
      ar: "الخدمات",
    },
    productsTab: {
      en: "Products",
      fr: "Produits",
      ar: "المنتجات",
    },
    coursesTab: {
      en: "Courses",
      fr: "Courses",
      ar: "الدورات",
    },
  };

  const services: ServiceCategory[] = [
    {
      icon: Cpu,
      title: {
        en: "AI & Data Science Solutions",
        fr: "Solutions IA & Science des Données",
        ar: "حلول الذكاء الاصطناعي وعلوم البيانات",
      },
      items: [
        {
          en: "AI-Based Chatbots & Virtual Assistants",
          fr: "Chatbots IA & Assistants Virtuels",
          ar: "روبوتات الدردشة والمساعدين الافتراضيين",
        },
        {
          en: "Computer Vision & Image Recognition Systems",
          fr: "Vision par Ordinateur & Reconnaissance d'Images",
          ar: "أنظمة الرؤية الحاسوبية والتعرف على الصور",
        },
        {
          en: "Predictive Analytics & Data Visualization",
          fr: "Analyses Prédictives & Visualisation de Données",
          ar: "التحليلات التنبؤية وتصور البيانات",
        },
        {
          en: "AI-powered Business Automation",
          fr: "Automatisation des Affaires par IA",
          ar: "أتمتة الأعمال المدعومة بالذكاء الاصطناعي",
        },
        {
          en: "Natural Language Processing (NLP) Solutions",
          fr: "Solutions de Traitement du Langage Naturel",
          ar: "حلول معالجة اللغة الطبيعية",
        },
      ],
    },
    {
      icon: Code,
      title: {
        en: "Software Development & Engineering",
        fr: "Développement Logiciel & Ingénierie",
        ar: "تطوير البرمجيات والهندسة",
      },
      items: [
        {
          en: "Custom Software Development (Web, Mobile, Desktop)",
          fr: "Développement Logiciel Sur Mesure (Web, Mobile, Desktop)",
          ar: "تطوير برمجيات مخصصة (ويب، موبايل، سطح المكتب)",
        },
        {
          en: "Cloud-Based Application Development",
          fr: "Développement d'Applications Cloud",
          ar: "تطوير التطبيقات السحابية",
        },
        {
          en: "ERP & CRM System Implementation",
          fr: "Implémentation de Systèmes ERP & CRM",
          ar: "تنفيذ أنظمة تخطيط موارد المؤسسات وإدارة العملاء",
        },
      ],
    },
    {
      icon: Shield,
      title: {
        en: "IT Solutions & Maintenance",
        fr: "Solutions IT & Maintenance",
        ar: "حلول تقنية المعلومات والصيانة",
      },
      items: [
        {
          en: "IT Infrastructure Setup & Management",
          fr: "Configuration & Gestion d'Infrastructure IT",
          ar: "إعداد وإدارة البنية التحتية لتقنية المعلومات",
        },
        {
          en: "Network Configuration & Optimization",
          fr: "Configuration & Optimisation Réseau",
          ar: "تكوين وتحسين الشبكات",
        },
        {
          en: "Server Maintenance & Cloud Computing Solutions",
          fr: "Maintenance de Serveurs & Solutions Cloud",
          ar: "صيانة الخوادم وحلول الحوسبة السحابية",
        },
        {
          en: "IT Security & Cybersecurity Services",
          fr: "Sécurité IT & Services de Cybersécurité",
          ar: "أمن تقنية المعلومات وخدمات الأمن السيبراني",
        },
        {
          en: "Backup & Disaster Recovery Solutions",
          fr: "Solutions de Sauvegarde & Reprise après Sinistre",
          ar: "حلول النسخ الاحتياطي والتعافي من الكوارث",
        },
      ],
    },
    {
      icon: Briefcase,
      title: {
        en: "Innovation & Research Services",
        fr: "Services d'Innovation & Recherche",
        ar: "خدمات الابتكار والبحث",
      },
      items: [
        {
          en: "IoT Solutions (Smart Devices, Industrial IoT, Home Automation)",
          fr: "Solutions IoT (Appareils Connectés, IoT Industriel, Domotique)",
          ar: "حلول إنترنت الأشياء (الأجهزة الذكية، إنترنت الأشياء الصناعي، الأتمتة المنزلية)",
        },
        {
          en: "Research & Data Collection for Government & Organizations",
          fr: "Recherche & Collecte de Données pour Gouvernements & Organisations",
          ar: "البحث وجمع البيانات للحكومات والمنظمات",
        },
        {
          en: "Digital Consultancy for Businesses & Start-ups",
          fr: "Conseil Digital pour Entreprises & Start-ups",
          ar: "الاستشارات الرقمية للشركات والشركات الناشئة",
        },
        {
          en: "Tech Strategy & Digital Transformation Services",
          fr: "Stratégie Tech & Services de Transformation Digitale",
          ar: "استراتيجية التكنولوجيا وخدمات التحول الرقمي",
        },
        {
          en: "Blockchain & Cryptocurrency Solutions",
          fr: "Solutions Blockchain & Cryptomonnaie",
          ar: "حلول البلوكشين والعملات الرقمية",
        },
      ],
    },
    {
      icon: GraduationCap,
      title: {
        en: "Training ",
        fr: "Services ",
        ar: " الإلكتروني",
      },
      items: [
        {
          en: "Programming & Software Development Courses",
          fr: "Cours de Programmation & Développement Logiciel",
          ar: "دورات البرمجة وتطوير البرمجيات",
        },
        {
          en: "AI & Machine Learning Training",
          fr: "Formation en IA & Machine Learning",
          ar: "تدريب الذكاء الاصطناعي والتعلم الآلي",
        },
        {
          en: "Networking & Cybersecurity Certifications",
          fr: "Certifications en Réseaux & Cybersécurité",
          ar: "شهادات الشبكات والأمن السيبراني",
        },
        {
          en: "Business & Digital Marketing Training",
          fr: "Formation en Business & Marketing Digital",
          ar: "تدريب الأعمال والتسويق الرقمي",
        },
        {
          en: "Hardware Repair & IT Support Training",
          fr: "Formation en Réparation Matérielle & Support IT",
          ar: "تدريب إصلاح الأجهزة ودعم تقنية المعلومات",
        },
      ],
    },
    {
      icon: Wrench,
      title: {
        en: "Tech Maintenance & Support",
        fr: "Maintenance & Support Technique",
        ar: "الصيانة والدعم التقني",
      },
      items: [
        {
          en: "Laptop & Smartphone Repairs",
          fr: "Réparations d'Ordinateurs Portables & Smartphones",
          ar: "إصلاح أجهزة الكمبيوتر المحمولة والهواتف الذكية",
        },
        {
          en: "Software Installation & Troubleshooting",
          fr: "Installation Logicielle & Dépannage",
          ar: "تثبيت البرامج واستكشاف الأخطاء",
        },
        {
          en: "Hardware Upgrades & Optimization",
          fr: "Mises à Niveau Matérielles & Optimisation",
          ar: "ترقيات الأجهزة والتحسين",
        },
        {
          en: "Smart Home & IoT Device Setup",
          fr: "Installation de Maison Intelligente & Appareils IoT",
          ar: "إعداد المنزل الذكي وأجهزة إنترنت الأشياء",
        },
        {
          en: "Surveillance & Security System Installation",
          fr: "Installation de Systèmes de Surveillance & Sécurité",
          ar: "تركيب أنظمة المراقبة والأمن",
        },
      ],
    },
    {
      icon: Megaphone,
      title: {
        en: "Digital Branding & E-Marketing",
        fr: "Image de Marque & Marketing Digital",
        ar: "العلامة التجارية الرقمية والتسويق",
      },
      items: [
        {
          en: "Brand Identity & Logo Design",
          fr: "Identité de Marque & Design de Logo",
          ar: "هوية العلامة التجارية وتصميم الشعار",
        },
        {
          en: "Social Media Management & Strategy",
          fr: "Gestion & Stratégie des Réseaux Sociaux",
          ar: "إدارة واستراتيجية وسائل التواصل الاجتماعي",
        },
        {
          en: "SEO & Content Marketing",
          fr: "SEO & Marketing de Contenu",
          ar: "تحسين محركات البحث والتسويق بالمحتوى",
        },
        {
          en: "Digital Advertising Campaigns",
          fr: "Campagnes de Publicité Digitale",
          ar: "حملات الإعلان الرقمي",
        },
      ],
    },
    {
      icon: Briefcase,
      title: {
        en: "Internships & Career Development",
        fr: "Stages & Développement de Carrière",
        ar: "التدريب وتطوير المهنة",
      },
      items: [
        {
          en: "Tech Internship Programs",
          fr: "Programmes de Stage Technique",
          ar: "برامج التدريب التقني",
        },
        {
          en: "Mentorship & Career Guidance",
          fr: "Mentorat & Orientation de Carrière",
          ar: "الإرشاد والتوجيه المهني",
        },
        {
          en: "Portfolio Development Support",
          fr: "Support au Développement de Portfolio",
          ar: "دعم تطوير الحافظة",
        },
      ],
    },
  ];

  const products: ServiceCategory[] = [
    {
      icon: Monitor,
      title: {
        en: "Computers & Accessories",
        fr: "Ordinateurs & Accessoires",
        ar: "أجهزة الكمبيوتر والملحقات",
      },
      items: [
        {
          en: "Laptops (Business, Gaming, Student)",
          fr: "Ordinateurs Portables (Professionnel, Gaming, Étudiant)",
          ar: "أجهزة كمبيوتر محمولة (أعمال، ألعاب، طلاب)",
        },
        {
          en: "Desktop Computers (Workstation, All-in-One, Gaming)",
          fr: "Ordinateurs de Bureau (Workstation, Tout-en-un, Gaming)",
          ar: "أجهزة كمبيوتر مكتبية (محطة عمل، الكل في واحد، ألعاب)",
        },
        {
          en: "Computer Monitors (HD, 4K, Curved)",
          fr: "Moniteurs (HD, 4K, Incurvés)",
          ar: "شاشات الكمبيوتر (HD، 4K، منحنية)",
        },
        {
          en: "Keyboards & Mice (Wired, Wireless, Mechanical)",
          fr: "Claviers & Souris (Filaires, Sans fil, Mécaniques)",
          ar: "لوحات المفاتيح والفئران (سلكية، لاسلكية، ميكانيكية)",
        },
        {
          en: "External Hard Drives & SSDs",
          fr: "Disques Durs Externes & SSD",
          ar: "محركات الأقراص الصلبة الخارجية وأقراص SSD",
        },
        {
          en: "Flash Drives (USB 3.0, Type-C, Encrypted)",
          fr: "Clés USB (USB 3.0, Type-C, Cryptées)",
          ar: "محركات فلاش (USB 3.0، Type-C، مشفرة)",
        },
        {
          en: "Memory Cards (MicroSD, SD Cards)",
          fr: "Cartes Mémoire (MicroSD, Cartes SD)",
          ar: "بطاقات الذاكرة (MicroSD، بطاقات SD)",
        },
        {
          en: "Cooling Pads & Laptop Stands",
          fr: "Ventilateurs de Refroidissement & Supports pour Ordinateurs Portables",
          ar: "وسادات التبريد وحوامل الكمبيوتر المحمول",
        },
      ],
    },
    {
      icon: Wifi,
      title: {
        en: "Networking & Security Devices",
        fr: "Appareils Réseau & Sécurité",
        ar: "أجهزة الشبكات والأمن",
      },
      items: [
        {
          en: "Wi-Fi Routers & Mesh Systems",
          fr: "Routeurs Wi-Fi & Systèmes Mesh",
          ar: "أجهزة توجيه Wi-Fi وأنظمة الشبكة",
        },
        {
          en: "Network Switches & Hubs",
          fr: "Commutateurs Réseau & Hubs",
          ar: "مفاتيح الشبكة والمحاور",
        },
        {
          en: "Modems & Signal Boosters",
          fr: "Modems & Amplificateurs de Signal",
          ar: "أجهزة المودم ومقويات الإشارة",
        },
        {
          en: "CCTV Cameras & Security Systems",
          fr: "Caméras CCTV & Systèmes de Sécurité",
          ar: "كاميرات المراقبة وأنظمة الأمن",
        },
        {
          en: "Smart Door Locks & Biometric Access Control",
          fr: "Serrures Connectées & Contrôle d'Accès Biométrique",
          ar: "أقفال الأبواب الذكية والتحكم بالوصول البيومتري",
        },
        {
          en: "GPS Trackers & Vehicle Monitoring Systems",
          fr: "Trackers GPS & Systèmes de Surveillance de Véhicules",
          ar: "أجهزة تتبع GPS وأنظمة مراقبة المركبات",
        },
      ],
    },
    {
      icon: Smartphone,
      title: {
        en: "Smartphones & Accessories",
        fr: "Smartphones & Accessoires",
        ar: "الهواتف الذكية والملحقات",
      },
      items: [
        {
          en: "Smartphones (Android, iOS, Feature Phones)",
          fr: "Smartphones (Android, iOS, Téléphones Simples)",
          ar: "الهواتف الذكية (أندرويد، iOS، الهواتف العادية)",
        },
        {
          en: "Smartwatches & Fitness Bands",
          fr: "Montres Connectées & Bracelets de Fitness",
          ar: "الساعات الذكية وأساور اللياقة",
        },
        {
          en: "Power Banks & Wireless Chargers",
          fr: "Batteries Externes & Chargeurs Sans Fil",
          ar: "بنوك الطاقة والشواحن اللاسلكية",
        },
        {
          en: "Phone Cases & Screen Protectors",
          fr: "Coques de Téléphone & Protecteurs d'Écran",
          ar: "حافظات الهاتف وواقيات الشاشة",
        },
        {
          en: "Bluetooth Earbuds & Headphones",
          fr: "Écouteurs Bluetooth & Casques",
          ar: "سماعات بلوتوث وسماعات الرأس",
        },
        {
          en: "VR Headsets & Augmented Reality Devices",
          fr: "Casques VR & Appareils de Réalité Augmentée",
          ar: "سماعات الواقع الافتراضي وأجهزة الواقع المعزز",
        },
      ],
    },
    {
      icon: Home,
      title: {
        en: "Smart Home & IoT Gadgets",
        fr: "Maison Intelligente & Gadgets IoT",
        ar: "المنزل الذكي وأجهزة إنترنت الأشياء",
      },
      items: [
        {
          en: "Smart TVs (4K, OLED, QLED)",
          fr: "TV Connectées (4K, OLED, QLED)",
          ar: "تلفزيونات ذكية (4K، OLED، QLED)",
        },
        {
          en: "Smart Home Assistants (Google Home, Alexa)",
          fr: "Assistants Maison Intelligente (Google Home, Alexa)",
          ar: "مساعدو المنزل الذكي (Google Home، Alexa)",
        },
        {
          en: "Smart Light Bulbs & Plugs",
          fr: "Ampoules Connectées & Prises Intelligentes",
          ar: "مصابيح ومقابس ذكية",
        },
        {
          en: "Smart Thermostats & Smoke Detectors",
          fr: "Thermostats Intelligents & Détecteurs de Fumée",
          ar: "منظمات حرارة ذكية وكواشف دخان",
        },
      ],
    },
    {
      icon: Gamepad2,
      title: {
        en: "Gaming & Entertainment",
        fr: "Gaming & Divertissement",
        ar: "الألعاب والترفيه",
      },
      items: [
        {
          en: "Gaming Consoles (PlayStation, Xbox, Nintendo Switch)",
          fr: "Consoles de Jeux (PlayStation, Xbox, Nintendo Switch)",
          ar: "أجهزة الألعاب (PlayStation، Xbox، Nintendo Switch)",
        },
        {
          en: "Gaming Accessories (Controllers, VR Headsets)",
          fr: "Accessoires de Gaming (Manettes, Casques VR)",
          ar: "ملحقات الألعاب (أذرع التحكم، سماعات VR)",
        },
        {
          en: "Streaming Devices (Chromecast, Fire TV Stick, Apple TV)",
          fr: "Appareils de Streaming (Chromecast, Fire TV Stick, Apple TV)",
          ar: "أجهزة البث (Chromecast، Fire TV Stick، Apple TV)",
        },
      ],
    },
    {
      icon: Printer,
      title: {
        en: "Professional & Business Tech",
        fr: "Tech Professionnel & Business",
        ar: "التكنولوجيا المهنية والأعمال",
      },
      items: [
        {
          en: "Drones (Photography, Agriculture, Security)",
          fr: "Drones (Photographie, Agriculture, Sécurité)",
          ar: "الطائرات بدون طيار (تصوير، زراعة، أمن)",
        },
        {
          en: "Point-of-Sale (POS) Machines & Barcode Scanners",
          fr: "Machines de Point de Vente & Scanners de Codes-Barres",
          ar: "أجهزة نقاط البيع وماسحات الباركود",
        },
        {
          en: "Digital Whiteboards & Projectors",
          fr: "Tableaux Blancs Numériques & Projecteurs",
          ar: "السبورات الرقمية وأجهزة العرض",
        },
        {
          en: "Printers, Scanners & 3D Printers",
          fr: "Imprimantes, Scanners & Imprimantes 3D",
          ar: "الطابعات والماسحات والطابعات ثلاثية الأبعاد",
        },
        {
          en: "Graphic Tablets & Styluses",
          fr: "Tablettes Graphiques & Stylets",
          ar: "ألواح الرسومات والأقلام",
        },
      ],
    },
  ];

  const courses: ServiceCategory[] = [
    {
      icon: Code,
      title: {
        en: "Programming & Software Development",
        fr: "Programmation & Développement Logiciel",
        ar: "البرمجة وتطوير البرمجيات",
      },
      items: [
        {
          en: "Full-Stack Web Development (HTML, CSS, JavaScript, React, Node.js)",
          fr: "Développement Web Full-Stack (HTML, CSS, JavaScript, React, Node.js)",
          ar: "تطوير الويب المتكامل (HTML، CSS، JavaScript، React، Node.js)",
        },
        {
          en: "Mobile App Development (React Native, Flutter, Android, iOS)",
          fr: "Développement d'Applications Mobiles (React Native, Flutter, Android, iOS)",
          ar: "تطوير تطبيقات الموبايل (React Native، Flutter، Android، iOS)",
        },
        {
          en: "Python Programming for Beginners to Advanced",
          fr: "Programmation Python du Débutant à l'Avancé",
          ar: "برمجة بايثون من المبتدئ إلى المتقدم",
        },
        {
          en: "Database Management (SQL, MongoDB, PostgreSQL)",
          fr: "Gestion de Bases de Données (SQL, MongoDB, PostgreSQL)",
          ar: "إدارة قواعد البيانات (SQL، MongoDB، PostgreSQL)",
        },
        {
          en: "DevOps & Cloud Computing (AWS, Azure, Docker, Kubernetes)",
          fr: "DevOps & Cloud Computing (AWS, Azure, Docker, Kubernetes)",
          ar: "DevOps والحوسبة السحابية (AWS، Azure، Docker، Kubernetes)",
        },
      ],
    },
    {
      icon: Cpu,
      title: {
        en: "AI & Machine Learning",
        fr: "IA & Apprentissage Automatique",
        ar: "الذكاء الاصطناعي والتعلم الآلي",
      },
      items: [
        {
          en: "Introduction to Artificial Intelligence",
          fr: "Introduction à l'Intelligence Artificielle",
          ar: "مقدمة في الذكاء الاصطناعي",
        },
        {
          en: "Machine Learning with Python (Scikit-learn, TensorFlow)",
          fr: "Machine Learning avec Python (Scikit-learn, TensorFlow)",
          ar: "التعلم الآلي باستخدام بايثون (Scikit-learn، TensorFlow)",
        },
        {
          en: "Deep Learning & Neural Networks",
          fr: "Deep Learning & Réseaux de Neurones",
          ar: "التعلم العميق والشبكات العصبية",
        },
        {
          en: "Natural Language Processing (NLP)",
          fr: "Traitement du Langage Naturel (NLP)",
          ar: "معالجة اللغة الطبيعية",
        },
        {
          en: "Computer Vision & Image Recognition",
          fr: "Vision par Ordinateur & Reconnaissance d'Images",
          ar: "الرؤية الحاسوبية والتعرف على الصور",
        },
        {
          en: "AI Chatbot Development",
          fr: "Développement de Chatbots IA",
          ar: "تطوير روبوتات الدردشة بالذكاء الاصطناعي",
        },
      ],
    },
    {
      icon: Shield,
      title: {
        en: "Cybersecurity & Networking",
        fr: "Cybersécurité & Réseaux",
        ar: "الأمن السيبراني والشبكات",
      },
      items: [
        {
          en: "Network Security Fundamentals",
          fr: "Fondamentaux de la Sécurité Réseau",
          ar: "أساسيات أمن الشبكات",
        },
        {
          en: "Ethical Hacking & Penetration Testing",
          fr: "Hacking Éthique & Tests de Pénétration",
          ar: "القرصنة الأخلاقية واختبار الاختراق",
        },
        {
          en: "CompTIA Security+ Certification Prep",
          fr: "Préparation Certification CompTIA Security+",
          ar: "التحضير لشهادة CompTIA Security+",
        },
        {
          en: "Cisco CCNA (Routing & Switching)",
          fr: "Cisco CCNA (Routage & Commutation)",
          ar: "سيسكو CCNA (التوجيه والتبديل)",
        },
        {
          en: "Cloud Security & Infrastructure Protection",
          fr: "Sécurité Cloud & Protection d'Infrastructure",
          ar: "أمن السحابة وحماية البنية التحتية",
        },
      ],
    },
    {
      icon: Monitor,
      title: {
        en: "IT Support & Hardware",
        fr: "Support IT & Matériel",
        ar: "دعم تقنية المعلومات والأجهزة",
      },
      items: [
        {
          en: "CompTIA A+ Hardware & Software Troubleshooting",
          fr: "CompTIA A+ Dépannage Matériel & Logiciel",
          ar: "استكشاف أخطاء الأجهزة والبرامج CompTIA A+",
        },
        {
          en: "Computer Hardware Repair & Maintenance",
          fr: "Réparation & Maintenance de Matériel Informatique",
          ar: "إصلاح وصيانة أجهزة الكمبيوتر",
        },
        {
          en: "Laptop & Smartphone Repair Training",
          fr: "Formation en Réparation d'Ordinateurs Portables & Smartphones",
          ar: "تدريب إصلاح الأجهزة المحمولة والهواتف الذكية",
        },
        {
          en: "Server Administration (Windows Server, Linux)",
          fr: "Administration de Serveurs (Windows Server, Linux)",
          ar: "إدارة الخوادم (Windows Server، Linux)",
        },
      ],
    },
    {
      icon: Megaphone,
      title: {
        en: "Digital Marketing & E-commerce",
        fr: "Marketing Digital & E-commerce",
        ar: "التسويق الرقمي والتجارة الإلكترونية",
      },
      items: [
        {
          en: "Social Media Marketing Mastery",
          fr: "Maîtrise du Marketing sur les Réseaux Sociaux",
          ar: "إتقان التسويق عبر وسائل التواصل الاجتماعي",
        },
        {
          en: "Search Engine Optimization (SEO) & Content Marketing",
          fr: "Optimisation pour Moteurs de Recherche (SEO) & Marketing de Contenu",
          ar: "تحسين محركات البحث والتسويق بالمحتوى",
        },
        {
          en: "Google Ads & Facebook Advertising",
          fr: "Google Ads & Publicité Facebook",
          ar: "إعلانات جوجل وإعلانات فيسبوك",
        },
        {
          en: "E-commerce Store Setup & Management (Shopify, WooCommerce)",
          fr: "Configuration & Gestion de Boutique E-commerce (Shopify, WooCommerce)",
          ar: "إعداد وإدارة متجر إلكتروني (Shopify، WooCommerce)",
        },
        {
          en: "Email Marketing & Automation",
          fr: "Email Marketing & Automatisation",
          ar: "التسويق عبر البريد الإلكتروني والأتمتة",
        },
      ],
    },
    {
      icon: GraduationCap,
      title: {
        en: "Data Science & Analytics",
        fr: "Science des Données & Analytique",
        ar: "علوم البيانات والتحليلات",
      },
      items: [
        {
          en: "Data Analysis with Python (Pandas, NumPy, Matplotlib)",
          fr: "Analyse de Données avec Python (Pandas, NumPy, Matplotlib)",
          ar: "تحليل البيانات باستخدام بايثون (Pandas، NumPy، Matplotlib)",
        },
        {
          en: "Business Intelligence & Data Visualization (Power BI, Tableau)",
          fr: "Business Intelligence & Visualisation de Données (Power BI, Tableau)",
          ar: "ذكاء الأعمال وتصور البيانات (Power BI، Tableau)",
        },
        {
          en: "Big Data Technologies (Hadoop, Spark)",
          fr: "Technologies Big Data (Hadoop, Spark)",
          ar: "تقنيات البيانات الضخمة (Hadoop، Spark)",
        },
        {
          en: "Statistical Analysis & Predictive Modeling",
          fr: "Analyse Statistique & Modélisation Prédictive",
          ar: "التحليل الإحصائي والنمذجة التنبؤية",
        },
      ],
    },
    {
      icon: Briefcase,
      title: {
        en: "Business & Entrepreneurship",
        fr: "Business & Entrepreneuriat",
        ar: "الأعمال وريادة الأعمال",
      },
      items: [
        {
          en: "Tech Entrepreneurship & Startup Fundamentals",
          fr: "Entrepreneuriat Tech & Fondamentaux des Startups",
          ar: "ريادة الأعمال التقنية وأساسيات الشركات الناشئة",
        },
        {
          en: "Project Management (Agile, Scrum, PMP)",
          fr: "Gestion de Projet (Agile, Scrum, PMP)",
          ar: "إدارة المشاريع (Agile، Scrum، PMP)",
        },
        {
          en: "Digital Product Management",
          fr: "Gestion de Produits Numériques",
          ar: "إدارة المنتجات الرقمية",
        },
        {
          en: "Business Analysis & Requirements Engineering",
          fr: "Analyse d'Affaires & Ingénierie des Exigences",
          ar: "تحليل الأعمال وهندسة المتطلبات",
        },
      ],
    },
    {
      icon: Gamepad2,
      title: {
        en: "Design & Creative Tech",
        fr: "Design & Technologie Créative",
        ar: "التصميم والتكنولوجيا الإبداعية",
      },
      items: [
        {
          en: "UI/UX Design & User Research",
          fr: "Design UI/UX & Recherche Utilisateur",
          ar: "تصميم واجهة المستخدم وتجربة المستخدم",
        },
        {
          en: "Graphic Design (Photoshop, Illustrator, Figma)",
          fr: "Design Graphique (Photoshop, Illustrator, Figma)",
          ar: "التصميم الجرافيكي (Photoshop، Illustrator، Figma)",
        },
        {
          en: "Video Editing & Motion Graphics",
          fr: "Montage Vidéo & Motion Graphics",
          ar: "تحرير الفيديو والرسومات المتحركة",
        },
        {
          en: "3D Modeling & Game Development (Unity, Unreal Engine)",
          fr: "Modélisation 3D & Développement de Jeux (Unity, Unreal Engine)",
          ar: "النمذجة ثلاثية الأبعاد وتطوير الألعاب (Unity، Unreal Engine)",
        },
      ],
    },
  ];

  const [activeTab, setActiveTab] = useState<
    "services" | "products" | "courses"
  >("services");
  let currentData: ServiceCategory[];
  if (activeTab === "services") {
    currentData = services;
  } else if (activeTab === "products") {
    currentData = products;
  } else {
    currentData = courses;
  }

  const toggleCategory = (index: number) => {
    setExpandedCategory(expandedCategory === index ? null : index);
  };

  return (
    <section className="relative min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 py-20 px-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl top-20 left-10 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl bottom-20 right-10 animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl lg:px-8 mx-auto">
        {/* Header */}
        <div
          className="text-center mb-16"
          dir={language === "ar" ? "rtl" : "ltr"}
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 bg-clip-text   bg-linear-to-r from-purple-400 to-pink-600">
            {translations.mainTitle[language]}
          </h2>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            {translations.subtitle[language]}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-12 gap-2 sm:gap-4">
          <button
            onClick={() => {
              setActiveTab("services");
              setExpandedCategory(0);
            }}
            className={`w-full sm:w-auto px-4 py-2 lg:px-8 lg:py-4 rounded-2xl font-semibold text-base sm:text-lg transition-all transform hover:scale-105 ${
              activeTab === "services"
                ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-2xl shadow-blue-500/50"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            {translations.servicesTab[language]}
          </button>
          <button
            onClick={() => {
              setActiveTab("products");
              setExpandedCategory(0);
            }}
            className={`w-full sm:w-auto px-4 py-2 lg:px-8 lg:py-4 rounded-2xl font-semibold text-base sm:text-lg transition-all transform hover:scale-105 ${
              activeTab === "products"
                ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-2xl shadow-blue-500/50"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            {translations.productsTab[language]}
          </button>
          <button
            onClick={() => {
              setActiveTab("courses");
              setExpandedCategory(0);
            }}
            className={`w-full sm:w-auto px-4 py-2 lg:px-8 lg:py-4 rounded-2xl font-semibold text-base sm:text-lg transition-all transform hover:scale-105 ${
              activeTab === "courses"
                ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-2xl shadow-blue-500/50"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            {translations.coursesTab[language]}
          </button>
        </div>

        {/* Service/Product Categories */}
        <div className="grid gap-4" dir={language === "ar" ? "rtl" : "ltr"}>
          {currentData.map((category, index) => {
            const Icon = category.icon;
            const isExpanded = expandedCategory === index;

            return (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 hover:border-blue-400/50 transition-all duration-300"
              >
                <button
                  onClick={() => toggleCategory(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      {category.title[language]}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-6 h-6 text-blue-300 transition-transform duration-300 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isExpanded
                      ? "max-h-[2000px] opacity-100"
                      : "max-h-0 opacity-0"
                  } overflow-hidden`}
                >
                  <div className="px-6 pb-6 pt-2">
                    <div className="grid md:grid-cols-2 gap-3">
                      {category.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                        >
                          <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 group-hover:scale-150 transition-transform"></div>
                          <p className="text-blue-100 leading-relaxed flex-1">
                            {item[language]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
