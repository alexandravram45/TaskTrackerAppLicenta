import React, { useState } from 'react';
import { Button, InputAdornment, Link, Slide, TextField, Typography } from '@mui/material';
import { StyledButton } from './AppMenuBar';
import styled from 'styled-components';
import KeyIcon from '@mui/icons-material/Key';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import { toast } from 'react-toastify';
import axios from 'axios';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useDispatch, useSelector } from 'react-redux';
import { registerAction, AppState } from '../store';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';



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


const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Enter a valid email")
      .required('email is required'),
    username: Yup.string()
      .min(6, 'username must contain at least 6 characters')
      .max(50, 'username is too long!')
      .required('username is required'),
    password: Yup.string()
      .min(6, 'password must contain at least 6 characters')
      .max(50, 'password is too long!')
      .required('password is required'),
  });
  

const Register:React.FC<RegisterProps> = ({ handleToggle }) => {
    const [error, setError] = useState("")
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
        email: '',
        password: '',
        username: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleRegister(values.email, values.username, values.password)
        },
    });


    const handleRegister = async (email: String, username: String, password: String)  => {
        await axios.post('http://localhost:5000/user/register', {
        username: username,
        password: password,
        email: email
        })
        .then(function (response) {
            console.log(response.data)
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

                dispatch(registerAction());

        })
        .catch(function (error) {
            console.log(error.message);
            setError(error.response?.data.message)
        })
    };

    const resendEmail = () => {

    }
    
    const isRegistered = useSelector((state: AppState) => state.isRegistered);

  return (
    <Slide in={true} direction="left" unmountOnExit>
    <RegisterContainer>
        {!isRegistered ? (
            <>
                <Typography variant="h5" style={{color: '#5B42F3', fontWeight: '700', fontFamily: 'Poppins'}}>Register</Typography>
                <form 
                style={{ textAlign: 'center', display: 'flex', flexDirection: "column", alignItems: "center", gap: '20px'}}
                onSubmit={formik.handleSubmit}
                > 
                <TextField id="username" name='username' label="username" variant="standard" 
                    value={formik.values.username} 
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.username && Boolean(formik.errors.username)}
                    helperText={formik.touched.username && formik.errors.username}
                    InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                        <InsertEmoticonIcon />
                        </InputAdornment>
                    ),
                    }} 
                    style={{ width: 230 }}
                />
                <TextField id="email" name='email' label="email" variant="standard"
                    value={formik.values.email} 
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={error !== "" || formik.touched.email && Boolean(formik.errors.email)}
                    helperText={error || formik.touched.email && formik.errors.email}
                    InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                        <AlternateEmailIcon />
                        </InputAdornment>
                    ),
                    }} 
                    style={{ width: 230 }}
                />
                
                <TextField id="password" label="password" name='password' type="password" variant="standard" 
                value={formik.values.password} 
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                    InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                        <KeyIcon />
                        </InputAdornment>
                    ),
                    }}
                    style={{ width: 230 }}
                />
                <StyledButton type='submit'>
                    <span>Register</span>
                </StyledButton>
                <Link component="button" onClick={handleToggle} style={{color: '#5B42F3'}} underline="hover">
                    Already have an account?
                </Link>
                </form>
            </>
        ) : (
            <>
                <Typography variant='h5'>Thank you for registering!</Typography>
                <CheckCircleIcon  style={{ color: '#5B42F3' }}/>
                <Typography variant='body2'>To complete the registration process, please verify your email address by clicking the link we've sent to your inbox.</Typography>
                <Button onClick={resendEmail} variant='text' style={{textTransform: 'none'}}>resend email</Button>
            </>
        )}
        
    </RegisterContainer>
    </Slide>
  );
}

export default Register;
