  import React, { ChangeEvent, useEffect, useReducer, useState } from 'react';
  import { Draggable } from 'react-beautiful-dnd';
  import styled from 'styled-components';
  import { Avatar, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, Menu, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
  import EditIcon from '@mui/icons-material/Edit';
  import CloseIcon from '@mui/icons-material/Close';
  import CheckIcon from '@mui/icons-material/Check';
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
  import AddIcon from '@mui/icons-material/Add';
  import { useDispatch, useSelector } from 'react-redux';
  import { AppState, setSelectedBoardRedux } from '../store';
  import GroupIcon from '@mui/icons-material/Group';
  import { User } from '../App';
  import DeleteIcon from '@mui/icons-material/Delete';
import Close from '@mui/icons-material/Close';

  interface ContainerProps {
    isdragging: boolean;
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
    background-color: rgb(130, 130, 130);
    color: white;

    &:hover {
      background-color: 'rgb(9, 77, 171)';
    }
  `;

  interface TaskProps {
    task: { title: string, description: string | null, dueDate: Date | null, _id: string, points: number | null, assignee: User | null };
    index: number;
    selectedBoard: Board | null;
  }

  const Task: React.FC<TaskProps> = ({ task, index, selectedBoard }) => {

    const [open, setOpen] = useState(false);
    const [isModified, setIsModified] = useState(false);
    const taskDate = task.dueDate ? new Date(task.dueDate) : null;
    const isInThePast = taskDate ? (taskDate.getTime() < Date.now() ? true : false) : false;

    const month = task.dueDate ? new Date(task.dueDate).toLocaleString('default', { month: 'short' }) : '';
    const day = task.dueDate ? new Date(task.dueDate).getDate() : '';
    const [anchorTask, setAnchorTask] = useState<null | HTMLElement>(null);


    const [daysRemaining, setDaysRemaining] = useState(task.dueDate ? dayjs(task.dueDate).diff(dayjs(), 'day') : null)
    const [members, setMembers] = useState<User[]>([])
    const [assigneeValue, setAssigneeValue] = useState<User | null>(task.assignee)
    const remainingTime = task.dueDate ? dayjs(task.dueDate).diff(dayjs(), 'hour') : null;
    // const daysRemaining = remainingTime !== null ? Math.floor(remainingTime / 24) : null;
    const hoursRemaining = remainingTime !== null ? remainingTime % 24 : null;
    // const [members, setMembers] = useState<User[]>()
    const [boardUser, setBoardUser] = useState<User>()
    const dispatch = useDispatch()
    const [assigneeUser, setAssigneeUser] = useState<User | null>()
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);



    useEffect(()=> {
      if (task.assignee){
        getUser(task.assignee).then((res) => setAssigneeUser(res))
      }
    }, [task._id])

    useEffect(() => {
      axios.get(`http://localhost:5000/board/${selectedBoard?._id}`)
        .then((res) => {
          setSelectedBoardRedux(res.data)
        }).catch((err)=> {
          console.log(err)
        })

    }, [selectedBoard, task._id])

    const handleOpen = () => {
      setOpen(true);
      if (selectedBoard?.user){
        getUser(selectedBoard?.user).then((res) => setBoardUser(res))
      }
      getMembers()
      console.log(members)

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
      description: Yup.string(),
      dueDate: Yup.date(),
      points: Yup.number(),
    });
    
    const formik = useFormik({
      initialValues: {
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        points: task.points,
      },
      validationSchema,
      onSubmit: (values) => {
        updateTask(values.title, values.description, values.dueDate, values.points, assigneeValue);
      },
    });

    const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
      formik.handleChange(e);
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
    
    const handleAssigneeChange = (e: SelectChangeEvent<User | null>) => {

      const value = e.target.value as User | null;
      console.log(value)

      setAssigneeValue(value);
      setAssigneeUser(value)
      setIsModified(true);
    };
    

    
    const updateTask = async (title: string, description: string | null, dueDate: Date | null, points: number | null, assignee: User | null) => {
      if (!formik.isValid) {
        return;
      }

      await axios.put(`http://localhost:5000/tasks/${task._id}`, {
        description,
        dueDate,
        title,
        points,
        assignee
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
        console.log(task.assignee)

        const newDaysRemaining = updatedTask.dueDate ? dayjs(updatedTask.dueDate).diff(dayjs(), 'day') : null;
        setDaysRemaining(newDaysRemaining);      

        // const index = selectedBoard?.tasks.findIndex((task) => task._id === updatedTask._id)
        // console.log(index)

        // if (index) selectedBoard?.tasks.splice(index, 1, updatedTask)

        dispatch(setSelectedBoardRedux(selectedBoard))

        setIsModified(false);
      }).catch((err) => {
        console.log(err)
      });
    };

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
  

    return (
      <Draggable draggableId={task._id} index={index}>
        {(provided, snapshot) => (
          <TaskCard
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            isdragging={snapshot.isDragging}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%'}}>
              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>

            <Typography variant='body2'>
              {task.title}
            </Typography>
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
                    {/* {daysRemaining !== null && (
                      <Typography variant='subtitle2' sx={{ fontSize: '12px', color: daysRemaining >= 0 ? 'green' : 'red' }}>
                        - {daysRemaining >= 0 ? `${daysRemaining} days left` : `${Math.abs(daysRemaining)} days overdue`}
                      </Typography>
                    )} */}
                  
                  </div>
                ) : null
              }
              {
                task.assignee ? (
                    <Avatar alt={assigneeUser?.username} src="/static/images/avatar/2.jpg" style={{ width: '24px', height: '24px', fontSize: '14px', marginRight: 4, backgroundColor: assigneeUser?.color }} />
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

            

            <Dialog open={open} fullWidth onClose={handleClose} PaperProps={{ sx: { backgroundColor: '#ebecf0', padding: 2 }}}>
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
                  <TextField 
                    variant='outlined' 
                    label="Description" 
                    value={formik.values.description}
                    onChange={handleDescriptionChange}
                    fullWidth 
                    
                    name="description"
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                    style={{backgroundColor: '#f7f7f79d', borderRadius: '6px', marginTop: 10}} 
                  />
                  
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                  <CalendarMonthIcon />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker 
                      label="Due date" 
                                    
                      value={dayjs(formik.values.dueDate)}
                      onChange={handleDueDateChange}
                      sx={{ width: '100%', backgroundColor: '#f7f7f79d'}}
                    />
                  </LocalizationProvider>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', gap: 20}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 10, width: '25%'}}>
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
                        style={{backgroundColor: '#f7f7f79d', borderRadius: '6px'}}
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

                  <div style={{display: 'flex', alignItems: 'center', gap: 10, width: '75%'}}>
                    <GroupIcon />
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Assignee</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Assignee"
                        value={assigneeValue} 
                        onChange={handleAssigneeChange} // Actualizați valoarea când se schimbă selecția
                        style={{backgroundColor: '#f7f7f79d', borderRadius: '6px'}}
                      >
                        <MenuItem key="" value="">None</MenuItem>
                        {members?.map((member) => {
                          return <MenuItem key={member.id} value={member.id}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar key={member.id} alt={member.username} src="/static/images/avatar/2.jpg" style={{ width:'30px', height:'30px', marginRight: 4, backgroundColor: member.color}} />
                            <span>{member.username}</span>
                          </div>
                        </MenuItem>
                        })}
                        <MenuItem key={boardUser?.id} value={boardUser?.id}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar alt={boardUser?.username} src="/static/images/avatar/2.jpg" style={{ width: '30px', height: '30px', marginRight: 4, backgroundColor: boardUser?.color }} />
                            <span>{boardUser?.username}</span>
                          </div>
                        </MenuItem>
                      </Select>

                    </FormControl>
                  </div>
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
                <StyledButton type='submit' disabled={!isModified} style={{marginRight: 'auto'}}>
                    SAVE
                </StyledButton>

              </DialogActions>
              </form>
            </Dialog>
          </TaskCard>
        )}
      </Draggable>
    );
  };

  export default Task;
