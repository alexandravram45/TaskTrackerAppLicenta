import React, { useEffect, useState } from 'react';
import { StyledButton } from './AppMenuBar';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { logoutAction, setCurrentUser } from '../store';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { user, setUser } = useAuth()
  const [title, setTitle] = useState('');
  const [badgeImage, setBadgeImage] = useState('');
  const location = useLocation()
  const isOnLanding = location.pathname === '/landing'

  const handleLogout = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    axios.post('/user/logout', {}, { withCredentials: true })
        .then((res) => {
            toast.success('Logged out succesfully!', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                progress: undefined,
                draggable: true,
                theme: "light",
                });

            dispatch(logoutAction())
            dispatch(setCurrentUser(null))
            setUser(null)
            navigate('/landing')
        })
        .catch(err => console.log(err.message));
  }

    type TitleImages = {
      [key: string]: string;
  }

    const titleImages: TitleImages = {
      Novice: require('../images/novice.png'),
      Explorer: require('../images/explorer.png'),
      Challenger: require('../images/challenger.png'),
      Wizard: require('../images/wizard.png'),
  };

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const response = await axios.get(`user/${user?.id}/points`);
        setTitle(response.data.title);
        setBadgeImage(titleImages[response.data.title])
      } catch (error) {
        console.error('Error fetching points:', error);
      }
    };

    fetchPoints();
  }, [user?.id]);

  return (
    <div>
      { user ?  
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 6}}>
        <Typography variant='h5'>Hello, {user?.firstName}!</Typography>
        <Typography variant='subtitle2'>Current title</Typography>
        <img src={badgeImage} width='60px' alt='novice' />
        <Typography  variant='h5'>{title}</Typography>
        <StyledButton onClick={handleLogout}>
            <span>Logout</span>
        </StyledButton>
        {isOnLanding ? <Link to='/home/boards'>Go to your boards</Link> : null}
      </div>
         :  
         <p>Succesfully logged out!</p>
        
       }
        
    </div>
  )
}
export default Profile;
