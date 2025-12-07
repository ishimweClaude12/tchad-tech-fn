import { Outlet } from "react-router-dom";

const ShopLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Shop Section Header */}
      <Outlet />
    </div>
  );
};

export default ShopLayout;
