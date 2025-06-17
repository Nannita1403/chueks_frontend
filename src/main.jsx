// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from './components/ui/provider'; // Tu provider personalizado
"import AuthPage from './components/Auth Page/AuthPage';"
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <Provider>
        <App/>
      </Provider>
  </React.StrictMode>
);
