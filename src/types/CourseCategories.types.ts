export enum ApiResponseStatus {
  SUCCESS = "success",
  ERROR = "error",
  PENDING = "pending",
}
 
export enum CategorySortField {
  NAME = "name",
  SORT_ORDER = "sortOrder",
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
}

 
export enum SortDirection {
  ASC = "asc",
  DESC = "desc",
}

 
export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconUrl: string;
  colorCode: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

 
export interface CourseCategoryData {
  categories: CourseCategory[];
}

export interface CourseSubCategoryData {
  subCategories: CourseCategory[];
}
 
export interface CourseCategoryResponse {
  success: boolean;
  message: string;
  data: CourseCategoryData;
}

export interface CourseSubCategoryResponse {
  success: boolean;
  message: string;
  data: CourseSubCategoryData;
}

 
export interface CourseCategoryErrorResponse {
  success: false;
  message: string;
  error?: {
    code?: string;
    details?: string;
    field?: string;
  };
}

// ============================================================================
// TYPES
// ============================================================================

/**
 * Union type for all possible API responses
 */
export type CourseCategoryApiResponse =
  | CourseCategoryResponse
  | CourseCategoryErrorResponse;
  
  export type CourseSubCategoryApiResponse =
  | CourseSubCategoryResponse
  | CourseCategoryErrorResponse;

/**
 * Type for category creation/update payload (omit system-generated fields)
 */
export type CreateCourseCategoryPayload = Omit<
  CourseCategory,
  "id" | "createdAt" | "updatedAt"
>;

/**
 * Type for category update payload (all fields optional except id)
 */
export type UpdateCourseCategoryPayload =
  Partial<CreateCourseCategoryPayload> & {
    id: string;
  };

/**
 * Type for category filters/query parameters
 */
export type CourseCategoryFilters = {
  /** Filter by active status */
  isActive?: boolean;

  /** Search by name (partial match) */
  search?: string;

  /** Filter by specific slugs */
  slugs?: string[];

  /** Sort field */
  sortBy?: CategorySortField;

  /** Sort direction */
  sortDirection?: SortDirection;

  /** Pagination: page number (1-indexed) */
  page?: number;

  /** Pagination: items per page */
  limit?: number;
};

/**
 * Type for a single category with optional metadata
 */
export type CourseCategoryWithMeta = CourseCategory & {
  /** Optional: Number of courses in this category */
  courseCount?: number;

  /** Optional: Number of enrolled students across all courses */
  studentCount?: number;

  /** Optional: Whether user has courses in this category */
  hasUserCourses?: boolean;
};

/**
 * Type for paginated category response
 */
export type PaginatedCourseCategoryResponse = {
  success: boolean;
  message: string;
  data: {
    categories: CourseCategory[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
};

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard to check if response is successful
 */
export function isSuccessResponse(
  response: CourseCategoryApiResponse
): response is CourseCategoryResponse {
  return response.success === true && "data" in response;
}

/**
 * Type guard to check if response is an error
 */
export function isErrorResponse(
  response: CourseCategoryApiResponse
): response is CourseCategoryErrorResponse {
  return response.success === false;
}

/**
 * Type guard to validate if object is a valid CourseCategory
 */
export function isCourseCategory(obj: unknown): obj is CourseCategory {
  if (typeof obj !== "object" || obj === null) return false;

  const category = obj as Record<string, unknown>;

  return (
    typeof category.id === "string" &&
    typeof category.name === "string" &&
    typeof category.slug === "string" &&
    typeof category.description === "string" &&
    typeof category.iconUrl === "string" &&
    typeof category.colorCode === "string" &&
    typeof category.sortOrder === "number" &&
    typeof category.isActive === "boolean" &&
    typeof category.createdAt === "string" &&
    typeof category.updatedAt === "string"
  );
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Extract only the identifying fields from CourseCategory
 */
export type CourseCategoryIdentifier = Pick<CourseCategory, "id" | "slug">;

/**
 * Extract only the display fields from CourseCategory
 */
export type CourseCategoryDisplay = Pick<
  CourseCategory,
  "name" | "description" | "iconUrl" | "colorCode"
>;

/**
 * Type for category selection in forms/dropdowns
 */
export type CourseCategoryOption = {
  value: string; // category id
  label: string; // category name
  icon?: string; // iconUrl
  color?: string; // colorCode
};

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Default values for pagination
 */
export const DEFAULT_CATEGORY_PAGINATION = {
  page: 1,
  limit: 20,
  sortBy: CategorySortField.SORT_ORDER,
  sortDirection: SortDirection.ASC,
} as const;

/**
 * Color code validation regex
 */
export const COLOR_CODE_REGEX = /^#([A-Fa-f0-9]{6})$/;

/**
 * Slug validation regex (lowercase letters, numbers, hyphens)
 */
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
