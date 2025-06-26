import { Button, HStack } from "@chakra-ui/react"
import AuthPage from "./components/AuthPage"


const App = () => {
  return (
    <HStack>
      <Toaster />
      <AuthPage/>
    </HStack>
  )
}

export default  App

