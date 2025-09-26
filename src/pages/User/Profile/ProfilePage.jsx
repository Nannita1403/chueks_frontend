import { Routes, Route } from "react-router-dom";
import UserLayout from "../UserLayout.jsx";

import ProfileDashboard from "../Profile/ProfileDashboard.jsx";
import OrdersPage from "../Order/OrdersPage.jsx";

const ProfilePage = () => {
  return (
    <Routes>
      <Route path="/" element={<UserLayout />}>
        <Route index element={<ProfileDashboard />} />
        <Route path="orders" element={<OrdersPage />} />
      </Route>
    </Routes>
  );
};

export default ProfilePage;
