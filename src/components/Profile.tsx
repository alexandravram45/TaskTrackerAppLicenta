import React from 'react';
import { StyledButton } from './AppMenuBar'; // Import your StyledButton component
import axios from 'axios';

import { useDispatch } from 'react-redux';
import { logoutAction } from '../store';
import { toast } from 'react-toastify';


interface ProfileProps {
    user: {
        id: string;
        username: string;
        email: string;
      };
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const dispatch = useDispatch();

  const handleLogout = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    axios.post('http://localhost:5000/user/logout', {}, { withCredentials: true })
        .then(() => {
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
            setTimeout(() => {
                window.location.reload();
              }, 100);
        })
        .catch(err => console.log(err.message));
  }

  return (
    <div>
        <p>Hello, {user.username}</p>
        <StyledButton onClick={handleLogout}>
            <span>Logout</span>
        </StyledButton>
    </div>
  )
}
export default Profile;
