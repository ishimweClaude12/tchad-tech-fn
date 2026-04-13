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
import { Button } from "@mui/material";
import { whyLearnTranslations } from "src/utils/constants/learn/translations";
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
  const { language, isRTL } = useLanguage();
  const t = whyLearnTranslations[language];

  return (
    <section
      className={`py-16 px-4 bg-linear-to-b from-gray-50 to-blue-50 ${
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
                      className="w-7 h-7 text-chad-blue"
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
          <Button variant="contained" color="primary" aria-label={t.cta}>
            {t.cta}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default WhyLearnWithUs;
