import {
  BookOpen,
  Users,
  GraduationCap,
  TrendingUp,
  Clock,
  CheckCircle2,
  Award,
  CreditCard,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useUser } from "@clerk/clerk-react";
import { useELearningUser, useInstructors } from "../../hooks/useApi";
import { usePublishedCourses } from "../../hooks/learn/useCourseApi";
import {
  useGetAllPaymentsMade,
  useUserEnrollments,
} from "../../hooks/learn/useEnrollmentApi";
import { UserRole } from "../../types/Users.types";
import { EnrollmentStatus } from "../../types/Enrollment.types";
import type { Payment, CourseEnrollment } from "../../types/Enrollment.types";
import { Link } from "react-router-dom";

// â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const SKELETON_KEYS = ["sk-0", "sk-1", "sk-2"];

const formatCurrency = (amount: number, currency = "XAF") =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(
    amount,
  );

const formatDate = (dateStr: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateStr));

const getPaymentDotColor = (status: string): string => {
  if (status === "completed") return "bg-emerald-500";
  if (status === "pending") return "bg-amber-500";
  if (status === "refunded") return "bg-violet-500";
  return "bg-red-500";
};

const getPaymentTextColor = (status: string): string => {
  if (status === "completed") return "text-emerald-600";
  if (status === "pending") return "text-amber-600";
  return "text-gray-400";
};

// â”€â”€ Sub-components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const SkeletonCard: React.FC = () => (
  <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm space-y-3">
    <div className="w-10 h-10 rounded-xl bg-gray-100 animate-pulse" />
    <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
    <div className="h-6 w-16 bg-gray-100 rounded animate-pulse" />
    <div className="h-3 w-28 bg-gray-100 rounded animate-pulse" />
  </div>
);

