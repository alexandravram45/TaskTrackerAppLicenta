import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Task from './Task';
import { Box, Button, ButtonGroup, Card, Divider, IconButton, Input, Menu, Typography } from '@mui/material';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Board } from './Home';
import { useDispatch, useSelector } from 'react-redux';
import { AppState, setSelectedBoardRedux } from '../store';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { User } from '../App';
import Close from '@mui/icons-material/Close';
import { TaskInterface } from './Home';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';


interface TaskListProps {
  isdraggingover: boolean;
  draggingOverIndex: number;
}


interface ColumnProps {
    column: { _id: string; title: String; };
    tasks: Array<TaskInterface>;
    index: number;
    draggingOverIndex: number;
    selectedBoard: Board | null;
    members: User[];
    done: Boolean;
  }


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
  background-color: #ebecf0 ;
  color: #172b4d !important;
  background-color: ${props => props.theme.palette === 'dark' ? 'black' : '#ebecf0'}; // Setează culoarea textului în funcție de tema selectată
`;

const AddNewCardButton = styled(Button)`
  && {
    text-transform: none;
    background-color: transparent;
    border-radius: 16px;
    display: flex;
    color: #172b4d; 
    padding: 8px;
    transition: background-color 0.3s;
    align-items: center;  

    &:hover {
      background-color: #ddd;
    }

    &:active {
      background-color: #aaa;
    }

    .MuiSvgIcon-root {
      margin-right: 8px;
    }
  }
`;

const Title = styled.h3`
  margin-left: 14px;
`;

const TaskList = styled.div<TaskListProps>`
  padding: 8px;
  transition: background-color 0.2s ease;
  flex-grow: 1;
  position: relative;
  max-height: 60vh;
  overflow-y: auto; /* Add this line to make the column scrollable */

/* 
  &:before {
    content: '';
    position: absolute;
    height: 50px;
    width: 282px;
    border-radius: 10px;
    background-color: #40404019;
    display: ${(props) => (props.isdraggingover ? 'block' : 'none')};
    top: ${(props) => props.draggingOverIndex * 60 + "px"}; 

    z-index: 1;
  }
   */
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
`;

const DueDateButton = styled.button`
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



const TaskCard = styled(Card)`
  border: 1px solid lightgray;
  padding: 8px;
  border-radius: 10px !important;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;

`;

const Column: React.FC<ColumnProps> = (props) => {

  const [addNewCardStyle, setNewCardStyle] = useState({display: 'none'})
  const [addButtonStyle, setAddButtonStyle] = useState({display: 'flex'})
  const [cardTitle, setCardTitle] = useState("")
  const dispatch = useDispatch();
  const selectedBoardRedux = useSelector((state: AppState) => state.selectedBoard);
  const [open, setOpen] = useState(false);
  const [areYouSureButton, setAreYouSureButton] = useState(false);
  const [anchorColumn, setAnchorColumn] = useState<null | HTMLElement>(null);
  const [tasks, setTasks] = useState<TaskInterface[]>([])
  const [column, setColumn] = useState(props.column)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);


  const addNewCard = async (event: React.MouseEvent<HTMLElement>) => {
    setNewCardStyle({display: 'block'})
    setAddButtonStyle({ display: 'none' })
  }
  
  const fetchTaskById = async (taskId: string) => {
    try{
      const res = await axios.get(`http://localhost:5000/tasks/get-by-id/${taskId}`);
      console.log(res.data.data)
    } catch (err) {
      console.log("Error fetching task: ", err)
    }
  }

  const updateDoneFieldColumn = async (columnId: string, done: Boolean) => {
    await axios.put(`http://localhost:5000/column/${columnId}`, {
      done
    }).then((res) => {
      console.log(res.data)
      getColumn()
    }).catch((err) => {
      console.log(err)
    })  
  }

  const updateColumn = async (columnId: string, taskIds: string | Array<TaskInterface>) => {
    await axios.put(`http://localhost:5000/column/${columnId}`, {
      taskIds
    }).then((res) => {
      console.log(res.data)
      let updatedTasks = res.data.data.tasks;
      console.log(updatedTasks)
      fetchTaskById(updatedTasks[updatedTasks.length - 1])
    }).catch((err) => {
      console.log(err)
    })  
  }

  const updateBoard = async (columnId: string, taskIds: string) => {

    const getBoardId = await axios.get(`http://localhost:5000/column/get-by-id/${columnId}`);
    const boardId = getBoardId.data.data.boardId;
    const taskss = getBoardId.data.data.tasks;
    console.log(taskss)

    const getBoard = await axios.get(`http://localhost:5000/board/${boardId}`);
    const board = getBoard.data;
    
    const updatedTasks = [...board.tasks, taskIds]; // Assuming taskIds is an array of taskIds

    await axios.put(`http://localhost:5000/board/${boardId}`, {
      tasks: updatedTasks,
      columns: board.columns
    }).then((res) => {
      dispatch(setSelectedBoardRedux(res.data.data))
      console.log(res.data.data)
      }).catch((err) => {
      console.log(err)
    })  
  }

  const handleAreYouSureButton = () => {
    setAreYouSureButton(true)
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenColumnDetails = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorColumn(event.currentTarget);
  };

