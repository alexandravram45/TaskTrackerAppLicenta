import React, { ChangeEvent, useEffect, useReducer, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { Avatar, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
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
  const formattedDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '';
  const [daysRemaining, setDaysRemaining] = useState(task.dueDate ? dayjs(task.dueDate).diff(dayjs(), 'day') : null)

  const remainingTime = task.dueDate ? dayjs(task.dueDate).diff(dayjs(), 'hour') : null;
  // const daysRemaining = remainingTime !== null ? Math.floor(remainingTime / 24) : null;
  const hoursRemaining = remainingTime !== null ? remainingTime % 24 : null;
  const [members, setMembers] = useState<User[]>()
  const [boardUser, setBoardUser] = useState<User>()

  const handleOpen = () => {
    setOpen(true);
    getMembers()
    getUser()
  };
  
  const handleClose = () => {
    setOpen(false);
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string(),
    dueDate: Yup.date(),
    points: Yup.number(),
    assignee: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      points: task.points,
      assignee: task.assignee
    },
    validationSchema,
    onSubmit: (values) => {
      updateTask(values.title, values.description, values.dueDate, values.points, values.assignee);
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
    const value = e.target.value // Convertiți valoarea la tipul potrivit
    formik.setFieldValue('assignee', value); // Actualizați valoarea în formik
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

      const updatedTask = res.data.data; // presupunând că serverul returnează task-ul actualizat

      const newDaysRemaining = updatedTask.dueDate ? dayjs(updatedTask.dueDate).diff(dayjs(), 'day') : null;
      setDaysRemaining(newDaysRemaining);
      
      setIsModified(false);
    }).catch((err) => {
      console.log(err)
    });
  };

  const getUser = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/user/${selectedBoard?.user}`);
      const userData = {
        id: res.data._id,
        username: res.data.username,
        email: res.data.email,
        color: res.data.color,
      };

      // Verifică dacă membrul este deja în listă
      setBoardUser(userData);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
};

const getMembers = async () => {
  selectedBoard?.members?.forEach(async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/user/${userId}`);
      const userData = {
        id: res.data._id,
        username: res.data.username,
        email: res.data.email,
        color: res.data.color,
      };

      // Verifică dacă membrul este deja în listă
      if (!members?.some(member => member.id === userData.id)) {
        setMembers((prevMembers) => [...(prevMembers || []), userData]);
      }
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: ''}}>
          <Typography variant='body2'>
            {task.title}
          </Typography>
            {
              task.dueDate ? (
                <div style={{ display: 'flex', flexDirection: 'row', gap: 4, alignItems: 'center', }}>
                  <ClockIcon style={{ width: '20px', color: 'rgba(0, 0, 0, 0.344)'}}/>
                  <Typography variant='subtitle2' sx={{ fontSize: '12px',color: 'rgba(0, 0, 0, 0.344)'}}>{formattedDate}</Typography>
                  {daysRemaining !== null && (
                    <Typography variant='subtitle2' sx={{ fontSize: '12px', color: daysRemaining >= 0 ? 'green' : 'red' }}>
                      - {daysRemaining >= 0 ? `${daysRemaining} days left` : `${Math.abs(daysRemaining)} days overdue`}
                    </Typography>
                  )}
                
                </div>
              ) : null
            }

            
          </div>

          <IconButtonStyled disableRipple onClick={handleOpen}>
            <EditIcon style={{ fontSize: '20px' }}/>
          </IconButtonStyled>


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
                    <InputLabel id="demo-simple-select-label">Points</InputLabel>
                    <Select
                      labelId="points-label"
                      id="points"
                      name='points'
                      label="Points"
                      value={formik.values.points} // Adăugați valoarea selectată
                      onChange={handlePointsChange} // Actualizați valoarea când se schimbă selecția
                      error={formik.touched.points && Boolean(formik.errors.points)}
                      style={{backgroundColor: '#f7f7f79d', borderRadius: '6px'}}
                    >
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
                      value={formik.values.assignee} // Adăugați valoarea selectată
                      onChange={handleAssigneeChange} // Actualizați valoarea când se schimbă selecția
                      error={formik.touched.assignee && Boolean(formik.errors.assignee)}
                      style={{backgroundColor: '#f7f7f79d', borderRadius: '6px'}}
                    >
                      <MenuItem value='none'>-</MenuItem>

                      {members?.map((member) => {
                        return <MenuItem value={member.username}>
                        <Avatar alt={member.username} src="/static/images/avatar/2.jpg" style={{ width:'30px', height:'30px', marginRight: 4, backgroundColor: member.color}} />
                        {member.username}
                      </MenuItem>
                      })}
                      <MenuItem value={boardUser?.username}>
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
            <DialogActions>
              <StyledButton type='submit' disabled={!isModified}>
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
