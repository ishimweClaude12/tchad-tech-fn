import { NavLink, Outlet, useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useCourseById } from "src/hooks/learn/useCourseApi";
import {
  useCheckEnrollment,
  useModuleProgress,
  useStartModuleProgress,
} from "src/hooks/learn/useEnrollmentApi";
import { usePublishedModulesByCourseId } from "src/hooks/learn/useModulesApi";
import type { Module } from "src/types/Module.types";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import { IconButton } from "@mui/material";
import { ModuleProgressStatus } from "src/types/Enrollment.types";

// Component to render module with lessons
const ModuleWithLessons = ({
  module,
  courseId,
  enrollmentId,
}: {
  module: Module;
  courseId: string;
  enrollmentId?: string;
}) => {
  const { data: moduleProgress } = useModuleProgress(
    enrollmentId || "",
    module.id,
  );

  const { mutate: startModuleProgress } = useStartModuleProgress();

  const progress = moduleProgress?.data.moduleProgress;
  const completedLessons = progress?.completedLessons;
  const totalLessons = progress?.totalLessons;
  const isCompleted = progress?.status === ModuleProgressStatus.COMPLETED;
  const isInProgress = progress?.status === ModuleProgressStatus.IN_PROGRESS;
  const isNotStarted = progress?.status === ModuleProgressStatus.NOT_STARTED;

  const getStatusIcon = () => {
    if (isCompleted) {
      return <CheckCircleIcon className="text-green-600" fontSize="small" />;
    }
    if (isInProgress) {
      return (
        <PlayCircleOutlineIcon className="text-blue-600" fontSize="small" />
      );
    }
    return (
      <RadioButtonUncheckedIcon className="text-gray-400" fontSize="small" />
    );
  };

  const handleNavigateToModule = (moduleId: string) => {
    // Start module progress if it's not started yet
    if (progress === null || (isNotStarted && enrollmentId)) {
      startModuleProgress({
        enrollmentId: enrollmentId || "",
        moduleId,
      });
    }
  };

  return (
    <li key={module.id}>
      <div className="space-y-2">
        {/* Module Header */}
        <div className="flex items-center gap-2">
          {/* Module Status Icon */}
          <div className="shrink-0">{getStatusIcon()}</div>

          <NavLink
            to={`/learn/enrollment/${enrollmentId}/course/${courseId}/module/${module.id}`}
            onClick={() => handleNavigateToModule(module.id)}
            className={({ isActive }) =>
              `flex-1 px-3 py-2 rounded-lg transition-colors text-sm leading-relaxed font-medium ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-900 hover:bg-gray-100"
              }`
            }
          >
            <div className="flex flex-col gap-1">
              <span>{module.title}</span>

              {/* Show "No lessons yet" when totalLessons is 0 or undefined */}
              {(!totalLessons || totalLessons === 0) && (
                <span className="text-xs text-gray-500 italic">
                  No lessons added yet
                </span>
              )}

              {/* Only show progress when there are lessons */}
              {totalLessons &&
                totalLessons > 0 &&
                (() => {
                  let progressTextColor = "text-gray-500";
                  if (isCompleted) {
                    progressTextColor = "text-green-600";
                  } else if (isInProgress) {
                    progressTextColor = "text-blue-600";
                  }

                  return (
                    <div className="flex items-center gap-2 text-xs">
                      {totalLessons > 0 && (
                        <span className={progressTextColor}>
                          {completedLessons || 0}/{totalLessons} lessons
                        </span>
                      )}

                      {/* Status Badge */}
                      {isCompleted && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Completed
                        </span>
                      )}
                      {isInProgress && !isCompleted && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          In Progress
                        </span>
                      )}
                      {isNotStarted && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                          Not Started
                        </span>
                      )}
                    </div>
                  );
                })()}
              {/* Progress Bar */}
              {totalLessons &&
                totalLessons > 0 &&
                completedLessons !== null &&
                completedLessons !== undefined && (
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        isCompleted ? "bg-green-600" : "bg-blue-600"
                      }`}
                      style={{
                        width: `${(completedLessons / totalLessons) * 100}%`,
                      }}
                    ></div>
                  </div>
                )}
            </div>
          </NavLink>
        </div>
      </div>
    </li>
  );
};

const CourseLayout = () => {
  const navigate = useNavigate();
  const { courseId = "" } = useParams<{
    courseId: string;
  }>();
  const { user } = useUser();

  const {
    data: modules,
    isLoading,
    error,
  } = usePublishedModulesByCourseId(courseId);

  const {
    data: course,
    isLoading: courseLoading,
    error: courseError,
  } = useCourseById(courseId);

  const { data: isUserEnrolledData } = useCheckEnrollment(
    courseId,
    user?.id || "",
  );

  if (isLoading || courseLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || courseError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold mb-2">Error loading course</p>
          <p className="text-sm">{error?.message || courseError?.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-full sm:w-80 md:w-96 lg:w-80 shrink-0 bg-white border-r border-gray-200 flex flex-col h-screen">
        <div className="p-6 border-b border-gray-200 shrink-0">
          <div className="flex items-start justify-between gap-2">
            <h1 className="text-xl font-bold text-gray-900 line-clamp-2 flex-1">
              {course?.data.course.title}
            </h1>
            <IconButton
              onClick={() => navigate("/learn")}
              size="small"
              className="hover:bg-gray-100"
              title="Exit course"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
        </div>

        <nav className="p-4 flex-1 overflow-y-auto">
          {/* Course Overview Link */}
          <div className="mb-4">
            <NavLink
              to={`/learn/enrollment/${isUserEnrolledData?.data.enrollment?.id}/course/${courseId}`}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <HomeIcon fontSize="small" />
              <span className="font-medium">Course Overview</span>
            </NavLink>
          </div>

          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
            Course Modules
          </h2>

          <ul className="space-y-1">
            {modules?.data.modules.map((module) => (
              <ModuleWithLessons
                key={module.id}
                module={module}
                courseId={courseId}
                enrollmentId={isUserEnrolledData?.data.enrollment?.id}
              />
            ))}
          </ul>

          {modules?.data.modules.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-8">
              No modules available yet
            </p>
          )}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-screen">
        <div className="mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default CourseLayout;
