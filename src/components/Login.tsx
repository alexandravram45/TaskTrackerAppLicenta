import React, { useState } from 'react';
import { InputAdornment, Link, Slide, TextField, Typography } from '@mui/material';
import { StyledButton } from './AppMenuBar';
import styled from 'styled-components';
import KeyIcon from '@mui/icons-material/Key';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { loginAction, setCurrentUser } from '../store';
import { useLocation, useNavigate, useParams } from 'react-router';


interface LoginProps {
  handleToggle: () => void,
  handleToggleReset: () => void,
  boardId: string
}

const LoginContainer = styled.div`
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`;

const Login:React.FC<LoginProps> = ({ handleToggle, boardId, handleToggleReset }) => {

  const [error, setError] = useState("")
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const params = useParams()

  const handleLogin = async (username: String, password: String) => {
      await axios.post('/user/login', {
        username: username,
        password: password,
      })
      .then((response) => {
        const token = response.data.token;
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
    
        setError('');
        formik.resetForm();
  
        dispatch(setCurrentUser(response.data.user))  
        dispatch(loginAction(response.data.user))

        const userId = response.data.user.id;

        if (location.pathname.includes('join')){
          axios.get(`/board/${params.boardId}/join/${userId}`)
          .then((res) => {
              console.log(res)
          })
          .catch((err) => {
              console.log(err)
          })
          navigate(`/home/boards/${boardId}`)
        } else {
          navigate("/home/boards")
        }
      })
      .catch((err) => {
        setError(err.response?.data.message)
      });
  };

  
  const validationSchema = Yup.object().shape({
    loginUsername: Yup.string()
      .required('username is required'),
      loginPassword: Yup.string()
      .required('password is required'),
  });
  
  let initialValues = {
    loginUsername: "",
    loginPassword: "",
  };
  
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      handleLogin(values.loginUsername, values.loginPassword)
    }
  })

  return (
    <Slide in={true} direction="right" unmountOnExit>
    <LoginContainer>
      <Typography variant="h5" style={{color: '#5B42F3', fontWeight: '700', fontFamily: 'Poppins' }}>Login</Typography>
      <form 
          style={{ textAlign: 'center', display: 'flex', flexDirection: "column", alignItems: "center", gap: '20px'}}
          onSubmit={formik.handleSubmit}
        >  
        <TextField id="loginUsername" name="loginUsername" label="username" variant="standard" 
            value={formik.values.loginUsername} 
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={error !== "" || formik.touched.loginUsername && Boolean(formik.errors.loginUsername)}
            helperText={error || formik.touched.loginUsername && formik.errors.loginUsername}
            InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                  <InsertEmoticonIcon />
                </InputAdornment>
            ),
            }}  
            style={{ width: 230 }}
        />
        <TextField id="loginPassword" name='loginPassword' label="password" type="password" variant="standard" 
            value={formik.values.loginPassword} 
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={error !== "" || formik.touched.loginPassword && Boolean(formik.errors.loginPassword)}
            helperText={error || formik.touched.loginPassword && formik.errors.loginPassword}
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
            <span>Log in</span>
        </StyledButton>
      </form>

        <Link component="button" onClick={handleToggleReset} style={{color: '#5B42F3'}} underline="hover">
            Forgot password?
        </Link>
        <Link component="button" onClick={handleToggle} style={{color: '#5B42F3'}} underline="hover">
            Don't have an account?
        </Link>

    </LoginContainer>
    </Slide>
  );
}

export default Login;