const handleCloseColumnDetails = () => {
    setAnchorColumn(null);
  };

  const addTask = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    if (cardTitle !== ""){
      
      await axios.post('http://localhost:5000/tasks', {
        title: cardTitle,
        columnId: props.column._id
      })
        .then( async (response) => {
          await Promise.all([
            updateColumn(props.column._id, response.data.data._id),
            updateBoard(props.column._id, response.data.data._id)
          ]) 
          // setTasks(prevTasks => [...prevTasks, response.data.data]);
          console.log(props.tasks)
          props.tasks.push({title: response.data.data.title, _id: response.data.data._id, description: '', dueDate: null, points: null, assignee: null, done: null})
          props.selectedBoard?.tasks.push({title: response.data.data.title, _id: response.data.data._id, description: '', dueDate: null, points: null, assignee: null, done: null})

          setCardTitle("");
          //setTasks((prev) => [...prev, response.data.data])

          setAddButtonStyle({display: 'flex'});
          setNewCardStyle({display: 'none '})
        })
        .catch((error) => {
          console.log(error.message)
        })
    } else {
      toast.error('The task title should not be empty!', {
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

  
  const giveUp = async (event: React.MouseEvent<HTMLElement>) => {

    setNewCardStyle({display: 'none'})
    setAddButtonStyle({ display: 'flex' })
  }

  const sortByDueDate = () => {
    props.tasks.sort((a, b) => {
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return 0;
    });
    // Actualizează state-ul pentru a reflecta noua ordine a taskurilor
    setTasks([...props.tasks]);
    updateColumn(props.column._id, tasks)

  };

  const sortByTitle= () => {
    props.tasks.sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      if (titleA < titleB) {
        return -1;
      }
      if (titleA > titleB) {
        return 1;
      }
      return 0;
    });
    // Actualizează state-ul pentru a reflecta noua ordine a taskurilor
    setTasks([...props.tasks]);
    updateColumn(props.column._id, tasks)
  };
  

  const sortByStoryPoints = () => {
    props.tasks.sort((a, b) => {
      // Verificăm dacă taskurile au story points asignate
      if (a.points === null && b.points === null) {
        return 0;
      }
      // Taskurile fără puncte de poveste sunt plasate la sfârșit
      if (a.points === null) {
        return 1;
      }
      if (b.points === null) {
        return -1;
      }
      // Comparăm story points-urile numerice
      return b.points - a.points;
    });
    // Actualizează state-ul pentru a reflecta noua ordine a taskurilor
    setTasks([...props.tasks]);
    updateColumn(props.column._id, tasks)
  };

  const makeColumnDONE = () => {
    updateDoneFieldColumn(props.column._id, true)
    props.tasks.map(async (task) => {
      await axios.put(`http://localhost:5000/tasks/${task._id}`, {
        done: true
      }).then((res) => {
        setTasks((prev) => [...prev, res.data.data]);
      }).catch((err) => {
        console.log(err)
      })
    });
    
  }

  const getColumn = () => {
    const id = props.column._id
    axios.get(`http://localhost:5000/column/get-by-id/${id}`).then((res) => {
      dispatch(setSelectedBoardRedux(props.selectedBoard))
    })
  }
  
  const handleAreYouSureButtonClose = () => {
    setAreYouSureButton(false);
  };

  
  const handleDeleteColumn = async () => {
    const boardId = props.selectedBoard?._id;
    await axios.delete(`http://localhost:5000/column/${column._id}/${boardId}`)
      .then((res) => {
        toast.success('Column deleted successfully!', {
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
  
        dispatch(setSelectedBoardRedux(props.selectedBoard))
        handleAreYouSureButtonClose();
      }).catch((err) => {
        console.log(err);
        toast.error('An error occurred while deleting the column. Please try again later.', {
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
    <Draggable draggableId={props.column._id} index={props.index}>
      {(provided) => (

      <ColumnCard
        {...provided.draggableProps}
        ref={provided.innerRef}
      >
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          <Title {...provided.dragHandleProps}>
            {props.column.title}
          </Title>
          <div style={{ marginLeft: 'auto', alignItems: 'center', display: 'flex' }}>
            {props.done ? <CheckCircle style={{color: 'green'}}/> : null}
            <IconButton sx={{ width: '40px', height: '40px'}} onClick={handleOpenColumnDetails}><MoreHorizIcon /></IconButton>
          </div>
          <Menu
            sx={{ ml: '12px'}}
            anchorEl={anchorColumn}
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
            
            open={Boolean(anchorColumn)}
            onClose={handleCloseColumnDetails}
          > 
            <Box sx={{ width: '300px', height: 'auto', padding: 2, display: 'flex', flexDirection: 'column', }}>
                <IconButton onClick={handleCloseColumnDetails} style={{alignSelf: 'flex-end' , color: 'black'}}>
                    <Close style={{ fontSize: '16px' }}/>
                </IconButton>
                <Typography style={{ alignSelf: 'center', marginBottom: '20px'}} variant='body2'>Column actions</Typography>
                <Typography variant='subtitle2'>Sort tasks by...</Typography>
                <ListItem>
                  <DueDateButton onClick={sortByDueDate}>Due date</DueDateButton>
                </ListItem>
                <ListItem>
                  <DueDateButton onClick={sortByTitle}>Title</DueDateButton>
                </ListItem>
                <ListItem>
                  <DueDateButton onClick={sortByStoryPoints}>Story points</DueDateButton>
                </ListItem>
                {!props.done ? (
                  <>
                  <Divider />
                    <ListItem >
                      <DueDateButton onClick={makeColumnDONE}>
                        <div  style={{display: 'flex', gap: 4, alignItems: 'center'}}>
                        <CheckCircle style={{color: 'green'}}/>
                        <span>Make it a DONE column</span>
                        </div>
                      </DueDateButton>
                  </ListItem>   

                </>
                ) : null}
                             
                <Divider />
                <ListItem>
                  <DueDateButton>Archive</DueDateButton>
                </ListItem>
                <ListItem>
                  <DueDateButton onClick={handleAreYouSureButton}>Delete</DueDateButton>
                </ListItem> 
                {
                  areYouSureButton ? (
                  <div style={{ textAlign: 'center'}}>
                    <Typography variant='body2' sx={{marginBottom: 2}}><i>Are you sure you want to delete this column?</i></Typography>
                    <Button onClick={handleAreYouSureButtonClose}>
                      Cancel
                    </Button>
                    <Button onClick={handleDeleteColumn} sx={{backgroundColor: 'red', color: 'white', ":hover": {backgroundColor: 'rgba(255, 0, 0, 0.522)'}}}>
                      Delete
                    </Button>
                  </div>
                  ) : (
                    null
                  )
                }         
            </Box>
          </Menu>
        </div>
        <Droppable droppableId={props.column._id} type='task'>
          {(provided, snapshot) => (
            <TaskList
              ref={provided.innerRef}
              {...provided.droppableProps}
              isdraggingover={snapshot.isDraggingOver}
              draggingOverIndex={props.draggingOverIndex}
            >
              {props.tasks && props.tasks.map((task, index) => (
                task &&
                <Task 
                  key={`${task.title}-${index}`} 
                  task={task} 
                  index={index} 
                  selectedBoard={props.selectedBoard}
                  done={props.done}
                />
              ))}
              <TaskCard style={addNewCardStyle} >
                <Input 
                  placeholder="Enter card title..." 
                  disableUnderline={true} 
                  multiline={true} 
                  minRows={2} 
                  value={cardTitle} 
                  onChange={(e) => setCardTitle(e.target.value)}
                />
                <ButtonGroup  orientation='vertical' color='secondary' style={{float: 'right' }}>
                  <Button onClick={addTask}>
                    <CheckIcon />
                  </Button>
                  <Button onClick={giveUp}>
                    <CloseIcon />
                  </Button>
              </ButtonGroup>
              </TaskCard>
              {provided.placeholder}
            </TaskList>
          )}
        </Droppable>
        {!props.done ? (
          <AddNewCardButton onClick={addNewCard} style={addButtonStyle}>
            <AddIcon />
            <span>Add a card</span>
          </AddNewCardButton>
        ) : null}
        
        
      
      </ColumnCard>
      )}

    </Draggable>

  );
};

export default Column;
