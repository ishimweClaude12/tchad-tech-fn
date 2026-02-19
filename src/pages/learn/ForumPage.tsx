import { useState, useMemo } from "react";
import {
  useGetPosts,
  useAddPost,
  useUpdatePost,
  useDeletePost,
} from "src/hooks/learn/useReviewsApi";
import type { Post } from "src/types/Reviews";
import UserCard from "src/components/learn/UserCard";

// MUI imports
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  Skeleton,
  Chip,
  IconButton,
  Divider,
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ReplyIcon from "@mui/icons-material/Reply";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useAuth } from "@clerk/clerk-react";

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

// ─── Sub-components ───────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <Paper
    variant="outlined"
    className="flex gap-4 p-5 rounded-2xl border border-gray-200 bg-white"
  >
    <Skeleton variant="circular" width={40} height={40} className="shrink-0" />
    <Box className="flex-1">
      <Skeleton variant="text" width="60%" height={20} className="mb-2" />
      <Skeleton variant="text" width="90%" height={14} className="mb-1" />
      <Skeleton variant="text" width="40%" height={14} />
    </Box>
  </Paper>
);

const EmptyState = ({ query }: { query: string }) => (
  <Box className="flex flex-col items-center py-16 px-6 text-center">
    <Box className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-5">
      <ForumOutlinedIcon className="text-blue-600 w-7 h-7" />
    </Box>
    <Typography
      variant="h6"
      className="font-semibold text-gray-900 mb-2"
      style={{ fontFamily: "'Sora', 'DM Sans', sans-serif" }}
    >
      {query ? `No posts matching "${query}"` : "No posts yet"}
    </Typography>
    <Typography variant="body2" className="text-gray-600 max-w-xs">
      {query
        ? "Try a different search term or clear the filter."
        : "Be the first to start a conversation in this community."}
    </Typography>
  </Box>
);

interface PostCardProps {
  post: Post;
  index: number;
  currentUserId: string | null | undefined;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
}

