import { Button, Card, CircularProgress, Typography } from '@mui/material';
import SideBar from './SideBar';
import { DragDropContext, DragUpdate, DropResult, Droppable, ResponderProvided } from 'react-beautiful-dnd';

import styled from 'styled-components';
import { useEffect, useState } from 'react';
import axios from 'axios';
import BoardComponents from './BoardComponents';
import { string } from 'yup';
import { Route, Routes, useLocation } from 'react-router-dom';
import AllBoards from './AllBoards';
import { useDispatch, useSelector } from 'react-redux';
import { AppState, setSelectedBoardRedux } from '../store';
import { User } from '../App';
import { Scheduler } from '@aldabil/react-scheduler';


export interface Board {
  _id: string;
  name: string;
  user: string;
  columns: Array<
    {_id: string, 
      title: String,
      tasks: Array<{ 
        title: string, 
        _id: string,
        description: string,
        dueDate: Date | null,
        points: number | null, 
        assignee: User | null,
      }>;
    }>;
  tasks: Array<{
    _id: string;
    title: string;
    description: string,
    dueDate: Date | null,
    points: number | null, 
    assignee: User | null,
  }>;
  color: string;
  createdAt: Date;
  favorite: Boolean;
  members: Array<User>;
}

interface Task {
  _id: string;
  title: string;
}

interface HomeProps {
  user: {
    id: string;
    username: string;
    email: string;
    color: string;
  };
}


const Container = styled.div`
  display: flex;
  height: 100%;
  min-height: 100vh;
  /* background: rgb(145,167,244);
  background: linear-gradient(23deg, rgba(145,167,244,0.6811974789915967) 0%, rgba(255,77,157,1) 100%); */
  background-image: ${props => props.color !== undefined ? props.color : 'white'};
`;

export const fetchTaskById = async (taskId: string) => {
  try {
    const response = await axios.get(`http://localhost:5000/tasks/get-by-id/${taskId}`);
    const newTask = response.data.data;
      // if (!newTask) {
      //   console.error('Task not found or is null.');
      //   return null;
      // }
    return newTask;
  } catch (error) {

    console.error('Error fetching task:', error);
  }
}


export const fetchColumnById = async (columnId: string) => {
  try {
    const response = await axios.get(`http://localhost:5000/column/get-by-id/${columnId}`);
    const column = response.data.data;
    const fetchedTasks = await Promise.all(column.tasks.map((taskId: string) => fetchTaskById(taskId)));

    column.tasks = fetchedTasks;

    //console.log(column)


    return column;
  } catch (error) {
    console.error('Error fetching column:', error);
  }
};

export const fetchBoardById = async (boardId: string, userId: string) => {
  try {
    const boardResponse = await axios.get(`http://localhost:5000/board/${boardId}`);
    console.log(boardResponse)

    const board = boardResponse.data;
    console.log(board)

    const columnPromises = board.columns?.map((columnId: string) => fetchColumnById(columnId));
    const columnData = await Promise.all(columnPromises);

    const taskPromises = board.tasks.map((taskId: string) => fetchTaskById(taskId));
    const taskData = await Promise.all(taskPromises);

    board.columns = columnData;
    board.tasks = taskData;
    

    return board;
  } catch (error) {
    console.error('Error fetching board:', error);
  }
};

const getAllBoards = async (userId: string) => {
  try {
      const response = await axios.get(`http://localhost:5000/board?userId=${userId}`);
      console.log("fetched boards: ", response.data);
  } catch (error) {
      console.error('Error fetching boards:', error);
  }
};

