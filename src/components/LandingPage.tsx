import { useState, useRef } from 'react';
import {
  Box,
  Card,
  Dialog,
  TextField,
  Typography
} from '@mui/material';
import styled, { keyframes } from 'styled-components';
import AppMenuBar, { StyledButton } from './AppMenuBar';
import {ReactTyped} from "react-typed";
import AnimatedNumbers from "react-animated-numbers";
import { useInView } from "react-intersection-observer";
import Footer from './Footer';
import Wave from './Wave';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import Login from './Login';

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

const WaveContainer = styled.div`
  position: absolute;
  top: -10px;
  left: 0;
  width: 100%;
  height: auto;
  z-index: 1;
`;

export const Hexagon1 = styled.div`
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

export const Hexagon2 = styled.div`
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

export const Hexagon3 = styled.div`
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

export const Hexagon4 = styled.div`
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

const ProductivityContainer = styled.div`
  display: flex;
  gap: 30px;
  padding: 120px;
  margin-top: -50px;
  text-align: left;
  position: relative;
  overflow-x: hidden; 
  overflow-y: hidden; 
  outline: 10px solid white;
  outline: 20px white;
  background: linear-gradient(60deg, rgb(82, 67, 170), rgb(237, 80, 180));
  outline: 20px white;

`;

