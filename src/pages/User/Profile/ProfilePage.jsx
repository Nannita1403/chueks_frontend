import { Routes, Route } from "react-router-dom";
import UserLayout from "../UserLayout.jsx";

// Páginas internas
import ProfileDashboard from "../Profile/ProfileDashboard.jsx";
import OrdersPage from "../Order/OrdersPage.jsx";

const ProfilePage = () => {
  return (
    <UserLayout>
      <Routes>
        <Route path="/" element={<ProfileDashboard />} />
        <Route path="orders" element={<OrdersPage />} />
      </Routes>
    </UserLayout>
  );
};

export default ProfilePage;
