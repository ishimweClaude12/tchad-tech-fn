import { Linkedin, Twitter, Mail, Phone } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Chip,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";

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

interface TeamMemberData {
  id: number;
  image: string;
  linkedin: string;
  twitter: string;
  email: string;
  phoneNumber: string;
  name: string;
  role: string;
  description: string;
}

interface TeamMemberProps {
  readonly member: TeamMemberData;
  readonly isRTL: boolean;
}

function TeamMember({ member, isRTL }: TeamMemberProps) {
  return (
    <Card
      className="flex flex-col h-full hover:shadow-xl transition-shadow duration-300"
      elevation={3}
    >
      <div className="relative overflow-hidden group">
        <CardMedia
          component="img"
          image={member.image}
          alt={member.name}
          className="h-72 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Social overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <div className="flex gap-2">
            <IconButton
              component="a"
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{
                bgcolor: "white",
                "&:hover": { bgcolor: "primary.main", color: "white" },
              }}
              aria-label={`${member.name} LinkedIn`}
            >
              <Linkedin size={16} />
            </IconButton>
            <IconButton
              component="a"
              href={member.twitter}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{
                bgcolor: "white",
                "&:hover": { bgcolor: "#1da1f2", color: "white" },
              }}
              aria-label={`${member.name} Twitter`}
            >
              <Twitter size={16} />
            </IconButton>
            <IconButton
              component="a"
              href={`mailto:${member.email}`}
              size="small"
              sx={{
                bgcolor: "white",
                "&:hover": { bgcolor: "secondary.main", color: "white" },
              }}
              aria-label={`Email ${member.name}`}
            >
              <Mail size={16} />
            </IconButton>
            {member.phoneNumber && (
              <IconButton
                component="a"
                href={`tel:${member.phoneNumber}`}
                size="small"
                sx={{
                  bgcolor: "white",
                  "&:hover": { bgcolor: "success.main", color: "white" },
                }}
                aria-label={`Call ${member.name}`}
              >
                <Phone size={16} />
              </IconButton>
            )}
          </div>
        </div>
      </div>

      <CardContent
        className={`flex flex-col gap-1 p-5 flex-1 ${isRTL ? "text-right" : ""}`}
      >
        <Typography variant="h6" component="h3" className="font-bold">
          {member.name}
        </Typography>
        <Typography
          variant="caption"
          component="p"
          className="font-semibold uppercase tracking-wide"
          sx={{ color: "primary.main" }}
        >
          {member.role}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary" }}
          className="mt-1 leading-relaxed"
        >
          {member.description}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function TeamSection() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  const isRTL = language === "ar";

  const teamMembers: TeamMemberData[] = teamMembersData.map((member, index) => ({
    ...member,
    ...t.teamMembers[index],
  }));

  return (
    <section
      className="py-16 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-gray-50 via-blue-50 to-purple-50"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <Chip
            label={t.ourLeadership}
            color="primary"
            size="small"
            className="mb-4 font-semibold"
          />
          <Typography
            variant="h3"
            component="h2"
            className="font-bold mb-4"
            sx={{ color: "text.primary" }}
          >
            {t.meetOurTeam}{" "}
            <span style={{ color: "var(--chad-blue)" }}>{t.team}</span>
          </Typography>
          <Typography
            variant="subtitle1"
            className="max-w-3xl mx-auto"
            sx={{ color: "text.secondary" }}
          >
            {t.tagline}
          </Typography>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <TeamMember key={member.id} member={member} isRTL={isRTL} />
          ))}
        </div>

        {/* Join CTA */}
        <div className="text-center mt-16 py-10 px-6 rounded-2xl bg-white shadow-md max-w-2xl mx-auto">
          <Typography variant="h5" component="h3" className="font-bold mb-2">
            {t.joinTeam}
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }} className="mb-6">
            {t.joinDescription}
          </Typography>
          <Button
            component={Link}
            to="/contact-us"
            variant="contained"
            color="primary"
            size="large"
          >
            {t.viewPositions}
          </Button>
        </div>
      </div>
    </section>
  );
}
