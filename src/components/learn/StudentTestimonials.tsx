import { useState } from "react";
import {
  Star,
  GraduationCap,
  Quote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { IconButton } from "@mui/material";
import { testimonialsTranslations } from "src/utils/constants/learn/translations";

const StudentTestimonials = () => {
  const { language, isRTL } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const t = testimonialsTranslations[language];

  const storiesPerView = 2;
  const maxIndex = Math.max(0, t.stories.length - storiesPerView);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  // Color palette for avatars
  const avatarColors = [
    "bg-gradient-to-br from-blue-500 to-blue-600",
    "bg-gradient-to-br from-green-500 to-green-600",
    "bg-gradient-to-br from-purple-500 to-purple-600",
    "bg-gradient-to-br from-orange-500 to-orange-600",
    "bg-gradient-to-br from-pink-500 to-pink-600",
    "bg-gradient-to-br from-indigo-500 to-indigo-600",
  ];

  return (
    <section
      className={`py-16 px-4 bg-linear-to-b from-blue-50 to-white ${
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

        {/* Testimonials Carousel */}
        <div className="relative mb-12 overflow-x-clip">
          {/* Navigation Buttons */}
          {t.stories.length > storiesPerView && (
            <>
              <IconButton
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className={`absolute ${
                  isRTL ? "right-0" : "left-0"
                } top-1/2 -translate-y-1/2 -translate-x-4 z-10 rounded-full shadow-lg hover:shadow-xl transition-all`}
                sx={{ bgcolor: "background.paper" }}
                aria-label="Previous testimonials"
              >
                {isRTL ? (
                  <ChevronRight className="w-6 h-6 text-gray-700" />
                ) : (
                  <ChevronLeft className="w-6 h-6 text-gray-700" />
                )}
              </IconButton>
              <IconButton
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                className={`absolute ${
                  isRTL ? "left-0" : "right-0"
                } top-1/2 -translate-y-1/2 translate-x-4 z-10 rounded-full shadow-lg hover:shadow-xl transition-all`}
                sx={{ bgcolor: "background.paper" }}
                aria-label="Next testimonials"
              >
                {isRTL ? (
                  <ChevronLeft className="w-6 h-6 text-gray-700" />
                ) : (
                  <ChevronRight className="w-6 h-6 text-gray-700" />
                )}
              </IconButton>
            </>
          )}

          {/* Stories Grid */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out gap-6 pb-4"
              style={{
                transform: `translateX(${
                  isRTL
                    ? currentIndex * (100 / storiesPerView)
                    : -currentIndex * (100 / storiesPerView)
                }%)`,
              }}
            >
              {t.stories.map((story, index) => (
                <div
                  key={index}
                  className="shrink-0 w-full md:w-1/2 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-8 border border-gray-100"
                  style={{ minWidth: "calc(50% - 12px)" }}
                >
                  {/* Quote Icon */}
                  <div className="mb-4">
                    <Quote
                      className="w-10 h-10 text-blue-200"
                      aria-hidden="true"
                    />
                  </div>

                  {/* Student Info */}
                  <div className="flex items-start gap-4 mb-6">
                    <div
                      className={`w-16 h-16 rounded-full ${
                        avatarColors[index % avatarColors.length]
                      } flex items-center justify-center text-white text-xl font-bold shrink-0`}
                    >
                      {story.avatar}
                    </div>
                    <div className="grow">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {story.name}
                        </h3>
                        <GraduationCap
                          className="w-4 h-4 text-green-600"
                          aria-label={t.verified}
                        />
                      </div>
                      <p className="text-sm text-gray-600">{story.location}</p>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mt-2">
                        {[...Array(story.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-yellow-500 fill-yellow-500"
                            aria-hidden="true"
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">
                          {story.rating}.0
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-gray-700 leading-relaxed mb-6 italic">
                    "{story.testimonial}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentTestimonials;
