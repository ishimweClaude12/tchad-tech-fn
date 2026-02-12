import type { Language } from "src/types/App.types";

export const NavigationTranslations = {
  en: {
    home: "Home",
    techProducts: "Tech Products",
    learn: "Learn",
    hub: "Hub",
    community: "Community",
    aboutUs: "About Us",
    contactUs: "Contact Us",
    language: "Language",
    openMenu: "Open main menu",
    adminUser: "Admin User",
    dashboard: "Dashboard",
    wishlist: "Wishlist",
  },
  fr: {
    home: "Accueil",
    techProducts: "Produits Tech",
    learn: "Apprendre",
    hub: "Hub",
    community: "Communauté",
    aboutUs: "À Propos",
    contactUs: "Nous Contacter",
    language: "Langue",
    openMenu: "Ouvrir le menu principal",
    adminUser: "Utilisateur Admin",
    dashboard: "Tableau de Bord",
    wishlist: "Liste de Souhaits",
  },
  ar: {
    home: "الرئيسية",
    techProducts: "المنتجات التقنية",
    learn: "تعلم",
    hub: "المركز",
    community: "المجتمع",
    aboutUs: "من نحن",
    contactUs: "اتصل بنا",
    language: "اللغة",
    openMenu: "افتح القائمة الرئيسية",
    adminUser: "مستخدم مشرف",
    dashboard: "لوحة القيادة",
    wishlist: "قائمة الرغبات",
  },
};

export const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
];
