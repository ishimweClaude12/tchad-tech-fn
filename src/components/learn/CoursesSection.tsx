import { CircularProgress } from "@mui/material";
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
    // <div>
    //   {coursesData?.data?.courses?.data.map((course) => (
    //     <div key={course.id}>
    //       <h3>{course.title}</h3>
    //       <p>{course.description}</p>
    //     </div>
    //   ))}
    // </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
      {coursesData?.data?.courses?.data.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};

export default CoursesSection;
