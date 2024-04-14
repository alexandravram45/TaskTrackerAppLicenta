import { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Typography
} from '@mui/material';
import styled, { keyframes } from 'styled-components';
import AppMenuBar, { StyledButton } from './AppMenuBar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { loginAction } from '../store';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import LoadingCircle from './LoadingCircle'

import { Formik, Form, Field, useFormik } from 'formik';
import * as Yup from 'yup';


const MainContainer = styled.div`
  display: flex;
  margin-top: 50px;
  padding: 20px;
  align-items: center;
  justify-content: space-between;
  background-repeat: no-repeat;
  background-size: cover;
`;

const LeftBox = styled(Box)`
  margin-left: 100px;
`;

const RightBox = styled(Box)`
  flex: 0 0 48%;
`;

const StyledImage = styled.img`
  width: 100%;
  height: auto;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 50px;
  padding: 100px;
  align-items: center;
  text-align: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    z-index: -1;
    background-color: red;
    inset: 0;
    transform: skewY(-5deg);
    background-image: linear-gradient(45deg, #12c2e2, #c471ed, #f64f59);

  }
`;


const flyAnimation = keyframes`
  from {
    transform: translateY(0.1em);
  }
  to {
    transform: translateY(-0.1em);
  }
`;

const ButtonStart = styled.button`
  font-family: inherit;
  font-size: 20px;
  background-color:#12c2e2 ;
  color: white;
  padding: 0.7em 1em;
  padding-left: 0.9em;
  display: flex;
  align-items: center;
  border: none;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s;
  cursor: pointer;
  width: 200px;
  margin-top: 20px;

  &:hover .svg-wrapper {
    animation: ${flyAnimation} 0.6s ease-in-out infinite alternate;
  }

  &:hover svg {
    transform: translateX(1.2em) rotate(45deg) scale(1.1);
  }

  &:hover span {
    transform: translateX(10em);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Span = styled.span`
  display: block;
  margin-left: 0.3em;
  transition: all 0.3s ease-in-out;
  font-weight: bold;
`;

const Svg = styled.svg`
  display: block;
  transform-origin: center center;
  transition: transform 0.3s ease-in-out;
`;


const LandingPage = () => {
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState("")


  const dispatch = useDispatch();
  const navigate = useNavigate();

  
  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required('username is required'),
      password: Yup.string()
      .required('password is required'),
  });
  
  let initialValues = {
    username: "",
    password: "",
  };
  
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      handleLogin(values.username, values.password)
    }
  })


  const handleLogin = async (username: String, password: String) => {
    setIsLoading(true)
  
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
  
      dispatch(loginAction(response.data.user))

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

      setTimeout(() => {
        setIsLoading(false)
        navigate('/boards')
      }, 1500)

      
    } catch (error) {
      console.log(error);
    } 
  };

  const [user, setUser] = useState({
    id: "",
    username: "",
    email: "",
    color: "",
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
          color: res.data.user.color,
        })
        console.log(user)
      })
      .catch((err) => {
        console.log(err);
      });
  }
}, [user.id]);

  return (
    <div>
      <AppMenuBar user={user} />

      <MainContainer>
        <LeftBox>
          <Typography variant='h4' sx={{ color: '#f64f59' }}>Make your life easier</Typography>
          <Typography variant='h1' sx={{ fontWeight: '900', fontFamily: 'Poppins', color: '#001B79'}}>Best task</Typography>
          <Typography sx={{ fontSize: '100px', fontWeight: '700', fontFamily: 'Poppins', color: '#001B79'}}>tracking app</Typography>
          <Typography sx={{ typography: 'body2', fontWeight: 'regular', fontFamily: 'Poppins' }}>Effortlessly manage your tasks and boost your productivity with our intuitive drag-and-drop task tracking app. Our innovative design empowers you to seamlessly add, organize, and complete tasks, revolutionizing the way you approach productivity.</Typography>
          <ButtonStart>
            <div className='svg-wrapper-1'>
              <div className='svg-wrapper'>
                <Svg xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24">
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path
                    fill="currentColor"
                    d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                  ></path>
                </Svg>
              </div>
            </div>
            <Span>
              START
            </Span>
          </ButtonStart>
        </LeftBox>
        <RightBox>
          <StyledImage src={require('../person-tasks2.png')} />
        </RightBox>
      </MainContainer>
      <LoginContainer>
        <Typography variant='h5' sx={{ fontFamily: 'Poppins', color: 'white' }}>Login</Typography>
        <Typography sx={{ fontFamily: 'Poppins', color: 'white', fontWeight: '100' }}>Welcome back, please login</Typography>
        <form
          style={{ textAlign: 'center', display: 'flex', flexDirection: "column", alignItems: "center", gap: '20px'}}
          onSubmit={formik.handleSubmit}
        >
          <TextField id="username" name='username' label="username" variant="filled" 
            value={formik.values.username} 
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={error !== "" || formik.touched.username && Boolean(formik.errors.username)}
            helperText={error || formik.touched.username && formik.errors.username}
            sx={{
              '& input, & label': {
                color: 'white',
              },
              width: 230
            }}

          />
          
          <TextField id="password" label="password" name="password" variant="filled" type='password' 
             value={formik.values.password} 
             onChange={formik.handleChange}
             onBlur={formik.handleBlur}
             error={error !== "" || formik.touched.password && Boolean(formik.errors.password)}
             helperText={error || formik.touched.password && formik.errors.password}
            sx={{
              '& input, & label': {
                color: 'white',
              },
              width: 230
            }}
          />
          { loading && <LoadingCircle /> }
          <StyledButton type='submit'>
            <span>
            Login
            </span>
          </StyledButton>
        </form>
        
      </LoginContainer>
    </div>
  );
};

export default LandingPage;
