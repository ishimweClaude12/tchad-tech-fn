import { CircularProgress, Typography } from "@mui/material";
import { usePublishedCourses } from "../../hooks/learn/useCourseApi";
import CourseCard from "./CourseCard";

const CoursesSection = () => {
  const { data: coursesData, isLoading, error } = usePublishedCourses();

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error loading courses.</div>;
  }

  return (
    <section className="bg-white max-w-7xl mx-auto mt-4">
      <Typography variant="h4" className="mb-2 font-bold text-gray-800">
        Browse Courses
      </Typography>
      <Typography variant="body1" className="mb-8 text-gray-600">
        Explore our wide range of courses designed to help you learn and grow
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