const Home: React.FC<HomeProps> = ({ user }) => {
    
    const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
    const [startingPage, setStartingPage] = useState(false);
    const selectedBoardRedux = useSelector((state: AppState) => state.selectedBoard);
    const dispatch = useDispatch()


    const [boardDataFetched, setBoardDataFetched] = useState<boolean>(false);
    const location = useLocation();

    useEffect(() => {
      if (selectedBoard && selectedBoardRedux?.tasks?.length !== selectedBoard?.tasks?.length) {
        if (selectedBoardRedux && selectedBoardRedux.tasks && selectedBoardRedux.tasks.length > 0) {
          selectedBoard.tasks.push(selectedBoardRedux.tasks[selectedBoardRedux.tasks.length - 1]);
        }
        console.log(selectedBoard.tasks.length  );
        console.log(selectedBoardRedux?.tasks?.length);

        console.log(selectedBoard?.tasks?.length);
        
      }
    }, [selectedBoardRedux?.tasks?.length !== selectedBoard?.tasks?.length]);
    
    useEffect(() => {
      if (selectedBoard)
        fetchBoardById(selectedBoard._id, user.id)
    }, [selectedBoardRedux?.columns.length === selectedBoard?.columns.length])

    useEffect(() => {
      if (location.pathname === '/boards'){
        getAllBoards(user.id).then((res) => {
          // Set selectedBoard to null when navigating to '/boards'
          setSelectedBoard(null);
          console.log(location.pathname)
          // You may set the fetched boards in state if needed
        });
      }
      else {
        // console.log(location.pathname)
        // console.log(selectedBoard)
        // console.log(boardDataFetched)
        // console.log(selectedBoardRedux)

        if (selectedBoardRedux){
          fetchBoardById(selectedBoardRedux._id, user.id).then((res) =>{
            setSelectedBoard(res)
          })
        }

        if (selectedBoard && !boardDataFetched) {
          localStorage.setItem("lastVisitedBoard", selectedBoard._id);
          // Fetch board data only once when selectedBoard is set and boardDataFetched is false
          fetchBoardById(selectedBoard._id, user.id)
            .then((res) => {
              setSelectedBoard(res);
              console.log(res)
              setBoardDataFetched(true); // Set boardDataFetched to true after fetching data
            })
            .catch((error) => {
              console.error('Error:', error.message);
            });
      }
      else if (!boardDataFetched){
        if (location.pathname.startsWith("/boards/")){
          const boardId = location.pathname.split('/').pop();
          console.log(boardId)
          if (boardId) {
            try {
              fetchBoardById(boardId, user.id).then((res) => { setSelectedBoard(res); console.log(res); setBoardDataFetched(true); });
            } catch (error) {
              console.error('Error fetching board data:', error);
            }
          }
        } else {
        }
      }
    }

    }, [selectedBoard?._id, user.id, boardDataFetched, location.pathname, selectedBoardRedux]);
  

  
    const handleBoardSelect = (board: Board) => {
      setSelectedBoard(board);
      setBoardDataFetched(false);
      dispatch(setSelectedBoardRedux(board))

      
      // localStorage.setItem("lastVisitedBoard", board._id);
      // console.log(localStorage.getItem("lastVisitedBoard"))
      // let lastVisitedBoard = localStorage.getItem("lastVisitedBoard");
      //   if (lastVisitedBoard && !selectedBoard) {
      //     fetchBoardById(lastVisitedBoard, user.id)
      //   }
    };

 
  const updateBoard = async (board: Board) => {
    setSelectedBoard(board);

    await axios.put(`http://localhost:5000/board/${board._id}`, {
      tasks: board.tasks,
      columns: board.columns
    }).then((res) => {
      console.log(res.data)
    }).catch((err) => {
      console.log(err)
    })  
  }

  
  const updateColumn = async (columnId: string, tasks: Array<( { title: string, _id: string, description: string, dueDate: Date | null })>) => {
    const taskIds = tasks.map(task => task._id); // Extrage doar id-urile task-urilor

    await axios.put(`http://localhost:5000/column/${columnId}`, {
      taskIds
    }).then((res) => {
      console.log(res.data)
    }).catch((err) => {
      console.log(err)
    })  
  }
  
  
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;
    console.log(result)

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === 'column'){
      const draggedColumn = selectedBoard?.columns.find((column) => column._id === draggableId)
      console.log(draggedColumn)

      if (!draggedColumn) {
        console.error(`Column with id ${draggableId} not found in selected board`);
        return; // or handle the situation accordingly
      }
  
      const newColumnOrder = selectedBoard?.columns;
      newColumnOrder?.splice(source.index, 1) 
      newColumnOrder?.splice(destination.index, 0, draggedColumn)

      const newData: Board = {
        ...selectedBoard!,
        columns: newColumnOrder || []
      }
      console.log(selectedBoard)

      console.log(newData)
      updateBoard(newData)
      return;
    }
    else {

      const draggedTask = selectedBoard?.tasks.find((task) => task._id === draggableId)

      if (!draggedTask) {
        console.error(`Task with id ${draggableId} not found in selected board`);
        return; // or handle the situation accordingly
      }
  
      const start = selectedBoard?.columns.find((column) => column._id === source.droppableId);
      const finish = selectedBoard?.columns.find((column) => column._id === destination.droppableId);
  
      console.log(start)
      console.log(finish)
  
      if (!start || !finish) {
        console.error('Start or finish column is undefined');
        return;
      }
      
      if (start._id == finish._id){
        const newTaskIds = Array.from(start.tasks);
        newTaskIds.splice(source.index, 1);
        newTaskIds.splice(destination.index, 0, draggedTask);
  
        const newColumn = {
          ...start,
          tasks: newTaskIds,
        };
  
        updateColumn(newColumn._id, newTaskIds)
        console.log(newColumn)
  
        const newColumns = selectedBoard?.columns.map(column => {
          if (column._id === newColumn._id) {
            return newColumn;
          } else {
            return column;
          }
        });
  
        console.log(newColumns)
  
  
        if (!newColumns) {
          console.error('Columns array is undefined');
          return;
        }
  
        const newData: Board = {
          columns: newColumns,
          _id: selectedBoard?._id || '', // Assign a default value if _id is undefined
          name: selectedBoard?.name || '', // Assign a default value if name is undefined
          user: selectedBoard?.user || '',
          tasks: selectedBoard?.tasks || [], // Assign an empty array if tasks is undefined
          color: selectedBoard?.color || '',
          createdAt: selectedBoard?.createdAt || new Date(),
          favorite: selectedBoard?.favorite || false,
          members: selectedBoard?.members || []
        };
        
        updateBoard(newData);
        return;
      }
  
      const startTaskIds = Array.from(start.tasks);
      startTaskIds.splice(source.index, 1);
      const newStart = {
        ...start,
        tasks: startTaskIds,
      };
  
      updateColumn(newStart._id, startTaskIds);
      
      const finishTaskIds = Array.from(finish.tasks);
      finishTaskIds.splice(destination.index, 0, draggedTask);
      const newFinish = {
        ...finish,
        tasks: finishTaskIds,
      };
  
      updateColumn(newFinish._id, finishTaskIds)
      
      const newColumns = selectedBoard?.columns.map(column => {
        if (column._id === newStart._id) {
          return newStart;
        } else if (column._id === newFinish._id) {
          return newFinish;
        } else {
          return column;
        }
      });
      
      if (!newColumns) {
        console.error('Columns array is undefined');
        return;
      }
      if (!selectedBoard) {
        console.error('Selected board is undefined');
        return; // Or handle the error in some other way
      }
      
      const newData: Board = {
        ...selectedBoard,
        columns: newColumns,
      };
  
      updateBoard(newData)
    }
  };



    return (
        <Container color={selectedBoard?.color}>
          <SideBar user={user} onBoardSelect={handleBoardSelect} />
            <div id='home' style={{width: '86%', backgroundColor: 'transparent', float: 'left', borderTopLeftRadius: 20}}>
              <Routes>
                <Route path="/" element={<AllBoards user={user}/>} />
                <Route path=":boardId" element={<BoardComponents selectedBoard={selectedBoard} onDragEnd={onDragEnd} user={user}/>} />
                <Route path=":boardId/calendarView" element={<Scheduler />} />
              </Routes>
            </div>
        </Container>
    )
}


export default Home;
