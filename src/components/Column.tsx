import React, { useState, useEffect, CSSProperties, useRef, useCallback } from 'react';
import styled from 'styled-components';
import Task from './Task';
import { Button, ButtonGroup, Card, IconButton, Input, TextField, Typography } from '@mui/material';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { COLORS } from '../colors';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Board, fetchBoardById } from './Home';
import { useDispatch, useSelector } from 'react-redux';
import { AppState, setSelectedBoardRedux } from '../store';
import EditIcon from '@mui/icons-material/Edit';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { User } from '../App';

interface TaskListProps {
  isdraggingover: boolean;
  draggingOverIndex: number;
}


interface ColumnProps {
    column: { _id: string; title: String; };
    tasks: Array<{ title: string, _id: string, description: string, dueDate: Date | null, points: number | null, assignee: User | null }>;
    index: number;
    draggingOverIndex: number;
    selectedBoard: Board | null;
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
  background-color: #ebecf0 !important;
  color: #172b4d !important;

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


  useEffect(() => {
  }, [selectedBoardRedux?.tasks.length])


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
  

  const updateColumn = async (columnId: string, taskIds: string) => {
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

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
          props.tasks.push({title: response.data.data.title, _id: response.data.data._id, description: '', dueDate: null, points: null, assignee: null})

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
          <IconButton disableRipple><MoreHorizIcon /></IconButton>
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
                <Task key={`${task.title}-${index}`} task={task} index={index} selectedBoard={props.selectedBoard}/>
              ))}
              <TaskCard style={addNewCardStyle}>
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
        <AddNewCardButton onClick={addNewCard} style={addButtonStyle}>
          <AddIcon />
          <span>Add a card</span>
        </AddNewCardButton>
        
      
      </ColumnCard>
      )}

    </Draggable>

  );
};

export default Column;
