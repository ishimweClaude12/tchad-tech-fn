import { Outlet } from "react-router-dom";

const ShopDashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Shop Dashboard Section Header */}
      <Outlet />
    </div>
  );
};

export default ShopDashboardLayout;
