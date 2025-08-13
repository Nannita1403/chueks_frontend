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



const App = () => {
/*  const {
    state: { loading },
    dispatch,
  } = useContext(UsersContext);
  const {
    state: { loading: loadingElements },
  } = useContext(ElementsContext);
  const {
    state: { loading: loadingProducts },
  } = useContext(ProductsContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.location.pathname.includes("/verifyAccount/")) {
      checkSession (dispatch, navigate);
    }
  }, []);
*/

  return (
  //  <>
  // {(loading || loadingProducts || loadingElements) && <Loading/>}
 <Box minH="100vh">
      <Routes>
        {/* Auth Routes */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/product/:id"
          element={
            <ProtectedRoute>
              <ProductDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/category/:id"
          element={
            <ProtectedRoute>
              <CategoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/wishlist"
          element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/cart"
          element={
            <ProtectedRoute>
              <CartPage />
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
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Box>
  )
}

export default  App

