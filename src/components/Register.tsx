import React, { useState } from 'react';
import { InputAdornment, Link, Slide, TextField, Typography } from '@mui/material';
import { StyledButton } from './AppMenuBar';
import styled from 'styled-components';
import KeyIcon from '@mui/icons-material/Key';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import { toast } from 'react-toastify';
import axios from 'axios';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import { useDispatch, useSelector } from 'react-redux';
import { registerAction, AppState } from '../store';


interface RegisterProps {
    handleToggle: () => void
}

const RegisterContainer = styled.div`
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`;

const Register:React.FC<RegisterProps> = ({ handleToggle }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');

const dispatch = useDispatch();
  

const handleRegister = async (e: React.MouseEvent<HTMLElement>)  => {
    e.preventDefault()
    await axios.post('http://localhost:5000/user/register', {
      username: username,
      password: password,
      email: email
    })
      .then(function (response) {
          console.log(response.data)
          localStorage.setItem('authToken', response.data.token)
          toast.success('Register succesfully!', {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            progress: undefined,
            draggable: true,
            theme: "light",
            });
            setUsername('')
            setEmail('')
            setPassword('')

            dispatch(registerAction());

      })
      .catch(function (error) {
          console.log(error.message);
      })
  };

  const isRegistered = useSelector((state: AppState) => state.isRegistered);

  return (
    <Slide in={true} direction="left" unmountOnExit>
    <RegisterContainer>
        <Typography variant="h5" style={{color: '#5B42F3', fontWeight: '700', fontFamily: 'Poppins'}}>Register</Typography>
        <TextField id="username" label="username" variant="standard" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                <InsertEmoticonIcon />
                </InputAdornment>
            ),
            }} />
        <TextField id="email" label="email" variant="standard" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                <AlternateEmailIcon />
                </InputAdornment>
            ),
            }} />
        
        <TextField id="password" label="password" type="password" variant="standard" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                <KeyIcon />
                </InputAdornment>
            ),
            }}/>
        <StyledButton onClick={handleRegister}>
            <span>Register</span>
        </StyledButton>
        <Link component="button" onClick={handleToggle} style={{color: '#5B42F3'}} underline="hover">
            {
                isRegistered ? (
                    "<- Return to Login"
                ) : "Already have an account?"
            }
        </Link>
    </RegisterContainer>
    </Slide>
  );
}

export default Register;
