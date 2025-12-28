import {
  Card,
  CardContent,
  Chip,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventIcon from "@mui/icons-material/Event";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { EditIcon } from "lucide-react";
import { useState } from "react";
import type { Quiz } from "../../types/Quiz.types";

interface QuizCardProps {
  quiz: Quiz;
  onClick?: () => void;
  onEdit?: (quiz: Quiz) => void;
  onDelete?: (quiz: Quiz) => void;
}

const QuizCard: React.FC<QuizCardProps> = ({
  quiz,
  onClick,
  onEdit,
  onDelete,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit?.(quiz);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete?.(quiz);
  };

  return (
    <>
      <Card
        onClick={onClick}
        className="cursor-pointer transition hover:shadow-lg"
      >
        <CardContent className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1">
              <Typography fontWeight={600}>{quiz.title}</Typography>

              <Typography
                variant="body2"
                className="text-gray-600 line-clamp-2"
              >
                {quiz.description}
              </Typography>
            </div>

            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{ position: "relative", zIndex: 2000 }}
            >
              <MoreVertOutlinedIcon />
            </IconButton>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <Chip label={quiz.kind} size="small" />
            <Chip label={quiz.scope} size="small" variant="outlined" />
            <Chip label={quiz.deliveryMode} size="small" variant="outlined" />

            {quiz.isMandatory && (
              <Chip label="Mandatory" size="small" color="warning" />
            )}
          </div>

          {/* Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <AccessTimeIcon fontSize="small" />
              <span>{quiz.timeLimitMinutes} minutes</span>
            </div>

            {quiz.openAt && quiz.closeAt && (
              <div className="flex items-center gap-2">
                <EventIcon fontSize="small" />
                <span>
                  {new Date(quiz.openAt).toLocaleDateString()} -{" "}
                  {new Date(quiz.closeAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        slotProps={{
          paper: {
            sx: {
              zIndex: 1501,
            },
          },
        }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <DeleteOutlineIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default QuizCard;
