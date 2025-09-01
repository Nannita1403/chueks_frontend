import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import UsersProvider from './providers/UsersProviders';
import ElementsProvider from './providers/ElementsProviders';
import ProductsProvider from './providers/ProductsProviders';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { themeSystem } from './theme/theme';
import { AuthProvider } from '../src/context/Auth/auth.context.jsx';
import CategoriesProvider from './providers/CategoriesProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode>
    <ColorModeScript initialColorMode={themeSystem.config.initialColorMode}/>
        <ChakraProvider theme={themeSystem}>
            <Router>
               <AuthProvider> 
                  <UsersProvider>            
                    <ElementsProvider>
                        <CategoriesProvider>
                        <ProductsProvider>
                            <App/>  
                        </ProductsProvider>
                        </CategoriesProvider>
                    </ElementsProvider>
                  </UsersProvider>    
                </AuthProvider>
            </Router>
        </ChakraProvider>
</React.StrictMode>
);
