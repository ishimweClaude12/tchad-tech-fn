import React, { useState, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Pagination,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  Stack,
  Avatar,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Skeleton,
  Paper,
  Modal,
} from "@mui/material";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import { useUser } from "@clerk/clerk-react";
import { useLanguage } from "../../contexts/LanguageContext";
import CourseForm from "../../components/learn/forms/CourseForm";
import { EmptyState } from "../../components/shared/EmptyState";
import {
  useCourses,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
  useCategories,
  useSubCategories,
} from "../../hooks/useApi";
import {
  CheckCircleIcon,
  StarIcon,
  SearchIcon,
  PlayIcon,
  ViewIcon,
  EditIcon,
  DeleteIcon,
} from "lucide-react";
import type { Course } from "../../types/Course.types";
import { CourseDetails } from "../../components/learn/CourseDetails";

// Translations
const translations = {
  en: {
    title: "Courses Management",
    searchPlaceholder: "Search courses by title, instructor, or category...",
    addCourse: "Add New Course",
    filters: "Filters",
    allCategories: "All Categories",
    allStatuses: "All Statuses",
    allLevels: "All Difficulty Levels",
    sortBy: "Sort By",
    newest: "Newest First",
    oldest: "Oldest First",
    mostEnrolled: "Most Enrolled",
    highestRated: "Highest Rated",
    priceHighLow: "Price: High to Low",
    priceLowHigh: "Price: Low to High",
    status: "Status",
    published: "Published",
    draft: "Draft",
    archived: "Archived",
    category: "Category",
    level: "Difficulty",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    expert: "Expert",
    edit: "Edit",
    delete: "Delete",
    view: "View Details",
    preview: "Preview Course",
    enrollments: "Enrollments",
    completions: "Completions",
    rating: "Rating",
    duration: "Duration",
    lessons: "Lessons",
    price: "Price",
    free: "Free",
    noResults: "No courses found",
    noResultsDesc: "Try adjusting your search or filters",
    loading: "Loading courses...",
    error: "Error loading courses",
    errorDesc: "Please try again later",
    deleteConfirm: "Delete Course",
    deleteMessage:
      "Are you sure you want to delete this course? This action cannot be undone.",
    cancel: "Cancel",
    confirmDelete: "Delete",
    submitting: "Deleting...",
    lastUpdated: "Last updated",
    createdBy: "Created by",
    totalCourses: "Total Courses",
    activeCourses: "Active Courses",
    totalStudents: "Total Students",
    avgRating: "Avg. Rating",
  },
  fr: {
    title: "Gestion des Cours",
    searchPlaceholder: "Rechercher par titre, instructeur ou catégorie...",
    addCourse: "Ajouter un Nouveau Cours",
    filters: "Filtres",
    allCategories: "Toutes les Catégories",
    allStatuses: "Tous les Statuts",
    allLevels: "Tous les Niveaux",
    sortBy: "Trier par",
    newest: "Plus Récent",
    oldest: "Plus Ancien",
    mostEnrolled: "Plus Inscrit",
    highestRated: "Mieux Noté",
    priceHighLow: "Prix: Élevé à Bas",
    priceLowHigh: "Prix: Bas à Élevé",
    status: "Statut",
    published: "Publié",
    draft: "Brouillon",
    archived: "Archivé",
    category: "Catégorie",
    level: "Difficulté",
    beginner: "Débutant",
    intermediate: "Intermédiaire",
    advanced: "Avancé",
    expert: "Expert",
    edit: "Modifier",
    delete: "Supprimer",
    view: "Voir Détails",
    preview: "Prévisualiser",
    enrollments: "Inscriptions",
    completions: "Complétions",
    rating: "Note",
    duration: "Durée",
    lessons: "Leçons",
    price: "Prix",
    free: "Gratuit",
    noResults: "Aucun cours trouvé",
    noResultsDesc: "Essayez d'ajuster votre recherche ou vos filtres",
    loading: "Chargement des cours...",
    error: "Erreur de chargement",
    errorDesc: "Veuillez réessayer plus tard",
    deleteConfirm: "Supprimer le Cours",
    deleteMessage:
      "Êtes-vous sûr de vouloir supprimer ce cours ? Cette action est irréversible.",
    cancel: "Annuler",
    confirmDelete: "Supprimer",
    submitting: "Suppression...",
    lastUpdated: "Dernière mise à jour",
    createdBy: "Créé par",
    totalCourses: "Total des Cours",
    activeCourses: "Cours Actifs",
    totalStudents: "Total Étudiants",
    avgRating: "Note Moyenne",
  },
  ar: {
    title: "إدارة الدورات",
    searchPlaceholder: "البحث حسب العنوان أو المدرس أو الفئة...",
    addCourse: "إضافة دورة جديدة",
    filters: "التصفية",
    allCategories: "جميع الفئات",
    allStatuses: "جميع الحالات",
    allLevels: "جميع المستويات",
    sortBy: "ترتيب حسب",
    newest: "الأحدث أولاً",
    oldest: "الأقدم أولاً",
    mostEnrolled: "الأكثر تسجيلاً",
    highestRated: "الأعلى تقييماً",
    priceHighLow: "السعر: من الأعلى إلى الأدنى",
    priceLowHigh: "السعر: من الأدنى إلى الأعلى",
    status: "الحالة",
    published: "منشور",
    draft: "مسودة",
    archived: "مؤرشف",
    category: "الفئة",
    level: "المستوى",
    beginner: "مبتدئ",
    intermediate: "متوسط",
    advanced: "متقدم",
    expert: "خبير",
    edit: "تعديل",
    delete: "حذف",
    view: "عرض التفاصيل",
    preview: "معاينة الدورة",
    enrollments: "التسجيلات",
    completions: "الإكمالات",
    rating: "التقييم",
    duration: "المدة",
    lessons: "الدروس",
    price: "السعر",
    free: "مجاني",
    noResults: "لم يتم العثور على دورات",
    noResultsDesc: "حاول تعديل البحث أو التصفية",
    loading: "جاري تحميل الدورات...",
    error: "خطأ في التحميل",
    errorDesc: "الرجاء المحاولة مرة أخرى",
    deleteConfirm: "حذف الدورة",
    deleteMessage:
      "هل أنت متأكد من حذف هذه الدورة؟ لا يمكن التراجع عن هذا الإجراء.",
    cancel: "إلغاء",
    confirmDelete: "حذف",
    submitting: "جاري الحذف...",
    lastUpdated: "آخر تحديث",
    createdBy: "أنشأ بواسطة",
    totalCourses: "إجمالي الدورات",
    activeCourses: "الدورات النشطة",
    totalStudents: "إجمالي الطلاب",
    avgRating: "متوسط التقييم",
  },
};

