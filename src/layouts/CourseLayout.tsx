import { NavLink, Outlet, useParams } from "react-router-dom";
import { useCourseById } from "src/hooks/learn/useCourseApi";
import { useModuleLessons } from "src/hooks/learn/useLessonApi";
import { usePublishedModulesByCourseId } from "src/hooks/learn/useModulesApi";
import { useState } from "react";
import { ChevronDown, ChevronRight, PlayCircle } from "lucide-react";
import type { Module } from "src/types/Module.types";
import type { Lesson } from "src/types/CourseLessons.types";
import { Button } from "@mui/material";

// Component to render module with lessons
const ModuleWithLessons = ({
  module,
  isExpanded,
  onToggle,
  courseId,
}: {
  module: Module;
  isExpanded: boolean;
  onToggle: (moduleId: string) => void;
  courseId: string;
}) => {
  const { data: lessonsData, isLoading: lessonsLoading } = useModuleLessons(
    module.id
  );
  const lessons = lessonsData?.data?.lessons || [];

  return (
    <li key={module.id}>
      <div>
        {/* Module Header */}
        <div className="flex items-center">
          <NavLink
            to={`/learn/progress/${courseId}/module/${module.id}`}
            className={({ isActive }) =>
              `flex-1 px-3 py-3 rounded-lg transition-colors text-sm leading-relaxed font-medium ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-900 hover:bg-gray-100"
              }`
            }
          >
            {module.title}
          </NavLink>

          <Button
            onClick={() => onToggle(module.id)}
            className="flex items-center gap-2 px-2 py-3 transition-colors hover:bg-gray-100 rounded-lg"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            )}
          </Button>
        </div>

        {/* Lessons Dropdown */}
        {isExpanded && (
          <div className="ml-12 mt-1 space-y-1">
            {lessonsLoading && (
              <div className="px-3 py-2 text-xs text-gray-500">
                Loading lessons...
              </div>
            )}
            {!lessonsLoading && lessons.length > 0 && (
              <>
                {lessons.map((lesson: Lesson) => (
                  <NavLink
                    key={lesson.id}
                    to={`/learn/progress/${courseId}/module/${module.id}/lesson/${lesson.id}`}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-colors ${
                        isActive
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`
                    }
                  >
                    <PlayCircle className="w-3 h-3" />
                    <span className="flex-1">{lesson.title}</span>
                  </NavLink>
                ))}
              </>
            )}
            {!lessonsLoading && lessons.length === 0 && (
              <div className="px-3 py-2 text-xs text-gray-500 italic">
                No lessons available
              </div>
            )}
          </div>
        )}
      </div>
    </li>
  );
};

const CourseLayout = () => {
  const { courseId = "" } = useParams<{ courseId: string }>();
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set()
  );

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

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

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
    <div className="flex h-screen bg-gray-50 min-w-screen">
      {/* Sidebar Navigation */}
      <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h1 className="text-xl font-bold text-gray-900 line-clamp-2">
            {course?.data.course.title}
          </h1>
        </div>

        <nav className="p-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
            Course Modules
          </h2>

          <ul className="space-y-1">
            {modules?.data.modules.map((module) => (
              <ModuleWithLessons
                key={module.id}
                module={module}
                isExpanded={expandedModules.has(module.id)}
                onToggle={toggleModule}
                courseId={courseId}
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
      <main className="overflow-y-auto">
        <div className="mx-auto ">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default CourseLayout;
