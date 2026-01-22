import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Rating,
  Button,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SchoolIcon from "@mui/icons-material/School";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import type { Course } from "src/types/Course.types";
import { useNavigate } from "react-router-dom";

interface Props {
  course: Course;
}

const CourseCard = ({ course }: Props) => {
  const navigate = useNavigate();

  return (
    <Card className="h-full flex flex-col hover:shadow-xl transition-shadow duration-300">
      {/* Thumbnail */}
      <div className="relative">
        <CardMedia
          component="img"
          height="180"
          image={course.thumbnailUrl || "/images/placeholder.jpg"}
          alt={course.title}
          className="h-44 object-cover"
        />

        {course.hasCertificate && (
          <div className="absolute top-2 left-2">
            <Chip
              icon={<WorkspacePremiumIcon />}
              label="Certificate"
              size="small"
              color="success"
            />
          </div>
        )}
      </div>

      <CardContent className="flex flex-col flex-1 space-y-3">
        {/* Category */}
        <Typography className="text-xs text-gray-500 uppercase tracking-wide">
          {course.category?.name}
        </Typography>

        {/* Title */}
        <Typography variant="h6" className="font-semibold line-clamp-2">
          {course.title}
        </Typography>

        {/* Subtitle */}
        <Typography variant="body2" className="text-gray-600 line-clamp-2">
          {course.shortDescription}
        </Typography>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <Rating
            value={course.ratingAverage ?? 0}
            precision={0.5}
            size="small"
            readOnly
          />
          <Typography className="text-sm text-gray-500">
            ({course.ratingCount})
          </Typography>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <AccessTimeIcon fontSize="small" />
            <span>{course.estimatedDurationHours} hrs</span>
          </div>

          <div className="flex items-center gap-1">
            <SchoolIcon fontSize="small" />
            <span>{course.totalLessons} lessons</span>
          </div>
        </div>

        {/* Instructor */}
        <Typography className="text-sm text-gray-700">
          {/* TODO: Replace with instructor name  */}
          By <span className="font-medium"> John Doe</span>
        </Typography>

        {/* Price */}
        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="flex items-center gap-2">
            {course.discountPrice ? (
              <>
                <Typography className="text-lg font-semibold text-green-600">
                  {course.currency} {course.discountPrice}
                </Typography>
                <Typography className="text-sm text-gray-400 line-through">
                  {course.currency} {course.price}
                </Typography>
              </>
            ) : (
              <Typography className="text-lg font-semibold">
                {course.currency} {course.price}
              </Typography>
            )}
          </div>

          <Button
            variant="contained"
            size="small"
            onClick={() => navigate(`/learn/course/${course.slug}`)}
          >
            View Course
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
