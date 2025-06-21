import { HStack } from "@chakra-ui/react"
import AuthPage from "./pages/Auth Page/AuthPage"
import { Toaster } from "./components/ui/toaster"


const App = () => {
  return (
    <HStack>
      <Toaster/>
      <AuthPage/>
    </HStack>
  )
}

export default  App

