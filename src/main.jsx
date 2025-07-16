import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import UsersProvider from './providers/UsersProviders';
import ElementsProvider from './providers/ElementsProviders';
import ProductsProvider from './providers/ProductsProviders';
import { ChakraProvider } from '@chakra-ui/react';
import { Theme } from './theme/theme';

ReactDOM.createRoot(document.getElementById('root')).render(
<ChakraProvider theme={Theme}>
    <Router>
        <UsersProvider>
            <ElementsProvider>
                <ProductsProvider>
                    <App/>  
                </ProductsProvider>
            </ElementsProvider>
        </UsersProvider>
    </Router>
</ChakraProvider>
);
