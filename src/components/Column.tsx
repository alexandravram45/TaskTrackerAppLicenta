import React, { useState } from 'react';
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
import { useDispatch } from 'react-redux';
import { setSelectedBoardRedux } from '../store';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { User } from '../App';
import Close from '@mui/icons-material/Close';
import { TaskInterface } from './Home';
import CheckCircle from '@mui/icons-material/CheckCircle';

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
    setSelectedBoard: (board: Board | null) => void;
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
  background-color: #f8f8f897 !important;
  color: #172b4d !important;
`;

const AddNewCardButton = styled(Button)`
  && {
    text-transform: none;
    background-color: transparent;
    border-radius: 16px;
    display: flex;
    color: #172b4d; 
    padding: 10px;
    margin-left: 8px;
    transition: background-color 0.3s;
    align-items: center;  

    &:hover {
      background-color: rgba(255, 255, 255, 0.474);
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
  max-height: 56vh;
  overflow-y: auto; 
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
  color: ${props => props.theme.palette === 'dark' ? 'white' : 'inherit'};
  
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
  const [areYouSureButton, setAreYouSureButton] = useState(false);
  const [anchorColumn, setAnchorColumn] = useState<null | HTMLElement>(null);
  const [tasks, setTasks] = useState<TaskInterface[]>(props.tasks)
  const [column, setColumn] = useState(props.column)

  const addNewCard = async (event: React.MouseEvent<HTMLElement>) => {
    setNewCardStyle({display: 'block'})
    setAddButtonStyle({ display: 'none' })
  }
  
  const fetchTaskById = async (taskId: string) => {
    try{
      const res = await axios.get(`/tasks/get-by-id/${taskId}`);
      console.log(res.data.data)
      return res.data.data;
    } catch (err) {
      console.log("Error fetching task: ", err)
    }
  }

  const updateDoneFieldColumn = async (columnId: string, done: Boolean) => {
    await axios.put(`/column/${columnId}`, {
      done
    }).then((res) => {
      let cols = props.selectedBoard?.columns.map((col:any) => {
        if (col._id === columnId){
          return {...col, done: done}
        } else {
          return col
        }
      })

      let b: Board = {...props.selectedBoard!, columns: cols || []}

      props.setSelectedBoard(b)

      getColumn()
    }).catch((err) => {
      console.log(err)
    })  
  }
  const updateColumn = async (columnId: string, taskIds: string | Array<TaskInterface>) => {
    await axios.put(`/column/${columnId}`, {
      taskIds
    }).then((res) => {
      let updatedTasks = res.data.data.tasks;
      fetchTaskById(updatedTasks[updatedTasks.length - 1])
      dispatch(setSelectedBoardRedux(props.selectedBoard))
    }).catch((err) => {
      console.log(err)
    })  
  }

  const updateBoardAfterSort = async (columnId: string, taskdIds: Array<TaskInterface>) => {
    const boardId = props.selectedBoard?._id

    const getBoard = await axios.get(`/board/${boardId}`);
    const columns = props.selectedBoard?.columns.map((col) => {
      if (col._id === columnId){
        return {
          ...col,
          tasks: taskdIds
        } 
      } else {
        return col;
      }
    })

    props.setSelectedBoard({
      ...props.selectedBoard!,
      columns: columns || []
    })
  }

  const updateBoard = async (columnId: string, taskIds: string) => { 

    const boardId = props.selectedBoard?._id
    const getBoard = await axios.get(`/board/${boardId}`);
    const board = getBoard.data;

    const taskObj = await fetchTaskById(taskIds);
    
    const updatedTasks = [...board.tasks, taskIds];

    const updatedTasks2 = props.selectedBoard?.tasks.concat(taskObj)

    const updatedColumns = props.selectedBoard?.columns.map((col: any) => {
      if (col._id === columnId) {
        return {
          ...col,
          tasks: [...col.tasks, taskObj]
        };
      }
      return col;
    });
    
    props.setSelectedBoard({
      ...props.selectedBoard!,
      columns: updatedColumns || [],
      tasks: updatedTasks2 || []
    });
    
    await axios.put(`/board/${boardId}`, {
      tasks: updatedTasks,
      columns: board.columns
    }).then((res) => {

      dispatch(setSelectedBoardRedux(res.data.data))
      }).catch((err) => {
      console.log(err)
    })  
  }

  const handleAreYouSureButton = () => {
    setAreYouSureButton(true)
  }

  const handleOpenColumnDetails = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorColumn(event.currentTarget);
  };

const handleCloseColumnDetails = () => {
    setAnchorColumn(null);
  };

  const addTask = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    if (cardTitle !== ""){
      
      await axios.post('/tasks', {
        title: cardTitle,
        columnId: props.column._id
      })
        .then( async (response) => {
          
          setCardTitle("");
          setAddButtonStyle({display: 'flex'});
          setNewCardStyle({display: 'none '})

          await Promise.all([
            updateColumn(props.column._id, response.data.data._id),
            updateBoard(props.column._id, response.data.data._id)
          ]) 
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
    const sortedTasks = [...props.tasks].sort((a, b) => {
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
  
      if (!a.dueDate && b.dueDate) {
        return 1;
      }
  
      if (a.dueDate && !b.dueDate) {
        return -1;
      }
  
      return 0;
    });
    setTasks(sortedTasks);
    updateColumn(props.column._id, sortedTasks);
    updateBoardAfterSort(props.column._id, sortedTasks)
  };
  
  const sortByTitle = () => {
    const sortedTasks = [...props.tasks].sort((a, b) => {
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
    setTasks(sortedTasks);
    updateColumn(props.column._id, sortedTasks);
    updateBoardAfterSort(props.column._id, sortedTasks)

  };
  
  const sortByStoryPoints = () => {
    const sortedTasks = [...props.tasks].sort((a, b) => {
      
      if ((a.points === null || a.points === undefined) && (b.points === null || b.points === undefined)) {
        return 0;
      }
      if (a.points === null || a.points === undefined) {
        return 1;
      }
      if (b.points === null || b.points === undefined) {
        return -1;
      }
      return b.points - a.points;
     

    });
    setTasks(sortedTasks);
    updateColumn(props.column._id, sortedTasks);
    updateBoardAfterSort(props.column._id, sortedTasks)
  };
  
  const makeColumnDONE = () => {
    updateDoneFieldColumn(props.column._id, true)
    props.tasks.map(async (task) => {
      await axios.put(`/tasks/${task._id}`, {
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
    axios.get(`/column/get-by-id/${id}`).then((res) => {
      dispatch(setSelectedBoardRedux(props.selectedBoard))
    })
  }
  
  const handleAreYouSureButtonClose = () => {
    setAreYouSureButton(false);
  };

  const handleDeleteColumn = async () => {
    const boardId = props.selectedBoard?._id;
  
    try {
      const tasks = props.selectedBoard?.tasks.filter(task => task.columnId === column._id);
  
      if (tasks && tasks.length > 0) {
        await Promise.all(tasks.map(task => axios.delete(`/tasks/${task._id}/${boardId}`)));
      }
  
      await axios.delete(`/column/${column._id}/${boardId}`);
  
      toast.success('Column and tasks deleted successfully!', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        draggable: true,
        theme: "light",
      });
  
      const updatedColumns = props.selectedBoard?.columns.filter(col => col._id !== column._id);
  
      const updatedTasks = props.selectedBoard?.tasks.filter(task => task.columnId !== column._id);
  
      props.setSelectedBoard({
        ...props.selectedBoard!,
        columns: updatedColumns || [],
        tasks: updatedTasks || []
      });
  
      dispatch(setSelectedBoardRedux({
        ...props.selectedBoard!,
        columns: updatedColumns || [],
        tasks: updatedTasks || []
      }));
  
      handleAreYouSureButtonClose();
    } catch (err) {
      console.log(err);
      toast.error('An error occurred while deleting the column and tasks. Please try again later.', {
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
                        <span>Mark column as DONE</span>
                        </div>
                      </DueDateButton>
                  </ListItem>   

                </>
                ) : null}
                             
                <Divider />
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
                  setSelectedBoard={props.setSelectedBoard}
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
