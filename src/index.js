import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './App/store';
import { SnackbarProvider } from 'notistack';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <SnackbarProvider anchorOrigin={{vertical:'bottom', horizontal:'right'}}>
        <App />
      </SnackbarProvider>
    </Provider>
  // </React.StrictMode> 
);

reportWebVitals();
