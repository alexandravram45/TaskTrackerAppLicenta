import { useEffect, useState, useRef } from 'react';
import {
  Box,
  Button,
  Card,
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
// import Logo from "./layered-waves-haikei.js";
import { Formik, Form, Field, useFormik } from 'formik';
import * as Yup from 'yup';
import {motion} from 'framer-motion'
import { fadeIn } from '../variants';
import {ReactTyped} from "react-typed";
import AnimatedNumbers from "react-animated-numbers";
import { useInView } from "react-intersection-observer";
import CountUp from 'react-countup';
import Footer from './Footer';
import Wave from './Wave';



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

const CurveContainer = styled.div`
    display: block;
    position: relative;
    height: 40px;
    width: 100%;
    background: rgb(57, 27, 112);
    transform: scale(1, 1);

    &::before {
      content: "";
      display: block;
      position: absolute;
      border-radius: 100%;
      width: 100%;
      height: 300px;
      background-color: white;
      right: -25%;
      top: 20px
  }

    &::after {
        content: "";
        display: block;
        position: absolute;
        border-radius: 100%;
        width: 100%;
        height: 300px;
        background-color: rgb(57, 27, 112);
        left: -25%;
        top: -240px;
        clip-path: ellipse(100% 15% at -15% 100%);
    }
`;


const Hexagon1 = styled.div`
   clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
    position: absolute;
    background-color: #f7f7f71c;
    width: 400px; /* Ajustați lățimea și înălțimea după nevoi */
    height: 400px;
    transform: rotate(60deg);
    top: -0; /* Ajustați top și left pentru a poziționa poligonul în colțul dorit */
    left: -80px;
    z-index: 1;
`;

const Hexagon2 = styled.div`
   clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
    position: absolute;
    background-color: #f7f7f717;
    width: 200px; /* Ajustați lățimea și înălțimea după nevoi */
    height: 200px;
    transform: rotate(128deg);
    top: 50px; /* Ajustați top și left pentru a poziționa poligonul în colțul dorit */
    left: 1550px;
    z-index: 1;
`;

const Hexagon3 = styled.div`
   clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
    position: absolute;
    background-color: #f7f7f71a;
    width: 100px; /* Ajustați lățimea și înălțimea după nevoi */
    height: 100px;
    transform: rotate(128deg);
    top: 100px; /* Ajustați top și left pentru a poziționa poligonul în colțul dorit */
    left: 650px;
    z-index: 1;
`;

const Hexagon4 = styled.div`
   clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
    position: absolute;
    background-color: #ffffff2c;
    width: 260px; /* Ajustați lățimea și înălțimea după nevoi */
    height: 260px;
    transform: rotate(17deg);
    top: 470px; /* Ajustați top și left pentru a poziționa poligonul în colțul dorit */
    left: 950px;
    z-index: 1;
`;

const svgBackground = `
  url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="red" fill-opacity="1" d="M0,288L80,250.7C160,213,320,139,480,133.3C640,128,800,192,960,202.7C1120,213,1280,171,1360,149.3L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path></svg>')
`;

const ProductivityContainer = styled.div`
  display: flex;
  gap: 30px;
  padding: 120px;
  margin-top: -20px;
  text-align: left;
  position: relative;
  overflow-x: hidden; /* Oprește scroll-ul orizontal */
  overflow-y: hidden; /* Oprește scroll-ul orizontal */
  background: url("//images.ctfassets.net/rz1oowkt5gyp/7lTGeXbBRNRLaVk2MdBjtJ/99c266ed4cb8cc63bd0c388071f01ff6/white-wave-bg.svg") center bottom -0.5px / 100% 18% no-repeat scroll padding-box border-box, linear-gradient(60deg, rgb(82, 67, 170), rgb(237, 80, 180)) 0% 0% / auto repeat scroll padding-box border-box rgb(82, 67, 170);
  /* background: ${svgBackground}; */
  /* background: linear-gradient(45deg, #12c2e2, #c471ed, #f64f59); */
  transform: rotate(180deg); 
`;

const ProgressContainer = styled.div`
  display: flex;
  gap: 30px;
  width: 100%;
  padding: 100px;
  flex-direction: column;
  text-align: left;
  position: relative;
`;


const GetStartedContainer = styled.div`
  padding: 100px;
  display: flex;
  gap: 20px;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  background: url("//images.ctfassets.net/rz1oowkt5gyp/6Q4l8SJeMZGSu1m6W9vAjL/1021a10f6940ce44c50d0ffaefec223e/BigSwingFooterHeroGraphic__Left.svg") left center / contain no-repeat scroll padding-box border-box, url("//images.ctfassets.net/rz1oowkt5gyp/7KsuX6srvRqJVzeAIdIzIb/da1a3319c278d251ecbd078fcffdcd23/BigSwingFooterHeroGraphic__Right.svg") right center / contain no-repeat scroll padding-box border-box, linear-gradient(60deg, rgb(82, 67, 170), rgb(237, 80, 180)) 0% 0% / auto repeat scroll padding-box border-box rgb(82, 67, 170);
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

  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0,
  });


  const dispatch = useDispatch();
  const navigate = useNavigate();


  const loginSection = useRef(null);

  
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

const goToLogin = () => {
  if (loginSection.current) {
    window.scrollTo({
      top: (loginSection.current as HTMLElement).offsetTop,
      behavior: 'smooth',
    });
  }
};


  return (
    <div>

      <MainContainer>
        <LeftBox>
          {/* <motion.div 
            variants={fadeIn('right', 0.1)}
            initial='hidden'
            whileInView={'show'}
            viewport={{once: false, amount: 0.1}}
          
          > */}
            <Typography variant='h4' sx={{ color: '#f64f59' }}>Make your life easier</Typography>
          {/* </motion.div> */}
          
          <Typography variant='h2' sx={{ fontWeight: '900', fontFamily: 'Poppins', color: '#001B79'}}>
            Organize {" "}
            <ReactTyped
              strings={["your life, one card at a time"]}
              typeSpeed={100}

              cursorChar="|"
              showCursor={true}
            />
          </Typography>
    
          {/* <Typography sx={{ fontSize: '100px', fontWeight: '700', fontFamily: 'Poppins', color: '#001B79'}}></Typography> */}
          
          <Typography sx={{ typography: 'body2', fontWeight: 'regular', fontFamily: 'Poppins' }}>Effortlessly manage your tasks and boost your productivity with our intuitive drag-and-drop task tracking app. Our innovative design empowers you to seamlessly add, organize, and complete tasks, revolutionizing the way you approach productivity.</Typography>
          <ButtonStart onClick={goToLogin}>
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

      <ProductivityContainer>
        <Hexagon1 />
        <Hexagon2 />
        <Hexagon3 />
        <Hexagon4 />
        <div style={{transform: 'rotate(180deg)', width: '100%', display: 'flex', gap: 20, flexDirection: 'column'}}>
          <Typography variant='h5' style={{
            color: 'white',
          }}>A new productivty powerhouse</Typography>
          <Typography variant='subtitle1' style={{
            color: 'white'
          }}>Empowering teamwork: navigate with Boards, organize with Columns, achieve with Tasks.
          </Typography>
          
          <div style={{display: 'flex', justifyContent: 'center',  gap: 50, width: '100%', padding: 10}}>
            <Card style={{width: '400px', padding: '50px', borderLeft: '10px solid rgb(82, 67, 170) '}}>
                <Typography variant='h4' style={{ marginBottom: 10}}>
                  Boards
                </Typography>
                <Typography variant='body2'>Trello boards keep tasks organized and work moving forward. In a glance, see everything from “things to do” to “aww yeah, we did it!”</Typography>
            </Card>
            <Card style={{width: '400px', padding: '50px', borderLeft: '10px solid #12c2e2'}}>
                <Typography variant='h4' style={{ marginBottom: 10}}>
                  Columns
                </Typography>
                <Typography variant='body2'>Trello boards keep tasks organized and work moving forward. In a glance, see everything from “things to do” to “aww yeah, we did it!”</Typography>
            </Card>
            <Card style={{width: '400px',  padding: '50px', borderLeft: '10px solid rgb(237, 80, 180)'}}>
                <Typography variant='h4' style={{ marginBottom: 10}}>
                  Tasks 
                </Typography>
                <Typography variant='body2'>Trello boards keep tasks organized and work moving forward. In a glance, see everything from “things to do” to “aww yeah, we did it!”</Typography>
            </Card>
          </div>

        </div>
      </ProductivityContainer>

      <ProgressContainer>
        <div style={{  width: '100%', display: 'flex', gap: 20, flexDirection: 'column'}}>
        <div style={{ display: 'flex'}}>
          <div style={{flexGrow: 1}}></div>
          <Typography variant='h4'>Earn</Typography>
          <Typography variant='h4'>
              <span style={{ fontWeight: 'bold', color: 'blue' }} >&nbsp;points</span>
          </Typography>
          <Typography variant='h4'>&nbsp;as you conquer tasks!</Typography>
       </div>
          <Typography variant='subtitle1' textAlign='right'>Whether it's a small victory or a monumental milestone, each completed task brings you closer to your goals.</Typography>
            
          <div style={{display: 'flex', justifyContent: 'center',  gap: 50, width: '100%', padding: 10}}>
            
            {/* <div style={{ display: 'flex', flexDirection: 'column', gap: 30, width: '400px'}}>
             </div> */}
            {/* novice */}
            <Card style={{width: '400px', gap: 6, padding: '50px', display: 'flex', alignItems: 'center', flexDirection: 'column'}} ref={ref}>
              <Typography variant='h4' style={{ marginBottom: 10}}>
                  Novice
              </Typography>
              <img src={require('../novice.png')} width='150px' alt='novice' />
              {inView ? (
                <>
                  <AnimatedNumbers
                    animateToNumber={50}
                    fontStyle={{
                        fontSize: 50,
                        color: "blue",
                    }}
                    
                    transitions={(index) => ({
                      type: "spring",
                      duration: index + 1,
                  })}
                  />
                  <Typography fontSize={20} color='blue'>points</Typography>

                </>
              ) : (
                <Typography fontSize={40} color='blue'>0</Typography>
              )}
            </Card>

            {/* explorer */}
            <Card style={{width: '400px', gap: 6, padding: '50px', display: 'flex', alignItems: 'center', flexDirection: 'column'}} ref={ref}>
              <Typography variant='h4' style={{ marginBottom: 10}}>
                  Explorer
              </Typography>
              <img src={require('../explorer.png')} width='150px' alt='explorer' />
              {inView ? (
                <>
                <AnimatedNumbers
                  animateToNumber={100}
                  fontStyle={{
                      fontSize: 50,
                      color: "blue",
                  }}
                  
                  transitions={(index) => ({
                    type: "spring",
                    duration: index + 2,
                })}
                />
                <Typography fontSize={20} color='blue'>points</Typography>
                </>


              ) : (
                <Typography fontSize={40} color='blue'>0</Typography>
              )}
            </Card>

            {/* challenger */}
            <Card style={{width: '400px', gap: 6, padding: '50px', display: 'flex', alignItems: 'center', flexDirection: 'column'}} ref={ref}>
              <Typography variant='h4' style={{ marginBottom: 10}}>
                  Challenger
              </Typography>
              <img src={require('../challenger.png')} width='150px' alt='challenger' />
              {inView ? (
                <>
                <AnimatedNumbers
                  animateToNumber={200}
                  fontStyle={{
                      fontSize: 50,
                      color: "blue",
                  }}
                  
                  transitions={(index) => ({
                    type: "spring",
                    duration: index + 3,
                })}
                />
                <Typography fontSize={20} color='blue'>points</Typography>
                </>

              ) : (
                <Typography fontSize={40} color='blue'>0</Typography>
              )}
            </Card>

            {/* wizard */}
            <Card style={{width: '400px', gap: 6, padding: '50px', display: 'flex', alignItems: 'center', flexDirection: 'column'}} ref={ref}>
              <Typography variant='h4' style={{ marginBottom: 10}}>
                  Wizard
              </Typography>
              <img src={require('../wizard.png')} width='150px' alt='wizard' />
              {inView ? (
                <>
                  <div style={{ display: 'flex', gap: 2}}>
                    <AnimatedNumbers
                      animateToNumber={200}
                      fontStyle={{
                          fontSize: 50,
                          color: "blue",
                      }}
                      
                      transitions={(index) => ({
                        type: "spring",
                        duration: index + 4,
                    })}
                    />

                    <Typography style={{fontSize: 50, color: "blue",}}>+</Typography>
                  </div>
                  <Typography fontSize={20} color='blue'>points</Typography>
                  </>
              ) : (
                <Typography fontSize={40} color='blue'>0</Typography>
              )}
            </Card>
          </div>

        </div>
          
      </ProgressContainer>
          
      

      {/* <CurveContainer>
        <Typography>baid</Typography>
      </CurveContainer> */}

      {/* <LoginContainer ref={loginSection}>
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
        
      </LoginContainer> */}
      <GetStartedContainer ref={loginSection}>
        <Typography variant='h3' sx={{ fontFamily: 'Poppins', color: 'white'}}>Get started now!</Typography>
        
        <div style={{ display: 'flex', gap: 10}}> 
          <TextField placeholder='Email' sx={{backgroundColor: 'white', border: '1px solid white'}}></TextField>
          <StyledButton><span>Sign up</span></StyledButton>
        </div>
      </GetStartedContainer>

      <Footer />
    </div>
  );
};

export default LandingPage;
