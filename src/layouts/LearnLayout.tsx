import { Outlet } from "react-router-dom";

const LearnLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Learn Section Header */}

      <Outlet />
    </div>
  );
};

export default LearnLayout;
