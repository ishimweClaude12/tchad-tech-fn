import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Headphones,
  Lightbulb,
} from "lucide-react";
import { useScrollToTop } from "../../utils/hooks/ScrollTop";
import { useLanguage } from "../../contexts/LanguageContext";

type Translations = {
  [key: string]: {
    en: string;
    fr: string;
    ar: string;
  };
};

const translations: Translations = {
  contactUs: { en: "Contact Us", fr: "Contactez-nous", ar: "اتصل بنا" },
  getInTouch: { en: "Get In Touch", fr: "Entrez en Contact", ar: "تواصل معنا" },
  reachDescription: {
    en: "Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
    fr: "Vous avez des questions? Nous aimerions avoir de vos nouvelles. Envoyez-nous un message et nous vous répondrons dans les plus brefs délais.",
    ar: "هل لديك أسئلة؟ نود أن نسمع منك. أرسل لنا رسالة وسنرد في أقرب وقت ممكن.",
  },
  firstName: { en: "First Name", fr: "Prénom", ar: "الاسم الأول" },
  lastName: { en: "Last Name", fr: "Nom de famille", ar: "اسم العائلة" },
  phoneNumber: {
    en: "Phone Number",
    fr: "Numéro de téléphone",
    ar: "رقم الهاتف",
  },
  email: {
    en: "Email Address",
    fr: "Adresse e-mail",
    ar: "عنوان البريد الإلكتروني",
  },
  subject: { en: "Subject", fr: "Sujet", ar: "الموضوع" },
  message: { en: "Your Message", fr: "Votre message", ar: "رسالتك" },
  sendMessage: {
    en: "Send Message",
    fr: "Envoyer le message",
    ar: "إرسال رسالة",
  },
  contactInfo: {
    en: "Contact Information",
    fr: "Informations de contact",
    ar: "معلومات الاتصال",
  },
  address: { en: "Our Address", fr: "Notre adresse", ar: "عنواننا" },
  emailUs: {
    en: "Email Us",
    fr: "Envoyez-nous un e-mail",
    ar: "راسلنا عبر البريد الإلكتروني",
  },
  callUs: { en: "Call Us", fr: "Appelez-nous", ar: "اتصل بنا" },
  businessHours: {
    en: "Business Hours",
    fr: "Heures d'ouverture",
    ar: "ساعات العمل",
  },
  hours: {
    en: "Mon - Fri: 8:00 AM - 6:00 PM",
    fr: "Lun - Ven: 8h00 - 18h00",
    ar: "الاثنين - الجمعة: 8:00 صباحًا - 6:00 مساءً",
  },
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
    en: "Feedback & Suggestions",
    fr: "Commentaires et Suggestions",
    ar: "الملاحظات والاقتراحات",
  },
  feedbackDesc: {
    en: "We value your feedback and are continuously working to improve our system. Your input is crucial.",
    fr: "Nous apprécions vos commentaires et travaillons continuellement à améliorer notre système.",
    ar: "نحن نقدر ملاحظاتك ونعمل باستمرار على تحسين نظامنا.",
  },
  mediaInquiries: {
    en: "Media Inquiries",
    fr: "Demandes des Médias",
    ar: "استفسارات وسائل الإعلام",
  },
  mediaInquiriesDesc: {
    en: "For media-related questions or press inquiries, please reach out to our communications team.",
    fr: "Pour les questions liées aux médias, veuillez contacter notre équipe de communication.",
    ar: "للأسئلة المتعلقة بوسائل الإعلام، يرجى الاتصال بفريق الاتصالات لدينا.",
  },
  findUs: {
    en: "Find Us on the Map",
    fr: "Trouvez-nous sur la carte",
    ar: "اعثر علينا على الخريطة",
  },
};

type ContactCardProps = {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  title: string;
  description: string;
  color: string;
};

const ContactCard = ({
  icon: Icon,
  title,
  description,
  color,
}: ContactCardProps) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div
        className={`w-14 h-14 rounded-2xl bg-linear-to-br ${color} flex items-center justify-center mb-4`}
      >
        <Icon className="text-white" size={28} />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

export default function ContactUsPage() {
  useScrollToTop({ smooth: true });
  const { language, isRTL } = useLanguage();

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <div
      className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-purple-50"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white py-20 px-4">
        <div className=" mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {t("contactUs")}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {t("reachDescription")}
          </p>
        </div>
      </div>

      <div className=" mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <ContactCard
            icon={Headphones}
            title={t("customerSupport")}
            description={t("customerSupportDesc")}
            color="from-blue-500 to-blue-600"
          />
          <ContactCard
            icon={Lightbulb}
            title={t("feedback")}
            description={t("feedbackDesc")}
            color="from-purple-500 to-purple-600"
          />
          <ContactCard
            icon={MessageSquare}
            title={t("mediaInquiries")}
            description={t("mediaInquiriesDesc")}
            color="from-indigo-500 to-indigo-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t("contactInfo")}
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {t("address")}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Tchad Tech Hub
                      <br />
                      N'Djamena, Tchad
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {t("emailUs")}
                    </h3>
                    <a
                      href="mailto:tchadtechhub.com"
                      className="text-purple-600 hover:text-purple-700 text-sm"
                    >
                      tchadtechhub.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {t("callUs")}
                    </h3>
                    <a
                      href="tel:+250790353162"
                      className="text-green-600 hover:text-green-700 text-sm"
                    >
                      +250 790 353 162
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                    <Clock className="text-orange-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {t("businessHours")}
                    </h3>
                    <p className="text-gray-600 text-sm">{t("hours")}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      Sat - Sun: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 bg-linear-to-r from-blue-600 to-purple-600">
            <h2 className="text-3xl font-bold text-white text-center">
              {t("findUs")}
            </h2>
          </div>
          <div className="h-96 md:h-[500px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62406.89384693768!2d15.013974799999998!3d12.134846!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1114e1c1a0b6d6d9%3A0x2e4e7f8f9c4c7a3b!2sN'Djamena%2C%20Chad!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Tchad Tech Hub Location - N'Djamena, Tchad"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
