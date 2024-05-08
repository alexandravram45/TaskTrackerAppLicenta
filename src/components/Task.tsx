  import React, { ChangeEvent, useEffect, useState } from 'react';
  import { Draggable } from 'react-beautiful-dnd';
  import styled, { useTheme } from 'styled-components';
  import { Avatar, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Tooltip, Typography, darken } from '@mui/material';
  import EditIcon from '@mui/icons-material/Edit';
  import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
  import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
  import { ClockIcon, DatePicker, DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
  import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
  import axios from 'axios';
  import { toast } from 'react-toastify';
  import * as Yup from 'yup';
  import { useFormik } from 'formik';
  import dayjs from 'dayjs';
  import ReactQuill from 'react-quill';
  import StarIcon from '@mui/icons-material/Star';
  import { Board } from './Home';
  import { useDispatch, useSelector } from 'react-redux';
  import {AppState, setSelectedBoardRedux } from '../store';
  import GroupIcon from '@mui/icons-material/Group';
  import { User } from '../App';
  import DeleteIcon from '@mui/icons-material/Delete';
  import 'react-quill/dist/quill.snow.css';
  import 'react-quill/dist/quill.bubble.css'
  import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
  import SmsIcon from '@mui/icons-material/Sms';

import { formats, modules } from '../colors';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Check from '@mui/icons-material/Check';
import AutoAwesome from '@mui/icons-material/AutoAwesome';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';

  interface ContainerProps {
    isdragging: boolean;
  }
  
  interface TaskProps {
    task: { title: string, description: string | null, dueDate: Date | null, _id: string, points: number | null, assignee: string | null, done: Boolean | null };
    index: number;
    selectedBoard: Board | null;
    done: Boolean;
  }
  interface Comment {
    _id: string,
    content: string,
    taskId: string,
    userId: string,
    user: User,
    createdAt: Date
  }


  const IconButtonStyled = styled(IconButton)`
    opacity: 0;
    transition: opacity 0.3s ease;

    &:hover {
      color: lightGray;
    }
  `;

  const TaskCard = styled(Card)<ContainerProps>`
    padding: 12px;
    border-radius: 10px !important;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:hover {
      ${IconButtonStyled} {
        opacity: 0.5;
      }
    }
  `;

  export const StyledButton = styled(Button)`
    background-color: rgb(198, 197, 197);
    color: white;

    &:hover {
      background-color: 'rgb(1, 10, 22)';
    }
  `;


  const Task: React.FC<TaskProps> = ({ task, index, selectedBoard, done }) => {

    const [open, setOpen] = useState(false);
    const [isModified, setIsModified] = useState(false);
    const taskDate = task.dueDate ? new Date(task.dueDate) : null;
    const isInThePast = taskDate ? (taskDate.getTime() < Date.now() ? true : false) : false;

    const month = task.dueDate ? new Date(task.dueDate).toLocaleString('default', { month: 'short' }) : '';
    const day = task.dueDate ? new Date(task.dueDate).getDate() : '';

    // const [daysRemaining, setDaysRemaining] = useState(task.dueDate ? dayjs(task.dueDate).diff(dayjs(), 'day') : null)
    const [members, setMembers] = useState<User[]>([])
    const remainingTime = task.dueDate ? dayjs(task.dueDate).diff(dayjs(), 'hour') : null;
    // const daysRemaining = remainingTime !== null ? Math.floor(remainingTime / 24) : null;
    const hoursRemaining = remainingTime !== null ? remainingTime % 24 : null;
    // const [members, setMembers] = useState<User[]>()
    const [boardUser, setBoardUser] = useState<User>()
    const dispatch = useDispatch()
    const [assigneeUser, setAssigneeUser] = useState<User | null>()
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [description, setDescription] = useState(task.description)
    const [commentValue, setCommentValue] = useState('')
    const [commentDisabled, setCommentDisabled] = useState(true)
    const [comments, setComments] = useState<Comment[]>([])
    const currentUser = useSelector((state: AppState) => state.currentUser);

    const isMyTask = task.assignee === currentUser?.id && task.done;
    
    useEffect(() => {
      axios.get(`http://localhost:5000/board/${selectedBoard?._id}`)
        .then((res) => {
          setSelectedBoardRedux(res.data)
        }).catch((err)=> {
          console.log(err)
        })

    }, [selectedBoard, task._id])

    useEffect(() => {
      if (selectedBoard?.user){
        getUser(selectedBoard?.user).then((res) => setBoardUser({
          id: res._id,
          username: res.username,
          firstName: res.firstName,
          lastName: res.lastName,
          email: res.email,
          color: res.color,
        }))
      }
      if (task.assignee){
        getUser(task.assignee).then((res) =>{
          setAssigneeUser(res)
        } )
      }
    }, [selectedBoard?._id])

    const handleOpen = async () => {
      setOpen(true);
      getMembers()
      getAllComments(task._id)
      console.log(task.assignee)
      
      console.log(members)
      console.log(boardUser)

    };
    
    const handleClose = () => {
      setOpen(false);
    };

    const handleDeleteOpen = () => {
      setConfirmDeleteOpen(true);
    };
    
    const handleDeleteClose = () => {
      setConfirmDeleteOpen(false);
    };

    const validationSchema = Yup.object().shape({
      title: Yup.string().required('Title is required'),
      dueDate: Yup.date().nullable(),
      points: Yup.number().nullable(),
      assignee: Yup.string().nullable()
    });
    
    const formik = useFormik({
      initialValues: {
        title: task.title,
        dueDate: task.dueDate,
        points: task.points,
        assignee: task.assignee
      },
      validationSchema,
      onSubmit: (values) => {
        updateTask(values.title, description, values.dueDate, values.points, values.assignee);
      },
    });

    const handleDescriptionChange = (e: any) => {
      setDescription(e)
      setIsModified(true);
    };

    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
      formik.handleChange(e);
      setIsModified(true);
    };
    
    const handleDueDateChange = (value: any) => {
      formik.setFieldValue('dueDate', value);
      setIsModified(true);
    };

    const handlePointsChange = (e: SelectChangeEvent<number | null>) => {
      const value = e.target.value as number; // Convertiți valoarea la tipul potrivit
      formik.setFieldValue('points', value); // Actualizați valoarea în formik
      setIsModified(true);
    };
    
    const handleAssigneeChange = (e: SelectChangeEvent<string | null>) => {
      const value = e.target.value as string;
      if (value === "None") {
        formik.setFieldValue('assignee', null);
      } else {
        formik.setFieldValue('assignee', value);
      }
      setIsModified(true);
      console.log(value)

    };
  
    const sendEmailToUser = async (userId: string, boardId: string, email: string) => {
      await axios.post(`http://localhost:5000/user/${userId}/assign/${boardId}`, {
        email: email,
        taskTitle: task.title,
        boardTitle: selectedBoard?.name
      }).then((res) => {
        console.log(res.data)
      }).catch((err) => {
        console.log(err)
      })
    }
    
    const updateTask = async (title: string, description: string | null, dueDate: Date | null, points: number | null, assignee: string | null | undefined) => {
      
      if (!formik.isValid) {
        return;
      }
      if (assignee && assignee !== 'None'){
        await getUser(assignee).then(async (res) => {
          setAssigneeUser(res)
        })
       
      } else {
        assignee = null;
      }

      await axios.put(`http://localhost:5000/tasks/${task._id}`, {
        description,
        dueDate,
        title,
        points,
        assignee,
      }).then((res) => {
        toast.success('Task saved!', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          progress: undefined,
          draggable: true,
          theme: "light",
        });

        const updatedTask = res.data.data;
        console.log(updatedTask)
        // console.log(task.assignee)

        if (assignee && assignee !== "Null" && selectedBoard && assigneeUser) {
          sendEmailToUser(assignee, selectedBoard?._id, assigneeUser.email).then((res) => {
            console.log(res)
          }).catch((err)=> {
            console.log(err)
          })
        }

        const newDaysRemaining = updatedTask.dueDate ? dayjs(updatedTask.dueDate).diff(dayjs(), 'day') : null;
            // setDaysRemaining(newDaysRemaining);  s    

            // const index = selectedBoard?.tasks.findIndex((task) => task._id === updatedTask._id)
            // console.log(index)

            // if (index) selectedBoard?.tasks.splice(index, 1, updatedTask)

        dispatch(setSelectedBoardRedux(selectedBoard))

        setIsModified(false);
      }).catch((err) => {
        console.log(err)
      });
    }

    const getUser = async (userId: string | User) => {
      try {
        const res = await axios.get(`http://localhost:5000/user/${userId}`);
        return res.data

      } catch (err) {
        console.log(err);
      }
  };

  const getMembers = async () => {
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

  const handleDeleteTask = async () => {
    const boardId = selectedBoard?._id;
    await axios.delete(`http://localhost:5000/tasks/${task._id}/${boardId}`)
      .then((res) => {
        toast.success('Task deleted successfully!', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          progress: undefined,
          draggable: true,
          theme: "light",
        });
        const id = res.data.data._id;
        console.log(res.data.data._id)
  
        dispatch(setSelectedBoardRedux(selectedBoard))
        handleDeleteClose();
        handleClose()
      }).catch((err) => {
        console.log(err);
        toast.error('An error occurred while deleting the task. Please try again later.', {
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

  const handleCommentPost = async () => {
    const content = commentValue
    const userId = currentUser?.id
    const taskId = task._id
    const createdAt = new Date(Date.now())

    if (content === ''){
      return;
    } else {
      await axios.post('http://localhost:5000/comment', {
        content, 
        userId, 
        taskId,
        createdAt
      }).then((res) => {
        console.log(res.data)
        setCommentDisabled(true)
        setCommentValue('')
        getAllComments(task._id)
      }).catch((err) => {
        console.log(err)
      })
    }
    
  }

  const handleCommentChange = (e: any) => {
    const newValue = e.target.value;
    setCommentValue(newValue);

    if (newValue.trim() == ''){
      setCommentDisabled(true)
    } else {
      setCommentDisabled(false)
    }
  }

  const getAllComments = async (taskId: string) => {
    await axios.get(`http://localhost:5000/comment/${taskId}`).then((res) => {
      console.log(res.data.data);
      const commentsWithUsers = res.data.data.map(async (comment: Comment) => {
        const userRes = await axios.get(`http://localhost:5000/user/${comment.userId}`);
        return { ...comment, user: {
          username: userRes.data.username,
          color: userRes.data.color,
          firstName: userRes.data.firstName,
          lastName: userRes.data.lastName,
        } };
      });
      Promise.all(commentsWithUsers).then((commentsWithUsersResolved) => {
        setComments(commentsWithUsersResolved);
      });
    }).catch((err) => {
      console.log(err);
    });
  };

  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.round(diffMs / 1000);
    const diffMinutes = Math.round(diffSeconds / 60);
    const diffHours = Math.round(diffMinutes / 60);
    const diffDays = Math.round(diffHours / 24);
    const diffWeeks = Math.round(diffDays / 7);
    const diffYears = Math.round(diffDays / 365);
  
    if (diffSeconds < 60) {
      return 'just now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    } else if (diffWeeks < 52) {
      return `${diffWeeks} week${diffWeeks === 1 ? '' : 's'} ago`;
    } else {
      return `${diffYears} year${diffYears === 1 ? '' : 's'} ago`;
    }
  };
  
    return (
      <>
        <Draggable draggableId={task._id} index={index}>
        {(provided, snapshot) => (
          <TaskCard
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            isdragging={snapshot.isDragging}
            // style={{ backgroundColor: done ? 'rgb(158, 251, 175)' : 'white'}}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%'}}>
              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <div style={{ alignItems: 'center', display: 'flex' , gap: 6}}>

                <Typography variant='body2'>
                  {task.title}
                </Typography>
                {/* {done ? <Check style={{color: 'green'}}/> : null} */}
                {isMyTask ? (
                  <Tooltip title={'Congrats! You got ' + task.points + ' points for this task.'}>
                    <AutoAwesome fontSize='small' sx={{color: 'rgba(0, 0, 0, 0.482)'}} />
                  </Tooltip>
                ) : null}
                </div>

                <IconButtonStyled disableRipple onClick={handleOpen} style={{ marginTop: '-8px'}} >
                  <EditIcon style={{ fontSize: '20px' }}/>
                </IconButtonStyled>
              </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
              {
                task.dueDate ? (
                  <div style={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center', flex: 1 }}>
                    <ClockIcon style={{ width: '20px', color: isInThePast ? "rgba(255, 0, 0, 0.468)" : "rgba(0, 0, 0, 0.344)"}}/>
                    <Typography variant='subtitle2' sx={{ color: isInThePast ? "rgba(255, 0, 0, 0.468)" : "rgba(0, 0, 0, 0.344)", fontSize: '12px'}}>{day} {month}</Typography>
                  </div>
                ) : null
              }
              {
                task.assignee ? (
                    <Avatar alt={assigneeUser ? assigneeUser?.firstName + assigneeUser?.lastName : ''} src="/static/images/avatar/2.jpg" style={{ width: '24px', height: '24px', fontSize: '14px', marginRight: 4, backgroundColor: assigneeUser?.color }}>
                      {assigneeUser ? assigneeUser?.firstName.charAt(0) + assigneeUser?.lastName.charAt(0) : ''}
                    </Avatar>
                ) : null
              }
              {
                task.points ? (
                  <div style={{ borderRadius: '50%', width: '26px', height: '26px', backgroundColor: 'rgba(208, 208, 208, 0.312)', textAlign: 'center'}}>
                    <Typography>{task.points} </Typography>

                  </div>
                ) : null
              }
              </div>
            </div>

            <Dialog open={open} fullWidth onClose={handleClose} PaperProps={{ sx: {padding: 2, minWidth: '700px' }}}>
              <form onSubmit={formik.handleSubmit}>
              <DialogTitle>
                
              <TextField  
                  type="text"
                  fullWidth
                  value={formik.values.title}
                  onChange={handleTitleChange}
                  onBlur={formik.handleBlur}
                  autoFocus
                  name="title"
                  variant='standard'
                  InputProps={{ disableUnderline: true }}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                />

              </DialogTitle>
              
              <DialogContent style={{ display: 'flex', flexDirection: 'column', gap: 20}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                  <FormatListBulletedIcon />
                <ReactQuill
                  theme='snow'
                  value={description}
                  onChange={handleDescriptionChange}
                  style={{backgroundColor:'rgba(145, 205, 245, 0.092)', borderRadius: '6px', marginTop: 10, width: '100%'}}
                />
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                  <CalendarMonthIcon />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker 
                      label="Due date" 
                      value={dayjs(formik.values.dueDate)}
                      onChange={handleDueDateChange}
                      sx={{ width: '100%', backgroundColor:'rgba(145, 205, 245, 0.092)'}}
                    />
                  </LocalizationProvider>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', gap: 20}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 10, width: '35%'}}>
                    <StarIcon />
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Story Points</InputLabel>
                      <Select
                        labelId="points-label"
                        id="points"
                        name='points'
                        label="Story Points"
                        defaultValue={0}
                        value={formik.values.points} // Adăugați valoarea selectată
                        onChange={handlePointsChange} // Actualizați valoarea când se schimbă selecția
                        error={formik.touched.points && Boolean(formik.errors.points)}
                        style={{backgroundColor: 'rgba(145, 205, 245, 0.092)', borderRadius: '6px'}}
                      >
                        <MenuItem value={0}>-</MenuItem>

                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={8}>8</MenuItem>
                        <MenuItem value={13}>13</MenuItem>
                        <MenuItem value={21}>21</MenuItem>
                      </Select>

                    </FormControl>
                  </div>

                  <div style={{display: 'flex', alignItems: 'center', gap: 10, width: '65%'}}>
                    <GroupIcon />
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Assignee</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Assignee"
                        value={ formik.values.assignee  } 
                        onChange={handleAssigneeChange}
                        style={{backgroundColor: 'rgba(145, 205, 245, 0.092)', borderRadius: '6px'}}
                      >
                        <MenuItem key="" value="None">None</MenuItem>
                        {members?.map((member) => {
                          return <MenuItem key={member.id} value={member.id}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar key={member.id} alt={member.firstName + ' ' + member.lastName} src="/static/images/avatar/2.jpg" style={{ width:'30px', height:'30px', marginRight: 4, backgroundColor: member.color}}>
                              {member.firstName.charAt(0) + member.lastName.charAt(0)}
                            </Avatar>
                            <span>{member.username}</span>
                          </div>
                        </MenuItem>
                        })}
                        <MenuItem key={boardUser?.id} value={boardUser?.id}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar alt={boardUser?.firstName + ' ' + boardUser?.lastName} src="/static/images/avatar/2.jpg" style={{ width: '30px', height: '30px', marginRight: 4, backgroundColor: boardUser?.color }}>
                            {boardUser ? boardUser?.firstName.charAt(0) + boardUser?.lastName.charAt(0) : ''}

                            </Avatar>
                            <span>{boardUser?.username}</span>
                          </div>
                        </MenuItem>
                      </Select>

                    </FormControl>
                  </div>
                </div>
                  
                <Divider />

                <div style={{ display: 'flex', gap: 10, alignItems: 'center'}}>
                  <SmsIcon />
                  <Typography variant='subtitle2'>Activity</Typography>
                </div>

                {comments.length ? (
                  <div style={{display: 'flex', flexDirection: 'column', gap: 30}}>
                    {comments.map((comm) => {
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <div style={{display: 'flex', gap: 4, alignItems: 'center'}}>
                            <Avatar alt={comm.user.firstName + ' ' + comm.user.lastName} src="/static/images/avatar/2.jpg" style={{ width: '30px', height: '30px', marginRight: 4, backgroundColor: comm.user.color }}>
                              {comm.user.firstName.charAt(0) + comm.user.lastName.charAt(0)}
                            </Avatar>
                            <Typography variant='body2'>{comm.user.username}</Typography>
                            <Typography variant='caption' sx={{ color: 'gray', marginLeft: 'auto' }}>{getTimeAgo(new Date(comm.createdAt))}</Typography>
                          </div>
                            <Card style={{ backgroundColor: 'rgba(145, 205, 245, 0.092)', padding: 10, borderRadius: '10px', display: 'flex', alignItems: 'center' }}>
                              <Typography key={comm._id} variant='subtitle2'>{comm.content}</Typography>
                          </Card>
                        </div>
                      );
                    })}
                  </div>
                ) : null}

                <div  style={{ display: 'flex', alignItems: 'center', gap: 10}}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', flex: 1 }}>
                    <Avatar alt={currentUser?.username} src="/static/images/avatar/2.jpg" style={{ width: '30px', height: '30px', marginRight: 4, backgroundColor: currentUser?.color }}>
                      {currentUser ? currentUser.firstName.charAt(0) + currentUser.lastName.charAt(0) : ''}
                    </Avatar>
                    <TextField 
                      variant='standard' 
                      value={commentValue}
                      onChange={handleCommentChange}
                      style={{ borderRadius: '10px', backgroundColor: 'rgba(145, 205, 245, 0.092)', padding: 10}} 
                      placeholder='Write a comment...'
                      InputProps={{ disableUnderline: true }}
                      fullWidth
                    />
                  </div>
                  <Button 
                    onClick={handleCommentPost}
                    disabled={commentDisabled}
                    sx={{ 
                      marginLeft: 'auto', 
                      backgroundColor: commentDisabled ? 'rgba(56, 56, 56, 0.121)' : currentUser?.color, 
                      color: 'white',
                      ":hover": {
                        backgroundColor: currentUser ? darken(currentUser.color, 0.2) : 'inherit', // Darken the color by 20%
                      }     
                    }}
                    >
                        post
                  </Button>
                </div>

              </DialogContent>
              <DialogActions disableSpacing>

                <IconButton disableRipple  onClick={handleDeleteOpen}>
                  <DeleteIcon sx={{ color: 'rgba(255, 0, 0, 0.523)', ":hover": { color: 'rgb(255, 0, 0)'}}}/>
                </IconButton>
                <Dialog open={confirmDeleteOpen} onClose={handleDeleteClose}>
                  <DialogTitle>Confirm Delete</DialogTitle>
                  <DialogContent>
                    <Typography>
                      Are you sure you want to delete this card?
                    </Typography>
                    <Typography>
                    All actions will be removed from the activity feed and you won’t be able to re-open the card. There is no undo.

                    </Typography>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleDeleteClose}>Cancel</Button>
                    <Button onClick={handleDeleteTask} sx={{ color: 'white', backgroundColor: 'rgba(255, 0, 0, 0.523)', ":hover": {backgroundColor: 'red'} }}>Delete</Button>
                  </DialogActions>
                </Dialog>

                <div style={{flex: '1 0'}} />
                {/* <StyledButton type='submit' disabled={!isModified} style={{marginRight: 'auto'}}>
                    SAVE
                </StyledButton> */}
                <Button 
                    type='submit'
                    disabled={!isModified}
                    sx={{ 
                      marginRight: 'auto', 
                      backgroundColor: !isModified ? 'rgba(19, 19, 19, 0.416)' : currentUser?.color, 
                      color: 'white',
                      ":hover": {
                        backgroundColor: currentUser ? darken(currentUser.color, 0.2) : 'inherit', // Darken the color by 20%
                      }                    
                    }}
                >
                  Save
                </Button>

              </DialogActions>
              </form>
            </Dialog>
          </TaskCard>
        )}
      </Draggable>
      
      </>
    );
  };

  export default Task;
