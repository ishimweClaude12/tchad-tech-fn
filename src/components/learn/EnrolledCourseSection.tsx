import { useAuth } from "@clerk/clerk-react";
import { Typography } from "@mui/material";
import { useUserEnrollments } from "src/hooks/learn/useEnrollmentApi";
import CourseEnrollmentCard from "./CourseEnrollmentCard";
import { useNavigate } from "react-router-dom";
import type { CourseEnrollment } from "src/types/Enrollment.types";

export const EnrolledCourseSection: React.FC = () => {
  const { userId, isSignedIn } = useAuth();
  const { data: enrollments } = useUserEnrollments(userId || "");
  const navigate = useNavigate();

  // Handlers

  const handleContinueLearning = (enrollmentId: string, courseId: string) => {
    ///learn/enrollment/:enrollmentId/course/:courseId
    navigate(`/learn/enrollment/${enrollmentId}/course/${courseId}`);
  };

  const handleCompletePayment = (enrollment: CourseEnrollment) => {
    navigate(
      `/learn/${enrollment.id}/checkout?data=${encodeURIComponent(
        JSON.stringify(enrollment)
      )}`
    );
  };

  const handleViewCertificate = (courseId: string) => {
    console.log("View certificate for course:", courseId);
    alert(`Viewing certificate for course: ${courseId}`);
  };


  if (!isSignedIn || !enrollments) {
    return null;
  }
  return (
    <div className="bg-gray-50 w-full">
      <div className="max-w-7xl p-2 mx-auto">
        <Typography variant="h4" className="mb-2 font-bold text-gray-800">
          My Courses
        </Typography>
        <Typography variant="body1" className="mb-8 text-gray-600">
          Track your learning progress and manage your enrollments
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {enrollments?.data.enrollments.map((enrollment) => (
            <CourseEnrollmentCard
              key={enrollment.id}
              enrollment={enrollment}
              onContinueLearning={handleContinueLearning}
              onCompletePayment={() => handleCompletePayment(enrollment)}
              onViewCertificate={handleViewCertificate}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
