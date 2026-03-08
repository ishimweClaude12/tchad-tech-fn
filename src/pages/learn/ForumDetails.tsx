import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetPostById,
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
} from "src/hooks/learn/useReviewsApi";
import type { PostComment } from "src/types/Reviews";
import UserCard from "src/components/learn/UserCard";
import { useAuth } from "@clerk/clerk-react";

// MUI imports
import {
  Box,
  Typography,
  TextField,
  Button,
  Skeleton,
  IconButton,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ReplyIcon from "@mui/icons-material/Reply";
import SendIcon from "@mui/icons-material/Send";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatRelativeTime = (dateStr: string): string => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

// ─── Comment Component (Recursive for Nested Comments) ────────────────────────

interface CommentItemProps {
  comment: PostComment;
  postId: string;
  currentUserId: string | null | undefined;
  level?: number;
  onEdit: (comment: PostComment) => void;
  onDelete: (comment: PostComment) => void;
}

const CommentItem = ({
  comment,
  postId,
  currentUserId,
  level = 0,
  onEdit,
  onDelete,
}: CommentItemProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const isAuthor = currentUserId && comment.user_id === currentUserId;
  const menuOpen = Boolean(anchorEl);
  const hasReplies = comment.replies && comment.replies.length > 0;
  const replyCount = comment.replies?.length || 0;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    setAnchorEl(null);
    onEdit(comment);
  };

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    setAnchorEl(null);
    onDelete(comment);
  };

  const handleReply = () => {
    setShowReplyForm(true);
  };

  const handleCancelReply = () => {
    setShowReplyForm(false);
  };

  return (
    <Box
      className={`${level > 0 ? "ml-8 mt-3" : "mt-4"} ${
        level > 0 ? "border-l-2 border-gray-200 pl-4" : ""
      }`}
    >
      <Paper
        variant="outlined"
        className="p-4 rounded-xl border border-gray-200 bg-white hover:border-blue-200 transition-colors"
      >
        {/* Comment Header */}
        <Box className="flex items-start justify-between mb-2">
          <Box className="flex-1">
            <UserCard userId={comment.user_id} />
            <Typography
              component="time"
              dateTime={comment.created_at}
              title={new Date(comment.created_at).toLocaleString()}
              className="text-gray-500 text-xs mt-1 block"
            >
              {formatRelativeTime(comment.created_at)}
            </Typography>
          </Box>

          {isAuthor && (
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              aria-label="Comment options"
              sx={{
                color: "#6b7280",
                "&:hover": { color: "#1e40af", backgroundColor: "#f3f4f6" },
              }}
            >
              <MoreVertIcon style={{ fontSize: 18 }} />
            </IconButton>
          )}
        </Box>

        {/* Comment Content */}
        <Typography
          variant="body2"
          className="text-gray-700 text-sm leading-relaxed mb-3"
        >
          {comment.content}
        </Typography>

        {/* Action Buttons */}
        <Box className="flex items-center gap-2">
          {/* Reply Button */}
          <Button
            size="small"
            startIcon={<ReplyIcon style={{ fontSize: 14 }} />}
            onClick={handleReply}
            sx={{
              color: "#6b7280",
              textTransform: "none",
              fontSize: "12px",
              "&:hover": { color: "#1e40af", backgroundColor: "#f3f4f6" },
            }}
          >
            Reply
          </Button>

          {/* Expand/Collapse Button - Only show if there are replies */}
          {hasReplies && (
            <Button
              size="small"
              startIcon={
                isExpanded ? (
                  <ExpandLessIcon style={{ fontSize: 14 }} />
                ) : (
                  <ExpandMoreIcon style={{ fontSize: 14 }} />
                )
              }
              onClick={() => setIsExpanded(!isExpanded)}
              sx={{
                color: "#6b7280",
                textTransform: "none",
                fontSize: "12px",
                "&:hover": { color: "#1e40af", backgroundColor: "#f3f4f6" },
              }}
            >
              {isExpanded ? "Hide" : "Show"} {replyCount}{" "}
              {replyCount === 1 ? "reply" : "replies"}
            </Button>
          )}
        </Box>

        {/* Menu for Edit/Delete */}
        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <EditIcon fontSize="small" sx={{ color: "#1e40af" }} />
            </ListItemIcon>
            <ListItemText>Edit Comment</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleDelete}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" sx={{ color: "#dc2626" }} />
            </ListItemIcon>
            <ListItemText sx={{ color: "#dc2626" }}>
              Delete Comment
            </ListItemText>
          </MenuItem>
        </Menu>
      </Paper>

      {/* Reply Form - Shown Inline */}
      <Collapse in={showReplyForm}>
        <CommentForm
          postId={postId}
          parentId={comment.id}
          onCancel={handleCancelReply}
          placeholder="Write your reply..."
          isReply
        />
      </Collapse>

      {/* Nested Replies - Collapsible */}
      {hasReplies && (
        <Collapse in={isExpanded}>
          <Box>
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                postId={postId}
                currentUserId={currentUserId}
                level={level + 1}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </Box>
        </Collapse>
      )}
    </Box>
  );
};

