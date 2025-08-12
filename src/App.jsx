import { HStack } from "@chakra-ui/react"
import { Navigate, Route, Routes, useNavigate } from "react-router-dom"
import { useContext, useEffect } from "react"
import { UsersContext } from "./providers/UsersProviders"
import { ElementsContext } from "./providers/ElementsProviders"
import { ProductsContext } from "./providers/ProductsProviders"
import Loading from "./components/Loading/Loading"
import VerifyAccount from "./pages/VerifyAccount/VerifyAccount"
import { checkSession } from "./reducers/users/users.actions"
import Home from "./pages/User/Home/Home"
import AuthPage from "./pages/Auth/AuthPage"
import Cart from "./pages/User/Cart/Cart"
import Category from "./pages/User/Category/Category"
import Product from "./pages/User/Product/Product"
import Wishlist from "./pages/User/Wishlist/Wishlist"
import DashboardAdmin from "./pages/Admin/DashboardAdmin/DashboardAdmin"
import Categories from "./pages/Admin/Categories/Categories"
//import Customers from "./pages/Admin/Customers/Customers"
//import Analytics from "./pages/Admin/Analytics/Analytics"
//import Orders from "./pages/Admin/Orders/Orders"
import Products from "./pages/Admin/Products/Products"


const App = () => {
  const {
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


  return (
    <>
    {(loading || loadingProducts || loadingElements) && <Loading/>}
    <HStack>
      <Routes>
        {/* Auth Routes */}
        <Route path="/register" element={<AuthPage/>}/>
        <Route path="/login" element={<AuthPage/>}/>
        <Route path="/verifyaccount" element={<VerifyAccount/>} />
        <Route path="/verifyaccount/:id/:token" element={<VerifyAccount />} />
        {/* Dashboard User Routes */}
        <Route path="/dashboard" element={<Home/>}/>
        <Route path="/dashboard/cart" element={<Cart/>} />
        <Route path="/dashboard/category/:id" element={<Category/>} />
        <Route path="/dashboard/product/:id" element={<Product/>} />
        <Route path="/dashboard/wishlist" element={<Wishlist/>} />
        {/* Admin Routes */}
        <Route path="/admin" element={<DashboardAdmin/>} />
        <Route path="/admin/categories" element={<Categories/>} />
        {/* <Route path="/admin-customers" element={<Customers/>} />*/}
        {/* <Route path="/admin-analytics" element={<Analytics/>} />*/}
        {/* <Route path="/admin-orders" element={<Orders/>} />*/}
        <Route path="/admin/products" element={<Products/>} />
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </HStack>
    </>
  );
};

export default  App

