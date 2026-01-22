import { useParams, useNavigate } from "react-router-dom";
import { useModuleById } from "src/hooks/learn/useModulesApi";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

const Module = () => {
  const navigate = useNavigate();
  const { moduleId = "" } = useParams<{ moduleId: string }>();

  const { data: moduleData, isLoading, error } = useModuleById(moduleId);

  if (isLoading) {
    return <div className="p-6">Loading module...</div>;
  }

  if (error || !moduleData) {
    return <div className="p-6 text-red-500">Error loading module.</div>;
  }

  const { title, description, estimatedDurationMinutes, lessons, isPreview } =
    moduleData;

  const getLessonIcon = (type: string) => {
    if (type === "VIDEO") return <PlayCircleOutlineIcon fontSize="small" />;
    return <DescriptionOutlinedIcon fontSize="small" />;
  };

  return (
    <div className=" mx-auto px-4 py-6 space-y-6">
      {/* Module Header */}
      <Card className="shadow-sm">
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Typography variant="h5" fontWeight={600}>
              {title}
            </Typography>
            {isPreview && <Chip label="Preview" size="small" color="info" />}
          </div>

          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <AccessTimeIcon fontSize="small" />
            <span>{estimatedDurationMinutes} minutes</span>
          </div>
        </CardContent>
      </Card>

      {/* Lessons Section */}
      <Card className="shadow-sm">
        <CardContent>
          <Typography variant="h6" fontWeight={600} className="mb-4">
            Lessons
          </Typography>

          <Divider className="mb-2" />

          {lessons.length ? (
            <List disablePadding>
              {lessons.map((lesson) => (
                <ListItemButton
                  key={lesson.id}
                  className="rounded-lg mb-1"
                  onClick={() => navigate(`/lessons/${lesson.id}`)}
                >
                  <div className="flex items-start gap-3">
                    {getLessonIcon(lesson.contentType)}
                    <ListItemText
                      primary={lesson.title}
                      secondary={
                        <span className="text-sm text-gray-500">
                          {lesson.description} · {lesson.durationMinutes} min
                        </span>
                      }
                    />
                  </div>
                </ListItemButton>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No lessons available in this module.
            </Typography>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Module;
