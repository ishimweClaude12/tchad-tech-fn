import { useUser } from "@clerk/clerk-react";
import {
  useUserWishListedCourses,
  useRemoveCourseFromWishList,
  useClearUserWishList,
} from "../../hooks/learn/useCourseApi";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  IconButton,
  Skeleton,
  Alert,
  Container,
  Tooltip,
} from "@mui/material";
import {
  Favorite,
  ShoppingCart,
  Delete,
  BookmarkBorder,
  ArrowBack,
  DeleteSweep,
} from "@mui/icons-material";

const WishList = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const {
    data: wishListedCourses,
    isLoading,
    error,
  } = useUserWishListedCourses(user?.id || "");

  const removeFromWishlistMutation = useRemoveCourseFromWishList();
  const clearWishlistMutation = useClearUserWishList();

  const handleRemoveFromWishlist = (courseId: string) => {
    if (!user?.id) return;
    removeFromWishlistMutation.mutate({
      userId: user.id,
      courseId,
    });
  };

  const handleClearWishlist = () => {
    if (!user?.id) return;
    if (
      window.confirm(
        "Are you sure you want to clear your entire wishlist? This action cannot be undone.",
      )
    ) {
      clearWishlistMutation.mutate(user.id);
    }
  };

  const handleEnrollNow = (slug: string) => {
    navigate(`/learn/course/${slug}`);
  };

  const handleViewCourse = (slug: string) => {
    navigate(`/learn/course/${slug}`);
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <Container maxWidth={false} className="py-8 px-4 md:px-6 lg:px-8 min-w-screen">
        <Skeleton variant="text" width={200} height={48} className="mb-2" />
        <Skeleton variant="text" width={300} height={24} className="mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" height={32} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} width="60%" />
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth={false} className="py-8 px-4 md:px-6 lg:px-8 min-w-screen">
        <Alert severity="error" className="mb-4">
          Error loading your wishlisted courses. Please try again later.
        </Alert>
      </Container>
    );
  }

  // Empty state
  if (
    !wishListedCourses?.data?.wishlist ||
    wishListedCourses.data.wishlist.length === 0
  ) {
    return (
      <Container
        maxWidth={false}
        className="py-16 px-4 md:px-6 lg:px-8 min-w-screen"
      >
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/learn")}
          className="mb-6"
        >
          Back to Courses
        </Button>
        <div className="flex flex-col items-center justify-center text-center">
          <BookmarkBorder
            className="text-gray-300 mb-4"
            style={{ fontSize: 120 }}
          />
          <Typography variant="h4" className="mb-2 font-semibold text-gray-800">
            Your Wishlist is Empty
          </Typography>
          <Typography variant="body1" className="mb-6 text-gray-600 max-w-md">
            Explore our courses and add your favorites to your wishlist to keep
            track of what you want to learn.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/learn")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Browse Courses
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container
      maxWidth={false}
      className="py-8 px-4 md:px-6 lg:px-8 min-w-screen"
    >
      {/* Header */}
      <div className="mb-8">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/learn")}
          className="mb-4"
        >
          Back to Courses
        </Button>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Favorite className="text-red-500" />
            <Typography
              variant="h4"
              component="h1"
              className="font-bold text-gray-900"
            >
              My Wishlist
            </Typography>
          </div>
          {wishListedCourses.data.wishlist.length > 0 && (
            <Tooltip title="Clear all items from wishlist">
              <Button
                startIcon={<DeleteSweep />}
                onClick={handleClearWishlist}
                disabled={clearWishlistMutation.isPending}
                color="error"
                variant="outlined"
                size="small"
              >
                Clear All
              </Button>
            </Tooltip>
          )}
        </div>
        <Typography variant="body1" className="text-gray-600">
          {wishListedCourses.data.wishlist.length}{" "}
          {wishListedCourses.data.wishlist.length === 1 ? "course" : "courses"}{" "}
          saved for later
        </Typography>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishListedCourses.data.wishlist.map((item) => (
          <div key={item.id}>
            <Card
              className="h-full flex flex-col hover:shadow-xl transition-all duration-300 cursor-pointer"
              sx={{ position: "relative" }}
            >
              {/* Course Image */}
              <button
                type="button"
                className="relative w-full text-left p-0 border-0 cursor-pointer"
                onClick={() => handleViewCourse(item.course.slug)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={item.course.thumbnailUrl || "/placeholder-course.jpg"}
                  alt={item.course.title}
                  className="h-48 object-cover"
                />
              </button>

              {/* Course Content */}
              <CardContent
                className="flex-1 flex flex-col"
                onClick={() => handleViewCourse(item.course.slug)}
              >
                <Typography
                  variant="h6"
                  component="h3"
                  className="mb-2 font-semibold line-clamp-2 text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {item.course.title}
                </Typography>

                <Typography
                  variant="body2"
                  className="text-gray-600 mb-3 line-clamp-3 flex-1"
                >
                  {item.course.description}
                </Typography>

                {/* Price and Action */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t gap-2">
                  <Typography variant="h6" className="font-bold text-blue-600">
                    ${Number(item.course.price).toFixed(2)}
                  </Typography>
                  <div className="flex gap-2">
                    <Tooltip title="Remove from wishlist">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromWishlist(item.course.id);
                        }}
                        disabled={removeFromWishlistMutation.isPending}
                        aria-label="Remove from wishlist"
                        className="text-red-500 hover:bg-red-50"
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<ShoppingCart />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEnrollNow(item.course.slug);
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Enroll Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default WishList;