const CoursesAdmin: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  const { user } = useUser();
  const { data: coursesData, isLoading, error, refetch } = useCourses();
  const { data: categoriesData } = useCategories();
  const { data: subcategoriesData } = useSubCategories();
  const createCourseMutation = useCreateCourse();
  const updateCourseMutation = useUpdateCourse();
  const deleteCourseMutation = useDeleteCourse();

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [courseDetailsModalOpen, setCourseDetailsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const itemsPerPage = 9;

  // Extract courses and categories
  const courses = coursesData?.data?.courses || [];
  const apiCategories = categoriesData || [];
  const apiSubcategories = subcategoriesData || [];

  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      courses.map((c) => c.category?.name).filter(Boolean)
    );
    return Array.from(uniqueCategories);
  }, [courses]);

  // Filter and sort logic
  const filteredAndSortedCourses = useMemo(() => {
    const filtered = courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor?.userId
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        course.category?.name === selectedCategory;

      const matchesStatus =
        selectedStatus === "all" || course.status === selectedStatus;

      const matchesLevel =
        selectedLevel === "all" || course.difficultyLevel === selectedLevel;

      return matchesSearch && matchesCategory && matchesStatus && matchesLevel;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "mostEnrolled":
          return b.enrollmentCount - a.enrollmentCount;
        case "highestRated":
          return (b.ratingAverage || 0) - (a.ratingAverage || 0);
        case "priceHighLow":
          return parseFloat(b.price) - parseFloat(a.price);
        case "priceLowHigh":
          return parseFloat(a.price) - parseFloat(b.price);
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    courses,
    searchQuery,
    selectedCategory,
    selectedStatus,
    selectedLevel,
    sortBy,
  ]);

  // Pagination
  const paginatedCourses = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredAndSortedCourses.slice(
      startIndex,
      startIndex + itemsPerPage
    );
  }, [filteredAndSortedCourses, page]);

  const totalPages = Math.ceil(filteredAndSortedCourses.length / itemsPerPage);

  // Statistics
  const stats = useMemo(() => {
    const totalEnrollments = courses.reduce(
      (sum, c) => sum + c.enrollmentCount,
      0
    );
    const activeCourses = courses.filter(
      (c) => c.status === "published"
    ).length;
    const avgRating =
      courses.reduce((sum, c) => sum + (c.ratingAverage || 0), 0) /
        courses.length || 0;

    return {
      totalCourses: courses.length,
      activeCourses,
      totalEnrollments,
      avgRating: avgRating.toFixed(1),
    };
  }, [courses]);

  // Handlers
  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    course: Course
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedCourse(course);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setModalMode("edit");
    setCourseModalOpen(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const confirmDelete = async () => {
    if (!selectedCourse) return;

    try {
      await deleteCourseMutation.mutateAsync(selectedCourse.id);
      setDeleteDialogOpen(false);
      setSelectedCourse(null);
      refetch();
    } catch (error) {
      console.error("Failed to delete course:", error);
    }
  };

  const handleAddCourse = () => {
    console.log("Add Course clicked - opening modal");
    setSelectedCourse(null);
    setModalMode("create");
    setCourseModalOpen(true);
    console.log("Modal state set to true");
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCourseSubmit = async (data: any) => {
    try {
      if (modalMode === "create") {
        await createCourseMutation.mutateAsync(data);
      } else if (selectedCourse) {
        await updateCourseMutation.mutateAsync({
          id: selectedCourse.id,
          data: data,
        });
      }
      setCourseModalOpen(false);
      setSelectedCourse(null);
      refetch();
    } catch (error) {
      console.error("Failed to submit course:", error);
      throw error;
    }
  };

  const handleCourseModalClose = () => {
    if (!createCourseMutation.isPending && !updateCourseMutation.isPending) {
      setCourseModalOpen(false);
      setSelectedCourse(null);
    }
  };

  const handleView = () => {
    console.log("View course:", selectedCourse);
    setCourseDetailsModalOpen(true);
    handleMenuClose();
    // TODO: Navigate to course details
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "success";
      case "draft":
        return "warning";
      case "archived":
        return "default";
      default:
        return "default";
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatPrice = (price: string, currency: string) => {
    const priceNum = parseFloat(price);
    return priceNum === 0 ? t.free : `${priceNum} ${currency}`;
  };

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          {t.loading}
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <Skeleton variant="rectangular" height={200} />
              <CardContent>
                <Skeleton variant="text" height={40} />
                <Skeleton variant="text" />
                <Skeleton variant="text" width="60%" />
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6">{t.error}</Typography>
          <Typography>{t.errorDesc}</Typography>
        </Alert>
        <Button variant="contained" onClick={() => refetch()}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, direction: isRTL ? "rtl" : "ltr" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          {t.title}
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{ borderRadius: 2 }}
          onClick={handleAddCourse}
        >
          {t.addCourse}
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 3,
          mb: 4,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {t.totalCourses}
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {stats.totalCourses}
              </Typography>
            </Box>
            {/* <TrendingUpIcon sx={{ fontSize: 48, opacity: 0.5 }} /> */}
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            color: "white",
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {t.activeCourses}
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {stats.activeCourses}
              </Typography>
            </Box>
            <CheckCircleIcon />
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            color: "white",
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {t.totalStudents}
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {stats.totalEnrollments}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
            color: "white",
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {t.avgRating}
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {stats.avgRating}
              </Typography>
            </Box>
            <StarIcon />
          </Box>
        </Paper>
      </Box>

      {/* Search and Filters */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems="stretch"
        >
          <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 33%" } }}>
            <TextField
              fullWidth
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box
            sx={{ flex: { xs: "1 1 100%", sm: "1 1 50%", md: "1 1 16.67%" } }}
          >
            <FormControl fullWidth>
              <InputLabel>{t.category}</InputLabel>
              <Select
                value={selectedCategory}
                label={t.category}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="all">{t.allCategories}</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box
            sx={{ flex: { xs: "1 1 100%", sm: "1 1 50%", md: "1 1 16.67%" } }}
          >
            <FormControl fullWidth>
              <InputLabel>{t.status}</InputLabel>
              <Select
                value={selectedStatus}
                label={t.status}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <MenuItem value="all">{t.allStatuses}</MenuItem>
                <MenuItem value="published">{t.published}</MenuItem>
                <MenuItem value="draft">{t.draft}</MenuItem>
                <MenuItem value="archived">{t.archived}</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box
            sx={{ flex: { xs: "1 1 100%", sm: "1 1 50%", md: "1 1 16.67%" } }}
          >
            <FormControl fullWidth>
              <InputLabel>{t.level}</InputLabel>
              <Select
                value={selectedLevel}
                label={t.level}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                <MenuItem value="all">{t.allLevels}</MenuItem>
                <MenuItem value="beginner">{t.beginner}</MenuItem>
                <MenuItem value="intermediate">{t.intermediate}</MenuItem>
                <MenuItem value="advanced">{t.advanced}</MenuItem>
                <MenuItem value="expert">{t.expert}</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box
            sx={{ flex: { xs: "1 1 100%", sm: "1 1 50%", md: "1 1 16.67%" } }}
          >
            <FormControl fullWidth>
              <InputLabel>{t.sortBy}</InputLabel>
              <Select
                value={sortBy}
                label={t.sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="newest">{t.newest}</MenuItem>
                <MenuItem value="oldest">{t.oldest}</MenuItem>
                <MenuItem value="mostEnrolled">{t.mostEnrolled}</MenuItem>
                <MenuItem value="highestRated">{t.highestRated}</MenuItem>
                <MenuItem value="priceHighLow">{t.priceHighLow}</MenuItem>
                <MenuItem value="priceLowHigh">{t.priceLowHigh}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Stack>
      </Paper>

      {/* Results count */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Showing {paginatedCourses.length} of {filteredAndSortedCourses.length}{" "}
        courses
      </Typography>

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <EmptyState message="No courses available. Click 'Add New Course' to create your first course." />
      ) : paginatedCourses.length === 0 ? (
        <Paper
          elevation={0}
          sx={{ p: 6, textAlign: "center", borderRadius: 2 }}
        >
          <SearchIcon />
          <Typography variant="h6" gutterBottom>
            {t.noResults}
          </Typography>
          <Typography color="text.secondary">{t.noResultsDesc}</Typography>
        </Paper>
      ) : (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            {paginatedCourses.map((course) => (
              <Card
                key={course.id}
                elevation={0}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    course.thumbnailUrl || "https://via.placeholder.com/400x200"
                  }
                  alt={course.title}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Chip
                      label={course.status}
                      size="small"
                      color={getStatusColor(course.status)}
                    />
                    <Chip
                      label={course.difficultyLevel}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  <Typography variant="h6" gutterBottom noWrap>
                    {course.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {course.shortDescription}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                      {course.instructor?.userId[0].toUpperCase()}
                    </Avatar>
                    <Typography variant="caption" color="text.secondary">
                      {course.instructor?.userId}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Typography variant="caption">
                        {course.enrollmentCount}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Typography variant="caption">
                        {formatDuration(course.totalDurationMinutes)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <PlayIcon />
                      <Typography variant="caption">
                        {course.totalLessons}
                      </Typography>
                    </Box>
                  </Stack>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <Rating
                      value={course.ratingAverage || 0}
                      readOnly
                      size="small"
                    />
                    <Typography variant="caption" color="text.secondary">
                      ({course.ratingCount})
                    </Typography>
                  </Box>

                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {formatPrice(course.price, course.currency)}
                  </Typography>
                </CardContent>

                <CardActions
                  sx={{ justifyContent: "space-between", px: 2, pb: 2 }}
                >
                  <Button
                    size="small"
                    startIcon={<ViewIcon />}
                    onClick={handleView}
                  >
                    {t.view}
                  </Button>
                  <Button
                    size="small"
                    onClick={(e) => handleMenuOpen(e, course)}
                  >
                    <MoreVertOutlinedIcon />
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleView}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t.view}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t.edit}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>{t.delete}</ListItemText>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <DialogTitle>{t.deleteConfirm}</DialogTitle>
        <DialogContent>
          <Typography>{t.deleteMessage}</Typography>
          {selectedCourse && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              <strong>{selectedCourse.title}</strong>
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleteCourseMutation.isPending}
          >
            {t.cancel}
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={deleteCourseMutation.isPending}
          >
            {deleteCourseMutation.isPending ? t.submitting : t.confirmDelete}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Course Form Modal */}
      <Modal
        open={courseModalOpen}
        onClose={handleCourseModalClose}
        aria-labelledby="course-form-modal"
        aria-describedby="course-form-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "1200px",
            maxHeight: "90vh",
            overflow: "auto",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <CourseForm
            onSubmit={handleCourseSubmit}
            onCancel={handleCourseModalClose}
            initialData={
              modalMode === "edit" && selectedCourse
                ? {
                    instructorId:
                      selectedCourse.instructor?.id || user?.id || "",
                    title: selectedCourse.title,
                    slug: selectedCourse.slug,
                    subtitle: selectedCourse.subtitle || "",
                    description: selectedCourse.description,
                    shortDescription: selectedCourse.shortDescription || "",
                    thumbnailUrl: selectedCourse.thumbnailUrl || "",
                    previewVideo: "",
                    learningObjectives: selectedCourse.learningObjectives || [],
                    prerequisites: selectedCourse.prerequisites || "",
                    targetAudience: selectedCourse.targetAudience || "",
                    difficultyLevel: selectedCourse.difficultyLevel as
                      | "BEGINNER"
                      | "INTERMEDIATE"
                      | "ADVANCED"
                      | "EXPERT",
                    estimatedDurationHours:
                      selectedCourse.totalDurationMinutes / 60,
                    price: parseFloat(selectedCourse.price),
                    discountPrice: parseFloat(
                      selectedCourse.discountPrice || "0"
                    ),
                    currency: selectedCourse.currency,
                    categoryId: selectedCourse.category?.id || "",
                    subcategoryId: selectedCourse.subcategory?.id || "",
                    tags: selectedCourse.tags || [],
                    hasCertificate: selectedCourse.hasCertificate || false,
                  }
                : undefined
            }
            categories={apiCategories.map((cat) => ({
              id: cat.id,
              name: cat.name,
            }))}
            subcategories={apiSubcategories.map((sub) => ({
              id: sub.id,
              name: sub.name,
              categoryId: sub.id,
            }))}
            instructorId={user?.id || ""}
            language={language}
          />
        </Box>
      </Modal>

      {/* Course Details Modal */}
      <Modal
        open={courseDetailsModalOpen}
        onClose={() => setCourseDetailsModalOpen(false)}
        aria-labelledby="course-details-modal"
        aria-describedby="course-details-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "800px",
            maxHeight: "90vh",
            overflow: "auto",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <CourseDetails />
        </Box>
      </Modal>
    </Box>
  );
};

export default CoursesAdmin;
