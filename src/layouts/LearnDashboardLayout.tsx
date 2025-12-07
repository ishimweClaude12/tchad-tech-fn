import { Outlet } from "react-router-dom";

const LearnDashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Learn Dashboard Section Header */}
      <Outlet />
    </div>
  );
};

export default LearnDashboardLayout;
