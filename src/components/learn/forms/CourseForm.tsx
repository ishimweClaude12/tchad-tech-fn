import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Upload, Video } from "lucide-react";
import { Button } from "@mui/material";

// Types
interface CourseFormData {
  instructorId: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  shortDescription: string;
  thumbnailUrl: string;
  previewVideo: string;
  learningObjectives: string[];
  prerequisites: string;
  targetAudience: string;
  difficultyLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  estimatedDurationHours: number;
  price: number;
  discountPrice: number;
  currency: string;
  categoryId: string;
  subcategoryId: string;
  tags: string[];
  hasCertificate: boolean;
}

interface CourseFormProps {
  onSubmit: (data: CourseFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<CourseFormData>;
  categories: Array<{ id: string; name: string }>;
  subcategories: Array<{ id: string; name: string; categoryId: string }>;
  instructorId: string;
  language?: "en" | "fr" | "ar";
}

interface FormErrors {
  [key: string]: string;
}

// Translations
const translations = {
  en: {
    createCourse: "Create New Course",
    editCourse: "Edit Course",
    basicInformation: "Basic Information",
    courseTitle: "Course Title",
    courseTitlePlaceholder: "Enter course title",
    slug: "URL Slug",
    slugPlaceholder: "course-url-slug",
    subtitle: "Subtitle",
    subtitlePlaceholder: "Brief subtitle for the course",
    description: "Full Description",
    descriptionPlaceholder: "Detailed course description...",
    shortDescription: "Short Description",
    shortDescriptionPlaceholder: "Brief overview (max 200 characters)",

    mediaAssets: "Media Assets",
    thumbnailUrl: "Thumbnail URL",
    thumbnailPlaceholder: "https://example.com/thumbnail.jpg",
    previewVideo: "Preview Video URL",
    previewVideoPlaceholder: "https://example.com/preview.mp4",
    uploadThumbnail: "Upload Thumbnail",
    uploadVideo: "Upload Video",

    learningContent: "Learning Content",
    learningObjectives: "Learning Objectives",
    addObjective: "Add Objective",
    objectivePlaceholder: "What will students learn?",
    prerequisites: "Prerequisites",
    prerequisitesPlaceholder: "Required knowledge or skills",
    targetAudience: "Target Audience",
    targetAudiencePlaceholder: "Who is this course for?",

    courseDetails: "Course Details",
    difficultyLevel: "Difficulty Level",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    expert: "Expert",
    estimatedDuration: "Estimated Duration (hours)",
    durationPlaceholder: "0.0",

    pricingCategory: "Pricing & Category",
    price: "Regular Price",
    pricePlaceholder: "0.00",
    discountPrice: "Discount Price",
    discountPlaceholder: "0.00",
    currency: "Currency",
    category: "Category",
    selectCategory: "Select a category",
    subcategory: "Subcategory",
    selectSubcategory: "Select a subcategory",

    additionalInfo: "Additional Information",
    tags: "Tags",
    addTag: "Add Tag",
    tagPlaceholder: "Enter tag and press Enter",
    hasCertificate: "Offers Certificate",
    certificateDescription:
      "Students will receive a certificate upon completion",

    submit: "Create Course",
    update: "Update Course",
    cancel: "Cancel",
    submitting: "Submitting...",

    errors: {
      required: "This field is required",
      minLength: "Must be at least {{min}} characters",
      maxLength: "Must not exceed {{max}} characters",
      invalidUrl: "Please enter a valid URL",
      invalidNumber: "Please enter a valid number",
      minValue: "Must be greater than {{min}}",
      maxValue: "Must not exceed {{max}}",
      invalidSlug:
        "Slug can only contain lowercase letters, numbers, and hyphens",
      discountGreaterThanPrice:
        "Discount price cannot be greater than regular price",
    },
  },
  fr: {
    createCourse: "Créer un Nouveau Cours",
    editCourse: "Modifier le Cours",
    basicInformation: "Informations de Base",
    courseTitle: "Titre du Cours",
    courseTitlePlaceholder: "Entrez le titre du cours",
    slug: "URL Slug",
    slugPlaceholder: "url-du-cours",
    subtitle: "Sous-titre",
    subtitlePlaceholder: "Bref sous-titre pour le cours",
    description: "Description Complète",
    descriptionPlaceholder: "Description détaillée du cours...",
    shortDescription: "Description Courte",
    shortDescriptionPlaceholder: "Aperçu bref (max 200 caractères)",

    mediaAssets: "Médias",
    thumbnailUrl: "URL de la Vignette",
    thumbnailPlaceholder: "https://exemple.com/vignette.jpg",
    previewVideo: "URL de la Vidéo de Prévisualisation",
    previewVideoPlaceholder: "https://exemple.com/preview.mp4",
    uploadThumbnail: "Télécharger la Vignette",
    uploadVideo: "Télécharger la Vidéo",

    learningContent: "Contenu d'Apprentissage",
    learningObjectives: "Objectifs d'Apprentissage",
    addObjective: "Ajouter un Objectif",
    objectivePlaceholder: "Qu'apprendront les étudiants?",
    prerequisites: "Prérequis",
    prerequisitesPlaceholder: "Connaissances ou compétences requises",
    targetAudience: "Public Cible",
    targetAudiencePlaceholder: "À qui s'adresse ce cours?",

    courseDetails: "Détails du Cours",
    difficultyLevel: "Niveau de Difficulté",
    beginner: "Débutant",
    intermediate: "Intermédiaire",
    advanced: "Avancé",
    expert: "Expert",
    estimatedDuration: "Durée Estimée (heures)",
    durationPlaceholder: "0.0",

    pricingCategory: "Prix et Catégorie",
    price: "Prix Normal",
    pricePlaceholder: "0.00",
    discountPrice: "Prix Réduit",
    discountPlaceholder: "0.00",
    currency: "Devise",
    category: "Catégorie",
    selectCategory: "Sélectionnez une catégorie",
    subcategory: "Sous-catégorie",
    selectSubcategory: "Sélectionnez une sous-catégorie",

    additionalInfo: "Informations Supplémentaires",
    tags: "Étiquettes",
    addTag: "Ajouter une Étiquette",
    tagPlaceholder: "Entrez l'étiquette et appuyez sur Entrée",
    hasCertificate: "Offre un Certificat",
    certificateDescription:
      "Les étudiants recevront un certificat à l'achèvement",

    submit: "Créer le Cours",
    update: "Mettre à Jour le Cours",
    cancel: "Annuler",
    submitting: "Envoi en cours...",

    errors: {
      required: "Ce champ est requis",
      minLength: "Doit contenir au moins {{min}} caractères",
      maxLength: "Ne doit pas dépasser {{max}} caractères",
      invalidUrl: "Veuillez entrer une URL valide",
      invalidNumber: "Veuillez entrer un nombre valide",
      minValue: "Doit être supérieur à {{min}}",
      maxValue: "Ne doit pas dépasser {{max}}",
      invalidSlug:
        "Le slug ne peut contenir que des lettres minuscules, des chiffres et des tirets",
      discountGreaterThanPrice:
        "Le prix réduit ne peut pas être supérieur au prix normal",
    },
  },
  ar: {
    createCourse: "إنشاء دورة جديدة",
    editCourse: "تعديل الدورة",
    basicInformation: "المعلومات الأساسية",
    courseTitle: "عنوان الدورة",
    courseTitlePlaceholder: "أدخل عنوان الدورة",
    slug: "الرابط المختصر",
    slugPlaceholder: "رابط-الدورة",
    subtitle: "العنوان الفرعي",
    subtitlePlaceholder: "عنوان فرعي موجز للدورة",
    description: "الوصف الكامل",
    descriptionPlaceholder: "وصف تفصيلي للدورة...",
    shortDescription: "وصف مختصر",
    shortDescriptionPlaceholder: "نظرة عامة موجزة (بحد أقصى 200 حرف)",

    mediaAssets: "ملفات الوسائط",
    thumbnailUrl: "رابط الصورة المصغرة",
    thumbnailPlaceholder: "https://example.com/thumbnail.jpg",
    previewVideo: "رابط فيديو المعاينة",
    previewVideoPlaceholder: "https://example.com/preview.mp4",
    uploadThumbnail: "تحميل الصورة المصغرة",
    uploadVideo: "تحميل الفيديو",

    learningContent: "محتوى التعلم",
    learningObjectives: "أهداف التعلم",
    addObjective: "إضافة هدف",
    objectivePlaceholder: "ماذا سيتعلم الطلاب؟",
    prerequisites: "المتطلبات الأساسية",
    prerequisitesPlaceholder: "المعرفة أو المهارات المطلوبة",
    targetAudience: "الجمهور المستهدف",
    targetAudiencePlaceholder: "لمن هذه الدورة؟",

    courseDetails: "تفاصيل الدورة",
    difficultyLevel: "مستوى الصعوبة",
    beginner: "مبتدئ",
    intermediate: "متوسط",
    advanced: "متقدم",
    expert: "خبير",
    estimatedDuration: "المدة المقدرة (ساعات)",
    durationPlaceholder: "0.0",

    pricingCategory: "السعر والفئة",
    price: "السعر العادي",
    pricePlaceholder: "0.00",
    discountPrice: "السعر المخفض",
    discountPlaceholder: "0.00",
    currency: "العملة",
    category: "الفئة",
    selectCategory: "اختر فئة",
    subcategory: "الفئة الفرعية",
    selectSubcategory: "اختر فئة فرعية",

    additionalInfo: "معلومات إضافية",
    tags: "الوسوم",
    addTag: "إضافة وسم",
    tagPlaceholder: "أدخل الوسم واضغط Enter",
    hasCertificate: "تقدم شهادة",
    certificateDescription: "سيحصل الطلاب على شهادة عند الإكمال",

    submit: "إنشاء الدورة",
    update: "تحديث الدورة",
    cancel: "إلغاء",
    submitting: "جاري الإرسال...",

    errors: {
      required: "هذا الحقل مطلوب",
      minLength: "يجب أن يكون على الأقل {{min}} حرفًا",
      maxLength: "يجب ألا يتجاوز {{max}} حرفًا",
      invalidUrl: "الرجاء إدخال رابط صالح",
      invalidNumber: "الرجاء إدخال رقم صالح",
      minValue: "يجب أن يكون أكبر من {{min}}",
      maxValue: "يجب ألا يتجاوز {{max}}",
      invalidSlug:
        "يمكن أن يحتوي الرابط المختصر على أحرف صغيرة وأرقام وشرطات فقط",
      discountGreaterThanPrice:
        "لا يمكن أن يكون السعر المخفض أكبر من السعر العادي",
    },
  },
};

const CourseForm: React.FC<CourseFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  categories,
  subcategories,
  instructorId,
  language = "en",
}) => {
  const t = translations[language];
  const isRTL = language === "ar";
  const isEditMode = !!initialData;

  // Form state
  const [formData, setFormData] = useState<CourseFormData>({
    instructorId: instructorId,
    title: "",
    slug: "",
    subtitle: "",
    description: "",
    shortDescription: "",
    thumbnailUrl: "",
    previewVideo: "",
    learningObjectives: [""],
    prerequisites: "",
    targetAudience: "",
    difficultyLevel: "BEGINNER",
    estimatedDurationHours: 0,
    price: 0,
    discountPrice: 0,
    currency: "CFA",
    categoryId: "",
    subcategoryId: "",
    tags: [],
    hasCertificate: true,
    ...initialData,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTag, setCurrentTag] = useState("");
  const [filteredSubcategories, setFilteredSubcategories] =
    useState(subcategories);

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEditMode && formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title, isEditMode]);

  // Filter subcategories based on selected category
  useEffect(() => {
    if (formData.categoryId) {
      const filtered = subcategories.filter(
        (sub) => sub.categoryId === formData.categoryId
      );
      setFilteredSubcategories(filtered);

      // Reset subcategory if it doesn't belong to the new category
      if (!filtered.find((sub) => sub.id === formData.subcategoryId)) {
        setFormData((prev) => ({ ...prev, subcategoryId: "" }));
      }
    } else {
      setFilteredSubcategories(subcategories);
    }
  }, [formData.categoryId, subcategories]);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = t.errors.required;
    } else if (formData.title.length < 10) {
      newErrors.title = t.errors.minLength.replace("{{min}}", "10");
    } else if (formData.title.length > 200) {
      newErrors.title = t.errors.maxLength.replace("{{max}}", "200");
    }

    // Slug validation
    if (!formData.slug.trim()) {
      newErrors.slug = t.errors.required;
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = t.errors.invalidSlug;
    }

    // Subtitle validation
    if (!formData.subtitle.trim()) {
      newErrors.subtitle = t.errors.required;
    } else if (formData.subtitle.length > 250) {
      newErrors.subtitle = t.errors.maxLength.replace("{{max}}", "250");
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = t.errors.required;
    } else if (formData.description.length < 100) {
      newErrors.description = t.errors.minLength.replace("{{min}}", "100");
    }

    // Short description validation
    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = t.errors.required;
    } else if (formData.shortDescription.length > 200) {
      newErrors.shortDescription = t.errors.maxLength.replace("{{max}}", "200");
    }

    // URL validations
    const urlRegex = /^https?:\/\/.+/;
    if (formData.thumbnailUrl && !urlRegex.test(formData.thumbnailUrl)) {
      newErrors.thumbnailUrl = t.errors.invalidUrl;
    }
    if (formData.previewVideo && !urlRegex.test(formData.previewVideo)) {
      newErrors.previewVideo = t.errors.invalidUrl;
    }

    // Learning objectives validation
    const validObjectives = formData.learningObjectives.filter((obj) =>
      obj.trim()
    );
    if (validObjectives.length === 0) {
      newErrors.learningObjectives = t.errors.required;
    }

    // Prerequisites validation
    if (!formData.prerequisites.trim()) {
      newErrors.prerequisites = t.errors.required;
    }

    // Target audience validation
    if (!formData.targetAudience.trim()) {
      newErrors.targetAudience = t.errors.required;
    }

    // Duration validation
    if (formData.estimatedDurationHours <= 0) {
      newErrors.estimatedDurationHours = t.errors.minValue.replace(
        "{{min}}",
        "0"
      );
    }

    // Price validation
    if (formData.price < 0) {
      newErrors.price = t.errors.minValue.replace("{{min}}", "0");
    }
    if (formData.discountPrice < 0) {
      newErrors.discountPrice = t.errors.minValue.replace("{{min}}", "0");
    }
    if (formData.discountPrice > formData.price) {
      newErrors.discountPrice = t.errors.discountGreaterThanPrice;
    }

    // Category validation
    if (!formData.categoryId) {
      newErrors.categoryId = t.errors.required;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleObjectiveChange = (index: number, value: string) => {
    const newObjectives = [...formData.learningObjectives];
    newObjectives[index] = value;
    setFormData((prev) => ({ ...prev, learningObjectives: newObjectives }));

    if (errors.learningObjectives) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.learningObjectives;
        return newErrors;
      });
    }
  };

  const addObjective = () => {
    setFormData((prev) => ({
      ...prev,
      learningObjectives: [...prev.learningObjectives, ""],
    }));
  };

  const removeObjective = (index: number) => {
    if (formData.learningObjectives.length > 1) {
      const newObjectives = formData.learningObjectives.filter(
        (_, i) => i !== index
      );
      setFormData((prev) => ({ ...prev, learningObjectives: newObjectives }));
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentTag.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(currentTag.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, currentTag.trim()],
        }));
      }
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Clean up learning objectives (remove empty ones)
      const cleanedData = {
        ...formData,
        learningObjectives: formData.learningObjectives.filter((obj) =>
          obj.trim()
        ),
      };

      await onSubmit(cleanedData);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`w-full max-w-5xl mx-auto ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditMode ? t.editCourse : t.createCourse}
          </h2>
        </div>

        {/* Basic Information */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t.basicInformation}
          </h3>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t.courseTitle} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder={t.courseTitlePlaceholder}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Slug */}
            <div>
              <label
                htmlFor="slug"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t.slug} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder={t.slugPlaceholder}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm ${
                  errors.slug ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.slug && (
                <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
              )}
            </div>

            {/* Subtitle */}
            <div>
              <label
                htmlFor="subtitle"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t.subtitle} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                placeholder={t.subtitlePlaceholder}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.subtitle ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.subtitle && (
                <p className="mt-1 text-sm text-red-600">{errors.subtitle}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t.description} <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder={t.descriptionPlaceholder}
                rows={6}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Short Description */}
            <div>
              <label
                htmlFor="shortDescription"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t.shortDescription} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                placeholder={t.shortDescriptionPlaceholder}
                maxLength={200}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.shortDescription ? "border-red-500" : "border-gray-300"
                }`}
              />
              <p className="mt-1 text-sm text-gray-500">
                {formData.shortDescription.length}/200
              </p>
              {errors.shortDescription && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.shortDescription}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Media Assets */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t.mediaAssets}
          </h3>

          <div className="space-y-4">
            {/* Thumbnail URL */}
            <div>
              <label
                htmlFor="thumbnailUrl"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t.thumbnailUrl}
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  id="thumbnailUrl"
                  name="thumbnailUrl"
                  value={formData.thumbnailUrl}
                  onChange={handleInputChange}
                  placeholder={t.thumbnailPlaceholder}
                  className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.thumbnailUrl ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Upload size={16} />
                  {t.uploadThumbnail}
                </button>
              </div>
              {errors.thumbnailUrl && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.thumbnailUrl}
                </p>
              )}
            </div>

            {/* Preview Video */}
            <div>
              <label
                htmlFor="previewVideo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t.previewVideo}
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  id="previewVideo"
                  name="previewVideo"
                  value={formData.previewVideo}
                  onChange={handleInputChange}
                  placeholder={t.previewVideoPlaceholder}
                  className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.previewVideo ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Video size={16} />
                  {t.uploadVideo}
                </button>
              </div>
              {errors.previewVideo && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.previewVideo}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Learning Content */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t.learningContent}
          </h3>

          <div className="space-y-4">
            {/* Learning Objectives */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.learningObjectives} <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {formData.learningObjectives.map((objective, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) =>
                        handleObjectiveChange(index, e.target.value)
                      }
                      placeholder={`${t.objectivePlaceholder} ${index + 1}`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {formData.learningObjectives.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeObjective(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addObjective}
                className="mt-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                {t.addObjective}
              </button>
              {errors.learningObjectives && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.learningObjectives}
                </p>
              )}
            </div>

            {/* Prerequisites */}
            <div>
              <label
                htmlFor="prerequisites"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t.prerequisites} <span className="text-red-500">*</span>
              </label>
              <textarea
                id="prerequisites"
                name="prerequisites"
                value={formData.prerequisites}
                onChange={handleInputChange}
                placeholder={t.prerequisitesPlaceholder}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  errors.prerequisites ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.prerequisites && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.prerequisites}
                </p>
              )}
            </div>

            {/* Target Audience */}
            <div>
              <label
                htmlFor="targetAudience"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t.targetAudience} <span className="text-red-500">*</span>
              </label>
              <textarea
                id="targetAudience"
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleInputChange}
                placeholder={t.targetAudiencePlaceholder}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  errors.targetAudience ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.targetAudience && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.targetAudience}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Course Details */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t.courseDetails}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Difficulty Level */}
            <div>
              <label
                htmlFor="difficultyLevel"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t.difficultyLevel} <span className="text-red-500">*</span>
              </label>
              <select
                id="difficultyLevel"
                name="difficultyLevel"
                value={formData.difficultyLevel}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="BEGINNER">{t.beginner}</option>
                <option value="INTERMEDIATE">{t.intermediate}</option>
                <option value="ADVANCED">{t.advanced}</option>
                <option value="EXPERT">{t.expert}</option>
              </select>
            </div>

            {/* Estimated Duration */}
            <div>
              <label
                htmlFor="estimatedDurationHours"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t.estimatedDuration} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="estimatedDurationHours"
                name="estimatedDurationHours"
                value={formData.estimatedDurationHours}
                onChange={handleInputChange}
                placeholder={t.durationPlaceholder}
                step="0.5"
                min="0"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.estimatedDurationHours
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.estimatedDurationHours && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.estimatedDurationHours}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Pricing & Category */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t.pricingCategory}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t.price} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder={t.pricePlaceholder}
                step="0.01"
                min="0"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.price ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
            </div>

            {/* Discount Price */}
            <div>
              <label
                htmlFor="discountPrice"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t.discountPrice}
              </label>
              <input
                type="number"
                id="discountPrice"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleInputChange}
                placeholder={t.discountPlaceholder}
                step="0.01"
                min="0"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.discountPrice ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.discountPrice && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.discountPrice}
                </p>
              )}
            </div>

            {/* Currency */}
            <div>
              <label
                htmlFor="currency"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t.currency} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="categoryId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t.category} <span className="text-red-500">*</span>
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.categoryId ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">{t.selectCategory}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
              )}
            </div>

            {/* Subcategory */}
            <div className="md:col-span-2">
              <label
                htmlFor="subcategoryId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t.subcategory}
              </label>
              <select
                id="subcategoryId"
                name="subcategoryId"
                value={formData.subcategoryId}
                onChange={handleInputChange}
                disabled={!formData.categoryId}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">{t.selectSubcategory}</option>
                {filteredSubcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Additional Information */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t.additionalInfo}
          </h3>

          <div className="space-y-4">
            {/* Tags */}
            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t.tags}
              </label>
              <input
                type="text"
                id="tags"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder={t.tagPlaceholder}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-blue-900"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Has Certificate */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="hasCertificate"
                name="hasCertificate"
                checked={formData.hasCertificate}
                onChange={handleCheckboxChange}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div>
                <label
                  htmlFor="hasCertificate"
                  className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                  {t.hasCertificate}
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  {t.certificateDescription}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
          <Button
            variant="outlined"
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.cancel}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t.submitting}
              </>
            ) : isEditMode ? (
              t.update
            ) : (
              t.submit
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;
