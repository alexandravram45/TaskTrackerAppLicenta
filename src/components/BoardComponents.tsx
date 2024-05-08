  import React, { ChangeEvent, useEffect, useState } from 'react'
  import { DragDropContext, DragUpdate, DropResult, Droppable, ResponderProvided } from 'react-beautiful-dnd';
  import Column from './Column';
  import styled, { createGlobalStyle } from 'styled-components';
  import AddIcon from '@mui/icons-material/Add';
  import { Avatar, AvatarGroup, Box, Button, ButtonGroup, Card, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Input, ListItem, Menu, TextField, Tooltip, Typography } from '@mui/material';
  import { Board } from './Home'
  import StarOutlineIcon from '@mui/icons-material/StarOutline';
  import ShareIcon from '@mui/icons-material/Share';
  import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
  import * as Yup from 'yup';
  import CheckIcon from '@mui/icons-material/Check';
  import CloseIcon from '@mui/icons-material/Close';
  import axios from 'axios';
  import { toast } from 'react-toastify';
  import { useDispatch, useSelector } from 'react-redux';
  import { AppState, setSelectedBoardRedux } from '../store';
  import { StyledButton } from './Task';
  import SendIcon from '@mui/icons-material/Send';
  import StarIcon from '@mui/icons-material/Star';
  import { User } from '../App';
  import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
  import GroupIcon from '@mui/icons-material/Group';
  import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import Close from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

  interface BoardComponentsProps {
      selectedBoard: Board | null,
      onDragEnd: (result: DropResult) => void,
      user: User
  }

  const GlobalScrollbarStyle = createGlobalStyle`
    ::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }

    ::-webkit-scrollbar-thumb {
      background-color: #0000002f;
      border-radius: 5px;
    }

    ::-webkit-scrollbar-track:hover {
      background-color: #00000014;
    }

    ::-webkit-scrollbar-thumb:hover {
      background-color: #01010164;
    }
  `;

  const ColumnContainer = styled.div`
    height: 80vh; 
    overflow: auto;
    display: grid;
    grid-auto-flow: column;
    align-items: flex-start;

    @media (max-width: 800px) { /* Ajustați lățimea de ecran pentru dispozitivele mobile */
      grid-auto-flow: row; /* Schimbați direcția fluxului pe vertical */
      align-items: normal;
    } 
  `;

  const ListButton = styled.button`
    width: 100%;
    text-align: left;
    padding: 10px;
    border: none;
    font-family: 'Poppins';
    background-color: transparent;
    cursor: pointer;
    color: ${props => props.theme.palette === 'dark' ? 'white' : 'inherit'}; // Setează culoarea textului în funcție de tema selectată

    &:hover {
      background-color: rgba(126, 40, 255, 0.122);
    }
  `;


  const AddNewCardButton = styled(Button)`
    && {
      text-transform: none;
      background-color: rgba(255, 255, 255, 0.249);
      
      border-radius: 16px;
      display: flex;
      width: 300px;
    
      color: #172b4d;
      padding: 8px;
      margin: 10px;
      transition: background-color 0.3s;
      justify-content: flex-start;

      &:hover {
        background-color: rgba(255, 255, 255, 0.582);
      }

      .MuiSvgIcon-root {
        margin-right: 8px;
      }

      @media (max-width: 800px) { /* Ajustați lățimea de ecran pentru dispozitivele mobile */
        height: 40px
    } 
    }
  `;



  const ColumnCard = styled(Card)`
    width: 300px;
    margin: 10px;
    padding: 10px;
    font-size: small;
    border-radius: 20px !important;

    display: block;
    transition-duration: 0.3s;
    position: relative;
    float: left;
    background-color: #ebecf0 !important;
    color: #172b4d !important;

    @media (max-width: 800px) {
      flex-direction: column;
      height: auto;
      width: 20px;
    }
  `;


  const BoardComponents:React.FC<BoardComponentsProps> = ({ selectedBoard, onDragEnd, user }) => {
    const [draggingOverIndex, setDraggingOverIndex] = useState(0)
    const [addNewColumnStyle, setNewColumnStyle] = useState({display: 'none'})
    const [addButtonStyle, setAddButtonStyle] = useState({display: 'flex'})
    const [boardName, setBoardName] = useState("")
    const [open, setOpen] = useState(false);
    const [isModified, setIsModified] = useState(false);
    const [favorite, setFavorite] = useState(selectedBoard?.favorite);
    const [members, setMembers] = useState<User[]>([])
    const [isEditing, setIsEditing] = useState(false);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const dispatch = useDispatch();
    const selectedBoardRedux = useSelector((state: AppState) => state.selectedBoard);
    const [boardUser, setBoardUser] = useState<User>()
    const [loading, setLoading] = useState(true); 
    const avatarLetters = user ? user?.firstName.charAt(0) + user?.lastName.charAt(0) : '';
    const navigate = useNavigate()
    const [seeMembers, setSeeMembers] = useState(false)

    const handleOpenMembersMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElUser(event.currentTarget);
    };
  
    const handleCloseMembersMenu = () => {
      setAnchorElUser(null);
    };


    useEffect(() => {
      setFavorite(selectedBoard?.favorite || false)
      setBoardName(selectedBoard?.name || "");

      setLoading(true);

      // Amână afișarea membrilor și a utilizatorului de bord cu 500ms
      const timeout = setTimeout(() => {
        getMembers().then(() => setLoading(false));
      }, 500);
    
      // Curăță timeout-ul dacă componenta este demontată înainte de expirarea celor 500ms
      
      if (selectedBoard && selectedBoard.user) {
        // Only call getUser if selectedBoard and selectedBoard.user are not null or undefined
        getUser(selectedBoard.user);
      }
            // console.log(selectedBoard?.favorite)
      // console.log(selectedBoard?.user)
      console.log(selectedBoard?.members)
      console.log(boardUser)
      console.log(members)
      return () => clearTimeout(timeout);

    }, [selectedBoard?._id]); // Efectul se declanșează ori de câte ori se schimbă selectedBoard
    
    useEffect(() => {
      setFavorite(selectedBoardRedux?.favorite)
    }, [selectedBoardRedux])

    const handleDoubleClick = () => {
      setIsEditing(true);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const updatedName = e.target.value;
      setBoardName(updatedName); 
      // dispatch(setSelectedBoardRedux(selectedBoard)) 
    };
    
    const handleBlur = async () => {
      setIsEditing(false);
      
      if (boardName?.trim() !== '') {
        await axios.put(`http://localhost:5000/board/update-name/${selectedBoard?._id}`, {
          name: boardName,
        }).then((res) => {
          console.log(res.data)
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
    
    const [columnTitle, setColumnTitle] = useState("")
    
    const addNewColumn = async (event: React.MouseEvent<HTMLElement>) => {
      setNewColumnStyle({display: 'block'})
      setAddButtonStyle({ display: 'none' })
    }

    const giveUp = async (event: React.MouseEvent<HTMLElement>) => {

      setNewColumnStyle({display: 'none'})
      setAddButtonStyle({ display: 'flex' })
    }

    const onDragUpdate = (update: DragUpdate, provided: ResponderProvided) => {
      const { destination } = update;
      if (!destination) return;
      setDraggingOverIndex(destination.index);
    };

    const handleOpen = () => {
      setOpen(true);
    };
    
    const handleClose = () => {
      setOpen(false);
    };

    const handleFavoriteChange = async () => {
      const updatedFavorite = !favorite; // Inversăm valoarea pentru a reflecta acțiunea de adăugare/ștergere din favorite

        await axios.put(`http://localhost:5000/board/add-to-favorites/${selectedBoard?._id}`, {
          favorite: updatedFavorite
        }).then((res) => {
          dispatch(setSelectedBoardRedux(res.data.data))
          setFavorite(res.data.data.favorite)
          console.log(res.data.data.favorite)
        }).catch((err) => {
          console.log(err)
        })
      }

    const handleNewMemberEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
      formik.handleChange(e);
      setIsModified(true);
    };

    const shareInvitationLink = async (email: string, boardId: string | undefined, userId: string) => {
      await axios.post(`http://localhost:5000/user/${userId}/invite/${boardId}`, {
        email: email,
        invitedBy: user.email,
      }).then((res) => {
        console.log(res.data)
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

    const getUser = async (userId: string) => {
      console.log(selectedBoard?.user)
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
    
          // Verifică dacă membrul este deja în listă
          setBoardUser(userData);
          // console.log(res.data);
        } catch (err) {
          console.log(err);
        }
    };

    const getMembers = async () => {
      console.log(selectedBoard?.members)
      console.log(members)
      if (selectedBoard) {
        for (const userId of selectedBoard.members || []) {
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
    
            // Verifică dacă membrul este deja în listă
            if (! (members?.some(member => member.id === userData.id) || userData.id === selectedBoard.user)) {
              setMembers((prevMembers) => [...(prevMembers || []), userData]);
            }
            console.log(members)
            return

          } catch (err) {
            console.log(err);
          }
        }
        setMembers([])
      }
    };
    
    

    const validationSchema = Yup.object().shape({
      email: Yup.string().email().required('email is required'),
    });

    const formik = useFormik({
      initialValues: {
        email: '',
      },
      validationSchema,
      onSubmit: (values) => {
        shareInvitationLink(values.email, selectedBoard?._id, user.id)
      },
    });


    const updateBoard = async (columnId: string) => {

      const getBoard = await axios.get(`http://localhost:5000/board/${selectedBoard?._id}`);
      const board = getBoard.data;
      
      const updatedColumns = [...board.columns, columnId]; // Assuming taskIds is an array of taskIds
      console.log(updatedColumns)
    
      await axios.put(`http://localhost:5000/board/${selectedBoard?._id}`, {
        columns: updatedColumns
      }).then((res) => {
        dispatch(setSelectedBoardRedux(res.data.data))
        console.log(selectedBoardRedux)
        console.log(res.data.data)
        }).catch((err) => {
        console.log(err)
      })  
    }

    const addColumn = async (event: React.MouseEvent<HTMLElement>) => {

      event.preventDefault();

      if (columnTitle !== ""){
        await axios.post('http://localhost:5000/column', {
          title: columnTitle,
          boardId: selectedBoard?._id,
          tasks: [], 
        }).then( async (response) => {
          await updateBoard(response.data.data._id);
          //response.data.data._id //new column id
          selectedBoard?.columns.push({ _id: response.data.data._id, title: response.data.data.title, tasks: [], done: false})
        
          setColumnTitle("");

          setAddButtonStyle({display: 'flex'});
          setNewColumnStyle({display: 'none '})
        })
        .catch((error) => {
          console.log(error.message)
        })
      } else {
        toast.error('The column title should not be empty!', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          progress: undefined,
          draggable: true,
          theme: "light",
        });

      }
    }

  const [anchorBoard, setAnchorBoard] = useState<null | HTMLElement>(null);
  const [areYouSureButton, setAreYouSureButton] = useState(false);


    const handleOpenBoardDetails = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorBoard(event.currentTarget);
    };
  
  const handleCloseBoardDetails = () => {
      setAnchorBoard(null);
    };

    const handleAreYouSureButton = () => {
      setAreYouSureButton(true)
    }

    const handleAreYouSureButtonClose = () => {
      setAreYouSureButton(false);
    };

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
          navigate('/boards')
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
  

    return (
      <>
      {selectedBoard ? ( 
        <div>
          <div style={{ borderBottom: '0.5px solid #ffffff73',}}>
            <div style={{
               display: 'flex', 
               alignItems: 'center', 
               alignContent: 'center', 
               justifyContent: 'center', 
               marginLeft: '20px',
               padding: 8, height: '80px'
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
                  />
              
                ) : (
                  <Typography 
                    onDoubleClick={handleDoubleClick} 
                    variant='body1' 
                    sx={{ ":hover" : { textDecoration: 'underline', color: '#00000092' }}}>
                      { boardName || selectedBoard.name }
                  </Typography>
                )
              }
            
            
              <IconButton disableRipple onClick={handleFavoriteChange} >
                {  favorite
                  ? <StarIcon />
                  : <StarOutlineIcon style={{color: 'rgba(17, 17, 17, 0.503)'}} />
                }
              </IconButton>

              {loading 
                ? <CircularProgress style={{ width: '20px', height: '20px', color: 'white'}}/>
                : <AvatarGroup>
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
              }

            <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10}}>
              <Link to={`calendarView`}>
                <IconButton>
                  <CalendarMonthIcon sx={{ color: 'white'}} />
                </IconButton>
              </Link>


              <Button onClick={handleOpen} style={{ backgroundColor: 'white', color: 'black' }}>
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


              <IconButton onClick={handleOpenBoardDetails}><MoreHorizIcon  /></IconButton>

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
                    <Box sx={{ width: '300px', height: 'auto', padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                      {members?.map((member, index) => {
                      return <IconButton disableRipple onClick={handleOpenMembersMenu}>
                                <Avatar alt={member.firstName} src="/static/images/avatar/2.jpg" key={index} style={{ background: member.color }}>
                                {member?.firstName.charAt(0) + member?.lastName.charAt(0)}
                                </Avatar>
                                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                                  <Typography variant='body1' ml={2}>{member?.firstName + " " + member?.lastName}</Typography>
                                  <Typography variant='subtitle2' ml={2}>{member?.email}</Typography>
                                </div>
                               
                              </IconButton>
                      })}
                      <IconButton disableRipple onClick={handleOpenMembersMenu}>
                        <Avatar alt={boardUser?.firstName} src="/static/images/avatar/2.jpg" style={{ backgroundColor: boardUser?.color}}>
                          {boardUser ? boardUser?.firstName.charAt(0) + boardUser?.lastName.charAt(0) : ''}
                        </Avatar>
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                          <Typography variant='body1' ml={2}>{boardUser?.firstName + " " + boardUser?.lastName}</Typography>
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
                        <ListButton>Archive</ListButton>
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

                <div style={{ marginLeft: '20px', marginTop: '20px'}}>
                  <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
                      <Droppable droppableId='all-columns' direction='horizontal' type='column'>
                        {provided => (
                        <ColumnContainer
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                            {selectedBoard?.columns?.map((column, index) => {
                                return <Column 
                                          key={column._id} 
                                          column={column} 
                                          tasks={column.tasks} 
                                          index={index} 
                                          draggingOverIndex={draggingOverIndex} 
                                          selectedBoard={selectedBoard}
                                          members={members}
                                          done={column.done}
                                        />;
                            })}
                            <ColumnCard style={addNewColumnStyle}>
                            <GlobalScrollbarStyle />
                              <Input
                                placeholder="Enter column title..." 
                                disableUnderline={true} 
                                multiline={true} 
                                minRows={2} 
                                value={columnTitle} 
                                onChange={(e) => setColumnTitle(e.target.value)}
                              />

                                <ButtonGroup  orientation='vertical' color='secondary' style={{float: 'right' }}>
                                  <Button onClick={addColumn}>
                                    <CheckIcon />
                                  </Button>
                                  <Button onClick={giveUp}>
                                    <CloseIcon />
                                  </Button>
                                </ButtonGroup>
                            </ColumnCard>
                              <AddNewCardButton style={addButtonStyle} onClick={addNewColumn}>
                                <AddIcon />
                                <span>Add a column</span>
                              </AddNewCardButton>
                          {provided.placeholder}
                        </ColumnContainer>
                        )}
                      </Droppable>
                    </DragDropContext>
                  
                </div>
        </div>
          
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%', marginTop: '200px' }}>
        <CircularProgress  style={{ color: 'whitesmoke' }}/>
        {/* <p>Select a board</p> */}
      </div>
      )}
          
        
      </>
    )
  }

  export default BoardComponents
