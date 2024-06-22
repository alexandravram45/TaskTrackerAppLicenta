import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';
import Router from './components/Router';
import { AuthProvider } from './components/AuthProvider';

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  color: string;
}

const App: React.FC = () => {

  axios.interceptors.request.use(
    config => {
        config.withCredentials = true;
        config.baseURL = 'http://localhost:5000'
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      if (error.config.url !== '/profile') { 
        window.location.href = '/landing';
      }
    }
    return Promise.reject(error);
  }
);

  const theme = createTheme({
    typography: {
      fontFamily: 'Poppins, sans-serif',
    },
  });
 
  return (
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <Router  />
        </AuthProvider>
      </ThemeProvider>
  );
};

export default App;