import { useState } from "react";
import { Linkedin, Twitter, Mail, Phone } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

// Translation object
const translations = {
  en: {
    ourLeadership: "Our Leadership",
    meetOurTeam: "Meet Our",
    team: "Team",
    tagline:
      "Passionate innovators building Africa's premier tech ecosystem. Together, we're empowering businesses, educators, and innovators across Chad and beyond.",
    joinTeam: "Want to Join Our Team?",
    joinDescription:
      "We're always looking for talented individuals who share our vision of transforming technology in Africa.",
    viewPositions: "View Open Positions",
    teamMembers: [
      {
        name: "Amina Tchad",
        role: "Chief Executive Officer",
        description:
          "Visionary leader with 15+ years in tech innovation. Drives strategic growth and partnerships across African markets.",
      },
      {
        name: "Omar Hassan",
        role: "Chief Technology Officer",
        description:
          "Full-stack architect specializing in micro-frontends and scalable systems. Leading our technical excellence.",
      },
      {
        name: "Sarah Mbaye",
        role: "Head of E-Commerce",
        description:
          "E-commerce strategist empowering local businesses. Expert in digital transformation and marketplace optimization.",
      },
      {
        name: "Ibrahim Kone",
        role: "Head of E-Learning",
        description:
          "Educational technology pioneer creating accessible learning pathways. Passionate about skills development in tech.",
      },
      {
        name: "Fatima Diallo",
        role: "Hub Operations Manager",
        description:
          "Community builder managing our innovation spaces. Connects investors, innovators, and service providers seamlessly.",
      },
      {
        name: "Moussa Diabate",
        role: "Lead Software Engineer",
        description:
          "Performance optimization expert ensuring lightning-fast user experiences. Architecting our micro-frontend ecosystem.",
      },
    ],
  },
  fr: {
    ourLeadership: "Notre Direction",
    meetOurTeam: "Rencontrez Notre",
    team: "Équipe",
    tagline:
      "Des innovateurs passionnés construisant le principal écosystème technologique d'Afrique. Ensemble, nous responsabilisons les entreprises, les éducateurs et les innovateurs à travers le Tchad et au-delà.",
    joinTeam: "Voulez-vous Rejoindre Notre Équipe?",
    joinDescription:
      "Nous recherchons toujours des personnes talentueuses qui partagent notre vision de transformer la technologie en Afrique.",
    viewPositions: "Voir les Postes Ouverts",
    teamMembers: [
      {
        name: "Amina Tchad",
        role: "Directrice Générale",
        description:
          "Leader visionnaire avec plus de 15 ans d'expérience dans l'innovation technologique. Pilote la croissance stratégique et les partenariats sur les marchés africains.",
      },
      {
        name: "Omar Hassan",
        role: "Directeur Technique",
        description:
          "Architecte full-stack spécialisé dans les micro-frontends et les systèmes évolutifs. Dirige notre excellence technique.",
      },
      {
        name: "Sarah Mbaye",
        role: "Responsable E-Commerce",
        description:
          "Stratège e-commerce responsabilisant les entreprises locales. Experte en transformation numérique et optimisation de marketplace.",
      },
      {
        name: "Ibrahim Kone",
        role: "Responsable E-Learning",
        description:
          "Pionnier de la technologie éducative créant des parcours d'apprentissage accessibles. Passionné par le développement des compétences en technologie.",
      },
      {
        name: "Fatima Diallo",
        role: "Responsable des Opérations Hub",
        description:
          "Bâtisseuse de communauté gérant nos espaces d'innovation. Connecte investisseurs, innovateurs et prestataires de services de manière fluide.",
      },
      {
        name: "Moussa Diabate",
        role: "Ingénieur Logiciel Principal",
        description:
          "Expert en optimisation des performances garantissant des expériences utilisateur ultra-rapides. Architecte notre écosystème de micro-frontends.",
      },
    ],
  },
  ar: {
    ourLeadership: "قيادتنا",
    meetOurTeam: "تعرف على",
    team: "فريقنا",
    tagline:
      "مبتكرون متحمسون يبنون النظام التقني الرائد في أفريقيا. معًا، نمكّن الشركات والمعلمين والمبتكرين في تشاد وخارجها.",
    joinTeam: "هل تريد الانضمام إلى فريقنا؟",
    joinDescription:
      "نبحث دائمًا عن أفراد موهوبين يشاركوننا رؤيتنا لتحويل التكنولوجيا في أفريقيا.",
    viewPositions: "عرض الوظائف المتاحة",
    teamMembers: [
      {
        name: "أمينة تشاد",
        role: "الرئيسة التنفيذية",
        description:
          "قائدة صاحبة رؤية مع أكثر من 15 عامًا في الابتكار التقني. تقود النمو الاستراتيجي والشراكات عبر الأسواق الأفريقية.",
      },
      {
        name: "عمر حسن",
        role: "المدير التقني",
        description:
          "مهندس معماري متكامل متخصص في الواجهات الأمامية الدقيقة والأنظمة القابلة للتوسع. يقود تميزنا التقني.",
      },
      {
        name: "سارة مباي",
        role: "رئيسة التجارة الإلكترونية",
        description:
          "خبيرة استراتيجية في التجارة الإلكترونية تمكّن الشركات المحلية. خبيرة في التحول الرقمي وتحسين السوق الإلكتروني.",
      },
      {
        name: "إبراهيم كوني",
        role: "رئيس التعليم الإلكتروني",
        description:
          "رائد في تكنولوجيا التعليم يخلق مسارات تعليمية متاحة. متحمس لتطوير المهارات في التكنولوجيا.",
      },
      {
        name: "فاطمة ديالو",
        role: "مديرة عمليات المركز",
        description:
          "بانية مجتمع تدير مساحات الابتكار لدينا. تربط المستثمرين والمبتكرين ومقدمي الخدمات بسلاسة.",
      },
      {
        name: "موسى ديباتي",
        role: "مهندس برمجيات رئيسي",
        description:
          "خبير في تحسين الأداء يضمن تجارب المستخدم فائقة السرعة. يصمم نظام الواجهات الأمامية الدقيقة لدينا.",
      },
    ],
  },
};

