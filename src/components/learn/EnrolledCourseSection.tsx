import { useAuth } from "@clerk/clerk-react";
import { Typography } from "@mui/material";
import { useState } from "react";
import {
  useDownloadCertificate,
  useUserEnrollments,
} from "src/hooks/learn/useEnrollmentApi";
import CourseEnrollmentCard from "./CourseEnrollmentCard";
import { useNavigate } from "react-router-dom";
import type { CourseEnrollment } from "src/types/Enrollment.types";
import { useLanguage } from "../../contexts/LanguageContext";
import { enrolledSectionTranslations } from "src/utils/constants/learn/translations";

export function EnrolledCourseSection() {
  const { userId, isSignedIn } = useAuth();
  const { language } = useLanguage();
  const t = enrolledSectionTranslations[language];
  const { data: enrollments } = useUserEnrollments(userId || "");
  const { mutate: downloadCertificate, isPending: isDownloading } =
    useDownloadCertificate();
  const [downloadingEnrollmentId, setDownloadingEnrollmentId] = useState<
    string | null
  >(null);
  const navigate = useNavigate();

  const handleContinueLearning = (enrollmentId: string, courseId: string) => {
    navigate(`/learn/enrollment/${enrollmentId}/course/${courseId}`);
  };

  const handleCompletePayment = (enrollment: CourseEnrollment) => {
    navigate(
      `/learn/${enrollment.id}/checkout?data=${encodeURIComponent(
        JSON.stringify(enrollment),
      )}`,
    );
  };

  const handleViewCertificate = (enrollmentId: string) => {
    setDownloadingEnrollmentId(enrollmentId);
    downloadCertificate(enrollmentId, {
      onSettled: () => setDownloadingEnrollmentId(null),
    });
  };

  if (!isSignedIn || !enrollments) {
    return null;
  }

  return (
    <div className="bg-gray-50 w-full">
      {enrollments.data.enrollments.length > 0 && (
        <div className="max-w-7xl p-2 mx-auto">
          <Typography variant="h4" className="mb-2 font-bold text-gray-800">
            {t.heading}
          </Typography>
          <Typography variant="body1" className="mb-8 text-gray-600">
            {t.subheading}
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {enrollments?.data.enrollments.map((enrollment) => (
              <CourseEnrollmentCard
                key={enrollment.id}
                enrollment={enrollment}
                onContinueLearning={handleContinueLearning}
                onCompletePayment={() => handleCompletePayment(enrollment)}
                onViewCertificate={handleViewCertificate}
                isDownloadingCertificate={
                  isDownloading && downloadingEnrollmentId === enrollment.id
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
