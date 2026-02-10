import React, { useState, useMemo } from "react";
import { useNavigate, Outlet, useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Chip,
  Pagination,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Stack,
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
import { useCategories } from "../../hooks/useApi";
import {
  CheckCircleIcon,
  StarIcon,
  SearchIcon,
  PlayIcon,
  ViewIcon,
  EditIcon,
} from "lucide-react";
import { CourseStatus, type Course } from "../../types/Course.types";
import { CourseDetails } from "../../components/learn/CourseDetails";
import {
  useCourses,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
  usePublishCourse,
} from "../../hooks/learn/useCourseApi";

import DeleteIcon from "@mui/icons-material/Delete";

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
    publish: "Publish",
    unpublish: "Unpublish",
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
    publishConfirm: "Publish Course",
    publishMessage:
      "Are you sure you want to publish this course? It will become visible to all students.",
    unpublishConfirm: "Unpublish Course",
    unpublishMessage:
      "Are you sure you want to unpublish this course? Students will no longer be able to access it.",
    cancel: "Cancel",
    confirmDelete: "Delete",
    confirmPublish: "Publish",
    confirmUnpublish: "Unpublish",
    submitting: "Deleting...",
    publishing: "Publishing...",
    unpublishing: "Unpublishing...",
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
    publish: "Publier",
    unpublish: "Dépublier",
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
    publishConfirm: "Publier le Cours",
    publishMessage:
      "Êtes-vous sûr de vouloir publier ce cours ? Il sera visible par tous les étudiants.",
    unpublishConfirm: "Dépublier le Cours",
    unpublishMessage:
      "Êtes-vous sûr de vouloir dépublier ce cours ? Les étudiants ne pourront plus y accéder.",
    cancel: "Annuler",
    confirmDelete: "Supprimer",
    confirmPublish: "Publier",
    confirmUnpublish: "Dépublier",
    submitting: "Suppression...",
    publishing: "Publication...",
    unpublishing: "Dépublication...",
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
    publish: "نشر",
    unpublish: "إلغاء النشر",
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
    publishConfirm: "نشر الدورة",
    publishMessage: "هل أنت متأكد من نشر هذه الدورة؟ ستصبح مرئية لجميع الطلاب.",
    unpublishConfirm: "إلغاء نشر الدورة",
    unpublishMessage:
      "هل أنت متأكد من إلغاء نشر هذه الدورة؟ لن يتمكن الطلاب من الوصول إليها.",
    cancel: "إلغاء",
    confirmDelete: "حذف",
    confirmPublish: "نشر",
    confirmUnpublish: "إلغاء النشر",
    submitting: "جاري الحذف...",
    publishing: "جاري النشر...",
    unpublishing: "جاري إلغاء النشر...",
    lastUpdated: "آخر تحديث",
    createdBy: "أنشأ بواسطة",
    totalCourses: "إجمالي الدورات",
    activeCourses: "الدورات النشطة",
    totalStudents: "إجمالي الطلاب",
    avgRating: "متوسط التقييم",
  },
};

