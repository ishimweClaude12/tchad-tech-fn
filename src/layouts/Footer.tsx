import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

interface FormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  message: string;
}

interface Translations {
  [key: string]: {
    en: string;
    fr: string;
    ar: string;
  };
}

const translations: Translations = {
  // Contact Form Section
  getInTouch: {
    en: "Get In Touch With Us",
    fr: "Entrez en Contact avec Nous",
    ar: "تواصل معنا",
  },
  reachAnytime: {
    en: "You can reach us anytime",
    fr: "Vous pouvez nous joindre à tout moment",
    ar: "يمكنك الوصول إلينا في أي وقت",
  },
  firstName: {
    en: "First Name",
    fr: "Prénom",
    ar: "الاسم الأول",
  },
  lastName: {
    en: "Last Name",
    fr: "Nom de famille",
    ar: "اسم العائلة",
  },
  phoneNumber: {
    en: "Phone Number",
    fr: "Numéro de téléphone",
    ar: "رقم الهاتف",
  },
  email: {
    en: "Email",
    fr: "E-mail",
    ar: "البريد الإلكتروني",
  },
  howCanWeHelp: {
    en: "How can we help?",
    fr: "Comment pouvons-nous vous aider?",
    ar: "كيف يمكننا المساعدة؟",
  },
  sendMessage: {
    en: "Send message",
    fr: "Envoyer le message",
    ar: "إرسال رسالة",
  },
  // Company Info
  mission: {
    en: "We are committed to addressing pressing global challenges through innovative tech solutions, empowering individuals with the knowledge and skills they need to succeed and collaborating with international organizations for wider impact.",
    fr: "Nous nous engageons à relever les défis mondiaux urgents grâce à des solutions technologiques innovantes, en donnant aux individus les connaissances et les compétences dont ils ont besoin pour réussir et en collaborant avec des organisations internationales pour un impact plus large.",
    ar: "نحن ملتزمون بمعالجة التحديات العالمية الملحة من خلال حلول تقنية مبتكرة، وتمكين الأفراد بالمعرفة والمهارات التي يحتاجونها للنجاح والتعاون مع المنظمات الدولية لتحقيق تأثير أوسع.",
  },
  // Support Sections
  customerSupport: {
    en: "Customer Support",
    fr: "Support Client",
    ar: "دعم العملاء",
  },
  customerSupportDesc: {
    en: "Our support team is available around the clock to address any concerns or queries you may have.",
    fr: "Notre équipe d'assistance est disponible 24h/24 pour répondre à toutes vos préoccupations ou questions.",
    ar: "فريق الدعم لدينا متاح على مدار الساعة لمعالجة أي مخاوف أو استفسارات قد تكون لديك.",
  },
  feedback: {
    en: "Feedback and Suggestions",
    fr: "Commentaires et Suggestions",
    ar: "الملاحظات والاقتراحات",
  },
  feedbackDesc: {
    en: "We value your feedback and are continuously working to improve our system. Your input is crucial in shaping the future of TCHAD TECH HUB.",
    fr: "Nous apprécions vos commentaires et travaillons continuellement à améliorer notre système. Votre contribution est cruciale pour façonner l'avenir de TCHAD TECH HUB.",
    ar: "نحن نقدر ملاحظاتك ونعمل باستمرار على تحسين نظامنا. مساهمتك حاسمة في تشكيل مستقبل TCHAD TECH HUB.",
  },
  mediaInquiries: {
    en: "Media Inquiries",
    fr: "Demandes des Médias",
    ar: "استفسارات وسائل الإعلام",
  },
  mediaInquiriesDesc: {
    en: "For media-related questions or press inquiries, please contact us at tchadtechhub.com",
    fr: "Pour les questions liées aux médias ou les demandes de presse, veuillez nous contacter à tchadtechhub.com",
    ar: "للأسئلة المتعلقة بوسائل الإعلام أو الاستفسارات الصحفية، يرجى الاتصال بنا على tchadtechhub.com",
  },
  contactUs: {
    en: "Contact Us",
    fr: "Contactez-nous",
    ar: "اتصل بنا",
  },
  helpUs: {
    en: "Help Us Learn More About You",
    fr: "Aidez-nous à en savoir plus sur vous",
    ar: "ساعدنا لنتعرف عليك أكثر",
  },
  helpDescription: {
    en: "To better understand your needs and connect you with the right opportunity, please fill out our short application form.",
    fr: "Pour mieux comprendre vos besoins et vous connecter à la bonne opportunité, veuillez remplir notre court formulaire de candidature.",
    ar: "لفهم احتياجاتك بشكل أفضل وربطك بالفرصة المناسبة، يرجى ملء نموذج التقديم القصير الخاص بنا.",
  },
  apply: {
    en: "Apply Now",
    fr: "Postuler",
    ar: "تقدم بطلب",
  },
  rights: {
    en: "All rights reserved.",
    fr: "Tous droits réservés.",
    ar: "كل الحقوق محفوظة.",
  },
};

