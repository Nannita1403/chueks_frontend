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

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminCategories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute adminOnly={true}>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute adminOnly={true}>
              <OrdersPage />
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

