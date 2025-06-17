import { Button, HStack } from "@chakra-ui/react"
import AuthPage from "./components/AuthPage"


const App = () => {
  return (
    <div>App</div>
  )
}
const Demo = () => {
  return (
    <HStack>
      <Toaster />
      <AuthPage/>
    </HStack>
  )
}

export default  App

