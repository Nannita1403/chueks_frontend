import { Box } from "@chakra-ui/react"
import Loading from "../../components/Loading/Loading,jsx"

const LoadingPage = () => {
  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <Loading />
    </Box>
  )
}

export default LoadingPage