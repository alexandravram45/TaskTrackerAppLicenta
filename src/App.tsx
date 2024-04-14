import React, { useEffect, useState } from 'react';
import AppMenuBar from './components/AppMenuBar';
import theme from './theme';
import { ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import Home from './components/Home';
import { useDispatch, useSelector } from 'react-redux';
import { AppState, setCurrentUser } from './store';
  import LandingPage from './components/LandingPage';
import styled from 'styled-components';
import { CircularProgress } from '@mui/material';

const Loading = styled.div`
  height: 100vh;
  background: rgb(145,167,244);
  background: linear-gradient(23deg, rgba(145,167,244,0.6811974789915967) 0%, rgba(255,77,157,1) 100%);
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export interface User {
  id: string;
  username: string;
  email: string;
  color: string;
}

const App: React.FC = () => {

  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);
  const currentUser = useSelector((state: AppState) => state.currentUser);
  const dispatch = useDispatch()

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
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
      setLoading(false); 
    }
  }, [user?.id]); 

  useEffect(() => {
    console.log()
  })

  if (loading) {
    return <Loading> 
      <CircularProgress  style={{ color: 'whitesmoke' }}/>
    </Loading>; 
  }

  return (

    <ThemeProvider theme={theme}>
      {user && <AppMenuBar user={user} /> }
      { user?.id
        ? <Home user={user} />
        : <LandingPage /> 
      }
    </ThemeProvider>

  );
};

export default App;
