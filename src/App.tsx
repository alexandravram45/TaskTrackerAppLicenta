  import React, { useEffect, useState } from 'react';
  import AppMenuBar from './components/AppMenuBar';
  import { ThemeProvider, TypeBackground, createTheme } from '@mui/material/styles';
  import axios from 'axios';
  import Home from './components/Home';
  import { useDispatch, useSelector } from 'react-redux';
  import { AppState, setCurrentUser } from './store';
    import LandingPage from './components/LandingPage';
  import styled from 'styled-components';
  import { CircularProgress, CssBaseline, Switch } from '@mui/material';
  import { useNavigate } from 'react-router';

  export interface User {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    color: string;
  }

  const App: React.FC = () => {

   
    const [user, setUser] = useState<User | null>(null);

    const [loading, setLoading] = useState(true);

    const currentUser = useSelector((state: AppState) => state.currentUser);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const authToken = localStorage.getItem('authToken');

    const saveThemePreference = (toggleDarkMode: Boolean) => {
      localStorage.setItem('themePreference', toggleDarkMode ? 'dark' : 'light');
    };
    
    const loadThemePreference = () => {
      const themePreference = localStorage.getItem('themePreference');

      if (themePreference === null) {
        return false; // Dacă nu este setată, întoarceți false (theme light)
      } else {
        return themePreference === 'dark'; // Altfel, întoarceți preferința salvată
      }
    };

    const initialThemePreference = loadThemePreference();

    const [toggleDarkMode, setToggleDarkMode] = useState(initialThemePreference);

    const toggleDarkModeHandler = () => {
      const newToggleDarkMode = !toggleDarkMode;
      setToggleDarkMode(newToggleDarkMode);
      saveThemePreference(newToggleDarkMode);  
    };

    useEffect(() => {
      console.log(authToken)
    
      if (authToken) {
        axios.get("http://localhost:5000/profile", {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res);
          console.log(res.data.user.username);

          const userData = {
            id: res.data.user._id,
            username: res.data.user.username,
            firstName: res.data.user.firstName,
            lastName: res.data.user.lastName,
            email: res.data.user.email,
            color: res.data.user.color,
          };

          setUser(userData)
          setLoading(false);
          dispatch(setCurrentUser(userData))
        })
        .catch((err) => {
          console.log(err);
          setLoading(false); 
        });
      } else {
        navigate('/landing')
        setLoading(false); 
      }
    }, [authToken]); 


    if (loading) {
      return <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', 
    }}>
        <CircularProgress style={{ color: 'rgba(14, 14, 14, 0.358)' }} />
    </div>;
    
    }

    const theme = createTheme({
      palette: {
        mode: toggleDarkMode ? 'dark' : 'light',
        // primary: {
        //   main: darkThemeColors.primary,
        // },
        // secondary: {
        //   main: darkThemeColors.secondary,
        // },
        // background: {
        //   paper: toggleDarkMode ? '#2a2a2a' : '#ebecf0',
        // },
      },
      typography: {
        fontFamily: 'Poppins, sans-serif',
      },
    });
   
    return (

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppMenuBar toggleDarkMode={toggleDarkMode} onToggleDarkMode={toggleDarkModeHandler} />
        { user?.id
          ? <Home user={user}/>
          : <LandingPage />
        }

      </ThemeProvider>

    );
  };

  export default App;
