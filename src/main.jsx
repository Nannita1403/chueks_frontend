import {Provider} from "../src/components/ui/provider.jsx"
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import theme from "./theme/theme.jsx";


createRoot(document.getElementById('root')).render(
    <Provider theme={theme}>
    <App />
    </Provider>
    );
