import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-lazy-load-image-component/src/effects/blur.css';

import AuthContextProvider from './store/auth-context';
import KeyContextProvider from './store/key-management-context';

ReactDOM.render(
  <AuthContextProvider>
    <KeyContextProvider>
      <BrowserRouter>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </BrowserRouter>
    </KeyContextProvider>
  </AuthContextProvider>,
  document.getElementById('root')
);
