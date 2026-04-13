import { Alert, CircularProgress, Typography } from "@mui/material";
import { usePublishedCourses } from "../../hooks/learn/useCourseApi";
import CourseCard from "./CourseCard";
import { useLanguage } from "../../contexts/LanguageContext";
import { coursesSectionTranslations } from "src/utils/constants/learn/translations";

const CoursesSection = () => {
  const { language } = useLanguage();
  const t = coursesSectionTranslations[language];
  const { data: coursesData, isLoading, error } = usePublishedCourses();

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto mt-4 p-2">
        <Alert severity="error">{t.errorLoading}</Alert>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto mt-4 p-2">
      <Typography variant="h4" className="mb-2 font-bold text-gray-800">
        {t.heading}
      </Typography>
      <Typography variant="body1" className="mb-8 text-gray-600">
        {t.subheading}
      </Typography>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
        {coursesData?.data?.courses.data.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
};

export default CoursesSection;
