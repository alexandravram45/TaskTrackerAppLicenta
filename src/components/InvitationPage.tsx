import { Box, Card, CircularProgress, } from '@mui/material';
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch, } from 'react-redux';
import {  useParams } from 'react-router'
import { Link } from 'react-router-dom';
import { CSSProperties } from 'styled-components';
import { setCurrentUser } from '../store';
import Login from './Login';
import Register from './Register';
import { User } from '../App';
import ForgotPassword from './ForgotPassword';

const styles: { [key: string]: CSSProperties } = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    },
    successMessage: {
        textAlign: 'center',
        fontSize: '24px',
    },
    errorMessage: {
        textAlign: 'center',
        fontSize: '18px',
    },
    link: {
        textDecoration: 'none',
        color: 'blue',
        marginTop: '10px',
    },
};

const InvitationPage = () => {
    const params = useParams();
    const [validUrl, setValidUrl] = useState(true);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false); 
    const dispatch = useDispatch()
    const [user, setUser] = useState<User | null>(null);
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const [isCheckedReset, setIsCheckedReset] = useState<boolean>(false);
    
    const handleToggle = () => {
        setIsChecked((prev) => !prev);
      };
    
      const handleToggleReset = () => {
        setIsCheckedReset((prev) => !prev);
      };

    
  useEffect(() => {
      axios.get("/profile", {
        withCredentials: true,
      })
      .then((res) => {
        const userData = {
          id: res.data.user._id,
          username: res.data.user.username,
          firstName: res.data.user.firstName,
          lastName: res.data.user.lastName,
          email: res.data.user.email,
          color: res.data.user.color,
        };

        setUser(userData)
        dispatch(setCurrentUser(userData));
        setIsLoggedIn(true);

        axios.get(`/board/${params.boardId}/join/${userData.id}`)
        .then((res) => {
            setLoading(false);
            setValidUrl(true)
        })
        .catch((err) => {
            setLoading(false);
            setValidUrl(false)
        })
      })
      .catch((err) => {
        setLoading(false); 
        setIsLoggedIn(false); 
      });
  }, [user?.id]); 


    return (
        <div style={styles.container}>
            {loading ? (
                <div style={styles.progressContainer}>
                    <CircularProgress />
                </div>
            ) : isLoggedIn ? ( 
                validUrl ? (
                    <div style={styles.successMessage}>
                        <p>Success</p>
                        <Link to={`/home/boards/${params.boardId}`} style={styles.link}>Go to board</Link>
                    </div>
                ) : (
                    <p style={styles.errorMessage}>404 not found</p>
                )
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 30, alignItems: 'center'}}>
                    <img src={require('../images/ticked.png')} width='350px' alt='ticked'/>
                    <Card style={{ backgroundColor: 'rgba(0, 0, 0, 0.032)', padding: '60px', height: 'auto', width: '300px'}}>
                        <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                            { isChecked ? (
                            <Register handleToggle={handleToggle} landingEmail=''/>
                            ) : (isCheckedReset) ? (
                            <ForgotPassword handleToggleReset={handleToggleReset} landingEmail=''/>
                            ): (!isChecked && !isCheckedReset ) ? (
                            <Login handleToggle={handleToggle} handleToggleReset={handleToggleReset} boardId={""}/>
                            ) : null}
                        </Box>
                    </Card>
                </div>
            )}
        </div>
  )
}

export default InvitationPage
