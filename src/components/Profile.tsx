import React, { useState } from 'react';
import { StyledButton } from './AppMenuBar'; // Import your StyledButton component
import axios from 'axios';

import { useDispatch, useSelector } from 'react-redux';
import { AppState, logoutAction, setCurrentUser } from '../store';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { Typography } from '@mui/material';


interface ProfileProps {
    handleToggle: () => void;
}

const Profile: React.FC<ProfileProps> = ( handleToggle ) => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const user = useSelector((state: AppState) => state.currentUser);
  const [userAfterLogout, setUserAfterLogout] = useState(user);

  const handleLogout = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    axios.post('http://localhost:5000/user/logout', {}, { withCredentials: true })
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
          
            console.log("user after dispatch:", res.data.user)
            setUserAfterLogout(res.data.user)
            dispatch(setCurrentUser(null))
            navigate('/')
            window.location.reload()

            
        })
        .catch(err => console.log(err.message));
  }

  return (
    <div>
      { userAfterLogout ?  
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 6}}>
        <Typography variant='h5'>Hello, {user?.firstName}!</Typography>
        <Typography variant='subtitle2'>Current title</Typography>
        <img src={require('../novice.png')} width='60px' alt='novice' />
        <Typography  variant='h5'>Novice</Typography>
        <StyledButton onClick={handleLogout}>
            <span>Logout</span>
        </StyledButton>
      </div>
         :  
         <p>Succesfully logged out!</p>
        
       }
        
    </div>
  )
}
export default Profile;
