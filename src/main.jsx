import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from './components/ui/provider'; // Tu provider personalizado
"import AuthPage from './components/Auth Page/AuthPage';"
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
      <Provider>
        <App/>
      </Provider>
  </Router>
);
