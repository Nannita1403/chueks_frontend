import { HStack } from "@chakra-ui/react"
import { Route, Routes, useNavigate } from "react-router-dom"
import { useContext, useEffect } from "react"
import { UsersContext } from "./providers/UsersProviders"
import { ElementsContext } from "./providers/ElementsProviders"
import { ProductsContext } from "./providers/ProductsProviders"
import Loading from "./components/Loading/Loading"
import VerifyAccount from "./pages/VerifyAccount/VerifyAccount"
import { checkSession } from "./reducers/users/users.actions"
import Home from "./pages/User/Home/Home"
import AuthPage from "./pages/Auth/AuthPage"


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
        <Route path="/" element={<Home/>}/>
        <Route path="/register" element={<AuthPage/>}/>
        <Route path="/login" element={<AuthPage/>}/>
        <Route path="/verifyaccount" element={<VerifyAccount/>} />
        <Route path="/verifyaccount/:id/:token" element={<VerifyAccount/>} />
      </Routes>
    </HStack>
    </>
  );
};

export default  App