// ─── Comment Form Component ───────────────────────────────────────────────────

interface CommentFormProps {
  postId: string;
  parentId: string | null;
  onCancel?: () => void;
  placeholder?: string;
  isReply?: boolean;
}

const CommentForm = ({
  postId,
  parentId,
  onCancel,
  placeholder = "Share your thoughts...",
  isReply = false,
}: CommentFormProps) => {
  const [content, setContent] = useState("");
  const createCommentMutation = useCreateComment();

  const handleSubmit = () => {
    if (!content.trim()) return;

    createCommentMutation.mutate(
      {
        post_id: postId,
        content: content.trim(),
        parent_id: parentId,
      },
      {
        onSuccess: () => {
          setContent("");
          if (onCancel) {
            onCancel(); // Close the reply form
          }
        },
      },
    );
  };

  // Extract button text logic
  const getButtonText = () => {
    if (createCommentMutation.isPending) return "Posting...";
    return isReply ? "Reply" : "Comment";
  };

  return (
    <Paper
      variant="outlined"
      className={`p-4 rounded-xl border border-gray-200 bg-white ${
        isReply ? "ml-8 mt-3" : "mt-6"
      }`}
    >
      <TextField
        fullWidth
        multiline
        minRows={isReply ? 2 : 3}
        placeholder={placeholder}
        variant="outlined"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#f9fafb",
            borderRadius: "8px",
            color: "#111827",
            fontSize: "14px",
            "& fieldset": { borderColor: "#e5e7eb" },
            "&:hover fieldset": { borderColor: "#d1d5db" },
            "&.Mui-focused fieldset": { borderColor: "#1e40af" },
          },
          "& textarea::placeholder": { color: "#9ca3af", opacity: 1 },
        }}
      />

      <Box className="flex justify-end gap-2 mt-3">
        {isReply && onCancel && (
          <Button
            variant="outlined"
            onClick={onCancel}
            size="small"
            sx={{
              textTransform: "none",
              fontSize: "13px",
              color: "#6b7280",
              borderColor: "#d1d5db",
              borderRadius: "8px",
              "&:hover": {
                color: "#111827",
                borderColor: "#9ca3af",
                backgroundColor: "#f3f4f6",
              },
            }}
          >
            Cancel
          </Button>
        )}
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={createCommentMutation.isPending || !content.trim()}
          endIcon={<SendIcon style={{ fontSize: 16 }} />}
          size="small"
          sx={{
            textTransform: "none",
            fontSize: "13px",
            fontWeight: 600,
            backgroundColor: "#1e40af",
            borderRadius: "8px",
            "&:hover": { backgroundColor: "#1e3a8a" },
            "&:disabled": {
              backgroundColor: "#9ca3af",
              color: "#e5e7eb",
            },
          }}
        >
          {getButtonText()}
        </Button>
      </Box>
    </Paper>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const ForumDetails = () => {
  const navigate = useNavigate();
  const { forumId } = useParams<{ forumId: string }>();
  const { userId } = useAuth();
  const { data, isLoading, error } = useGetPostById(forumId || "");
  const updateCommentMutation = useUpdateComment();
  const deleteCommentMutation = useDeleteComment();

  // Edit states
  const [editingComment, setEditingComment] = useState<PostComment | null>(
    null,
  );
  const [editContent, setEditContent] = useState("");

  // Delete states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<PostComment | null>(
    null,
  );

  const handleEditComment = (comment: PostComment) => {
    setEditingComment(comment);
    setEditContent(comment.content);
  };

  const handleCloseEdit = () => {
    setEditingComment(null);
    setEditContent("");
  };

  const handleSubmitEdit = () => {
    if (!editingComment || !editContent.trim()) return;

    updateCommentMutation.mutate(
      {
        commentId: editingComment.id,
        content: editContent.trim(),
      },
      {
        onSuccess: () => {
          handleCloseEdit();
        },
      },
    );
  };

  const handleDeleteComment = (comment: PostComment) => {
    setCommentToDelete(comment);
    setDeleteDialogOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteDialogOpen(false);
    setCommentToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (!commentToDelete) return;

    deleteCommentMutation.mutate(commentToDelete.id, {
      onSuccess: () => {
        handleCloseDelete();
      },
    });
  };

  if (isLoading) {
    return (
      <Box
        className="min-h-screen bg-gray-50 p-4 sm:p-6"
        style={{
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}
      >
        <Skeleton variant="rectangular" height={40} className="mb-6" />
        <Paper variant="outlined" className="p-6 rounded-2xl mb-6">
          <Skeleton variant="text" width="60%" height={32} className="mb-4" />
          <Skeleton variant="text" width="100%" height={20} className="mb-2" />
          <Skeleton variant="text" width="100%" height={20} className="mb-2" />
          <Skeleton variant="text" width="40%" height={20} />
        </Paper>
        <Skeleton variant="rectangular" height={100} className="mb-4" />
        <Skeleton variant="rectangular" height={100} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <Alert
          severity="error"
          icon={<ErrorOutlineIcon />}
          className="rounded-2xl"
          sx={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fca5a5",
            color: "#dc2626",
            borderRadius: "14px",
            "& .MuiAlert-icon": { color: "#dc2626" },
          }}
        >
          Failed to load forum post. Please try again later.
        </Alert>
      </Box>
    );
  }

  const post = data?.data.post;
  const comments = data?.data.userComments || [];

  return (
    <Box
      className="min-h-screen bg-gray-50"
      style={{
        fontFamily: "'DM Sans', system-ui, sans-serif",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <Box className="mx-auto px-4 sm:px-6 pt-10 pb-20 sm:pt-6">
        {/* Back Button */}
        <Button
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackIcon />}
          sx={{
            textTransform: "none",
            fontSize: "14px",
            color: "#6b7280",
            marginBottom: "24px",
            "&:hover": {
              color: "#1e40af",
              backgroundColor: "#f3f4f6",
            },
          }}
        >
          Back
        </Button>

        {/* Post Details */}
        {post && (
          <Paper
            variant="outlined"
            className="p-6 rounded-2xl border border-gray-200 bg-white mb-8"
          >
            {/* Post Author */}
            <Box className="mb-4">
              <UserCard userId={post.user_id} />
              <Typography
                component="time"
                dateTime={post.created_at}
                title={new Date(post.created_at).toLocaleString()}
                className="text-gray-500 text-xs mt-2 block"
              >
                Posted {formatRelativeTime(post.created_at)}
              </Typography>
            </Box>

            {/* Post Title */}
            <Typography
              variant="h4"
              component="h1"
              className="text-gray-900 font-bold tracking-[-0.01em] leading-tight mb-4"
              style={{
                fontFamily: "'Sora', 'DM Sans', sans-serif",
                fontSize: "clamp(24px, 4vw, 32px)",
              }}
            >
              {post.title}
            </Typography>

            {/* Post Content */}
            <Typography
              variant="body1"
              className="text-gray-700 leading-relaxed mb-6 whitespace-pre-wrap"
            >
              {post.content}
            </Typography>

            {/* Post Stats */}
            <Box className="flex items-center gap-4 pt-4 border-t border-gray-200">
              <Box className="flex items-center gap-1.5 text-gray-600">
                <ChatBubbleOutlineIcon style={{ fontSize: 16 }} />
                <Typography variant="body2" className="text-sm">
                  {comments.length}{" "}
                  {comments.length === 1 ? "comment" : "comments"}
                </Typography>
              </Box>
            </Box>
          </Paper>
        )}

        {/* Comments Section */}
        <Box>
          <Typography
            variant="h5"
            component="h2"
            className="text-gray-900 font-bold mb-4"
            style={{ fontFamily: "'Sora', 'DM Sans', sans-serif" }}
          >
            Comments ({comments.length})
          </Typography>

          {/* Add Comment Form */}
          <CommentForm postId={forumId || ""} parentId={null} />

          {/* Comments List */}
          {comments.length === 0 ? (
            <Box className="text-center py-12">
              <Box className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <ChatBubbleOutlineIcon className="text-blue-600" />
              </Box>
              <Typography
                variant="h6"
                className="text-gray-900 font-semibold mb-2"
                style={{ fontFamily: "'Sora', 'DM Sans', sans-serif" }}
              >
                No comments yet
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Be the first to share your thoughts!
              </Typography>
            </Box>
          ) : (
            <Box>
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  postId={forumId || ""}
                  currentUserId={userId}
                  onEdit={handleEditComment}
                  onDelete={handleDeleteComment}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* Edit Comment Dialog */}
      <Dialog
        open={!!editingComment}
        onClose={handleCloseEdit}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontFamily: "'Sora', 'DM Sans', sans-serif" }}>
          Edit Comment
        </DialogTitle>
        <DialogContent>
          <Box className="pt-2">
            <TextField
              fullWidth
              multiline
              minRows={4}
              placeholder="Edit your comment..."
              variant="outlined"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f9fafb",
                  borderRadius: "8px",
                  color: "#111827",
                  fontSize: "14px",
                  "& fieldset": { borderColor: "#e5e7eb" },
                  "&:hover fieldset": { borderColor: "#d1d5db" },
                  "&.Mui-focused fieldset": { borderColor: "#1e40af" },
                },
                "& textarea::placeholder": { color: "#9ca3af", opacity: 1 },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button
            onClick={handleCloseEdit}
            sx={{
              textTransform: "none",
              color: "#6b7280",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitEdit}
            disabled={updateCommentMutation.isPending || !editContent.trim()}
            variant="contained"
            sx={{
              textTransform: "none",
              backgroundColor: "#1e40af",
              "&:hover": { backgroundColor: "#1e3a8a" },
              "&:disabled": {
                backgroundColor: "#9ca3af",
                color: "#e5e7eb",
              },
            }}
          >
            {updateCommentMutation.isPending ? "Updating..." : "Update Comment"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDelete}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontFamily: "'Sora', 'DM Sans', sans-serif" }}>
          Delete Comment?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" className="text-gray-600">
            Are you sure you want to delete this comment? This action cannot be
            undone.
          </Typography>
          {commentToDelete && (
            <Box className="mt-3 p-3 bg-gray-50 rounded-lg">
              <Typography variant="body2" className="text-gray-700">
                {commentToDelete.content.slice(0, 150)}
                {commentToDelete.content.length > 150 ? "..." : ""}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button
            onClick={handleCloseDelete}
            sx={{
              textTransform: "none",
              color: "#6b7280",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            disabled={deleteCommentMutation.isPending}
            variant="contained"
            sx={{
              textTransform: "none",
              backgroundColor: "#dc2626",
              "&:hover": { backgroundColor: "#b91c1c" },
              "&:disabled": {
                backgroundColor: "#9ca3af",
                color: "#e5e7eb",
              },
            }}
          >
            {deleteCommentMutation.isPending ? "Deleting..." : "Delete Comment"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ForumDetails;
