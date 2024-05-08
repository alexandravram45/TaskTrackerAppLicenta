import { AppBar, Avatar, Box, Button, IconButton, Menu, Switch, Tooltip} from '@mui/material'
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
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '@mui/material/styles';
import ForgotPassword from './ForgotPassword';

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

interface AppMenuBarProps {
  toggleDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const AppMenuBar: React.FC<AppMenuBarProps> = ({toggleDarkMode, onToggleDarkMode}) => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isCheckedReset, setIsCheckedReset] = useState<boolean>(false);

  const isLoggedIn = useSelector((state: AppState) => state.isLoggedIn);
  const isRegistered = useSelector((state: AppState) => state.isRegistered);
  const user = useSelector((state: AppState) => state.currentUser);
  const avatarLetters = user ? user?.firstName.charAt(0) + user?.lastName.charAt(0) : '';
  const theme = useTheme();

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

  const handleToggleReset = () => {
    setIsCheckedReset((prev) => !prev);

    console.log('isCheckedreset:', isCheckedReset);

  };

  return (
    <AppBar position='static' sx={{ position: 'absolute', backgroundColor: 'rgb(255 255 255 / 16%)', borderBottom: '0.5px solid #ffffff73', boxShadow: 'none', top: 0}}>
      <div style={{display: 'flex', padding: 1, alignItems: 'center', justifyContent: 'space-between', marginRight: '30px'}}>
        <div style={{ flexGrow: 1 }}>
          <img src={require('../ticked.png')} width='170px' alt='ticked' />
        </div>
        <div>
          <IconButton sx={{ ml: 1 }} onClick={onToggleDarkMode} color="inherit">
            {toggleDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </div>


        <Button sx={{ textTransform: 'none', color: "#303030"}}>
          <NotificationsNoneIcon />
        </Button>
        <ToastContainer />
        <Box sx={{ ml: 1, textAlign: 'center'}}>
            <Tooltip title="Profile">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {user ? (
                  <Avatar alt={user.firstName} src="/static/images/avatar/2.jpg" style={{backgroundColor: user?.color}}>{avatarLetters}</Avatar>
                ) : (
                  <Avatar src="/static/images/avatar/1.jpg" />

                )}
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
              
              <Box sx={{ width: '350px', height: 'auto', padding: 5, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                { user !== null ? (
                  <Profile handleToggle={handleToggle} />
                ) : isChecked ? (
                  <Register handleToggle={handleToggle} />
                ) : (isCheckedReset) ? (
                  <ForgotPassword handleToggleReset={handleToggleReset} />

                ): (!isChecked && !isCheckedReset || isRegistered || user == null) ? (
                  <Login handleToggle={handleToggle} handleToggleReset={handleToggleReset} boardId={""}/>

                ) : null}
              </Box>
            </Menu>
          </Box>
        </div>
    </AppBar>
  )
}

export default AppMenuBar
export {StyledButton}
