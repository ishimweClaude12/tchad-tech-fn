import React, { useState } from "react";
import { Mail } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { Button } from "@mui/material";

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
  contactUs: {
    en: "Contact Us",
    fr: "Contactez-nous",
    ar: "اتصل بنا",
  },
  contactDescription: {
    en: "Email, call, or complete the form, We would love to connect with you! and help you.",
    fr: "Envoyez un e-mail, appelez ou remplissez le formulaire, nous serions ravis de vous rencontrer et de vous aider.",
    ar: "أرسل بريدًا إلكترونيًا أو اتصل أو املأ النموذج، يسعدنا التواصل معك ومساعدتك.",
  },
  customerSupport: {
    en: "Customer Support",
    fr: "Support Client",
    ar: "دعم العملاء",
  },
  customerSupportDesc: {
    en: "Our support team is available around the clock to address any concerns or queries you may have",
    fr: "Notre équipe d'assistance est disponible 24h/24 pour répondre à toutes vos préoccupations ou questions",
    ar: "فريق الدعم لدينا متاح على مدار الساعة لمعالجة أي مخاوف أو استفسارات قد تكون لديك",
  },
  feedback: {
    en: "Feedback and Suggestions",
    fr: "Commentaires et Suggestions",
    ar: "الملاحظات والاقتراحات",
  },
  feedbackDesc: {
    en: "We value your feedback and are continuously working to improve our system. Your input is crucial in shaping the future of TCHAD TECH HUB",
    fr: "Nous apprécions vos commentaires et travaillons continuellement à améliorer notre système. Votre contribution est cruciale pour façonner l'avenir de TCHAD TECH HUB",
    ar: "نحن نقدر ملاحظاتك ونعمل باستمرار على تحسين نظامنا. مساهمتك حاسمة في تشكيل مستقبل TCHAD TECH HUB",
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
    en: "FirstName",
    fr: "Prénom",
    ar: "الاسم الأول",
  },
  lastName: {
    en: "LastName",
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
};

const ContactUsSection: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    message: "",
  });

  const t = (key: string): string => {
    return translations[key]?.[language as "en" | "fr" | "ar"] || key;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
      // Add your form submission logic here (e.g., API call)
      // Reset form after submission
      setFormData({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        message: "",
      });
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <section
      className="bg-black text-white py-8 px-6"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl lg:px-6 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column - Contact Information */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-light mb-4">
              {t("contactUs")}
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed mb-6">
              {t("contactDescription")}
            </p>

            {/* Contact Details */}
            <div className="space-y-2 text-slate-300">
              <p>Tchad Tech Hub, N'Djamena</p>
              <p>tchadtechhub.com</p>
              <p>+250 790 353 162</p>
            </div>
          </div>

          {/* Support Sections */}
          <div className="space-y-8 pt-8">
            {/* Customer Support */}
            <div>
              <h3 className="text-xl font-medium mb-2">
                {t("customerSupport")}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {t("customerSupportDesc")}
              </p>
            </div>

            {/* Feedback and Suggestions */}
            <div>
              <h3 className="text-xl font-medium mb-2">{t("feedback")}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {t("feedbackDesc")}
              </p>
            </div>

            {/* Media Inquiries */}
            <div>
              <h3 className="text-xl font-medium mb-2">
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
            {/* First Name */}
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

            {/* Last Name */}
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

            {/* Phone Number */}
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

            {/* Email */}
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

            {/* Message */}
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

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-3 group"
            >
              <div className="w-10 h-10 bg-indigo-700 rounded-lg flex items-center justify-center group-hover:bg-indigo-800 transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <span className="font-medium text-lg">{t("sendMessage")}</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUsSection;