const CoursesAdmin: React.FC = () => {
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  const { user } = useUser();
  const { courseId } = useParams<{ courseId: string }>();
  const { data: coursesData, isLoading, error, refetch } = useCourses();
  const { data: categoriesData } = useCategories();
  const createCourseMutation = useCreateCourse();
  const updateCourseMutation = useUpdateCourse();
  const deleteCourseMutation = useDeleteCourse();
  const publishCourseMutation = usePublishCourse();

  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [courseDetailsModalOpen, setCourseDetailsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const itemsPerPage = 9;

  // Extract courses and categories
  const courses = useMemo(
    () => coursesData?.data?.courses || [],
    [coursesData]
  );
  const apiCategories = categoriesData || [];

  // No search/filters: use all courses as-is
  const filteredAndSortedCourses = courses;

  // Pagination
  const paginatedCourses = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredAndSortedCourses.slice(
      startIndex,
      startIndex + itemsPerPage,
    );
  }, [filteredAndSortedCourses, page]);

  const totalPages = Math.ceil(filteredAndSortedCourses.length / itemsPerPage);

  // Statistics
  const stats = useMemo(() => {
    const totalEnrollments = courses.reduce(
      (sum, c) => sum + c.enrollmentCount,
      0,
    );
    const activeCourses = courses.filter(
      (c) => c.status === CourseStatus.PUBLISHED,
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
    course: Course,
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

  const handlePublish = () => {
    setPublishDialogOpen(true);
    handleMenuClose();
  };

  const confirmPublish = async () => {
    if (!selectedCourse) return;

    try {
      const shouldPublish = selectedCourse.status !== CourseStatus.PUBLISHED;
      await publishCourseMutation.mutateAsync({
        id: selectedCourse.id,
        publish: shouldPublish,
      });
      setPublishDialogOpen(false);
      setSelectedCourse(null);
      refetch();
    } catch (error) {
      console.error("Failed to publish/unpublish course:", error);
    }
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
          // remove instructorId from data if present
          data: { ...data, instructorId: undefined },
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

  const handleView = (course: Course) => {
    if (!course) return;
    navigate(`/learn/dashboard/courses/${course.id}`);
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

  const formatPrice = (price: string, currency: string) => {
    const priceNum = Number.parseFloat(price);
    return priceNum === 0 ? t.free : `${priceNum} ${currency}`;
  };

  // Determine content to display based on courses state
  const getCoursesContent = () => {
    if (courses.length === 0) {
      return (
        <EmptyState message="No courses available. Click 'Add New Course' to create your first course." />
      );
    }

    if (paginatedCourses.length === 0) {
      return (
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
      );
    }

    return (
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
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={course.thumbnailUrl || "/images/placeholder.jpg"}
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

                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Typography variant="caption">
                      {course.enrollmentCount}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Typography variant="caption">
                      Estimated Duration: {course.estimatedDurationHours} hrs
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
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
                  onClick={() => handleView(course)}
                >
                  {t.view}
                </Button>
                <Button size="small" onClick={(e) => handleMenuOpen(e, course)}>
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
    );
  };

  // Loading state
  // If courseId is present in the URL, render the nested Outlet for CourseDetails
  if (courseId) {
    return <Outlet />;
  }

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
        <Typography
          variant="h4"
          component="h6"
          fontWeight="bold"
          fontSize="16px"
        >
          {t.title}
        </Typography>
        <Button
          variant="contained"
          size="medium"
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

      {/* Courses Grid */}
      {getCoursesContent()}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t.edit}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handlePublish}>
          <ListItemIcon>
            <CheckCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {selectedCourse?.status === "PUBLISHED" ? t.unpublish : t.publish}
          </ListItemText>
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

      {/* Publish/Unpublish Confirmation Dialog */}
      <Dialog
        open={publishDialogOpen}
        onClose={() => setPublishDialogOpen(false)}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <DialogTitle>
          {selectedCourse?.status === CourseStatus.PUBLISHED
            ? t.unpublishConfirm
            : t.publishConfirm}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {selectedCourse?.status === CourseStatus.PUBLISHED
              ? t.unpublishMessage
              : t.publishMessage}
          </Typography>
          {selectedCourse && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              <strong>{selectedCourse.title}</strong>
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setPublishDialogOpen(false)}
            disabled={publishCourseMutation.isPending}
          >
            {t.cancel}
          </Button>
          <Button
            onClick={confirmPublish}
            color={
              selectedCourse?.status === CourseStatus.PUBLISHED
                ? "warning"
                : "success"
            }
            variant="contained"
            disabled={publishCourseMutation.isPending}
          >
            {(() => {
              if (publishCourseMutation.isPending) {
                return selectedCourse?.status === CourseStatus.PUBLISHED
                  ? t.unpublishing
                  : t.publishing;
              }
              return selectedCourse?.status === CourseStatus.PUBLISHED
                ? t.confirmUnpublish
                : t.confirmPublish;
            })()}
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
                    difficultyLevel: (selectedCourse.difficultyLevel ===
                    "BEGINNER"
                      ? "BIGINNER"
                      : selectedCourse.difficultyLevel) as
                      | "BIGINNER"
                      | "INTERMEDIATE"
                      | "ADVANCED",
                    estimatedDurationHours:
                      selectedCourse.estimatedDurationHours,
                    price: Number.parseFloat(selectedCourse.price),
                    discountPrice: Number.parseFloat(
                      selectedCourse.discountPrice || "0",
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
            instructorId={user?.id || ""}
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
