  import React, { ChangeEvent, useEffect, useState } from 'react'
  import { DragDropContext, DragUpdate, DropResult, Droppable, ResponderProvided } from 'react-beautiful-dnd';
  import Column from './Column';
  import styled, { createGlobalStyle } from 'styled-components';
  import AddIcon from '@mui/icons-material/Add';
  import { Avatar, AvatarGroup, Box, Button, ButtonGroup, Card, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Input, InputAdornment, Menu, TextField, Tooltip, Typography } from '@mui/material';
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

  import { useFormik } from 'formik';
import { Link } from 'react-router-dom';

  interface BoardComponentsProps {
      selectedBoard: Board | null,
      onDragEnd: (result: DropResult) => void,
      user: {
        id: string;
        username: string;
        email: string;
      };
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

  const BoardName = styled.span`

    &:hover {
      text-decoration: underline;
      color: #00000092;
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
    const [newMemberEmail, setNewMemberEmail] = useState('');
    const [favorite, setFavorite] = useState(selectedBoard?.favorite);
    const [members, setMembers] = useState<User[]>([])
    const [isEditing, setIsEditing] = useState(false);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const dispatch = useDispatch();
    const selectedBoardRedux = useSelector((state: AppState) => state.selectedBoard);
    const [boardUser, setBoardUser] = useState<User>()
    const [loading, setLoading] = useState(true); 

    const handleOpenMembersMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElUser(event.currentTarget);
    };
  
    const handleCloseMembersMenu = () => {
      setAnchorElUser(null);
    };


    useEffect(() => {
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
        await axios.put(`http://localhost:5000/board/add-to-favorites/${selectedBoard?._id}`, {
          favorite: !favorite
        }).then((res) => {
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
          tasks: []
        }).then( async (response) => {
          await updateBoard(response.data.data._id);
          //response.data.data._id //new column id
          selectedBoard?.columns.push({ _id: response.data.data._id, title: response.data.data.title, tasks: []})
        
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

    return (
      <>
      {selectedBoard ? ( 
        <div>
          <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.042)', display: 'flex', alignItems: 'center', gap: 14, padding: '16px', marginTop: '61px', height: '50px' }}>
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
                <BoardName onDoubleClick={handleDoubleClick}>
                    { boardName || selectedBoard.name }
                </BoardName>
              )
            }
            
            
            <IconButton disableRipple onClick={handleFavoriteChange} >
              { selectedBoard.favorite || favorite
                ? <StarIcon />
                : <StarOutlineIcon style={{color: 'rgba(17, 17, 17, 0.503)'}} />
              }
            </IconButton>

              {loading 
                ? <CircularProgress style={{ width: '20px', height: '20px', color: 'white'}}/>
                : <AvatarGroup>
                    {members?.map((member, index) => {
                      return <Tooltip title={member.username} key={index}>
                              <IconButton disableRipple onClick={handleOpenMembersMenu}>
                                <Avatar alt={member.username} src="/static/images/avatar/2.jpg" key={index} style={{ background: member.color }}/>
                              </IconButton>
                          </Tooltip>
                      })}
        
                      <Tooltip title={boardUser?.username}>
                          <IconButton disableRipple onClick={handleOpenMembersMenu}>
                            <Avatar alt={boardUser?.username} src="/static/images/avatar/2.jpg" style={{ backgroundColor: boardUser?.color}} />
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
                <StyledButton type='submit' disabled={!isModified}>
                    INVITE
                  <SendIcon style={{ fontSize: 18, marginLeft: 5}}/>
                </StyledButton>
              </DialogActions>
              </form>
            </Dialog>


              <IconButton disableRipple><MoreHorizIcon /></IconButton>
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
                            {selectedBoard  ?.columns?.map((column, index) => {
                                return <Column 
                                          key={column._id} 
                                          column={column} 
                                          tasks={column.tasks} 
                                          index={index} 
                                          draggingOverIndex={draggingOverIndex} 
                                          selectedBoard={selectedBoard}
                                          members={members}
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
