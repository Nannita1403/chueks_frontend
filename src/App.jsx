import { Button, HStack } from "@chakra-ui/react"
import AuthPage from "./components/Auth Page/AuthPage"
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

