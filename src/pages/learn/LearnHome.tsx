import CoursesSection from "../../components/learn/CoursesSection";
import { Hero } from "../../components/learn/HeroSection";
import StudentTestimonials from "../../components/learn/StudentTestimonials";
import WhyLearnWithUs from "../../components/learn/WhyLearnWithUs";

const LearnHome: React.FC = () => {
  return (
    <div>
      <Hero />
      <CoursesSection />
      <WhyLearnWithUs />
      <StudentTestimonials />
    </div>
  );
};

export default LearnHome;