const teamMembersData = [
  {
    id: 1,
    image: "/images/placeholder.jpg",
    linkedin: "#",
    twitter: "#",
    email: "amina@chadtechhub.com",
    phoneNumber: "+235 123 456 789",
  },
  {
    id: 2,
    image: "/images/placeholder.jpg",
    linkedin: "#",
    twitter: "#",
    email: "omar@chadtechhub.com",
    phoneNumber: "+235 987 654 321",
  },
  {
    id: 3,
    image: "/images/placeholder.jpg",
    linkedin: "#",
    twitter: "#",
    email: "sarah@chadtechhub.com",
    phoneNumber: "+235 555 666 777",
  },
  {
    id: 4,
    image: "/images/placeholder.jpg",
    linkedin: "#",
    twitter: "#",
    email: "ibrahim@chadtechhub.com",
    phoneNumber: "+235 444 333 222",
  },
  {
    id: 5,
    image: "/images/placeholder.jpg",
    linkedin: "#",
    twitter: "#",
    email: "fatima@chadtechhub.com",
    phoneNumber: "+235 111 222 333",
  },
  {
    id: 6,
    image: "/images/placeholder.jpg",
    linkedin: "#",
    twitter: "#",
    email: "moussa@chadtechhub.com",
    phoneNumber: "+235 888 999 000",
  },
];

interface TeamMemberProps {
  member: {
    id: number;
    image: string;
    linkedin: string;
    twitter: string;
    email: string;
    phoneNumber: string;
    name: string;
    role: string;
    description: string;
  };
  index: number;
  isRTL: boolean;
}

const TeamMember = ({ member, index, isRTL }: TeamMemberProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative"
      style={{
        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
        {/* Image Container */}
        <div className="relative h-80 overflow-hidden bg-linear-to-br from-blue-50 to-purple-50">
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div
            className={`absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Social Links - appear on hover */}
          <div
            className={`absolute bottom-4 left-0 right-0 flex justify-center gap-3 transition-all duration-300 ${
              isHovered
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <a
              href={member.linkedin}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
            >
              <Linkedin size={18} />
            </a>
            <a
              href={member.twitter}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-blue-400 hover:text-white transition-colors"
            >
              <Twitter size={18} />
            </a>
            <a
              href={`mailto:${member.email}`}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-purple-600 hover:text-white transition-colors"
            >
              <Mail size={18} />
            </a>

            <a
              href={member.phoneNumber ? `tel:${member.phoneNumber}` : "#"}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
            >
              <Phone size={18} />
            </a>
          </div>
        </div>

        {/* Content */}
        <div className={`p-6 ${isRTL ? "text-right" : ""}`}>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {member.name}
          </h3>
          <p className="text-sm font-semibold text-blue-600 mb-3 uppercase tracking-wide">
            {member.role}
          </p>
          <p className="text-gray-600 leading-relaxed">{member.description}</p>
        </div>

        {/* Decorative Corner */}
        <div
          className={`absolute top-0 ${
            isRTL ? "left-0" : "right-0"
          } w-20 h-20 bg-linear-to-bl from-blue-500/10 to-transparent ${
            isRTL ? "rounded-br-full" : "rounded-bl-full"
          }`}
        />
      </div>
    </div>
  );
};

export default function TeamSection() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  const isRTL = language === "ar";

  // Merge translated data with static data
  const teamMembers = teamMembersData.map((member, index) => ({
    ...member,
    ...t.teamMembers[index],
  }));

  return (
    <div
      className={`min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-purple-50 pt-20 px-4 ${
        isRTL ? "rtl" : "ltr"
      }`}
    >
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>

      <div className="max-w-7xl lg:px-8 mx-auto pb-8">
        {/* Header */}
        <div
          className="text-center mb-16"
          style={{ animation: "slideIn 0.8s ease-out" }}
        >
          <div className="inline-block mb-4">
            <span className="bg-linear-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-full">
              {t.ourLeadership}
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            {t.meetOurTeam}{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
              {t.team}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t.tagline}
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <TeamMember
              key={member.id}
              member={member}
              index={index}
              isRTL={isRTL}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