const PostCard = ({
  post,
  index,
  currentUserId,
  onEdit,
  onDelete,
}: PostCardProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isAuthor = currentUserId && post.user_id === currentUserId;
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit(post);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete(post);
  };
  return (
    <Paper
      variant="outlined"
      component="article"
      tabIndex={0}
      aria-label={`Post: ${post.title}`}
      className="
        p-5 rounded-2xl cursor-pointer
        border border-gray-200 bg-white
        transition-all duration-200 ease-out
        hover:border-blue-300 hover:bg-gray-50
        hover:-translate-y-0.5 hover:shadow-lg
        focus-visible:outline-2 focus-visible:outline-blue-600
        focus-visible:border-blue-600
      "
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* User Information */}
      <Box className="mb-4">
        <UserCard userId={post.user_id} />
      </Box>

      {/* Body */}
      <Box className="flex-1 min-w-0">
        {/* Header row */}
        <Box className="flex items-center justify-between gap-2 mb-2 flex-wrap">
          <Box className="flex items-center gap-1.5 text-[12.5px]">
            <Typography
              component="time"
              dateTime={post.created_at}
              title={new Date(post.created_at).toLocaleString()}
              className="text-gray-500 text-[12.5px]"
            >
              {formatRelativeTime(post.created_at)}
            </Typography>
          </Box>

          <Box className="flex items-center gap-1">
            {post.attachment && (
              <Chip
                icon={<AttachFileIcon style={{ fontSize: 12 }} />}
                label="Attachment"
                size="small"
                aria-label="Has attachment"
                sx={{
                  color: "#1e40af",
                  backgroundColor: "rgba(30,64,175,0.1)",
                  "& .MuiChip-icon": { color: "#1e40af" },
                  fontSize: "11px",
                  letterSpacing: "0.04em",
                }}
              />
            )}
            {isAuthor && (
              <IconButton
                size="small"
                onClick={handleMenuOpen}
                aria-label="Post options"
                sx={{
                  color: "#6b7280",
                  "&:hover": { color: "#1e40af", backgroundColor: "#f3f4f6" },
                }}
              >
                <MoreVertIcon style={{ fontSize: 18 }} />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Title */}
        <Typography
          variant="h6"
          component="h2"
          className="text-gray-900 font-semibold text-base leading-snug tracking-[-0.01em] mb-1.5"
          style={{ fontFamily: "'Sora', 'DM Sans', sans-serif" }}
        >
          {post.title}
        </Typography>

        {/* Excerpt */}
        <Typography
          variant="body2"
          className="text-gray-600 text-[13.5px] leading-relaxed mb-3.5"
        >
          {post.content.length > 160
            ? `${post.content.slice(0, 160)}…`
            : post.content}
        </Typography>

        {/* Footer stats */}
        <Box className="flex items-center gap-2 flex-wrap">
          {/* Views */}
          <Button
            size="small"
            startIcon={<VisibilityOutlinedIcon style={{ fontSize: 14 }} />}
            aria-label={`${post.view_count} views`}
            sx={{
              color: "#6b7280",
              textTransform: "none",
              fontSize: "12.5px",
              "&:hover": { color: "#1e40af", backgroundColor: "#f3f4f6" },
            }}
          >
            {post.view_count.toLocaleString()}
          </Button>

          {/* Comments */}
          <Button
            size="small"
            startIcon={<ChatBubbleOutlineIcon style={{ fontSize: 14 }} />}
            aria-label={`${post.comment_count} comments`}
            sx={{
              color: "#6b7280",
              textTransform: "none",
              fontSize: "12.5px",
              "&:hover": { color: "#1e40af", backgroundColor: "#f3f4f6" },
            }}
          >
            {post.comment_count.toLocaleString()}
          </Button>

          {/* Reply */}
          <Button
            size="small"
            startIcon={<ReplyIcon style={{ fontSize: 14 }} />}
            variant="outlined"
            sx={{
              marginLeft: "auto",
              textTransform: "none",
              fontSize: "12.5px",
              color: "#1e40af",
              borderColor: "rgba(30,64,175,0.3)",
              "&:hover": {
                backgroundColor: "#1e40af",
                borderColor: "#1e40af",
                color: "#fff",
              },
            }}
          >
            Reply
          </Button>

          {/* Share */}
          <IconButton
            size="small"
            aria-label="Share post"
            className="hidden sm:flex"
            sx={{
              color: "#6b7280",
              "&:hover": { color: "#1e40af", backgroundColor: "#f3f4f6" },
            }}
          >
            <ShareOutlinedIcon style={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </Box>

      {/* Menu for Edit/Delete */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
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
          <ListItemText>Edit Post</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: "#dc2626" }} />
          </ListItemIcon>
          <ListItemText sx={{ color: "#dc2626" }}>Delete Post</ListItemText>
        </MenuItem>
      </Menu>
    </Paper>
  );
};

// ─── Compose Drawer ───────────────────────────────────────────────────────────

