import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Typography,
  LinearProgress,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  PlayCircle,
  CheckCircle,
  Payment,
  Cancel,
  School,
  AccessTime,
  Info,
} from "@mui/icons-material";
import {
  type CourseEnrollment,
  EnrollmentStatus,
  EnrollmentType,
} from "src/types/Enrollment.types";

interface CourseEnrollmentCardProps {
  enrollment: CourseEnrollment;
  onContinueLearning?: (enrollmentId: string, courseId: string) => void;
  onCompletePayment?: (enrollmentId: string) => void;
  onViewCertificate?: (courseId: string) => void;
  onViewDetails?: (courseId: string) => void;
}

const CourseEnrollmentCard: React.FC<CourseEnrollmentCardProps> = ({
  enrollment,
  onContinueLearning,
  onCompletePayment,
  onViewCertificate,
  onViewDetails,
}) => {
  const { course, status, enrollmentType, enrolledAt, completedAt } =
    enrollment;

  const getStatusConfig = () => {
    switch (status) {
      case EnrollmentStatus.ACTIVE:
        return {
          color: "success" as const,
          label: "Active",
          icon: <PlayCircle />,
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        };
      case EnrollmentStatus.COMPLETED:
        return {
          color: "info" as const,
          label: "Completed",
          icon: <CheckCircle />,
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        };
      case EnrollmentStatus.PENDING_PAYMENT:
        return {
          color: "warning" as const,
          label: "Payment Pending",
          icon: <Payment />,
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
        };
      case EnrollmentStatus.CANCELLED:
        return {
          color: "error" as const,
          label: "Cancelled",
          icon: <Cancel />,
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        };
      default:
        return {
          color: "default" as const,
          label: "Unknown",
          icon: <Info />,
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
        };
    }
  };

  const getEnrollmentTypeConfig = () => {
    switch (enrollmentType) {
      case EnrollmentType.SCHOLARSHIP:
        return { label: "Scholarship", color: "secondary" as const };
      case EnrollmentType.FREE:
        return { label: "Free", color: "default" as const };
      case EnrollmentType.PAID:
        return { label: "Paid", color: "primary" as const };
      default:
        return { label: "Unknown", color: "default" as const };
    }
  };

  const handlePrimaryAction = () => {
    switch (status) {
      case EnrollmentStatus.ACTIVE:
        onContinueLearning?.(enrollment.id, course.id);
        break;
      case EnrollmentStatus.PENDING_PAYMENT:
        onCompletePayment?.(enrollment.id);
        break;
      case EnrollmentStatus.COMPLETED:
        onViewCertificate?.(course.id);
        break;
      default:
        break;
    }
  };

  const getPrimaryActionButton = () => {
    switch (status) {
      case EnrollmentStatus.ACTIVE:
        return {
          label: "Start Learning",
          variant: "contained" as const,
          color: "primary" as const,
          icon: <PlayCircle className="mr-2" />,
        };
      case EnrollmentStatus.PENDING_PAYMENT:
        return {
          label: "Complete Payment",
          variant: "contained" as const,
          color: "warning" as const,
          icon: <Payment className="mr-2" />,
        };
      case EnrollmentStatus.COMPLETED:
        return {
          label: "View Certificate",
          variant: "outlined" as const,
          color: "primary" as const,
          icon: <CheckCircle className="mr-2" />,
        };
      case EnrollmentStatus.CANCELLED:
        return null;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const statusConfig = getStatusConfig();
  const enrollmentTypeConfig = getEnrollmentTypeConfig();
  const primaryAction = getPrimaryActionButton();

  return (
    <Card
      className={`hover:shadow-lg transition-shadow duration-300 border-2 ${statusConfig.borderColor} ${statusConfig.bgColor}`}
      sx={{
        maxWidth: 400,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="relative">
        <CardMedia
          component="img"
          height="200"
          image={
            course.thumbnailUrl ||
            "https://placehold.co/400x200?text=Course+Thumbnail"
          }
          alt={course.title}
          className="h-48 object-cover"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <Chip
            icon={statusConfig.icon}
            label={statusConfig.label}
            color={statusConfig.color}
            size="small"
            className="backdrop-blur-sm bg-white/90"
          />
        </div>
        <div className="absolute top-3 left-3">
          <Chip
            icon={<School />}
            label={enrollmentTypeConfig.label}
            color={enrollmentTypeConfig.color}
            size="small"
            className="backdrop-blur-sm bg-white/90"
          />
        </div>
      </div>

      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1">
          <Typography
            variant="h6"
            component="h3"
            className="font-semibold mb-2 line-clamp-2"
            gutterBottom
          >
            {course.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            className="mb-3 line-clamp-2"
          >
            {course.description}
          </Typography>

          {status === EnrollmentStatus.ACTIVE && (
            <Box className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <Typography variant="caption" color="text.secondary">
                  Progress
                </Typography>
                <Typography variant="caption" className="font-semibold">
                  87%
                </Typography>
              </div>
              <LinearProgress
                variant="determinate"
                value={87}
                className="h-2 rounded-full"
              />
            </Box>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <AccessTime fontSize="small" />
            <Typography variant="caption">
              Enrolled {formatDate(enrolledAt)}
            </Typography>
          </div>

          {completedAt && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <CheckCircle fontSize="small" className="text-green-600" />
              <Typography variant="caption">
                Completed {formatDate(completedAt)}
              </Typography>
            </div>
          )}

          {status === EnrollmentStatus.PENDING_PAYMENT && (
            <Typography
              variant="body2"
              className="text-orange-700 font-semibold mb-3"
            >
              Amount Due: ${course.price.toFixed(2)}
            </Typography>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          {primaryAction && (
            <Button
              variant={primaryAction.variant}
              color={primaryAction.color}
              fullWidth
              onClick={handlePrimaryAction}
              startIcon={primaryAction.icon}
              disabled={status === EnrollmentStatus.CANCELLED}
            >
              {primaryAction.label}
            </Button>
          )}

          {status !== EnrollmentStatus.CANCELLED && (
            <Tooltip title="View Details">
              <IconButton
                onClick={() => onViewDetails?.(course.id)}
                color="primary"
                size="small"
              >
                <Info />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseEnrollmentCard;
