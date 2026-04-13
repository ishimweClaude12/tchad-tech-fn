import { EnrolledCourseSection } from "src/components/learn/EnrolledCourseSection";
import CoursesSection from "../../components/learn/CoursesSection";
import { Hero } from "../../components/learn/HeroSection";
import StudentTestimonials from "../../components/learn/StudentTestimonials";
import WhyLearnWithUs from "../../components/learn/WhyLearnWithUs";

export default function LearnHome() {
  return (
    <div>
      <Hero />
      <EnrolledCourseSection />
      <CoursesSection />
      <WhyLearnWithUs />
      <StudentTestimonials />
    </div>
  );
}
