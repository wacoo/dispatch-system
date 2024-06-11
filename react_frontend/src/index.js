import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';
import { Provider } from "react-redux";
import store from './redux/store/store';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
const theme = createTheme({
  palette: {
    primary: {
      main: '#4286F5',
    },
    secondary: {
      main: '#ff00ff',
    },
  },
  typography: {
    h1: {
      fontSize: '3rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: '600'
    },
  },
})
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}> 
        <App />
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);

