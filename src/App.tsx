import React, { useEffect, useState } from 'react';
import AppMenuBar from './components/AppMenuBar';
import theme from './theme';
import { ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import Home from './components/Home';

const App: React.FC = () => {

  const [user, setUser] = useState({
    id: "",
    username: "",
    email: "",
  })

useEffect(() => {
  const authToken = localStorage.getItem('authToken');
  
  if (authToken) {
    axios.get("http://localhost:5000/profile", {
      withCredentials: true,
    })
      .then((res) => {
        console.log(res);
        console.log(res.data.user.username);
        setUser({
          id: res.data.user._id,
          username: res.data.user.username,
          email: res.data.user.email,
        })
        console.log(user)
      })
      .catch((err) => {
        console.log(err);
      });
  }
}, [user.username]);


  return (
      <ThemeProvider theme={theme}>
        <AppMenuBar user={user} />
        <Home />
      </ThemeProvider>
  );
};

export default App;