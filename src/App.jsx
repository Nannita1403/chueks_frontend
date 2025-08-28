import { Box } from "@chakra-ui/react"
import { Navigate, Route, Routes } from "react-router-dom"
import AuthPage from "./pages/Auth/AuthPage.jsx"
import Home from "./pages/User/Home/Home.jsx"
import ProductDetail from "./pages/User/Product/Product.jsx"
import CategoryPage from "./pages/User/Category/Category.jsx"
import WishlistPage from "./pages/User/Wishlist/Wishlist.jsx"
import CartPage from "./pages/User/Cart/Cart.jsx"
import AdminDashboard from "./pages/admin/DashboardAdmin/DashboardAdmin.jsx"
import AdminProducts from "./pages/admin/Products/Products.jsx"
import AdminCategories from "./pages/admin/Categories/Categories.jsx"
import AnalyticsPage from "./pages/admin/Analytics/Analytics.jsx"
import OrdersPage from "./pages/admin/Orders/Orders.jsx"
import ProtectedRoute from "./components/ProtectedRoutes/ProtectedRoute.jsx"
import ProfilePage from "./pages/User/Profile/Profile.jsx"
import AdminLayout from "./pages/Admin/Layout/AdminLayout.jsx"



const App = () => {
  return (

 <Box minH="100vh">
      <Routes>
        {/* Auth Routes */}
        <Route path="/auth" element={<AuthPage/>} />

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
          <WishlistPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/cart"
      element={
        <ProtectedRoute>
         <CartPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
        <ProfilePage /> 
        </ProtectedRoute>
      }
    />
{/* Protected admin routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route path="" element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="orders" element={<OrdersPage />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/home" replace />} />
      </Routes>
    </Box>
  )
}

export default  App

