import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography
} from '@mui/material';
import styled, { keyframes } from 'styled-components';
import { StyledButton } from './AppMenuBar';

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
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
        <TextField id="email" label="email" variant="filled" value={email} onChange={(e) => setEmail(e.target.value)}
          sx={{
            '& input, & label': {
              color: 'white',
            },
          }}
        />
        <TextField id="password" label="password" variant="filled" type='password' value={password} onChange={(e) => setPassword(e.target.value)}
          sx={{
            '& input, & label': {
              color: 'white',
            },
          }}
        />
        <Button variant="contained"
          sx={{
            backgroundColor: '#f64f59',
            '&:hover': {
              backgroundColor: 'white',
              color: '#f64f59'
            },
            fontWeight: 'bold',
            fontFamily: 'Poppins',
            padding: 2
          }}>
          Login
        </Button>
      </LoginContainer>
    </>
  );
};

export default LandingPage;