const AdminActivity: React.FC<{
  payments: Payment[];
  isLoading: boolean;
}> = ({ payments, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {SKELETON_KEYS.map((k) => (
          <div key={k} className="h-14 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }
  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-400">
        <AlertCircle className="h-8 w-8 mb-2 opacity-40" />
        <p className="text-sm">No payments yet</p>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {payments.map((payment) => (
        <div
          key={payment.id}
          className="flex items-center justify-between p-3 rounded-xl bg-gray-50"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-2 h-2 rounded-full shrink-0 ${getPaymentDotColor(payment.status ?? "")}`}
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {payment.id.slice(0, 16)}â€¦
              </p>
              <p className="text-xs text-gray-400">
                {formatDate(payment.createdAt)}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0 ml-3">
            <p className="text-sm font-bold text-gray-900">
              {formatCurrency(
                Number(payment.amount),
                payment.currency || "XAF",
              )}
            </p>
            <p
              className={`text-xs capitalize ${getPaymentTextColor(payment.status ?? "")}`}
            >
              {payment.status}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

const StudentActivity: React.FC<{
  enrollments: CourseEnrollment[];
  isLoading: boolean;
}> = ({ enrollments, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {SKELETON_KEYS.map((k) => (
          <div key={k} className="h-16 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }
  if (enrollments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-400">
        <BookOpen className="h-8 w-8 mb-2 opacity-40" />
        <p className="text-sm">No enrollments yet</p>
        <a
          href="/learn/dashboard/courses"
          className="mt-2 text-xs text-blue-600 font-medium hover:underline"
        >
          Browse courses â†’
        </a>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {enrollments.map((enrollment) => (
        <a
          key={enrollment.id}
          href={`/learn/courses/${enrollment.course.slug}`}
          className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors group"
        >
          {enrollment.course.thumbnailUrl ? (
            <img
              src={enrollment.course.thumbnailUrl}
              alt={enrollment.course.title}
              className="w-10 h-10 rounded-lg object-cover shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
              <BookOpen className="h-5 w-5 text-blue-500" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-800 truncate">
              {enrollment.course.title}
            </p>
            <p className="text-xs text-gray-400">
              Enrolled {formatDate(enrollment.enrolledAt)}
            </p>
          </div>
          <div className="shrink-0">
            {enrollment.status === EnrollmentStatus.COMPLETED ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                Active
              </span>
            )}
          </div>
        </a>
      ))}
    </div>
  );
};

// â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// -- Stat card builders (outside component to reduce cognitive complexity) --

const DASH = "\u2014";

const buildAdminStatCards = (
  coursesLoading: boolean,
  totalCourses: number,
  instructorsLoading: boolean,
  totalInstructors: number,
  paymentsLoading: boolean,
  pmStats: { revenue: number; completed: number; pending: number },
) => [
  {
    label: "Published Courses",
    value: coursesLoading ? DASH : String(totalCourses),
    icon: BookOpen,
    gradient: "from-blue-600 to-blue-800",
    sub: "Available to learners",
    subColor: "text-blue-600",
  },
  {
    label: "Instructors",
    value: instructorsLoading ? DASH : String(totalInstructors),
    icon: Users,
    gradient: "from-violet-600 to-violet-800",
    sub: "Active on platform",
    subColor: "text-violet-600",
  },
  {
    label: "Total Revenue",
    value: paymentsLoading ? DASH : formatCurrency(pmStats.revenue),
    icon: TrendingUp,
    gradient: "from-emerald-600 to-emerald-800",
    sub: `${pmStats.completed} completed transactions`,
    subColor: "text-emerald-600",
  },
  {
    label: "Pending Payments",
    value: paymentsLoading ? DASH : String(pmStats.pending),
    icon: Clock,
    gradient: "from-amber-500 to-amber-700",
    sub: "Awaiting confirmation",
    subColor: "text-amber-600",
  },
];

const buildStudentStatCards = (
  coursesLoading: boolean,
  totalCourses: number,
  instructorsLoading: boolean,
  totalInstructors: number,
  enrollmentsLoading: boolean,
  enrStats: { total: number; active: number; completed: number },
) => [
  {
    label: "Open Courses",
    value: coursesLoading ? DASH : String(totalCourses),
    icon: BookOpen,
    gradient: "from-blue-600 to-blue-800",
    sub: "Available to you",
    subColor: "text-blue-600",
  },
  {
    label: "Instructors",
    value: instructorsLoading ? DASH : String(totalInstructors),
    icon: Users,
    gradient: "from-violet-600 to-violet-800",
    sub: "Ready to teach",
    subColor: "text-violet-600",
  },
  {
    label: "My Courses",
    value: enrollmentsLoading ? DASH : String(enrStats.total),
    icon: GraduationCap,
    gradient: "from-cyan-600 to-cyan-800",
    sub: `${enrStats.active} in progress`,
    subColor: "text-cyan-600",
  },
  {
    label: "Certificates",
    value: enrollmentsLoading ? DASH : String(enrStats.completed),
    icon: Award,
    gradient: "from-emerald-600 to-emerald-800",
    sub: "Courses completed",
    subColor: "text-emerald-600",
  },
];

const DashboardOverview: React.FC = () => {
  useLanguage(); // keep context subscription

  const { user: clerkUser } = useUser();
  const userId = clerkUser?.id ?? "";

  const { data: eLearningUser, isLoading: userLoading } =
    useELearningUser(userId);

  const isAdmin =
    eLearningUser?.role === UserRole.ADMIN ||
    eLearningUser?.role === UserRole.SUPPER_ADMIN;

  const { data: publishedCoursesData, isLoading: coursesLoading } =
    usePublishedCourses();
  const { data: instructorsData, isLoading: instructorsLoading } =
    useInstructors("1", "500");
  const { data: enrollmentsData, isLoading: enrollmentsLoading } =
    useUserEnrollments(userId);
  const { data: paymentsData, isLoading: paymentsLoading } =
    useGetAllPaymentsMade({ page: 1, limit: 500 });

  // â”€â”€ Derived data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const totalCourses =
    publishedCoursesData?.data?.courses?.meta?.totalItems ?? 0;
  const totalInstructors = instructorsData?.length ?? 0;
  const enrollments = enrollmentsData?.data?.enrollments ?? [];
  const completedEnrollments = enrollments.filter(
    (e) => e.status === EnrollmentStatus.COMPLETED,
  );
  const activeEnrollments = enrollments.filter(
    (e) => e.status === EnrollmentStatus.ACTIVE,
  );
  const payments = paymentsData?.data?.payments ?? [];
  const completedPayments = payments.filter((p) => p.status === "completed");
  const pendingPaymentsCount = payments.filter(
    (p) => p.status === "pending",
  ).length;
  const totalRevenue = completedPayments.reduce(
    (sum, p) => sum + Number(p.amount),
    0,
  );

  const userName = clerkUser?.firstName ?? clerkUser?.username ?? "there";

  const recentEnrollments = [...enrollments]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 4);

  const recentPayments = [...payments]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 4);

  // â”€â”€ Stat card definitions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const statCards =
    !userLoading && isAdmin
      ? buildAdminStatCards(
          coursesLoading,
          totalCourses,
          instructorsLoading,
          totalInstructors,
          paymentsLoading,
          {
            revenue: totalRevenue,
            completed: completedPayments.length,
            pending: pendingPaymentsCount,
          },
        )
      : buildStudentStatCards(
          coursesLoading,
          totalCourses,
          instructorsLoading,
          totalInstructors,
          enrollmentsLoading,
          {
            total: enrollments.length,
            active: activeEnrollments.length,
            completed: completedEnrollments.length,
          },
        );

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* â”€â”€ Hero banner â”€â”€ */}
      <div className="rounded-2xl bg-linear-to-br from-blue-800 via-blue-700 to-blue-500 p-6 text-white shadow-lg">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-blue-200 text-sm font-medium mb-1">
              {new Intl.DateTimeFormat("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(new Date())}
            </p>
            <h1 className="text-2xl font-bold mb-1">
              Welcome back, {userName}
            </h1>
            <p className="text-blue-100 text-sm">
              {isAdmin
                ? "Here's an overview of your platform's performance."
                : "Here's what's happening with your learning journey."}
            </p>
          </div>
          <div className="shrink-0 w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      {/* â”€â”€ Stat cards â”€â”€ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {userLoading
          ? SKELETON_KEYS.concat("sk-3").map((k) => <SkeletonCard key={k} />)
          : statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-linear-to-br ${stat.gradient} flex items-center justify-center`}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </p>
                  <p className={`text-xs font-medium ${stat.subColor}`}>
                    {stat.sub}
                  </p>
                </div>
              );
            })}
      </div>

      {/* â”€â”€ Bottom row â”€â”€ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h3 className="font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-5 space-y-2">
            <Link
              to="/learn/dashboard/courses"
              className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-blue-50 hover:border-blue-100 group transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-800">
                  Browse Courses
                </span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
            </Link>
            {isAdmin ? (
              <Link
                to="/learn/dashboard/payments"
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-emerald-50 hover:border-emerald-100 group transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-800">
                    Manage Payments
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-emerald-500 transition-colors" />
              </Link>
            ) : (
              <Link
                to="/learn/dashboard/my-learning"
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-emerald-50 hover:border-emerald-100 group transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <GraduationCap className="h-4 w-4 text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-800">
                    Continue Learning
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-emerald-500 transition-colors" />
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/learn/dashboard/users"
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-amber-50 hover:border-amber-100 group transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Users className="h-4 w-4 text-amber-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-800">
                    Manage Users
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-amber-500 transition-colors" />
              </Link>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h3 className="font-semibold text-gray-900">
              {isAdmin ? "Recent Payments" : "My Recent Courses"}
            </h3>
          </div>
          <div className="p-5">
            {isAdmin ? (
              <AdminActivity
                payments={recentPayments}
                isLoading={paymentsLoading}
              />
            ) : (
              <StudentActivity
                enrollments={recentEnrollments}
                isLoading={enrollmentsLoading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
