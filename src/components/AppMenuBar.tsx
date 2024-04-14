import { AppBar, Avatar, Box, Button, IconButton, Menu, Tooltip} from '@mui/material'
import React, { useEffect, useState } from 'react'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from './Profile';
import Register from './Register';
import Login from './Login';
import { useSelector } from 'react-redux';
import { AppState } from '../store';

interface AppMenuBarProps {
  user: {
    id: string;
    username: string;
    email: string;
    color: string;
  };
}

const StyledButton = styled.button`
  align-items: center;
  background-image: linear-gradient(45deg, #12c2e2, #c471ed, #f64f59);
  border: 0;
  border-radius: 8px;
  box-shadow: rgba(151, 65, 252, 0.2) 0 15px 30px -5px;
  box-sizing: border-box;
  color: #FFFFFF;
  display: flex;
  font-size: 15px;
  justify-content: center;
  font-family: 'Poppins';
  line-height: 1em;
  max-width: 100%;
  min-width: 100px;
  padding: 3px;
  text-decoration: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.3s;

  &:active,
  &:hover {
    outline: 0;
  }

  span {
    background-color: rgb(5, 6, 45);
    padding: 16px 24px;
    border-radius: 6px;
    width: 100%;
    height: 100%;
    transition: 300ms;
  }

  &:hover span {
    background: none;
  }

  &:active {
    transform: scale(0.9);
  }
`;

const AppMenuBar: React.FC<AppMenuBarProps> = ({ user }) => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const isLoggedIn = useSelector((state: AppState) => state.isLoggedIn);
  const isRegistered = useSelector((state: AppState) => state.isRegistered);
  const currentUser = useSelector((state: AppState) => state.currentUser);
  //const isLoggedOut = useSelector((state: AppState) => state.isLoggedOut)

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleToggle = () => {
    setIsChecked((prev) => !prev);
    console.log('isChecked:', isChecked);
  };


  return (
    <AppBar position='static' sx={{ position: 'absolute', backgroundColor: 'rgba(252, 252, 252, 0.17)', boxShadow: 'none', top: 0}}>
      <div style={{display: 'flex', padding: 1, alignItems: 'center', justifyContent: 'space-between', marginRight: '30px'}}>
        <div style={{ flexGrow: 1 }}>
          <img src={require('../ticked.png')} width='170px' alt='ticked' />
        </div>
        <Button sx={{ textTransform: 'none', color: "#303030"}}>
          <NotificationsNoneIcon />
        </Button>
        <ToastContainer />
        <Box sx={{ ml: 1, textAlign: 'center'}}>
            <Tooltip title="Profile">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={user.username} src="/static/images/avatar/2.jpg" style={{backgroundColor: user.color}} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >    
              
              <Box sx={{ width: '300px', height: '350px', padding: 5, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                { user.id || currentUser !== null ? (
                  <Profile user={currentUser || user} handleToggle={handleToggle} />
                ) : isChecked ? (
                  <Register handleToggle={handleToggle} />
                ) : (!isChecked || isRegistered || currentUser == null) ? (
                  <Login handleToggle={handleToggle} boardId={""}/>
                ): null}
              </Box>
            </Menu>
          </Box>
        </div>
    </AppBar>
  )
}

export default AppMenuBar
export {StyledButton}
