
import { ChakraProvider, defaultSystem} from '@chakra-ui/react'
import { ColorModeProvider } from './color-mode'
import { Theme } from '../../theme/theme'

export function Provider(props) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}
