import { Box, Card, CircularProgress, Typography } from '@mui/material';
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router'
import { Link } from 'react-router-dom';
import { CSSProperties } from 'styled-components';
import { AppState, setCurrentUser } from '../store';
import { toast } from 'react-toastify';
import Login from './Login';
import Register from './Register';
import { Toast, ToastContainer } from 'react-toastify/dist/components';
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
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Noua stare pentru urmărirea stării de autentificare

    const currentUser = useSelector((state: AppState) => state.currentUser);
    const dispatch = useDispatch()
    const navigate = useNavigate(); // Obține istoricul navigării
    const [user, setUser] = useState<User | null>(null);
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const [isCheckedReset, setIsCheckedReset] = useState<boolean>(false);
    

    const handleToggle = () => {
        setIsChecked((prev) => !prev);
        console.log('isChecked:', isChecked);
      };
    
      const handleToggleReset = () => {
        setIsCheckedReset((prev) => !prev);
    
        console.log('isCheckedreset:', isCheckedReset);
    
      };

    
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    console.log(authToken)
  
    if (authToken) {
      axios.get("http://localhost:5000/profile", {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        console.log(res.data.user.username);

        const userData = {
          id: res.data.user._id,
          username: res.data.user.username,
          firstName: res.data.user.firstName,
          lastName: res.data.user.lastName,
          email: res.data.user.email,
          color: res.data.user.color,
        };

        setUser(userData)
        console.log(userData)
        setLoading(false);
        dispatch(setCurrentUser(userData));
        setIsLoggedIn(true);

        axios.get(`http://localhost:5000/board/${params.boardId}/join/${userData.id}`)
        .then((res) => {
            console.log(res)
            console.log(currentUser?.email)
            setValidUrl(true)
        })
        .catch((err) => {
            console.log(err)
            setValidUrl(false)
        })
      })
      .catch((err) => {
        console.log(err);
        setLoading(false); 
        setIsLoggedIn(false); // Setează starea isLoggedIn ca neautentificată
      });
    } else {
      setLoading(false); 
      setIsLoggedIn(false); // Setează starea isLoggedIn ca neautentificată
    }
  }, [user?.id]); 

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={styles.container}>
            {loading ? (
                <div style={styles.progressContainer}>
                    <CircularProgress />
                </div>
            ) : isLoggedIn ? ( // Verifică starea isLoggedIn pentru a decide ce să afișeze
                validUrl ? (
                    <div style={styles.successMessage}>
                        <p>Success</p>
                        <Link to={`/boards/${params.boardId}`} style={styles.link}>Go to board</Link>
                    </div>
                ) : (
                    <p style={styles.errorMessage}>404 not found</p>
                )
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 30, alignItems: 'center'}}>
                    <img src={require('../ticked.png')} width='350px' alt='ticked'/>
                    <Card style={{ backgroundColor: 'rgba(0, 0, 0, 0.032)', padding: '60px', height: 'auto', width: '300px'}}>
                        {/* <Login handleToggle={function () {}} handleToggleReset={function () {}} boardId={params.boardId || ""}/> */}
                        <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                            { isChecked ? (
                            <Register handleToggle={handleToggle} />
                            ) : (isCheckedReset) ? (
                            <ForgotPassword handleToggleReset={handleToggleReset} />
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
