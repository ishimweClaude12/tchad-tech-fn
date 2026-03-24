import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Button,
} from "@mui/material";
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