const ProgressContainer = styled.div`
  display: flex;
  gap: 30px;
  padding: 100px;
  overflow-x: hidden; 
  overflow-y: hidden; 
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
  const [email, setEmail] = useState('')
  const [isChecked, setIsChecked] = useState<boolean>(true);
  const [isCheckedReset, setIsCheckedReset] = useState<boolean>(false);
  const { ref, inView } = useInView({
    threshold: 0,
  });

  const [open, setOpen] = useState(false);
  
  const handleOpen = async () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };

  
  const handleToggle = () => {
    setIsChecked((prev) => !prev);
  };

  const handleToggleReset = () => {
    setIsCheckedReset((prev) => !prev);
  };

  const loginSection = useRef(null);

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
      <AppMenuBar />
      
      <MainContainer>
        <LeftBox>
          <Typography variant='h4' sx={{ color: '#f64f59' }}>Make your life easier</Typography>
          <Typography variant='h2' sx={{ fontWeight: '900', fontFamily: 'Poppins', color: '#001B79'}}>
            Organize {" "}
            <ReactTyped
              strings={["your life, one card at a time"]}
              typeSpeed={100}

              cursorChar="|"
              showCursor={true}
            />
          </Typography>
    
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
          <StyledImage src={require('../images/person-tasks2.png')} />
        </RightBox>
      </MainContainer>

      
      <ProductivityContainer>
      <WaveContainer>
        <Wave />
      </WaveContainer>
        <Hexagon1 />
        <Hexagon2 />
        <Hexagon3 />
        <Hexagon4 />
        <div style={{ width: '100%', display: 'flex', gap: 20, marginTop: '40px', flexDirection: 'column'}}>
          <Typography variant='h5' style={{
            color: 'white',
          }}>A new productivty powerhouse</Typography>
          <Typography variant='subtitle1' style={{
            color: 'white'
          }}>Empowering teamwork: navigate with Boards, organize with Columns, achieve with Tasks.
          </Typography>
          
          <div style={{display: 'flex', justifyContent: 'center',  gap: 50, width: '100%', padding: 10}}>
            <Card style={{width: '400px', padding: '50px', borderLeft: '10px solid rgb(82, 67, 170) '}}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10}}>
                  <img src={require('../images/board.png')} width='100px' alt='ticked'  />
                
                  <Typography variant='h4' style={{ marginBottom: 10}}>
                    Boards
                  </Typography>
                </div>
                
                <Typography variant='body2'>Ticked boards keep tasks organized and work moving forward. In a glance, see everything from “things to do” to “aww yeah, we did it!”</Typography>
            </Card>
            <Card style={{width: '400px', padding: '50px', borderLeft: '10px solid #12c2e2'}}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10}}>
                  <img src={require('../images/column.png')} width='100px' alt='ticked'  />
                
                  <Typography variant='h4' style={{ marginBottom: 10}}>
                    Columns
                  </Typography>
                </div>
                <Typography variant='body2'>From ideation to implementation, columns are like a busy intersection where ideas come to life and projects gain momentum. So grab your coffee and join the hustle - we've got places to go and tasks to conquer!</Typography>
            </Card>
            <Card style={{width: '400px',  padding: '50px', borderLeft: '10px solid rgb(237, 80, 180)'}}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10}}>
                  <img src={require('../images/task.png')} width='100px' alt='ticked'  />
                
                  <Typography variant='h4' style={{ marginBottom: 10}}>
                    Tasks
                  </Typography>
                </div>
                <Typography variant='body2'>Charting the course through the turbulent waters of tasks, you are the captain of this ship. With each task completed, you steer the project closer to its destination. So batten down the hatches, unfurl the sails, and let's set a course for success! </Typography>
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
              <span style={{ fontWeight: 'bold', color: 'rgb(91, 66, 243)' }} >&nbsp;points</span>
          </Typography>
          <Typography variant='h4'>&nbsp;as you conquer tasks!</Typography>
       </div>
          <Typography variant='subtitle1' textAlign='right'>Whether it's a small victory or a monumental milestone, each completed task brings you closer to your goals.</Typography>
            
          <div style={{display: 'flex', justifyContent: 'center',  gap: 50, width: '100%', padding: 10}}>

            {/* novice */}
            <Card style={{width: '400px', gap: 6, padding: '50px', display: 'flex', alignItems: 'center', flexDirection: 'column'}} ref={ref}>
              <Typography variant='h4' style={{ marginBottom: 10}}>
                  Novice
              </Typography>
              <img src={require('../images/novice.png')} width='150px' alt='novice' />
              {inView ? (
                <>
                  <AnimatedNumbers
                    animateToNumber={50}
                    fontStyle={{
                        fontSize: 50,
                        color: "rgb(91, 66, 243)",
                    }}
                    
                    transitions={(index) => ({
                      type: "spring",
                      duration: index + 1,
                  })}
                  />
                  <Typography fontSize={20} color='rgb(91, 66, 243)'>points</Typography>

                </>
              ) : (
                <Typography fontSize={40} color='rgb(91, 66, 243)'>0</Typography>
              )}
            </Card>

            {/* explorer */}
            <Card style={{width: '400px', gap: 6, padding: '50px', display: 'flex', alignItems: 'center', flexDirection: 'column'}} ref={ref}>
              <Typography variant='h4' style={{ marginBottom: 10}}>
                  Explorer
              </Typography>
              <img src={require('../images/explorer.png')} width='150px' alt='explorer' />
              {inView ? (
                <>
                <AnimatedNumbers
                  animateToNumber={100}
                  fontStyle={{
                      fontSize: 50,
                      color: "rgb(91, 66, 243)",
                  }}
                  
                  transitions={(index) => ({
                    type: "spring",
                    duration: index + 2,
                })}
                />
                <Typography fontSize={20} color='rgb(91, 66, 243)'>points</Typography>
                </>


              ) : (
                <Typography fontSize={40} color='rgb(91, 66, 243)'>0</Typography>
              )}
            </Card>

            {/* challenger */}
            <Card style={{width: '400px', gap: 6, padding: '50px', display: 'flex', alignItems: 'center', flexDirection: 'column'}} ref={ref}>
              <Typography variant='h4' style={{ marginBottom: 10}}>
                  Challenger
              </Typography>
              <img src={require('../images/challenger.png')} width='150px' alt='challenger' />
              {inView ? (
                <>
                <AnimatedNumbers
                  animateToNumber={200}
                  fontStyle={{
                      fontSize: 50,
                      color: "rgb(91, 66, 243)",
                  }}
                  
                  transitions={(index) => ({
                    type: "spring",
                    duration: index + 3,
                })}
                />
                <Typography fontSize={20} color='rgb(91, 66, 243)'>points</Typography>
                </>

              ) : (
                <Typography fontSize={40} color='rgb(91, 66, 243)'>0</Typography>
              )}
            </Card>

            {/* wizard */}
            <Card style={{width: '400px', gap: 6, padding: '50px', display: 'flex', alignItems: 'center', flexDirection: 'column'}} ref={ref}>
              <Typography variant='h4' style={{ marginBottom: 10}}>
                  Wizard
              </Typography>
              <img src={require('../images/wizard.png')} width='150px' alt='wizard' />
              {inView ? (
                <>
                  <div style={{ display: 'flex', gap: 2}}>
                    <AnimatedNumbers
                      animateToNumber={200}
                      fontStyle={{
                          fontSize: 50,
                          color: "rgb(91, 66, 243)",
                      }}
                      
                      transitions={(index) => ({
                        type: "spring",
                        duration: index + 4,
                    })}
                    />

                    <Typography style={{fontSize: 50, color: "rgb(91, 66, 243)",}}>+</Typography>
                  </div>
                  <Typography fontSize={20} color='rgb(91, 66, 243)'>points</Typography>
                  </>
              ) : (
                <Typography fontSize={40} color='rgb(91, 66, 243)'>0</Typography>
              )}
            </Card>
          </div>

        </div>
          
      </ProgressContainer>
      
      <GetStartedContainer ref={loginSection}>
        <Typography variant='h3' sx={{ fontFamily: 'Poppins', color: 'white'}}>Get started now!</Typography>
        
        <div style={{ display: 'flex', gap: 10}}> 
          <TextField 
            placeholder='Email' 
            sx={{backgroundColor: 'white', border: '1px solid white'}}
            value={email}
            onChange={(e) => {setEmail(e.target.value)}}
          />
          <div>
          <StyledButton onClick={handleOpen}><span>Sign up</span></StyledButton>

          </div>
        </div>
      </GetStartedContainer>

      <Dialog open={open} onClose={handleClose} PaperProps={{ sx: {padding: 4, minWidth: '600px' }}}>
        {isChecked ? (
          <Register handleToggle={handleToggle} landingEmail={email}/>
        ) : isCheckedReset ? (
          <ForgotPassword handleToggleReset={handleToggleReset} landingEmail={email}/>
        ) : (
          <Login handleToggle={handleToggle} handleToggleReset={handleToggleReset} boardId={""} />
        )}
      </Dialog>

      <Footer />
    </div>
  );
};

export default LandingPage;
