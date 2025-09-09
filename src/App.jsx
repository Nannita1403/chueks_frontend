import { Box } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthPage from "./pages/Auth/AuthPage.jsx";
import Home from "./pages/User/Home/Home.jsx";
import ProductDetail from "./pages/User/Product/Product.jsx";
import CategoryPage from "./pages/User/Category/Category.jsx";
import AdminDashboard from "./pages/Admin/DashboardAdmin/DashboardAdmin.jsx";
import AdminProducts from "./pages/Admin/Products/Products.jsx";
import AdminCategories from "./pages/Admin/Categories/Categories.jsx";
import AnalyticsPage from "./pages/Admin/Analytics/Analytics.jsx";
import ProtectedRoute from "./components/ProtectedRoutes/ProtectedRoute.jsx";
import AdminLayout from "./pages/Admin/Layout/AdminLayout.jsx";
import Cart from "./pages/User/Cart/Cart.jsx";
import OrdersPageUser from "./pages/User/Order/OrdersPageUser.jsx";
import OrdersPageAdmin from "./pages/Admin/Orders/OrdersPageAdmin.jsx";
import UserLayout from "./pages/User/UserLayout.jsx";
import ProfileDashboard from "./pages/User/Profile/ProfileDashboard.jsx";
import Wishlist from "./pages/User/Wishlist/Wishlist.jsx";
import OrderConfirm from "./pages/User/Order/OrderConfirm.jsx";

const App = () => {
  return (
    <Box minH="100vh">
      <Routes>
        {/* Auth Routes */}
        <Route path="/auth" element={<AuthPage />} />

        {/* User Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProtectedRoute>
              <ProductDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/category/:id"
          element={
            <ProtectedRoute>
              <CategoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
       {/* ✅ Rutas protegidas del perfil */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ProfileDashboard />} />
        <Route path="orders" element={<OrdersPageUser />} />
      </Route>

      <Route
        path="/order/confirm"
        element={
          <ProtectedRoute>
            <OrderConfirm/>
          </ProtectedRoute>
        }
      />

        {/* Protected admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="orders" element={<OrdersPageAdmin />} />
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/home" replace />} />
      </Routes>
    </Box>
  );
};

export default App;