interface ComposeDrawerProps {
  onClose: () => void;
  title: string;
  content: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const ComposeDrawer = ({
  onClose,
  title,
  content,
  onTitleChange,
  onContentChange,
  onSubmit,
  isSubmitting,
}: ComposeDrawerProps) => (
  <Paper
    variant="outlined"
    role="form"
    aria-label="Create new post"
    className="p-5 rounded-2xl border border-gray-200 bg-white mb-6 animate-[slideDown_260ms_cubic-bezier(0.4,0,0.2,1)]"
  >
    <Typography
      variant="overline"
      className="block text-gray-700 text-[11px] font-semibold tracking-widest mb-1.5"
    >
      Title
    </Typography>
    <TextField
      id="compose-title"
      fullWidth
      placeholder="What's your post about?"
      variant="outlined"
      size="small"
      className="mb-3"
      value={title}
      onChange={(e) => onTitleChange(e.target.value)}
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
        "& input::placeholder": { color: "#9ca3af", opacity: 1 },
      }}
    />

    <Typography
      variant="overline"
      className="block text-gray-700 text-[11px] font-semibold tracking-widest mb-1.5"
    >
      Content
    </Typography>
    <TextField
      id="compose-content"
      fullWidth
      multiline
      minRows={4}
      placeholder="Share your thoughts, questions, or ideas…"
      variant="outlined"
      className="mb-3.5"
      value={content}
      onChange={(e) => onContentChange(e.target.value)}
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

    <Box className="flex justify-end gap-2.5">
      <Button
        variant="outlined"
        onClick={onClose}
        sx={{
          textTransform: "none",
          fontSize: "14px",
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
      <Button
        variant="contained"
        onClick={onSubmit}
        disabled={isSubmitting || !title.trim() || !content.trim()}
        sx={{
          textTransform: "none",
          fontSize: "14px",
          fontWeight: 600,
          backgroundColor: "#1e40af",
          borderRadius: "8px",
          "&:hover": { backgroundColor: "#1e3a8a" },
          "&:active": { backgroundColor: "#1e3a8a" },
          "&:disabled": {
            backgroundColor: "#9ca3af",
            color: "#e5e7eb",
          },
        }}
      >
        {isSubmitting ? "Publishing..." : "Publish Post"}
      </Button>
    </Box>
  </Paper>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const ForumPage = () => {
  const { data: forumData, isLoading, error } = useGetPosts();
  const { userId } = useAuth();
  const addPostMutation = useAddPost();
  const updatePostMutation = useUpdatePost();
  const deletePostMutation = useDeletePost();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"recent" | "popular" | "discussed">(
    "recent",
  );
  const [showCompose, setShowCompose] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");

  // Edit states
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // Delete states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const handleCloseEdit = () => {
    setEditingPost(null);
    setEditTitle("");
    setEditContent("");
  };

  const handleSubmitEdit = () => {
    if (!editingPost || !editTitle.trim() || !editContent.trim()) return;

    // Send entire Post object except post_id
    const { post_id } = editingPost;

    updatePostMutation.mutate(
      {
        postId: post_id,
        payload: {
          title: editTitle.trim(),
          content: editContent.trim(),
        },
      },
      {
        onSuccess: () => {
          handleCloseEdit();
        },
      },
    );
  };

  const handleDeletePost = (post: Post) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (!postToDelete) return;

    deletePostMutation.mutate(postToDelete.post_id, {
      onSuccess: () => {
        handleCloseDelete();
      },
    });
  };

  const handleSubmitPost = () => {
    if (!postTitle.trim() || !postContent.trim()) return;

    addPostMutation.mutate(
      {
        title: postTitle.trim(),
        content: postContent.trim(),
      },
      {
        onSuccess: () => {
          setPostTitle("");
          setPostContent("");
          setShowCompose(false);
        },
      },
    );
  };

  const posts: Post[] = (forumData?.data?.posts ?? []).filter(
    (p: Post) => !p.isDeleted,
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const result = q
      ? posts.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.content.toLowerCase().includes(q),
        )
      : [...posts];

    if (sort === "popular") result.sort((a, b) => b.view_count - a.view_count);
    else if (sort === "discussed")
      result.sort((a, b) => b.comment_count - a.comment_count);
    else
      result.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );

    return result;
  }, [posts, search, sort]);

  const totalViews = posts.reduce((s, p) => s + p.view_count, 0);
  const totalComments = posts.reduce((s, p) => s + p.comment_count, 0);

  return (
    <Box
      className="min-h-screen bg-gray-50"
      style={{
        fontFamily: "'DM Sans', system-ui, sans-serif",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <Box className="max-w-[860px] mx-auto px-5 pt-10 pb-20 sm:px-4 sm:pt-6">
        {/* ── Header ── */}
        <Box component="header" className="mb-9">
          <Box className="flex items-center gap-2 mb-2.5">
            <Box
              className="w-1.5 h-1.5 rounded-full bg-blue-600"
              aria-hidden="true"
            />
            <Typography
              variant="overline"
              className="text-blue-600 text-[11px] font-semibold tracking-[0.12em]"
            >
              Chad-Tech-Hub Community
            </Typography>
          </Box>

          <Typography
            variant="h1"
            className="text-gray-900 font-bold tracking-[-0.02em] leading-tight mb-2.5"
            style={{
              fontFamily: "'Sora', 'DM Sans', sans-serif",
              fontSize: "clamp(28px, 5vw, 40px)",
            }}
          >
            The{" "}
            <Box component="span" className="text-blue-600">
              Forum
            </Box>
          </Typography>

          <Typography
            variant="body1"
            className="text-gray-600 leading-relaxed max-w-[520px] text-[15px]"
          >
            Share ideas, ask questions, and connect with innovators, investors,
            and learners across the hub.
          </Typography>
        </Box>

        {/* ── Stats bar ── */}
        {!isLoading && !error && (
          <Paper
            variant="outlined"
            component="section"
            aria-label="Forum statistics"
            className="flex gap-6 px-5 py-4 rounded-2xl border border-gray-200 bg-white mb-6"
          >
            {[
              { value: posts.length, label: "Posts" },
              { value: totalComments.toLocaleString(), label: "Replies" },
              { value: totalViews.toLocaleString(), label: "Views" },
            ].map((stat, i) => (
              <Box key={stat.label} className="flex items-center gap-6">
                {i > 0 && (
                  <Divider
                    orientation="vertical"
                    flexItem
                    className="border-gray-200 mr-0"
                  />
                )}
                <Box className={`flex flex-col gap-0.5 ${i > 0 ? "ml-6" : ""}`}>
                  <Typography
                    className="text-gray-900 font-bold text-xl"
                    style={{ fontFamily: "'Sora', 'DM Sans', sans-serif" }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography className="text-gray-600 text-[11px] tracking-[0.06em] uppercase font-medium">
                    {stat.label}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        )}

        {/* ── Toolbar ── */}
        <Box className="flex items-center gap-3 mb-5 flex-wrap sm:flex-col sm:items-stretch">
          {/* Search */}
          <TextField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts…"
            type="search"
            size="small"
            inputProps={{ "aria-label": "Search forum posts" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    className="text-gray-500"
                    style={{ fontSize: 18 }}
                  />
                </InputAdornment>
              ),
            }}
            className="flex-1 min-w-[200px]"
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                color: "#111827",
                fontSize: "14px",
                "& fieldset": { borderColor: "#e5e7eb" },
                "&:hover fieldset": { borderColor: "#d1d5db" },
                "&.Mui-focused fieldset": {
                  borderColor: "#1e40af",
                  boxShadow: "0 0 0 3px rgba(30,64,175,0.1)",
                },
              },
              "& input::placeholder": { color: "#9ca3af", opacity: 1 },
            }}
          />

          {/* Sort */}
          <ToggleButtonGroup
            value={sort}
            exclusive
            onChange={(_, val) => val && setSort(val)}
            aria-label="Sort posts by"
            size="small"
            sx={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "4px",
              gap: "4px",
              "& .MuiToggleButton-root": {
                border: "none",
                borderRadius: "6px !important",
                color: "#6b7280",
                textTransform: "capitalize",
                fontSize: "13px",
                fontWeight: 500,
                padding: "6px 14px",
                fontFamily: "'DM Sans', sans-serif",
                "&:hover": { color: "#111827", backgroundColor: "#f3f4f6" },
                "&.Mui-selected": {
                  backgroundColor: "#1e40af",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#1e40af", color: "#fff" },
                },
              },
            }}
          >
            {(["recent", "popular", "discussed"] as const).map((s) => (
              <ToggleButton key={s} value={s} aria-pressed={sort === s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          {/* New Post button */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowCompose((v) => !v)}
            aria-expanded={showCompose}
            sx={{
              textTransform: "none",
              fontSize: "14px",
              fontWeight: 600,
              backgroundColor: "#1e40af",
              borderRadius: "8px",
              padding: "9px 18px",
              whiteSpace: "nowrap",
              fontFamily: "'DM Sans', sans-serif",
              "&:hover": {
                backgroundColor: "#1e3a8a",
                transform: "translateY(-1px)",
              },
              "&:active": { transform: "translateY(0)" },
              transition: "opacity 220ms, transform 220ms",
            }}
          >
            New Post
          </Button>
        </Box>

        {/* ── Compose drawer ── */}
        {showCompose && (
          <ComposeDrawer
            onClose={() => {
              setShowCompose(false);
              setPostTitle("");
              setPostContent("");
            }}
            title={postTitle}
            content={postContent}
            onTitleChange={setPostTitle}
            onContentChange={setPostContent}
            onSubmit={handleSubmitPost}
            isSubmitting={addPostMutation.isPending}
          />
        )}

        {/* ── Loading skeletons ── */}
        {isLoading && (
          <Box
            aria-busy="true"
            aria-label="Loading posts"
            className="flex flex-col gap-3"
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </Box>
        )}

        {/* ── Error ── */}
        {error && (
          <Alert
            severity="error"
            icon={<ErrorOutlineIcon />}
            className="rounded-2xl mb-4"
            sx={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fca5a5",
              color: "#dc2626",
              borderRadius: "14px",
              "& .MuiAlert-icon": { color: "#dc2626" },
            }}
          >
            Failed to load posts. Please refresh or try again later.
          </Alert>
        )}

        {/* ── Posts list ── */}
        {!isLoading && !error && (
          <>
            {filtered.length > 0 && (
              <Typography
                variant="body2"
                className="text-[#4A6FA5] mb-3.5 pl-0.5 text-[12.5px]"
              >
                <Box component="strong" className="text-[#94A3B8]">
                  {filtered.length}
                </Box>{" "}
                {filtered.length === 1 ? "post" : "posts"}
                {search ? ` for "${search}"` : ""}
              </Typography>
            )}

            <Box component="main">
              {filtered.length === 0 ? (
                <EmptyState query={search} />
              ) : (
                <Box className="flex flex-col gap-3">
                  {filtered.map((post, i) => (
                    <PostCard
                      key={post.post_id}
                      post={post}
                      index={i}
                      currentUserId={userId}
                      onEdit={handleEditPost}
                      onDelete={handleDeletePost}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </>
        )}
      </Box>

      {/* Edit Post Dialog */}
      <Dialog
        open={!!editingPost}
        onClose={handleCloseEdit}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontFamily: "'Sora', 'DM Sans', sans-serif" }}>
          Edit Post
        </DialogTitle>
        <DialogContent>
          <Box className="pt-2">
            <Typography
              variant="overline"
              className="block text-gray-700 text-[11px] font-semibold tracking-widest mb-1.5"
            >
              Title
            </Typography>
            <TextField
              fullWidth
              placeholder="What's your post about?"
              variant="outlined"
              size="small"
              className="mb-3"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
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
                "& input::placeholder": { color: "#9ca3af", opacity: 1 },
              }}
            />

            <Typography
              variant="overline"
              className="block text-gray-700 text-[11px] font-semibold tracking-widest mb-1.5"
            >
              Content
            </Typography>
            <TextField
              fullWidth
              multiline
              minRows={4}
              placeholder="Share your thoughts, questions, or ideas…"
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
            disabled={
              updatePostMutation.isPending ||
              !editTitle.trim() ||
              !editContent.trim()
            }
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
            {updatePostMutation.isPending ? "Updating..." : "Update Post"}
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
          Delete Post?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" className="text-gray-600">
            Are you sure you want to delete this post? This action cannot be
            undone.
          </Typography>
          {postToDelete && (
            <Box className="mt-3 p-3 bg-gray-50 rounded-lg">
              <Typography
                variant="subtitle2"
                className="font-semibold text-gray-900 mb-1"
              >
                {postToDelete.title}
              </Typography>
              <Typography variant="caption" className="text-gray-600">
                {postToDelete.content.slice(0, 100)}
                {postToDelete.content.length > 100 ? "..." : ""}
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
            disabled={deletePostMutation.isPending}
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
            {deletePostMutation.isPending ? "Deleting..." : "Delete Post"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ForumPage;
