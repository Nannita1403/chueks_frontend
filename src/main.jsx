import {Provider} from "../src/components/ui/provider.jsx"
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ChakraProvider } from "@chakra-ui/react"

createRoot(document.getElementById('root')).render(<Provider>
    <App />
    </Provider>)
