import { useAuth } from "@clerk/clerk-react";
import { Typography } from "@mui/material";
import { useUserEnrollments } from "src/hooks/learn/useEnrollmentApi";
import CourseEnrollmentCard from "./CourseEnrollmentCard";

export const EnrolledCourseSection: React.FC = () => {
  const { userId, isSignedIn } = useAuth();
  const { data: enrollments } = useUserEnrollments(userId || "");

  // Handlers

  const handleContinueLearning = (courseId: string) => {
    console.log("Continue learning course:", courseId);
    alert(`Navigating to course: ${courseId}`);
  };

  const handleCompletePayment = (enrollmentId: string) => {
    console.log("Complete payment for enrollment:", enrollmentId);
    alert(`Opening payment page for enrollment: ${enrollmentId}`);
  };

  const handleViewCertificate = (courseId: string) => {
    console.log("View certificate for course:", courseId);
    alert(`Viewing certificate for course: ${courseId}`);
  };

  const handleViewDetails = (courseId: string) => {
    console.log("View details for course:", courseId);
    alert(`Viewing details for course: ${courseId}`);
  };
  if (!isSignedIn || !enrollments) {
    return null;
  }
  return (
    <div className="bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
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
              onCompletePayment={handleCompletePayment}
              onViewCertificate={handleViewCertificate}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
