import { BookOpen, Users, BarChart3, GraduationCap } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

// Dashboard Overview Component
const DashboardOverview: React.FC = () => {
  const { language } = useLanguage();

  const content = {
    en: {
      welcome: "Welcome to E-Learning Dashboard",
      description:
        "Manage your courses, track progress, and explore learning opportunities.",
      stats: {
        totalCourses: "Total Courses",
        totalInstructors: "Instructors",
        myProgress: "My Progress",
        certificates: "Certificates",
      },
    },
    fr: {
      welcome: "Bienvenue dans le Tableau de Bord E-Learning",
      description:
        "Gérez vos cours, suivez vos progrès et explorez les opportunités d'apprentissage.",
      stats: {
        totalCourses: "Total des Cours",
        totalInstructors: "Instructeurs",
        myProgress: "Mon Progrès",
        certificates: "Certificats",
      },
    },
    ar: {
      welcome: "مرحباً بك في لوحة تحكم التعليم الإلكتروني",
      description: "إدارة الدورات وتتبع التقدم واستكشاف فرص التعلم.",
      stats: {
        totalCourses: "إجمالي الدورات",
        totalInstructors: "المدرسون",
        myProgress: "تقدمي",
        certificates: "الشهادات",
      },
    },
  };

  const currentContent = content[language] || content.en;

  const stats = [
    { name: currentContent.stats.totalCourses, value: "24", icon: BookOpen },
    { name: currentContent.stats.totalInstructors, value: "12", icon: Users },
    { name: currentContent.stats.myProgress, value: "68%", icon: BarChart3 },
    {
      name: currentContent.stats.certificates,
      value: "3",
      icon: GraduationCap,
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {currentContent.welcome}
        </h1>
        <p className="text-gray-600">{currentContent.description}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="shrink-0">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <a
              href="/learn/dashboard/courses"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <BookOpen className="h-5 w-5 text-blue-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">
                Browse Courses
              </span>
            </a>
            <a
              href="/learn/dashboard/my-learning"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <GraduationCap className="h-5 w-5 text-green-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">
                Continue Learning
              </span>
            </a>
            <a
              href="/learn/dashboard/instructors"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Users className="h-5 w-5 text-purple-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">
                Find Instructors
              </span>
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 rounded-lg bg-blue-50">
              <div className="shrink-0 w-2 h-2 bg-blue-600 rounded-full"></div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Completed React Basics
                </p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center p-3 rounded-lg bg-green-50">
              <div className="shrink-0 w-2 h-2 bg-green-600 rounded-full"></div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Enrolled in JavaScript Course
                </p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
            <div className="flex items-center p-3 rounded-lg bg-yellow-50">
              <div className="shrink-0 w-2 h-2 bg-yellow-600 rounded-full"></div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Achievement Unlocked
                </p>
                <p className="text-xs text-gray-500">3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
