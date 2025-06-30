import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from './components/ui/provider'; // Tu provider personalizado
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import UsersProvider from './providers/UsersProviders';
import ElementsProvider from './providers/ElementsProviders';
import ProductsProvider from './providers/ProductsProviders';

ReactDOM.createRoot(document.getElementById('root')).render(
<Provider>
    <Router>
        <UsersProvider>
            <ElementsProvider>
                <ProductsProvider>
                    <App/>  
                </ProductsProvider>
            </ElementsProvider>
        </UsersProvider>
    </Router>
</Provider>
);
