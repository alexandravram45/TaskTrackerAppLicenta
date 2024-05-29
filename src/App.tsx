import React, { useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from './store';
import Router from './components/Router';

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
      if (error.config.url !== '/profile') { // Avoid infinite loop
        window.location.href = '/landing';
      }
    }
    return Promise.reject(error);
  }
);

  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/profile');
        const userData: User = {
          id: res.data.user._id,
          username: res.data.user.username,
          firstName: res.data.user.firstName,
          lastName: res.data.user.lastName,
          email: res.data.user.email,
          color: res.data.user.color,
        };
        
        dispatch(setCurrentUser(userData));

      } catch (err) {
        console.log(err);

      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [ ]);


  const theme = createTheme({
    typography: {
      fontFamily: 'Poppins, sans-serif',
    },
  });

 
 
  return (
    // <AuthProvider>
      <ThemeProvider theme={theme}>
          <Router  />

      </ThemeProvider>
    // </AuthProvider>

  );
};

export default App;