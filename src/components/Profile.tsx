import React, { useEffect, useState } from 'react';
import { StyledButton } from './AppMenuBar'; // Import your StyledButton component
import axios from 'axios';

import { useDispatch, useSelector } from 'react-redux';
import { AppState, logoutAction } from '../store';
import { toast } from 'react-toastify';
import Login from './Login';
import { useNavigate } from 'react-router';


interface ProfileProps {
    user: {
        id: string;
        username: string;
        email: string;
      };
    handleToggle: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, handleToggle }) => {
  const dispatch = useDispatch();
  const [userAfterLogout, setUserAfterLogout] = useState(user);
  const navigate = useNavigate()

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
            navigate('/')
            
        })
        .catch(err => console.log(err.message));
  }

  return (
    <div>
      { userAfterLogout ?  
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
        <p>Hello, {user.username}!</p>
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