const Footer: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    message: "",
  });

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.phoneNumber &&
      formData.message
    ) {
      console.log("Form submitted:", formData);
      setFormData({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        message: "",
      });
      alert("Message sent successfully!");
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-black text-white">
      {/* Contact Form Section */}
      <section className="py-16 px-6" dir={isRTL ? "rtl" : "ltr"}>
        <div className="max-w-7xl px-8 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Support Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-light mb-4">
                {t("contactUs")}
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                {t("reachAnytime")}
              </p>

              {/* Contact Details */}
              <div className="space-y-3 text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-1" />
                  <span>Tchad Tech Hub, N'Djamena - Tchad</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                  <a
                    href="mailto:tchadtechhub.com"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    tchadtechhub.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                  <a
                    href="tel:+250790353162"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    +250 790 353 162
                  </a>
                </div>
              </div>
            </div>

            {/* Support Sections */}
            <div className="space-y-6 pt-8">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-indigo-300">
                  {t("customerSupport")}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {t("customerSupportDesc")}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2 text-indigo-300">
                  {t("feedback")}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {t("feedbackDesc")}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2 text-indigo-300">
                  {t("mediaInquiries")}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {t("mediaInquiriesDesc")}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-light text-slate-800 mb-2">
                {t("getInTouch")}
              </h2>
              <p className="text-slate-500 text-sm">{t("reachAnytime")}</p>
            </div>

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  name="firstName"
                  placeholder={t("firstName")}
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800 placeholder-slate-400"
                />
              </div>

              <div>
                <input
                  type="text"
                  name="lastName"
                  placeholder={t("lastName")}
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800 placeholder-slate-400"
                />
              </div>

              <div>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder={t("phoneNumber")}
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800 placeholder-slate-400"
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder={t("email")}
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800 placeholder-slate-400"
                />
              </div>

              <div>
                <textarea
                  name="message"
                  placeholder={t("howCanWeHelp")}
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800 placeholder-slate-400 resize-none"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-3 group"
              >
                <div className="w-10 h-10 bg-indigo-700 rounded-lg flex items-center justify-center group-hover:bg-indigo-800 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="font-medium text-lg">{t("sendMessage")}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Traditional Footer Content */}
      <div className="border-t border-slate-800" dir={isRTL ? "rtl" : "ltr"}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
                <span className="font-semibold text-white text-lg">
                  Tchad Tech Hub
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">
                {t("mission")}
              </p>
              <div className="flex gap-3 pt-2">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5 text-white" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5 text-white" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-sky-500 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5 text-white" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Quick Links</h3>
              <nav className="space-y-2">
                <a
                  href="/"
                  className="block text-sm text-slate-400 hover:text-indigo-400 transition-colors"
                >
                  Home
                </a>
                <a
                  href="/about-us"
                  className="block text-sm text-slate-400 hover:text-indigo-400 transition-colors"
                >
                  About
                </a>
                <a
                  href="/learn"
                  className="block text-sm text-slate-400 hover:text-indigo-400 transition-colors"
                >
                  Services
                </a>
                <a
                  href="/learn"
                  className="block text-sm text-slate-400 hover:text-indigo-400 transition-colors"
                >
                  Courses
                </a>

                <a
                  href="/shop"
                  className="block text-sm text-slate-400 hover:text-indigo-400 transition-colors"
                >
                  Tech Products
                </a>
              </nav>
            </div>

            {/* Application CTA */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                {t("helpUs")}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {t("helpDescription")}
              </p>
              <button
                className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors w-full justify-center group"
                onClick={() => console.log("Apply clicked")}
              >
                <span className="font-medium">{t("apply")}</span>
                <div className="w-8 h-8 bg-indigo-700 rounded-md flex items-center justify-center group-hover:bg-indigo-800 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <p className="text-sm text-slate-400 text-center">
            © 2025 TCHAD TECH HUB. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
