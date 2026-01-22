import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Trash2,
  Upload,
  Video,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  Check,
} from "lucide-react";
import { Button } from "@mui/material";
import { useImageUpload } from "../../../hooks/learn/useVideoApi";
import {
  useSubCategoriesByCategory,
  useInstructors,
} from "../../../hooks/useApi";

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
  difficultyLevel: "BIGINNER" | "INTERMEDIATE" | "ADVANCED";
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
  instructorId: string;
}

interface FormErrors {
  [key: string]: string;
}

// Error Messages Configuration
const ERROR_MESSAGES = {
  required: "This field is required",
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must not exceed ${max} characters`,
  invalidSlug: "Slug can only contain lowercase letters, numbers, and hyphens",
  invalidUrl: "Please enter a valid URL (starting with http:// or https://)",
  minValue: (min: number) => `Must be at least ${min}`,
  discountGreaterThanPrice:
    "Discount price cannot be greater than regular price",
  invalidNumber: "Please enter a valid number",
};

// Error display component
const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
    <AlertCircle size={14} />
    <span>{message}</span>
  </div>
);

const CourseForm: React.FC<CourseFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  categories,
  instructorId,
}) => {
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
    difficultyLevel: "BIGINNER",
    price: 0,
    discountPrice: 0,
    currency: "CFA",
    categoryId: "",
    subcategoryId: "",
    tags: [],
    hasCertificate: true,
    ...initialData,
  });

  // Fetch subcategories based on selected category
  const { data: subcategoriesData } = useSubCategoriesByCategory(
    formData.categoryId || "",
  );
  const subcategories = subcategoriesData || [];

  // Pagination state for instructors
  const [instructorPage, setInstructorPage] = useState(1);
  const instructorsPerPage = 6;

  // Fetch instructors with pagination
  const { data: instructorsData, isLoading: isLoadingInstructors } =
    useInstructors(instructorPage.toString(), instructorsPerPage.toString());
  const instructors = instructorsData || [];

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTag, setCurrentTag] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const thumbnailFileInputRef = React.useRef<HTMLInputElement>(null);

  const imageUploadMutation = useImageUpload();

  // Set initial thumbnail preview
  useEffect(() => {
    if (initialData?.thumbnailUrl) {
      setThumbnailPreview(initialData.thumbnailUrl);
    }
  }, [initialData?.thumbnailUrl]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEditMode && formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replaceAll(/[^a-z0-9]+/g, "-")
        .replaceAll(/^-+|-+$/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title, isEditMode]);

  // Validation function
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validateField = (name: string, value: any): string => {
    switch (name) {
      case "title":
        if (!value.trim()) return ERROR_MESSAGES.required;
        if (value.length < 10) return ERROR_MESSAGES.minLength(10);
        if (value.length > 200) return ERROR_MESSAGES.maxLength(200);
        break;

      case "slug":
        if (!value.trim()) return ERROR_MESSAGES.required;
        if (!/^[a-z0-9-]+$/.test(value)) return ERROR_MESSAGES.invalidSlug;
        break;

      case "subtitle":
        if (!value.trim()) return ERROR_MESSAGES.required;
        if (value.length > 250) return ERROR_MESSAGES.maxLength(250);
        break;

      case "description":
        if (!value.trim()) return ERROR_MESSAGES.required;
        if (value.length < 100) return ERROR_MESSAGES.minLength(100);
        break;

      case "shortDescription":
        if (!value.trim()) return ERROR_MESSAGES.required;
        if (value.length > 200) return ERROR_MESSAGES.maxLength(200);
        break;

      case "thumbnailUrl":
      case "previewVideo":
        if (value && !/^https?:\/\/.+/.test(value)) {
          return ERROR_MESSAGES.invalidUrl;
        }
        break;

      case "prerequisites":
      case "targetAudience":
        if (!value.trim()) return ERROR_MESSAGES.required;
        break;

      case "discountPrice":
        if (value && value > formData.price) {
          return ERROR_MESSAGES.discountGreaterThanPrice;
        }
        break;

      case "categoryId":
        if (!value) return ERROR_MESSAGES.required;
        break;
    }
    return "";
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate basic fields
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof CourseFormData]);
      if (error) newErrors[key] = error;
    });

    // Special validation for learning objectives
    const validObjectives = formData.learningObjectives.filter((obj) =>
      obj.trim(),
    );
    if (validObjectives.length === 0) {
      newErrors.learningObjectives =
        "At least one learning objective is required";
    }

    setErrors(newErrors);

    // Mark all fields as touched
    const allTouched: { [key: string]: boolean } = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    return Object.keys(newErrors).length === 0;
  };

  // Handle field blur
  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name as keyof CourseFormData]);
    setErrors((prev) => {
      if (error) {
        return { ...prev, [name]: error };
      } else {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      }
    });
  };

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number" ? (value === "" ? 0 : parseFloat(value)) : value,
    }));

    // Validate on change if field has been touched
    if (touched[name]) {
      const error = validateField(
        name,
        type === "number"
          ? value === ""
            ? 0
            : Number.parseFloat(value)
          : value,
      );
      setErrors((prev) => {
        if (error) {
          return { ...prev, [name]: error };
        } else {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        }
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

    // Clear error if we have at least one non-empty objective
    if (newObjectives.some((obj) => obj.trim())) {
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
        (_, i) => i !== index,
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

  const handleThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    // Upload image
    imageUploadMutation.mutate(file, {
      onSuccess: (response) => {
        // Assuming the response has a url property
        const uploadedUrl = response.data.url;
        setFormData((prev) => ({ ...prev, thumbnailUrl: uploadedUrl }));
        // Update preview with the uploaded URL
        setThumbnailPreview(uploadedUrl);
      },
      onError: (error) => {
        console.error("Upload error:", error);
        alert("Failed to upload image. Please try again.");
        // Keep the preview even if upload fails, don't clear it
      },
    });
  };

  const handleThumbnailUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, thumbnailUrl: url }));
    setThumbnailPreview(url);
  };

  const removeThumbnail = () => {
    setFormData((prev) => ({ ...prev, thumbnailUrl: "" }));
    setThumbnailPreview("");
    if (thumbnailFileInputRef.current) {
      thumbnailFileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const cleanedData = {
        ...formData,
        learningObjectives: formData.learningObjectives.filter((obj) =>
          obj.trim(),
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
    <div className="w-full max-w-5xl mx-auto p-6 bg-white rounded-lg  ">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditMode ? "Edit Course" : "Create New Course"}
          </h2>
        </div>

        {/* Error Summary */}
        {Object.keys(errors).length > 0 && Object.keys(touched).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="text-red-600 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">
                  Please fix the following errors:
                </h3>
                <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                  {Object.entries(errors).map(([field, message]) => (
                    <li key={field}>
                      <span className="font-medium capitalize">
                        {field.replaceAll(/([A-Z])/g, " $1").trim()}
                      </span>
                      : {message}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Basic Information */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Basic Information
          </h3>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Course Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                onBlur={() => handleBlur("title")}
                placeholder='e.g., "Mastering React: From Beginner to Pro"'
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.title && touched.title
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {errors.title && touched.title && (
                <ErrorMessage message={errors.title} />
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.title.length}/200 characters
              </p>
            </div>

            {/* Subtitle */}
            <div>
              <label
                htmlFor="subtitle"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Subtitle <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                onBlur={() => handleBlur("subtitle")}
                placeholder="e.g., A comprehensive guide to mastering React.js"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.subtitle && touched.subtitle
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {errors.subtitle && touched.subtitle && (
                <ErrorMessage message={errors.subtitle} />
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.subtitle.length}/250 characters
              </p>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                onBlur={() => handleBlur("description")}
                placeholder="Provide a detailed description of your course (minimum 100 characters)"
                rows={6}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors ${
                  errors.description && touched.description
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {errors.description && touched.description && (
                <ErrorMessage message={errors.description} />
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.description.length} characters (minimum 100)
              </p>
            </div>

            {/* Short Description */}
            <div>
              <label
                htmlFor="shortDescription"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Short Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                onBlur={() => handleBlur("shortDescription")}
                placeholder="A brief overview for search results and previews"
                maxLength={200}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.shortDescription && touched.shortDescription
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {errors.shortDescription && touched.shortDescription && (
                <ErrorMessage message={errors.shortDescription} />
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.shortDescription.length}/200 characters
              </p>
            </div>
          </div>
        </section>

        {/* Instructor */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Course Instructor <span className="text-red-500">*</span>
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Select an instructor to teach this course
              </p>
            </div>
          </div>

          {errors.instructorId && touched.instructorId && (
            <div className="mb-4">
              <ErrorMessage message={errors.instructorId} />
            </div>
          )}

          {/* Loading State */}
          {isLoadingInstructors && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading instructors...</span>
            </div>
          )}

          {/* Instructors Grid */}
          {!isLoadingInstructors && instructors.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {instructors.map((instructor) => {
                  const isSelected =
                    formData.instructorId === instructor.userId;
                  return (
                    <Button
                      type="button"
                      key={instructor.userId}
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          instructorId: instructor.userId,
                        }));
                        setTouched((prev) => ({ ...prev, instructorId: true }));
                        setErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.instructorId;
                          return newErrors;
                        });
                      }}
                      className={`relative p-4 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md w-full ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      {/* Selected Checkmark */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-blue-600 rounded-full p-1">
                          <Check size={16} className="text-white" />
                        </div>
                      )}

                      {/* Instructor Avatar */}
                      <div className="flex items-start space-x-3">
                        {instructor.clerkProfile.imageUrl ? (
                          <img
                            src={instructor.clerkProfile.imageUrl}
                            alt={`${instructor.clerkProfile.firstName} ${instructor.clerkProfile.lastName}`}
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              target.nextElementSibling?.classList.remove(
                                "hidden",
                              );
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-16 h-16 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center ${
                            instructor.clerkProfile.imageUrl ? "hidden" : ""
                          }`}
                        >
                          <UserCircle size={32} className="text-white" />
                        </div>

                        {/* Instructor Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {instructor.clerkProfile.firstName}{" "}
                            {instructor.clerkProfile.lastName}
                          </h4>
                          {instructor.clerkProfile.username && (
                            <p className="text-sm text-gray-500 truncate">
                              @{instructor.clerkProfile.username}
                            </p>
                          )}
                          <div className="mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                              {instructor.role}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  onClick={() =>
                    setInstructorPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={instructorPage === 1}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} className="mr-1" />
                  Previous
                </Button>

                <span className="text-sm text-gray-600">
                  Page {instructorPage}
                </span>

                <Button
                  type="button"
                  onClick={() => setInstructorPage((prev) => prev + 1)}
                  disabled={instructors.length < instructorsPerPage}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight size={16} className="ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* No Instructors Found */}
          {!isLoadingInstructors && instructors.length === 0 && (
            <div className="text-center py-12">
              <UserCircle size={48} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600">No instructors found</p>
              <p className="text-sm text-gray-500 mt-1">
                {instructorPage > 1
                  ? "Try going to the previous page"
                  : "No instructors available"}
              </p>
            </div>
          )}
        </section>
        {/* Media Assets */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Media Assets
          </h3>

          <div className="space-y-6">
            {/* Thumbnail Image */}
            <div>
              <label
                htmlFor="courseThumbnail"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Course Thumbnail
              </label>

              {/* Thumbnail Preview or Upload Area */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Upload/Preview Area */}
                <div>
                  {thumbnailPreview ? (
                    <div className="relative group">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-full h-auto object-contain rounded-lg border-2 border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EInvalid Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                      <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center">
                        <Button
                          type="button"
                          onClick={removeThumbnail}
                          className="opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2"
                        >
                          <Trash2 size={16} />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => thumbnailFileInputRef.current?.click()}
                      className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <Upload className="text-gray-400 mb-2" size={32} />
                      <p className="text-sm font-medium text-gray-700">
                        Click to upload thumbnail
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG up to 5MB
                      </p>
                    </Button>
                  )}
                  <input
                    ref={thumbnailFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                  />
                  {imageUploadMutation.isPending && (
                    <div className="mt-2 text-sm text-blue-600 flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      Uploading...
                    </div>
                  )}
                </div>

                {/* URL Input Alternative */}
                <div className="flex flex-col justify-center">
                  <label
                    htmlFor="thumbnailUrl"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Or enter image URL
                  </label>
                  <input
                    type="url"
                    id="thumbnailUrl"
                    name="thumbnailUrl"
                    value={formData.thumbnailUrl}
                    onChange={handleThumbnailUrlChange}
                    onBlur={() => handleBlur("thumbnailUrl")}
                    placeholder="https://example.com/thumbnail.jpg"
                    disabled={imageUploadMutation.isPending}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.thumbnailUrl && touched.thumbnailUrl
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  />
                  {errors.thumbnailUrl && touched.thumbnailUrl && (
                    <ErrorMessage message={errors.thumbnailUrl} />
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    Recommended size: 1280x720px (16:9 ratio)
                  </p>
                </div>
              </div>
            </div>

            {/* Preview Video */}
            <div>
              <label
                htmlFor="previewVideo"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Preview Video URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  id="previewVideo"
                  name="previewVideo"
                  value={formData.previewVideo}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("previewVideo")}
                  placeholder="https://example.com/preview.mp4"
                  className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.previewVideo && touched.previewVideo
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                <Button
                  type="button"
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Video size={16} />
                  Upload
                </Button>
              </div>
              {errors.previewVideo && touched.previewVideo && (
                <ErrorMessage message={errors.previewVideo} />
              )}
              <p className="mt-1 text-xs text-gray-500">
                Optional: Add a promotional video to showcase your course
              </p>
            </div>
          </div>
        </section>

        {/* Learning Content */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Learning Content
          </h3>

          <div className="space-y-4">
            {/* Learning Objectives */}
            <div>
              <label
                htmlFor="learningObjective-0"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Learning Objectives <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {formData.learningObjectives.map((objective, index) => (
                  <div key={objective.length + index} className="flex gap-2">
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) =>
                        handleObjectiveChange(index, e.target.value)
                      }
                      placeholder={`Learning objective ${index + 1}`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {formData.learningObjectives.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeObjective(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={20} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                onClick={addObjective}
                className="mt-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Add Objective
              </Button>
              {errors.learningObjectives && (
                <ErrorMessage message={errors.learningObjectives} />
              )}
            </div>

            {/* Prerequisites */}
            <div>
              <label
                htmlFor="prerequisites"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Prerequisites <span className="text-red-500">*</span>
              </label>
              <textarea
                id="prerequisites"
                name="prerequisites"
                value={formData.prerequisites}
                onChange={handleInputChange}
                onBlur={() => handleBlur("prerequisites")}
                placeholder="What knowledge or skills should students have before taking this course?"
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors ${
                  errors.prerequisites && touched.prerequisites
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {errors.prerequisites && touched.prerequisites && (
                <ErrorMessage message={errors.prerequisites} />
              )}
            </div>

            {/* Target Audience */}
            <div>
              <label
                htmlFor="targetAudience"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Target Audience <span className="text-red-500">*</span>
              </label>
              <textarea
                id="targetAudience"
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleInputChange}
                onBlur={() => handleBlur("targetAudience")}
                placeholder="Who is this course for? (e.g., Beginners, Developers, Designers)"
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors ${
                  errors.targetAudience && touched.targetAudience
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {errors.targetAudience && touched.targetAudience && (
                <ErrorMessage message={errors.targetAudience} />
              )}
            </div>
          </div>
        </section>

        {/* Course Details */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Course Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Difficulty Level */}
            <div>
              <label
                htmlFor="difficultyLevel"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Difficulty Level <span className="text-red-500">*</span>
              </label>
              <select
                id="difficultyLevel"
                name="difficultyLevel"
                value={formData.difficultyLevel}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="BIGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>
          </div>
        </section>

        {/* Pricing & Category */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Pricing & Category
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Price (CFA) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price || ""}
                onChange={handleInputChange}
                onBlur={() => handleBlur("price")}
                placeholder="e.g., 49000"
                min="0"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.price && touched.price
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {errors.price && touched.price && (
                <ErrorMessage message={errors.price} />
              )}
            </div>

            {/* Discount Price */}
            <div>
              <label
                htmlFor="discountPrice"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Discount Price (CFA)
              </label>
              <input
                type="number"
                id="discountPrice"
                name="discountPrice"
                value={formData.discountPrice || ""}
                onChange={handleInputChange}
                onBlur={() => handleBlur("discountPrice")}
                placeholder="e.g., 29000"
                min="0"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.discountPrice && touched.discountPrice
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {errors.discountPrice && touched.discountPrice && (
                <ErrorMessage message={errors.discountPrice} />
              )}
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="categoryId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category <span className="text-red-500">*</span>
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
                <option value="">Select Category</option>
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
                Subcategory
              </label>
              <select
                id="subcategoryId"
                name="subcategoryId"
                value={formData.subcategoryId}
                onChange={handleInputChange}
                disabled={!formData.categoryId}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select Subcategory</option>
                {subcategories.map((sub) => (
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
            Additional Information
          </h3>

          <div className="space-y-4">
            {/* Tags */}
            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tags
              </label>
              <input
                type="text"
                id="tags"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Type a tag and press Enter"
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
                      <Button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-blue-900"
                      >
                        <X size={14} />
                      </Button>
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
                  Provide Certificate of Completion
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  Certificate will be issued upon successful completion of the
                  course.
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
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {(() => {
              if (isSubmitting) {
                return (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting
                  </>
                );
              }
              return isEditMode ? "Update" : "Create";
            })()}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;
