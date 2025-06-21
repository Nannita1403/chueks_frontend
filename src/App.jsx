import { HStack } from "@chakra-ui/react"

import { Toaster } from "./components/ui/toaster"
import AuthPage from "./pages/Auth/AuthPage"


const App = () => {
  return (
    <HStack>
      <Toaster/>
      <AuthPage/>
    </HStack>
  )
}

export default  App

