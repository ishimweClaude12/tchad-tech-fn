import { EnrolledCourseSection } from "src/components/learn/EnrolledCourseSection";
import CoursesSection from "../../components/learn/CoursesSection";
import { Hero } from "../../components/learn/HeroSection";
import StudentTestimonials from "../../components/learn/StudentTestimonials";
import WhyLearnWithUs from "../../components/learn/WhyLearnWithUs";

const LearnHome: React.FC = () => {
  return (
    <div>
      <Hero />
      <EnrolledCourseSection />
      <CoursesSection />
      <WhyLearnWithUs />
      <StudentTestimonials />
    </div>
  );
};

export default LearnHome;
