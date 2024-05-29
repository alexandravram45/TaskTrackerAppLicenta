import { Avatar, AvatarGroup, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Input, ListItem, Menu, TextField, Tooltip, Typography } from '@mui/material'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { Board } from './Home'
import { User } from '../App';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { AppState, setBoards, setSelectedBoardRedux } from '../store';
import * as Yup from 'yup';
import styled from 'styled-components';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import ShareIcon from '@mui/icons-material/Share';
import Delete from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Close from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupIcon from '@mui/icons-material/Group';
import SendIcon from '@mui/icons-material/Send';
import StarIcon from '@mui/icons-material/Star';

interface BoardBarProps {
    selectedBoard: Board,
    setSelectedBoard: (board: Board | null) => void,
    members: User[],
    setMembers: (users: User[]) => void
}

const ListButton = styled(Button)`
    width: 100%;
    border-radius: 10px;

`;
const BoardBar:React.FC<BoardBarProps> = ( { selectedBoard, setSelectedBoard, members, setMembers }) => {

  const user = useSelector((state: AppState) => state.currentUser)
  const userId = user ? user?.id : ''
  const [isModified, setIsModified] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [boardName, setBoardName] = useState("")
  const dispatch = useDispatch();
  const [boardUser, setBoardUser] = useState<User>()
  const [favorite, setFavorite] = useState(selectedBoard?.favorite);
  const [anchorBoard, setAnchorBoard] = useState<null | HTMLElement>(null);
  const [areYouSureButton, setAreYouSureButton] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [seeMembers, setSeeMembers] = useState(false)
  const isBoardAdmin = user?.id === boardUser?.id
  const navigate = useNavigate()
  const selectedBoardRedux = useSelector((state: AppState) => state.selectedBoard);
  const isArchived = selectedBoard?.archived ? true : false;
  const boards = useSelector((state: AppState) => state.boards);  

  useEffect(() => {
    if (!selectedBoard) return
    setFavorite(selectedBoard?.favorite || false)
    setBoardName(selectedBoard?.name || "");

    setLoading(true);
    getUser(selectedBoard.user);

    const timeout = setTimeout(() => {
      getMembers().then(() => setLoading(false));
    }, 500);
  
    return () => clearTimeout(timeout);

  }, [selectedBoard?._id]);

    const validationSchema = Yup.object().shape({
        email: Yup.string().email().required('email is required'),
      });
    
      const formik = useFormik({
        initialValues: {
          email: '',
        },
        validationSchema,
        onSubmit: (values) => {
          shareInvitationLink(values.email, selectedBoard?._id, userId)
        },
      });

      const handleClose = () => {
        formik.resetForm()
        setOpen(false);
      };
    
      const handleNewMemberEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        formik.handleChange(e);
        setIsModified(true);
      };

      const shareInvitationLink = async (email: string, boardId: string | undefined, userId: string) => {
        await axios.post(`http://localhost:5000/user/${userId}/invite/${boardId}`, {
          email: email,
          invitedBy: user?.email,
        }).then((res) => {
          setIsModified(false)
          toast.success(`Invitation sent to ${email}.`, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            progress: undefined,
            draggable: true,
            theme: "light",
          });    
        }).catch((err) => {
          console.log(err)
        })
      }
    
      const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const updatedName = e.target.value;
        setBoardName(updatedName); 
      };
    
      const handleBlur = async () => {
        setIsEditing(false);
        
        if (boardName?.trim() !== '') {
          await axios.put(`http://localhost:5000/board/update-name/${selectedBoard?._id}`, {
            name: boardName,
          }).then((res) => {
            dispatch(setSelectedBoardRedux(res.data.data))
            setBoardName(res.data.data.name);
          }).catch((err) => {
            console.log(err)
          })  
        }
        else {
          return
        }
      };
      
      const handleOpen = () => {
        setOpen(true);
      };

      const handleDoubleClick = () => {
        setIsEditing(true);
      };

      const handleFavoriteChange = async () => {
        const updatedFavorite = !favorite; 
    
          await axios.put(`http://localhost:5000/board/add-to-favorites/${selectedBoard?._id}`, {
            favorite: updatedFavorite
          }).then((res) => {
            dispatch(setSelectedBoardRedux(res.data.data))
            setFavorite(res.data.data.favorite)
          }).catch((err) => {
            console.log(err)
          })
        }
    
      const handleOpenBoardDetails = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorBoard(event.currentTarget);
      };
    
    const handleCloseBoardDetails = () => {
        setAnchorBoard(null);
      };
    
      const handleAreYouSureButton = () => {
        setAreYouSureButton(true)
      }  
      
      const handleOpenMembersMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
      };

      const getMembers = async () => {
          for (const userId of selectedBoard?.members || []) {
            try {
              const res = await axios.get(`user/${userId}`);
              const userData = {
                id: res.data._id,
                username: res.data.username,
                firstName: res.data.firstName,
                lastName: res.data.lastName,
                email: res.data.email,
                color: res.data.color,
              };
              members.push(userData)
      
              // if (! (members?.some(member => member.id === userData.id) || userData.id === selectedBoard?.user)) {
              //   setMembers((prevMembers) => [...(prevMembers || []), userData]);
              // }
              return
    
            } catch (err) {
              console.log(err);
            }
          }
          setMembers([])
      };
    
      
    const deleteMember = async (user: User) => {  
    const userId = user.id
    const boardId = selectedBoard?._id
    const remainingMembers = members.filter((mem) => mem.id !== userId)
    await axios.put(`/board/${boardId}`, {
        members: remainingMembers
    }).then(()=> {
        toast.success(`Deleted user ${user.username} from board ${selectedBoard?.name}.`, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            progress: undefined,
            draggable: true,
            theme: "light",
        });  
        handleAreYouSureButtonClose()
        setMembers(remainingMembers)
        setSelectedBoard({...selectedBoard!, members: remainingMembers})
        getMembers()
        
    })
    }

  const handleDeleteBoard = async () => {
    const boardId = selectedBoard?._id;
    await axios.delete(`http://localhost:5000/board/${boardId}`)
      .then((res) => {
        toast.success('Board deleted successfully!', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          progress: undefined,
          draggable: true,
          theme: "light",
        });
        handleAreYouSureButtonClose();
        navigate('/home/boards')
      }).catch((err) => {
        console.log(err);
        toast.error('An error occurred while deleting the board. Please try again later.', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          progress: undefined,
          draggable: true,
          theme: "light",
        });
      });
  };

  const handleArchiveBoard = () => {
    archiveBoard(!isArchived)
  }

  const archiveBoard = async (value: boolean) => {
    const boardId = selectedBoard?._id;
    
    await axios.put(`http://localhost:5000/board/${boardId}`, {
      archived: value
    }).then((res) => {
      if (value) {
        navigate('/home/boards')

        toast.success(`Board ${selectedBoard?.name} archived.`, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            progress: undefined,
            draggable: true,
            theme: "light",
          });
      } else {
        if (boards) {
            const updated = [...boards, selectedBoard]
            dispatch(setBoards(updated))
        }
        toast.success(`Board ${selectedBoard?.name} unarchived.`, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            progress: undefined,
            draggable: true,
            theme: "light",
          });
          handleCloseBoardDetails()
        
      }
      }).catch((err) => {
      console.log(err)
    })  
  }

  const getUser = async (userId: string) => {
      try {
        const res = await axios.get(`http://localhost:5000/user/${userId}`);
        const userData = {
          id: res.data._id,
          username: res.data.username,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          email: res.data.email,
          color: res.data.color,
        };
        setBoardUser(userData);
      } catch (err) {
        console.log(err);
      }
  };

  const handleAreYouSureButtonClose = () => {
    setAreYouSureButton(false);
  };

  return (
    <div>
        <div style={{ borderBottom: '0.5px solid #ffffff73',}}>
          <div style={{
             display: 'flex', 
             alignItems: 'center', 
             alignContent: 'center', 
             justifyContent: 'center', 
             marginLeft: '20px',
             marginTop: '20px',
             height: '80px'
            }}>
            {
              isEditing ? (
                <Input
                  type="text"
                  value={boardName}
                  placeholder={selectedBoard?.name !== "" ? selectedBoard?.name : "Title can not be empty!"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoFocus
                  disableUnderline={true}
                  sx={{
                    color: selectedBoard?.color === 'linear-gradient(23deg, rgba(24,24,24,1) 0%, rgba(0,29,92,1) 100%)' ? 'white' : '#00000092'
                  }}
                />
            
              ) : (
                <Typography 
                  onDoubleClick={handleDoubleClick} 
                  variant='body1' 
                  sx={{ color: selectedBoard.color === 'linear-gradient(23deg, rgba(24,24,24,1) 0%, rgba(0,29,92,1) 100%)' ? 'white' : '#00000092',
                     ":hover" : { textDecoration: 'underline', color: selectedBoard.color === 'linear-gradient(23deg, rgba(24,24,24,1) 0%, rgba(0,29,92,1) 100%)' ? 'white' : '#00000092' }}}>
                    { boardName || selectedBoard.name }
                   
                </Typography>
              )
            }
          
          
            <IconButton disableRipple onClick={handleFavoriteChange} >
              {  favorite
                ? <StarIcon sx={{color: selectedBoard.color === 'linear-gradient(23deg, rgba(24,24,24,1) 0%, rgba(0,29,92,1) 100%)' ? 'white' : '#00000092'}}/>
                : <StarOutlineIcon style={{color: selectedBoard.color === 'linear-gradient(23deg, rgba(24,24,24,1) 0%, rgba(0,29,92,1) 100%)' ? 'white' : '#00000092'}} />
              }
            </IconButton>

            {loading ? (
              <CircularProgress style={{color: 'white', width: '20px', height: '20px'}} />
            ) : (
                <AvatarGroup>
                  {members?.map((member, index) => {
                    return <Tooltip title={member.firstName + ' ' + member.lastName} key={index}>
                            <IconButton disableRipple onClick={handleOpenMembersMenu}>
                              <Avatar alt={member.firstName} src="/static/images/avatar/2.jpg" key={index} style={{ background: member.color }}>
                              {member?.firstName.charAt(0) + member?.lastName.charAt(0)}
                              </Avatar>
                            </IconButton>
                        </Tooltip>
                    })}
      
                    <Tooltip title={boardUser ? boardUser?.firstName + ' ' + boardUser?.lastName : ''}>
                        <IconButton disableRipple onClick={handleOpenMembersMenu}>
                          <Avatar alt={boardUser?.firstName} src="/static/images/avatar/2.jpg" style={{ backgroundColor: boardUser?.color}}>
                            {boardUser ? boardUser?.firstName.charAt(0) + boardUser?.lastName.charAt(0) : ''}
                          </Avatar>
                        </IconButton>
                    </Tooltip>
                </AvatarGroup>
            )}
            
            

          <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10}}>
            <Link to={`calendarView`}>
              <IconButton>
                <CalendarMonthIcon sx={{ color: 'white'}} />
              </IconButton>
            </Link>


            <Button onClick={handleOpen} style={{ backgroundColor: 'white', color: 'black' }} >
              <ShareIcon style={{marginRight: 4}} />Share
            </Button>
            

            <Dialog open={open} fullWidth onClose={handleClose} PaperProps={{ sx: { backgroundColor: '#ebecf0', padding: 2 }}}>
            <form onSubmit={formik.handleSubmit}>
            <DialogTitle>
              <span style={{ fontStyle: 'italic', fontSize: '16px'}}>Share board</span>
              <Typography variant='h5'>
                {selectedBoard.name}
              </Typography>

            </DialogTitle>

            <DialogContent style={{ display: 'flex', flexDirection: 'column', gap: 20}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 10}}>
                <TextField
                  variant='outlined' 
                  label="Email address" 
                  fullWidth 
                  value={formik.values.email}
                  onChange={handleNewMemberEmailChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  name="email"
                />
              </div>
              

            </DialogContent>
            <DialogActions>
              <Button type='submit' disabled={!isModified} endIcon={<SendIcon />}>
                  INVITE
              </Button>
            </DialogActions>
            </form>
          </Dialog>

            <IconButton onClick={handleOpenBoardDetails}><MoreHorizIcon style={{
              color: selectedBoard.color === 'linear-gradient(23deg, rgba(24,24,24,1) 0%, rgba(0,29,92,1) 100%)' ? 'white' : '#00000092'
            }} /></IconButton>

            <Menu
              sx={{ mt: '70px'}}
              anchorEl={anchorBoard}
              anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
              }}
              slotProps={{
                paper: {
                  style: {borderRadius: '10px'}
                },
              }}            
              keepMounted
              transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
              }}
              
              open={Boolean(anchorBoard)}
              onClose={handleCloseBoardDetails}
            >
                {seeMembers ? (
                  <Box sx={{ width: '350px', height: 'auto', padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                    {members?.map((member, index) => {
                    return <>
                            <IconButton disableRipple onClick={handleOpenMembersMenu} sx={{width: '100%'}}>
                              <Avatar alt={member.firstName} src="/static/images/avatar/2.jpg" key={index} style={{ background: member.color }}>
                              {member?.firstName.charAt(0) + member?.lastName.charAt(0)}
                              </Avatar>
                              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                                <Typography variant='body1' ml={2}>{member?.firstName + " " + member?.lastName}</Typography>
                                <Typography variant='subtitle2' ml={2}>{member?.email}</Typography>
                              </div>
                              <div style={{flexGrow: 1}}></div>
                              { isBoardAdmin 
                                ? <IconButton onClick={handleAreYouSureButton} sx={{ ml: 'auto' }}>
                                    <Delete />
                                  </IconButton> 
                                : null
                              }
                            </IconButton>
                            {
                              areYouSureButton ? (
                              <div style={{ textAlign: 'center'}}>
                                <Typography variant='body2' sx={{marginBottom: 2}}><i>Are you sure you want to delete this user from board {selectedBoard.name}?</i></Typography>
                                <Button onClick={handleAreYouSureButtonClose}>
                                  Cancel
                                </Button>
                                <Button onClick={() => deleteMember(member)} sx={{backgroundColor: 'red', color: 'white', ":hover": {backgroundColor: 'rgba(255, 0, 0, 0.522)'}}}>
                                  Delete
                                </Button>
                              </div>
                              ) : (
                                null
                              )
                            } 
                          </>
                    })}
                    
                    <IconButton disableRipple onClick={handleOpenMembersMenu}>
                      <Avatar alt={boardUser?.firstName} src="/static/images/avatar/2.jpg" style={{ backgroundColor: boardUser?.color}}>
                        {boardUser ? boardUser?.firstName.charAt(0) + boardUser?.lastName.charAt(0)  : ''}
                      </Avatar>
                      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                        <Typography variant='body1' ml={2}>{boardUser?.firstName + " " + boardUser?.lastName + ' (Admin)'}</Typography>
                        <Typography variant='subtitle2' ml={2}>{boardUser?.email}</Typography>
                      </div>
                    </IconButton>
                    <IconButton disableRipple onClick={() => setSeeMembers(false)} style={{marginTop: 10, marginLeft: 10}}><ArrowBackIosIcon /></IconButton>
                  </Box>
                ) : (
                  <Box sx={{ width: '300px', height: 'auto', padding: 2, display: 'flex', flexDirection: 'column', }}>
                    <IconButton onClick={handleCloseBoardDetails} style={{alignSelf: 'flex-end' , color: 'black'}}>
                    <Close style={{ fontSize: '16px' }}/>
                    </IconButton>
                    <Typography style={{ alignSelf: 'center', marginBottom: '20px'}} variant='body2'>Board actions</Typography>
                    <Typography style={{ alignSelf: 'center', marginBottom: '20px'}} variant='h6'>{selectedBoard.name}</Typography>

                    <ListItem>
                      <ListButton onClick={() => setSeeMembers(true)}>
                        <div style={{display: 'flex', alignContent: 'center', gap: 4}}>
                          <GroupIcon sx={{fontSize:'20px'}}/>
                          <Typography variant='body2'>See members</Typography>
                        </div>
                      </ListButton>
                    </ListItem>
                            
                    <Divider />
                    <ListItem>
                      <ListButton onClick={handleArchiveBoard}>{isArchived ? 'Unarchive' : 'Archive'}</ListButton>
                    </ListItem>
                    <ListItem>
                      <ListButton onClick={handleAreYouSureButton}>Delete</ListButton>
                    </ListItem> 
                    {
                      areYouSureButton ? (
                      <div style={{ textAlign: 'center'}}>
                        <Typography variant='body2' sx={{marginBottom: 2}}><i>Are you sure you want to delete this board?</i></Typography>
                        <Button onClick={handleAreYouSureButtonClose}>
                          Cancel
                        </Button>
                        <Button onClick={handleDeleteBoard} sx={{backgroundColor: 'red', color: 'white', ":hover": {backgroundColor: 'rgba(255, 0, 0, 0.522)'}}}>
                          Delete
                        </Button>
                      </div>
                      ) : (
                        null
                      )
                    }         
                  </Box>
                )}
               
            </Menu>
          </div>
          </div>

        </div>
      
    </div>
  )
}

export default BoardBar
