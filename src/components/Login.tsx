import React, { useState } from 'react';
import { InputAdornment, Link, Slide, TextField, Typography } from '@mui/material';
import { StyledButton } from './AppMenuBar'; // Import your StyledButton component
import styled from 'styled-components';
import KeyIcon from '@mui/icons-material/Key';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import { toast } from 'react-toastify';
import axios from 'axios';

import { useDispatch } from 'react-redux';
import { loginAction } from '../store';


interface LoginProps {
  handleToggle: () => void
}

const LoginContainer = styled.div`
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`;

const Login:React.FC<LoginProps> = ({ handleToggle }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const dispatch = useDispatch();

  const handleLogin = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:5000/user/login', {
        username: username,
        password: password,
      });
  
      console.log("res from login: ", response.data);
      console.log(response.data.token);
  
      const token = response.data.token;
  
      // Set the received token as a cookie
      document.cookie = `SessionID=${token}; Max-Age=1200; Path=/; Secure; SameSite=None`;
  
      toast.success('Logged in successfully!', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        draggable: true,
        theme: "light",
      });
  
      setUsername('');
      setPassword('');

      dispatch(loginAction())
      setTimeout(() => {
          window.location.reload();
        }, 100);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Slide in={true} direction="right" unmountOnExit>
    <LoginContainer>
      <Typography variant="h5" style={{color: '#5B42F3', fontWeight: '700', fontFamily: 'Poppins' }}>Login</Typography>
        <TextField id="username" label="username" variant="standard" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                <InsertEmoticonIcon />
                </InputAdornment>
            ),
            }}  />
        <TextField id="password" label="password" type="password" variant="standard" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                <KeyIcon />
                </InputAdornment>
            ),
            }}  />
        <StyledButton onClick={handleLogin}>
            <span>Log in</span>
        </StyledButton>
        <Link component="button" onClick={handleToggle} style={{color: '#5B42F3'}} underline="hover">
            Don't have an account?
        </Link>
    </LoginContainer>
    </Slide>
  );
}

export default Login;
