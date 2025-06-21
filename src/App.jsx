import { HStack } from "@chakra-ui/react"
import { Toaster } from "./components/ui/toaster"
import AuthPage from "./pages/Auth/AuthPage"
import { Route, Routes, useNavigate } from "react-router-dom"
import Home from "./pages/Home/Home"
import { useEffect } from "react"


const App = () => {
/*
  const navigate=useNavigate();

  useEffect(()=> {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, []);*/

  return (
    <HStack>
      <Toaster/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/register" element={<AuthPage/>}/>
        <Route path="/login" element={<AuthPage/>}/>
      </Routes>
    </HStack>
  )
}

export default  App

